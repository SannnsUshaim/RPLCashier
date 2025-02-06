import { db } from "../config/db.js";

// export const getTransaction = (_req, res) => {
//   const q = "SELECT * FROM transaksi";
// };

export const getIdTransaction = (_req, res) => {
  const q = "SELECT _id FROM transaksi ORDER BY _id DESC LIMIT 1";

  db.query(q, (err, data) => {
    if (err) return res.send(err);

    let id;
    if (data.length > 0) {
      const lastId = data[0]._id;

      const numericPart = parseInt(lastId.replace("RECEIPT", ""), 10);
      const nexNumericPart = numericPart + 1;

      id = `RECEIPT${nexNumericPart.toString().padStart(6, "0")}`;
    } else {
      id = "RECEIPT000001";
    }

    return res.status(200).json(id);
  });
};

export const addTransaction = (req, res) => {
  db.beginTransaction((err) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send("An error occurred while starting the transaction.");
    }
    const {
      _id,
      userId,
      totalBarang,
      totalHarga,
      bayar,
      kembalian,
      transactionDate,
      products,
      total,
    } = req.body;
    const q = `
          INSERT 
          INTO
          transaksi
          (
              _id,
              userId,
              totalBarang,
              totalHarga,
              bayar,
              kemabalian,
              transactionDate
          ) VALUES (?)`;
    const values = [
      _id,
      userId,
      totalBarang,
      totalHarga,
      bayar,
      kembalian,
      transactionDate,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.send(err);

      if (products && products.lenght > 0) {
        const detailQuery = `
        INSERT INTO
        transaksidetails
        (
          transactionId,
          productId,
          harga,
          jumlah,
          total
        ) VALUES (?)`;

        const detailValues = products.map((p) => [
          _id,
          p._id,
          p.harga,
          p.quantity,
          p.harga * p.quantity, // Total dihitung dari harga * quantity
        ]);

        db.query(detailQuery, [detailValues], (err, result) => {
          if (err) {
            db.rollback(() => {
              console.error(err);
              res
                .status(500)
                .send("An error occurred while committing the transaction.");
            });
          }

          db.commit((err) => {
            if (err) {
              db.rollback(() => {
                console.error(err);
                res
                  .status(500)
                  .send("An error occurred while committing the transaction.");
              });
            }

            res.status(201).json("Transaction have been successfully created.");
          });
        });
      } else {
        db.commit((err) => {
          if (err) {
            db.rollback(() => {
              console.error(err);
              res
                .status(500)
                .send("An error occurred while committing the transaction.");
            });
          }
          res.status(201).json("Transaction has been successfully created.");
        });
      }
    });
  });
};

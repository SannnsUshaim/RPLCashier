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
      console.error("Error starting transaction:", err);
      return res.status(500).send("Gagal memulai transaksi database.");
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
    } = req.body;

    // 1. Perbaikan typo kolom 'kembalian'
    const q = `
      INSERT INTO transaksi (
        _id,
        userId,
        totalBarang,
        totalHarga,
        bayar,
        kembalian,  
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
      if (err) {
        console.error("Error inserting transaction:", err);
        return db.rollback(() => res.status(500).send(err.message));
      }

      // 2. Perbaikan typo 'lenght' menjadi 'length'
      if (products && products.length > 0) {
        const detailQuery = `
          INSERT INTO transaksidetails (
            transactionId,
            productId,
            harga,
            jumlah,
            total
          ) VALUES ?`; // Gunakan placeholder ? untuk bulk insert

        const detailValues = products.map((p) => [
          _id,
          p._id,
          p.harga,
          p.stok,
          p.harga * p.stok,
        ]);

        // 3. Perbaikan parameter bulk insert (hilangkan array wrapper)
        db.query(detailQuery, [detailValues], (err, result) => {
          if (err) {
            console.error("Error inserting details:", err);
            return db.rollback(() => res.status(500).send(err.message));
          }

          db.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              return db.rollback(() => res.status(500).send(err.message));
            }
            res.status(201).json("Transaksi berhasil dibuat.");
          });
        });
      } else {
        db.commit((err) => {
          if (err) {
            console.error("Error committing transaction:", err);
            return db.rollback(() => res.status(500).send(err.message));
          }
          res.status(201).json("Transaksi berhasil dibuat tanpa detail.");
        });
      }
    });
  });
};

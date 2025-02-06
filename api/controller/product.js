import { db } from "../config/db.js";

export const getProductId = (_req, res) => {
  const generateRandomId = () => {
    return `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
  };

  return res.status(200).json(generateRandomId());
};

export const getAllProduct = (_req, res) => {
  const q = "SELECT * FROM product";

  db.query(q, (err, data) => {
    if (err) return res.send(err);

    return res.status(200).json(data);
  });
};

export const getProduct = (req, res) => {
  const id = req.params.id;
  const q = "SELECT * FROM product WHERE _id = ?";

  db.query(q, [id], (err, data) => {
    if (err) return res.send(err);

    return res.status(200).json(data[0]);
  });
};

export const addProduct = (req, res) => {
  const { _id, name, stok, harga } = req.body;
  const q = `
          INSERT
          INTO
          product
          (
              _id,
              name,
              stok,
              harga
          ) VALUES (?)`;
  const values = [_id, name, stok, harga];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);

    return res.status(200).json({
      message: "A product has been successfully created",
    })
  });

  // db.beginTransaction((err) => {
  //   if (err) {
  //     console.error(err);
  //     return res
  //       .status(500)
  //       .send("An error occurred while starting the transaction.");
  //   }
  //   const { _id, name, stok, harga, attachment } = req.body;
  //   const q = `
  //         INSERT
  //         INTO
  //         product
  //         (
  //             _id,
  //             name,
  //             stok,
  //             harga
  //         ) VALUES (?)`;
  //   const values = [_id, name, stok, harga];

  //   db.query(q, [values], (err, data) => {
  //     if (err) return res.send(err);

  //     if (attachment && attachment.lenght > 0) {
  //       const attachmentQuery = `
  //                 INSERT
  //                 INTO
  //                 productdetails
  //                 (
  //                     productId
  //                     attachmentP
  //                 ) VALUES (?)`;

  //       const attachmentValues = attachment.map((att) => [
  //         _id,
  //         att.attachmentP,
  //       ]);

  //       db.query(attachmentQuery, [attachmentValues], (err, result) => {
  //         if (err) {
  //           db.rollback(() => {
  //             console.error(err);
  //             res
  //               .status(500)
  //               .send("An error occurred while committing the transaction.");
  //           });
  //         }

  //         db.commit((err) => {
  //           if (err) {
  //             db.rollback(() => {
  //               console.error(err);
  //               res
  //                 .status(500)
  //                 .send("An error occurred while committing the transaction.");
  //             });
  //           }

  //           res
  //             .status(201)
  //             .json("jurnal and its details have been successfully created.");
  //         });
  //       });
  //     } else {
  //       db.commit((err) => {
  //         if (err) {
  //           db.rollback(() => {
  //             console.error(err);
  //             res
  //               .status(500)
  //               .send("An error occurred while committing the transaction.");
  //           });
  //         }
  //         res.status(201).json("product has been successfully created.");
  //       });
  //     }
  //   });
  // });
};

export const updateProduct = (req, res) => {
  const { _id, name, stok, harga } = req.body;
  const q = `
    UPDATE
    product
    SET
        name = ?,
        stok = ?,
        harga = ?
    WHERE _id = ?
    `;
  const values = [name, stok, harga, _id];

  db.query(q, values, (err, data) => {
    if (err) return res.send(err);

    res.status(200).json({
      message: "A product has been successfully updated",
    });
  });
};

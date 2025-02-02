import {
    db
} from "../config/db.js"

export const getProductId = (_req, res) => {
    const q = "SELECT _id FROM product ORDER BY _id DESC LIMIT 1";

    db.query(q, (err, data) => {
        if (err) return res.send(err);

        let id;
        if (data.length > 0) {
            const lastId = data[0]._id;

            const numericPart = parseInt(lastId.replace("PRODUCT", ""), 10);
            const nexNumericPart = numericPart + 1;

            id = `PRODUCT${nexNumericPart.toString().padStart(4, "0")}`;
        } else {
            id = "PRODUCT0001";
        }

        return res.status(200).json(id);
    })
}

export const getAllProduct = (_req, res) => {
    const q = "SELECT * FROM product";

    db.query(q, (err, data) => {
        if (err) return res.send(err);

        return res.status(200).json(data);
    })
}

export const getProduct = (req, res) => {
    const id = req.params.id;
    const q = "SELECT * FROM product WHERE _id = ?";

    db.query(q, [id], (err, data) => {
        if (err) return res.send(err);

        return res.status(200).json(data[0]);
    })
}

export const addProduct = (req, res) => {
    const {
        _id,
        name,
        stok,
        harga
    } = req.body;
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
    const values = [
        _id,
        name,
        stok,
        harga
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.send(err);

        res.status(200).json({
            message: "A product has been successfully created"
        })
    })
}

export const updateProduct = (req, res) => {
    const {
        _id,
        name,
        stok,
        harga
    } = req.body;
    const q = `
    UPDATE
    product
    SET
        name = ?,
        stok = ?,
        harga = ?
    WHERE _id = ?
    `;
    const values = [
        name,
        stok,
        harga,
        _id
    ];

    db.query(q, values, (err, data) => {
        if (err) return res.send(err);

        res.status(200).json({
            message: "A product has been successfully updated"
        })
    })
}
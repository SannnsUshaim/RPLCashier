import {
    db
} from "../config/db.js";
import bcrypt from "bcryptjs"

export const getUserId = (_req, res) => {
    const q = "SELECT _id FROM users ORDER BY _id DESC LIMIT 1";

    db.query(q, (err, data) => {
        if (err) return res.send(err);

        let id;
        if (data.length > 0) {
            const lastId = data[0]._id;

            const numericPart = parseInt(lastId.replace("USER", ""), 10);
            const nexNumericPart = numericPart + 1;

            id = `USER${nexNumericPart.toString().padStart(4, "0")}`;
        } else {
            id = "USER0001";
        }

        return res.status(200).json(id);
    })
}

export const getAllUser = (_req, res) => {
    const q = 'SELECT * FROM users';

    db.query(q, (err, data) => {
        if (err) return res.send(err);

        return res.status(200).json(data);
    })
}

export const getActiveUser = (_req, res) => {
    const q = "SELECT * FROM users WHERE status = 1";

    db.query(q, (err, data) => {
        if (err) return res.send(err);

        return res.status(200).json(data);
    })
}

export const getUser = (req, res) => {
    const id = req.params.id;
    const q = `SELECT * FROM users WHERE _id = ?`

    db.query(q, [id], (err, data) => {
        if (err) return res.send(err);

        return res.status(200).json(data[0])
    })
}

// export const getDepartment = (_req, res) => {
//     const q = "SELECT * FROM departments";

//     db.query(q, (err, data) => {
//         if (err) return res.send(err);

//         return res.status(200).json(data)
//     })
// }

export const addUser = (req, res) => {
    const {
        _id,
        username,
        email,
        password
    } = req.body
    const q = `
    INSERT
    INTO
    users
    (
        _id,
        username,
        email,
        password
    )
    VALUES (?)`

    const salt = bcrypt.genSaltSync(11);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const values = [
        _id,
        username,
        email,
        hashedPassword
    ]

    db.query(q, [values], (err, data) => {
        if (err) return res.send(err);

        return res.status(200).json({
            message: "An user successfully added!"
        })
    })
}

export const updateUser = (req, res) => {
    const {
        _id,
        username,
        email,
        password
    } = req.body
    const q = `
    UPDATE
    users
    SET
    username = ?,
    email = ? ,
    password = ?
    WHERE _id = ?`

    const values = [
        username,
        email,
        password,
        _id
    ]

    db.query(q, values, (err, data) => {
        if (err) return res.send(err);

        return res.status(200).json({
            message: "An user successfully edited!"
        })
    })
}
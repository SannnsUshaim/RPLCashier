import {
    db
} from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const login = (req, res) => {
    const q = `
    SELECT 
    u.*, 
    GROUP_CONCAT(d.name) AS department
    FROM 
        users u
    LEFT JOIN 
        userdepartments ud ON u._id = ud.userId
    LEFT JOIN 
        departments d ON ud.departmentId = d._id
    WHERE 
        u.username = ? AND u.email = ?
    GROUP BY 
        u._id;`;

    db.query(q, [req.body.username, req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User credentials not found!");

        const isPassword = bcrypt.compareSync(
            req.body.password,
            data[0].password
        );

        if (!isPassword) return res.status(400).json("Wrong password!")

        const departments = data[0].department.split(",").map((d) => d.trim());

        const access_token = jwt.sign({
            id: data[0]._id,
            department: departments
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });
        const refresh_token = jwt.sign({
            id: data[0]._id,
            department: departments
        }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        db.query("UPDATE users SET refreshToken = ? WHERE _id = ?", [refresh_token, data[0]._id], (err, data) => {
            if (err) return null;

            res.cookie("refreshtoken", refresh_token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            res.json({
                access_token
            })
        })
    });
};

export const logout = (req, res) => {
    const refreshToken = req.cookies.refreshtoken;

    if (!refreshToken) return res.sendStatus(204);

    db.query("SELECT * FROM users WHERE refreshToken = ?", refreshToken, (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User credentials not found!");

        db.query("UPDATE users SET refreshToken = null WHERE _id = ?", data[0]._id, (err, data) => {

            res.clearCookie("refreshtoken").status(200).json("User has been logged out.")
        })
    })
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshtoken;

        if (!refreshToken) return res.sendStatus(401);
        db.query("SELECT * FROM users WHERE refreshToken = ?", refreshToken, (err, data) => {
            if (!data[0]) return res.sendStatus(403);

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err) return res.sendStatus(403);

                const accessToken = jwt.sign({
                    id: decoded.id,
                    department: decoded.department
                }, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '15s'
                })

                res.json({
                    accessToken
                });
            })
        })
    } catch (error) {
        console.log(error)
    }
}
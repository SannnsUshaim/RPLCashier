import express from "express";
import {
    addUser,
    getActiveUser,
    getAllUser,
    getUser,
    getUserId,
    updateUser
} from "../controller/users.js";

const router = express.Router();

router.get("/id", getUserId)
router.get("/", getAllUser)
router.get("/:id", getUser)
router.get("/active", getActiveUser)
router.post("/", addUser)
router.put("/", updateUser)

export default router;
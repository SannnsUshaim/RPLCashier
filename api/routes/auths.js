import express from "express";
import { login, logout, refreshToken } from "../controller/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/token", refreshToken);
router.post("/logout", logout);

export default router;
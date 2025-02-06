import express from "express";
import { addTransaction, getIdTransaction } from "../controller/transaction.js";

const router = express.Router();

router.get("/id", getIdTransaction);
// router.get("/", )
router.post("/", addTransaction);

export default router;

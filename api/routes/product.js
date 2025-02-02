import express from "express";
import {
    addProduct,
    getAllProduct,
    getProduct,
    getProductId,
    updateProduct
} from "../controller/product.js";

const router = express.Router();

router.get("/id", getProductId);
router.get("/", getAllProduct);
router.get("/:id", getProduct);
router.post("/", addProduct);
router.put("/", updateProduct);

export default router;
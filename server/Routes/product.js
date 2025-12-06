import express from "express";
import { addProduct, deleteProduct, getAllProducts } from "../Controllers/product.js";

const router = express.Router();

// ADMIN ROUTES
router.post("/add", addProduct);         
router.delete("/delete/:id", deleteProduct); 
router.get("/all", getAllProducts);

export default router;

import express from "express";
import {
  addToCart,
  deleteCartItem,
  updateQuantity,
  getMyCart,
} from "../Controllers/cart.js";
import { protect } from "../Middleware/auth.js";

const router = express.Router();

router.use(protect);  // user must be logged in

router.post("/add", addToCart);                 // ADD OR INCREASE
router.delete("/delete/:productId", deleteCartItem); // DELETE ITEM
router.put("/update", updateQuantity);          // INC / DEC
router.get("/my", getMyCart);                   // GET CART

export default router;

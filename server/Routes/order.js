import express from "express";
import {
  checkout,
  getOrderHistory,
  getOrderById,
} from "../Controllers/order.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // user must be logged in

router.post("/checkout", checkout);          // CREATE ORDER & CLEAR CART
router.get("/history", getOrderHistory);     // GET ORDER HISTORY
router.get("/:orderId", getOrderById);       // GET SINGLE ORDER

export default router;

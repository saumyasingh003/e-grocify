import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { errorHandler } from "./Middleware/errorMiddleware.js";
import authRoutes from "./Routes/user.js";
import productRoutes from "./Routes/product.js";
import recommendationRoutes from "./Routes/recomm.js";
import cartRoutes from "./Routes/cart.js";

dotenv.config();

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/recomm", recommendationRoutes);
app.use("/cart", cartRoutes);

// Error Handling Middleware (Correct Position)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

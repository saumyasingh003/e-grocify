import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { errorHandler } from "../Middleware/errorMiddleware.js";
import authRoutes from "../Routes/user.js";
import productRoutes from "../Routes/product.js";
import recommendationRoutes from "../Routes/recomm.js";
import cartRoutes from "../Routes/cart.js";
import orderRoutes from "../Routes/order.js";

dotenv.config();

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/recomm", recommendationRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Error Handling Middleware
app.use(errorHandler);

// For local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export for Vercel serverless
export default app;


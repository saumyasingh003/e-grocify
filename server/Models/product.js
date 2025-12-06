import mongoose from "mongoose";

export const allowedTags = [
  "popular",
  "healthy",
  "new",
  "best-seller",
  "low-calorie",
  "gluten-free",
  "vegan",
  "vegetarian",
  "budget-friendly",
  "kid-friendly",
  "breakfast",
  "lunch",
  "dinner",
  "snacking",
  "protein-rich",
  "low-fat",
  "high-fiber",
];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["fruits", "vegetables", "grains", "protein", "dairy"],
    },

    brand: {
      type: String,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
    },

    image: {
      type: String,
    },

    quantity: {
      type: String,
      required: [true, "Quantity is required"], // 500g, 1kg, 250ml, etc.
    },

    tags: {
      type: [String],
      enum: allowedTags, // Tags must be from the allowed list
      default: [],
    },

    isRecommended: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);

import Product, { allowedTags } from "../Models/product.js";

// ADD PRODUCT
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      price,
      image,
      quantity,
      tags,
    } = req.body;

    // Required fields check
    if (!name || !description || !category || !price || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Name, description, category, price & quantity are required",
      });
    }

    // Validate tags if provided
    if (tags && tags.length > 0) {
      const invalid = tags.filter((t) => !allowedTags.includes(t));

      if (invalid.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid tags: ${invalid.join(", ")}`,
        });
      }
    }

    const product = await Product.create({
      name,
      description,
      category,
      brand,
      price,
      image,
      quantity,
      tags,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
};



// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};



// ⭐ GET ALL PRODUCTS + TOTAL COUNT
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // newest first
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      success: true,
      totalProducts,
      products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

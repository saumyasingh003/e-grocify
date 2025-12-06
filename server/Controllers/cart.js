import Cart from "../Models/cart.js";
import Product from "../Models/product.js";

// ─────────────────────────────────────────────
// Helper: Create cart if not exists
// ─────────────────────────────────────────────
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await cart.populate("items.product");
  }

  return cart;
};

// ─────────────────────────────────────────────
// Helper: Calculate totals
// ─────────────────────────────────────────────
const calculateTotals = (cart) => {
  const items = cart.items.map((item) => ({
    productId: item.product._id,
    name: item.product.name,
    image: item.product.image,
    price: item.product.price,
    quantity: item.quantity,
    subtotal: item.product.price * item.quantity,
  }));

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.subtotal, 0);

  return { items, totalItems, totalPrice };
};

// ─────────────────────────────────────────────
// 1. ADD ITEM (also increases if already exists)
// POST /api/cart/add
// ─────────────────────────────────────────────
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await getOrCreateCart(userId);

    const index = cart.items.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (index !== -1) {
      cart.items[index].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    cart = await cart.populate("items.product");

    res.json({ message: "Item added", cart: calculateTotals(cart) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// 2. DELETE ITEM
// DELETE /api/cart/delete/:productId
// ─────────────────────────────────────────────
export const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product._id.toString() !== productId
    );

    await cart.save();
    cart = await cart.populate("items.product");

    res.json({ message: "Item removed", cart: calculateTotals(cart) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// 3. UPDATE QUANTITY (inc or dec)
// PUT /api/cart/update
// ─────────────────────────────────────────────
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, action } = req.body; // "inc" or "dec"

    let cart = await getOrCreateCart(userId);

    const index = cart.items.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (index === -1)
      return res.status(404).json({ message: "Item not in cart" });

    if (action === "inc") cart.items[index].quantity += 1;
    if (action === "dec") {
      cart.items[index].quantity -= 1;
      if (cart.items[index].quantity <= 0) {
        cart.items.splice(index, 1);
      }
    }

    await cart.save();
    cart = await cart.populate("items.product");

    res.json({ message: "Quantity updated", cart: calculateTotals(cart) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET CART
// GET /api/cart/my
// ─────────────────────────────────────────────
export const getMyCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart)
      return res.json({ items: [], totalItems: 0, totalPrice: 0 });

    res.json(calculateTotals(cart));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

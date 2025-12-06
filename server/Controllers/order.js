import Order from "../Models/order.js";
import Cart from "../Models/cart.js";

// ─────────────────────────────────────────────
// Helper: Calculate totals from cart
// ─────────────────────────────────────────────
const calculateOrderDetails = (cart) => {
  const items = cart.items.map((item) => ({
    product: item.product._id,
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
// CHECKOUT - Create order from cart and clear cart
// POST /api/orders/checkout
// ─────────────────────────────────────────────
export const checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate order details
    const orderDetails = calculateOrderDetails(cart);

    // Create the order
    const order = await Order.create({
      user: userId,
      items: orderDetails.items,
      totalItems: orderDetails.totalItems,
      totalPrice: orderDetails.totalPrice,
      paymentStatus: "paid",
      status: "processing",
    });

    // Clear the cart
    cart.items = [];
    await cart.save();

    // Populate order items for response
    const populatedOrder = await Order.findById(order._id).populate("items.product");

    res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET ORDER HISTORY
// GET /api/orders/history
// ─────────────────────────────────────────────
export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product");

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET SINGLE ORDER
// GET /api/orders/:orderId
// ─────────────────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: userId }).populate(
      "items.product"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

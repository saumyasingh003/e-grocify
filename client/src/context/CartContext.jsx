import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

// API Base URL
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Not logged in, don't fetch cart
      setCart([]);
      setCartTotal(0);
      setCartCount(0);
      return;
    }

    try {
      const { data } = await axios.get(`${API_BASE}/cart/my`, {
        headers: getAuthHeaders()
      });
      setCart(data.items || []);
      setCartTotal(data.totalPrice || 0);
      setCartCount(data.totalItems || 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
      setCartTotal(0);
      setCartCount(0);
    }
  };

  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_BASE}/cart/add`,
        { productId },
        { headers: getAuthHeaders() }
      );
      setCart(data.cart.items);
      setCartTotal(data.cart.totalPrice);
      setCartCount(data.cart.totalItems);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const updateQty = async (productId, action) => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/cart/update`,
        { productId, action },
        { headers: getAuthHeaders() }
      );
      setCart(data.cart.items);
      setCartTotal(data.cart.totalPrice);
      setCartCount(data.cart.totalItems);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const deleteItem = async (productId) => {
    try {
      const { data } = await axios.delete(
        `${API_BASE}/cart/delete/${productId}`,
        { headers: getAuthHeaders() }
      );
      setCart(data.cart.items);
      setCartTotal(data.cart.totalPrice);
      setCartCount(data.cart.totalItems);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, cartTotal, cartCount, addToCart, updateQty, deleteItem, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

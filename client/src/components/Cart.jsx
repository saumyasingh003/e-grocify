import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faArrowLeft,
  faMinus,
  faPlus,
  faCartShopping,
  faCreditCard,
  faLock,
  faXmark,
  faCheckCircle,
  faSpinner,
  faHistory,
  faBox
} from "@fortawesome/free-solid-svg-icons";

const Cart = () => {
  const {
    cart,
    cartTotal,
    updateQty,
    deleteItem,
    cartCount,
    checkout,
    orderHistory,
    loadingHistory,
    fetchOrderHistory
  } = useCart();
  const navigate = useNavigate();

  // Payment Modal States
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: ""
  });

  const totalQty = cart?.reduce((acc, item) => acc + item.quantity, 0);

  // Fetch order history on mount
  useEffect(() => {
    fetchOrderHistory();
  }, []);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  // Handle card input changes
  const handleCardChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      setCardData(prev => ({ ...prev, cardNumber: formatCardNumber(value) }));
    } else if (name === "expiry") {
      setCardData(prev => ({ ...prev, expiry: formatExpiry(value) }));
    } else if (name === "cvv") {
      setCardData(prev => ({ ...prev, cvv: value.replace(/[^0-9]/g, "").slice(0, 3) }));
    } else {
      setCardData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };



  // Handle payment submission
  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Call checkout which creates order and clears cart
      await checkout();

      setIsProcessing(false);
      setPaymentSuccess(true);

      // Reset form
      setCardData({
        cardNumber: "",
        expiry: "",
        cvv: "",
        name: ""
      });

      // Close modal and stay on cart page to show order history
      setTimeout(() => {
        setShowPayment(false);
        setPaymentSuccess(false);
      }, 2500);
    } catch (error) {
      setIsProcessing(false);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <>
      <div className="bg-[#f8f9fa] min-h-screen py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-[#be5b4c] transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </button>
            <div className="text-xl font-extrabold text-gray-900">
              Shopping Cart <span className="text-lg text-gray-500 font-medium ml-2">({totalQty || 0} items)</span>
            </div>
          </div>

          {/* CART SECTION */}
          {cart?.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center mb-12">
              <FontAwesomeIcon icon={faCartShopping} className="text-7xl text-gray-200 mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Your Cart is Empty
              </h2>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added anything to your cart yet.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-[#be5b4c] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#a0493d] transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              {/* CART ITEMS LIST */}
              <div className="flex-1 space-y-4">
                {cart?.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-50 rounded-xl flex items-center justify-center p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 w-full text-center sm:text-left">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-[#be5b4c] font-bold text-lg">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                      {/* Quantity */}
                      <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQty(item.productId, "dec")}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-[#be5b4c] transition font-bold"
                        >
                          <FontAwesomeIcon icon={faMinus} size="sm" />
                        </button>
                        <span className="font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.productId, "inc")}
                          className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-[#be5b4c] transition font-bold"
                        >
                          <FontAwesomeIcon icon={faPlus} size="sm" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-[80px]">
                        <p className="text-xs text-gray-500">Subtotal</p>
                        <p className="font-bold text-gray-900">₹{item.subtotal}</p>
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => deleteItem(item.productId)}
                      className="text-gray-400 hover:text-red-500 transition p-2"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-lg" />
                    </button>
                  </div>
                ))}
              </div>

              {/* CHECKOUT SUMMARY */}
              <div className="lg:w-96">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium">₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-[#be5b4c]">
                        ₹{(cartTotal).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">Including VAT</p>
                  </div>

                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full bg-[#be5b4c] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#a0493d] hover:shadow-xl transition-all active:scale-[0.98]"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ORDER HISTORY SECTION */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <FontAwesomeIcon icon={faHistory} className="text-2xl text-[#be5b4c]" />
              <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
            </div>

            {loadingHistory ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                <FontAwesomeIcon icon={faSpinner} className="text-4xl text-[#be5b4c] animate-spin mb-4" />
                <p className="text-gray-500">Loading order history...</p>
              </div>
            ) : orderHistory?.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                <FontAwesomeIcon icon={faBox} className="text-6xl text-gray-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
                <p className="text-gray-500">Your order history will appear here after your first purchase.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orderHistory.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6 border-b border-gray-100">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-mono font-bold text-gray-800 text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium text-gray-800">{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-bold text-[#be5b4c] text-lg">₹{order.totalPrice?.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-4 sm:p-6">
                      <p className="text-sm font-medium text-gray-500 mb-4">{order.totalItems} item(s)</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                          >
                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-1 flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              <p className="text-sm font-bold text-[#be5b4c]">₹{item.subtotal}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

            {/* Success State */}
            {paymentSuccess ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-5xl text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-500 mb-4">Thank you for your order</p>
                <p className="text-sm text-gray-400">Your order history has been updated.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-[#635bff] to-[#7c3aed] p-6 text-white relative">
                  <button
                    onClick={() => setShowPayment(false)}
                    className="absolute top-4 right-4 text-white/70 hover:text-white transition"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-xl" />
                  </button>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faCreditCard} className="text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Secure Payment</h2>
                      <p className="text-sm text-white/70">Powered by Stripe</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold">₹{(cartTotal).toFixed(2)}</div>
                </div>

                {/* Form */}
                <form onSubmit={handlePayment} className="p-6 space-y-5">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] bg-gray-50"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <img src="https://img.icons8.com/color/32/visa.png" alt="visa" className="h-6" />
                        <img src="https://img.icons8.com/color/32/mastercard.png" alt="mastercard" className="h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={cardData.name}
                      onChange={handleCardChange}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] bg-gray-50"
                    />
                  </div>

                  {/* Expiry & CVV */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] bg-gray-50"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="password"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        placeholder="•••"
                        maxLength={3}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Pay Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-[#635bff] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#4f46e5] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isProcessing ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faLock} />
                        Pay ₹{(cartTotal).toFixed(2)}
                      </>
                    )}
                  </button>

                  {/* Security Note */}
                  <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faLock} />
                    Your payment is secured with 256-bit SSL encryption
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;


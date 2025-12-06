import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);

  const base = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Convert name → slug
  const createSlug = (name) => name.toLowerCase().replace(/\s+/g, "-");

  // 1️⃣ Fetch the clicked product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${base}/products/all`);
        const data = await res.json();

        if (data && data.products) {
          const found = data.products.find(
            (p) => p.name.toLowerCase().replace(/\s+/g, "-") === slug
          );
          setProduct(found);
        }
      } catch (error) {
        console.error("Product fetch error:", error);
      }
    };

    fetchProduct();
  }, [slug]);

  // 2️⃣ Fetch recommended products based on clicked product
  useEffect(() => {
    if (!product) return;

    const fetchRecommended = async () => {
      try {
        const res = await fetch(`${base}/recomm/${slug}`);
        const data = await res.json();

        if (data.success) {
          setRecommended(data.recommended);
        }
      } catch (error) {
        console.error("Recommendation fetch error:", error);
      }
    };

    fetchRecommended();
  }, [product]);

  if (!product)
    return (
      <div className="flex items-center justify-center text-xl min-h-screen">
        Loading product details...
      </div>
    );

  return (
    <div className="my-10 px-4">

      {/* PRODUCT DETAILS BOX */}
      <div className="max-w-4xl mx-auto rounded-2xl py-10 px-4 border-gray-700 border bg-white shadow-md mb-12">
        <div className="flex flex-col md:flex-row gap-10">

          {/* IMAGE */}
          <img
            src={product.image}
            alt={product.name}
            className="w-80 h-60 object-contain rounded-xl"
          />

          {/* DETAILS */}
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <p className="text-gray-700 text-md mb-2">{product.description}</p>

            <p className="text-gray-700 text-md mb-2">
              <span className="font-bold">Brand:</span> {product.brand}
            </p>

            <div className="text-2xl font-semibold text-[#be5b4c] mb-2">
              ₹{product.price}
            </div>

            <div className="text-gray-800 mb-3">
              <strong>Category:</strong> {product.category}
            </div>

            <div className="text-gray-800 mb-3">
              <strong>Quantity:</strong> {product.quantity}
            </div>

            <button
              onClick={() => addToCart(product._id)}
              className="px-6 py-3 cursor-pointer bg-[#be5b4c] text-white rounded-lg shadow-md hover:bg-[#a94b41] transition"
            >
              Add to Cart
            </button>
          </div>

        </div>
      </div>

      {/* ⭐ HEADING BELOW THE BOX */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Recommended <span className="text-[#be5b4c]">for You..</span>
        </h2>
        <div className="h-1 flex-1 bg-gray-200 ml-6 rounded-full hidden sm:block"></div>
      </div>

      {/* ⭐ RECOMMENDED PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommended.length === 0 && (
          <p className="text-gray-500">No recommendations available.</p>
        )}

        {recommended.map((p) => {
          return (
            <div
              key={p._id}
              onClick={() => navigate(`/productDetails/${createSlug(p.name)}`)}
              className="border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden bg-white cursor-pointer"
            >
              {/* IMAGE */}
              <div className="flex justify-center items-center py-6">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-40 w-40 object-contain"
                />
              </div>

              {/* DETAILS */}
              <div className="p-4 flex flex-col justify-between bg-[#EEEBD0]">
                <div>
                  {/* NAME + PRICE */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-semibold text-gray-800">
                      {p.name}
                    </h3>

                    <div className="text-md font-semibold text-gray-900">
                      ₹{p.price}
                    </div>
                  </div>

                  {/* SHORT DESCRIPTION */}
                  <p className="text-sm text-gray-600 mb-3">
                    {p.description.split(" ").slice(0, 4).join(" ")}...
                  </p>
                </div>

                {/* BUTTON */}
                <div className="mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(p._id);
                    }}
                    className="w-full py-2.5 cursor-pointer rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300 bg-[#be5b4c] text-white hover:bg-[#a94b41] hover:scale-[1.03] active:scale-[0.97] shadow-md hover:shadow-lg"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );


};

export default ProductDetails;

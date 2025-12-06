import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useCart } from "../context/CartContext";

const Listings = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const rupee = "\u20B9";

  // createSlug helper...
  const createSlug = (name) => name.toLowerCase().replace(/\s+/g, "-");

  // Fetch all products
  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${base}/products/all`);
        const data = await res.json();
        if (data?.products) setProducts(data.products);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchProducts();
  }, []);

  // Category filters
  const fruitsAndVeg = products.filter(
    (p) => p.category === "fruits" || p.category === "vegetables"
  );

  const packed = products.filter((p) =>
    ["grains", "protein", "dairy"].includes(p.category)
  );

  // ⭐ TIME-BASED RECOMMENDATION LOGIC ⭐
  const getTimeBasedTag = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) return "breakfast";
    if (hour >= 11 && hour < 16) return "lunch";
    if (hour >= 16 && hour < 19) return "snacking";
    if (hour >= 19 && hour <= 23) return "dinner";

    return "snacking";
  };

  const recommendedTag = getTimeBasedTag();

  // Filter TOP 10 recommended items
  const recommended = products
    .filter((p) => p.tags?.includes(recommendedTag))
    .slice(0, 10);

  // ⭐ Reusable Section Component
  const Section = ({ title, items }) => (
    <div className="mb-10">
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {title.split(" ")[0]}{" "}
          <span className="text-[#be5b4c]">{title.split(" ").slice(1).join(" ")}</span>
        </h2>
        <div className="h-1 flex-1 bg-gray-200 ml-6 rounded-full hidden sm:block"></div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items?.map((p) => {
          return (
            <div
              key={p._id}
              onClick={() => navigate(`/productDetails/${createSlug(p.name)}`)}
              className="border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden bg-white cursor-pointer"
            >
              {/* IMAGE */}
              <div className="flex justify-center items-center py-6">
                <img src={p.image} alt={p.name} className="h-40 w-40 object-contain" />
              </div>

              {/* DETAILS */}
              <div className="p-4 flex flex-col justify-between bg-[#EEEBD0]">
                <div>
                  {/* NAME + PRICE */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-semibold text-gray-800">{p.name}</h3>
                    <div className="text-md font-semibold text-gray-900">
                      {rupee}
                      {p.price}
                    </div>
                  </div>

                  {/* SHORT DESCRIPTION */}
                  <p className="text-sm text-gray-600 mb-3">
                    {p.description.split(" ").slice(0, 4).join(" ")}...
                  </p>
                </div>

                {/* ADD BUTTON */}
                <div className="mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent redirect
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

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4">

      <SearchBar products={products} />


      {/* SECTION 1 */}
      <Section title="Fresh Fruits & Veggies" items={fruitsAndVeg} />

      {/* SECTION 2 */}
      <Section title="Fresh Packed Products" items={packed} />

      {/* ⭐ TIME-BASED RECOMMENDED SECTION ⭐ */}
      <Section
        title={`Recommended for ${recommendedTag.charAt(0).toUpperCase() + recommendedTag.slice(1)}`}
        items={recommended}
      />
    </div>
  );
};

export default Listings;

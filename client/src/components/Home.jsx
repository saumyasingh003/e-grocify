import React, { useEffect, useState } from "react";
import { testimonialData } from "../data/testimonials.js";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  // Carousel Settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const createSlug = (name) => name.toLowerCase().replace(/\s+/g, "-");

  // Fetch products
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

  const fruitsAndVeg = products.filter(
    (p) => ["fruits", "vegetables"].includes(p.category)
  );

  return (
    <div className="bg-[#EEEBD0] min-h-screen">
      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 ">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          {/* Text Section */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 px-4 py-1.5 rounded-full shadow-sm mx-auto md:mx-0">
              <span className="text-sm font-bold text-orange-600 uppercase tracking-wide">
                Bike Delivery
              </span>
              <img
                src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
                alt="bike"
                className="w-5 h-5"
              />
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight text-gray-900 tracking-tight">
              Eat Fresh. <br />
              Live Better. <br />
              <span className="text-[#be5b4c]">We Deliver It All.</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-base sm:text-lg md:text-xl max-w-lg mx-auto md:mx-0">
              Fresh vegetables, dairy, fruits, snacks, and everyday essentials
              delivered straight to your doorstep. Fast, reliable, and always
              fresh.
            </p>

            {/* Button */}
            <button
              onClick={() => navigate("/more")}
              className="mt-4 bg-[#be5b4c] hover:bg-[#a0493d] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Order Now
            </button>
          </div>

          {/* Hero Image */}
          <div className="w-full md:w-1/2 flex justify-center relative">
            <div className="absolute inset-0 bg-[#be5b4c]/10 rounded-full blur-3xl scale-75 -z-10"></div>
            <img
              src="/vege1.png"
              alt="Hero"
              className="w-full max-w-md md:max-w-lg h-auto object-contain drop-shadow-2xl animate-fade-in-up"
            />
          </div>
        </div>
      </div>

      {/* FRUITS & VEGETABLES SECTION */}
      <div className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Fresh <span className="text-[#be5b4c]">Fruits & Veggies</span>
            </h2>
            <div className="h-1 flex-1 bg-gray-200 ml-6 rounded-full hidden sm:block"></div>
          </div>

          {/* Carousel */}
          <div className="pb-10">
            {fruitsAndVeg.length > 0 ? (
              <Slider {...settings}>
                {fruitsAndVeg.map((item) => (
                  <div key={item._id} className="px-3 py-4">
                    <div
                      onClick={() => navigate(`/productDetails/${createSlug(item.name)}`)}
                      className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 h-full flex flex-col cursor-pointer"
                    >
                      {/* Image Section */}
                      <div className="h-48 w-full flex items-center justify-center bg-white p-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white transition-colors duration-300"></div>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full max-h-40 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      {/* Title & Button Section */}
                      <div
                        className="p-5 flex flex-col items-center w-full gap-3"
                        style={{ backgroundColor: "#EFEBD1" }}
                      >
                        <h3
                          className="font-bold text-xl transition-colors text-center"
                          style={{ color: "#BE5B4C" }}
                        >
                          {item.name}
                        </h3>

                        {/* Add Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item._id);
                          }}
                          className="w-full py-2 bg-[#be5b4c] text-white rounded-lg font-medium shadow-md hover:bg-[#a94b41] transition-transform active:scale-95 text-sm"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="text-center py-10 text-gray-500">Loading fresh products...</div>
            )}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS SECTION */}
      <div className="py-20 bg-[#EEEBD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 text-lg">
              Hear from customers who trust Grocify for fresh and fast grocery
              delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialData.map((item) => (
              <div
                key={item.id}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative hover:-translate-y-2 transition-transform duration-300"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-8 text-6xl text-gray-100 font-serif leading-none select-none">
                  "
                </div>

                {/* Stars */}
                <div className="flex text-yellow-400 text-lg mb-4">
                  {"★".repeat(item.rating)}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 italic text-lg mb-6 relative z-10">
                  {item.text}
                </p>

                {/* User Info */}
                <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#be5b4c]"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {item.name}
                    </p>
                    <p className="text-sm text-[#be5b4c] font-medium">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

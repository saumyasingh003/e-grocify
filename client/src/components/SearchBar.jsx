import React, { useState, useEffect, useRef } from "react";
import { useSearch } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";

const base = import.meta.env.VITE_API_URL || "http://localhost:8000";
const GEMINI_KEY = "AIzaSyCk1xr9Jf9dBS93cdVwXzYxOSQtsEK9ZXo";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestedWord, setSuggestedWord] = useState(""); // ⭐ AI suggestion

  const searchRef = useRef(null);
  const { setSearchData } = useSearch();
  const navigate = useNavigate();

  // LOAD ALL PRODUCTS
  useEffect(() => {
    const loadProducts = async () => {
      const res = await fetch(`${base}/products/all`);
      const data = await res.json();
      setAllProducts(data.products || []);
    };
    loadProducts();
  }, []);

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // TIME BASED PRODUCT RECOMMENDATION
  const getTimeTag = () => {
    const hour = new Date().getHours();
    if (hour < 11) return "breakfast";
    if (hour < 16) return "lunch";
    if (hour < 19) return "snacking";
    return "dinner";
  };

  const recommended = allProducts
    .filter((p) => p.tags.includes(getTimeTag()))
    .slice(0, 6);

  // HIGHLIGHT SEARCH TEXT
  const highlight = (text, q) => {
    const reg = new RegExp(`(${q})`, "gi");
    return text.replace(reg, "<b class='text-[#be5b4c]'>$1</b>");
  };

  // ⭐ AI SUGGESTION FUNCTION (Frontend)
  const checkAISuggestion = async (text) => {
    if (!text || text.trim().length < 2) {
      setSuggestedWord("");
      return;
    }

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
Correct the spelling of this grocery search term:
"${text}"

Return ONLY the corrected word. No explanation.
                    `,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const corrected =
        data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

      if (corrected && corrected.toLowerCase() !== text.toLowerCase()) {
        setSuggestedWord(corrected);
      } else {
        setSuggestedWord("");
        console.log("AI corrected:", corrected);
console.log("suggestedWord:", suggestedWord);
      }
    } catch (err) {
      console.log("AI Suggestion Error:", err);
    }
  };

  // HANDLE SEARCH INPUT
  const handleSearch = (value) => {
    setQuery(value);

    if (!value.trim()) {
      setSuggestions(recommended);
      setSuggestedWord("");
      return;
    }

    // ⭐ AI CHECK
    checkAISuggestion(value);

    // FILTER PRODUCTS
    const filtered = allProducts.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 6));
  };

  // EXECUTE SEARCH
  const runSearch = (q = query) => {
    const results = allProducts.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );

    setSearchData(q, results);
    navigate("/search-results");
    setShowDropdown(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-auto mb-10">
      {/* SEARCH INPUT */}
      <div
        onClick={() => {
          setShowDropdown(true);
          setSuggestions(recommended);
        }}
        className="flex items-center bg-white border py-3 border-gray-300 rounded-md px-4 shadow-sm cursor-text"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m1.35-5.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z"
          />
        </svg>

        <input
          type="text"
          placeholder="Search anything you want..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
          className="w-full ml-3 outline-none text-gray-700"
        />
      </div>

      {/* DROPDOWN */}
      {showDropdown && (
        <div className="absolute left-0 right-0 bg-white border rounded-md shadow-md mt-2 p-2 z-50">

          {/* ⭐ AI SUGGESTION (Left Aligned) */}
       {suggestedWord && (
  <div
    className="px-3 py-2 text-sm text-blue-600 cursor-pointer hover:underline text-left border-b border-gray-200"
    onClick={() => {
      setQuery(suggestedWord);
      runSearch(suggestedWord);
      setSuggestedWord("");
    }}
  >
    Did you mean <strong>{suggestedWord}</strong>?
  </div>
)}


          {/* IF NO SUGGESTIONS */}
          {suggestions.length === 0 ? (
            <p className="flex items-center gap-2 text-gray-500 px-2 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              No recommendations available
            </p>
          ) : (
            suggestions.map((item) => (
              <div
                key={item._id}
                onClick={() => runSearch(item.name)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 object-cover rounded-md"
                />

                <div className="flex-1">
                  <span
                    className="font-medium text-gray-800"
                    dangerouslySetInnerHTML={{
                      __html: highlight(item.name, query),
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-0.5">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

import React from "react";
import { useSearch } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";

const rupee = "\u20B9";

const SearchResults = () => {
  const { searchQuery, searchResults } = useSearch();
  const navigate = useNavigate();

  const createSlug = (name) => name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">
        Results for <span className="text-[#be5b4c]">{searchQuery}</span>
      </h2>

      {searchResults.length === 0 ? (
        <p className="text-gray-500 text-lg">No matching products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {searchResults.map((p) => (
            <div
              key={p._id}
              onClick={() =>
                navigate(`/productDetails/${createSlug(p.name)}`)
              }
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
                      {rupee}
                      {p.price}
                    </div>
                  </div>

                  {/* SHORT DESCRIPTION */}
                  <p className="text-sm text-gray-600 mb-3">
                    {p.description
                      ? p.description.split(" ").slice(0, 4).join(" ")
                      : "No description"}
                    ...
                  </p>
                </div>

                {/* BUTTON */}
                <div className="mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // 🔥 Add-to-cart logic can be placed here
                    }}
                    className="w-full py-2.5 cursor-pointer rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300 bg-[#be5b4c] text-white hover:bg-[#a94b41] hover:scale-[1.03] active:scale-[0.97] shadow-md hover:shadow-lg"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default SearchResults;

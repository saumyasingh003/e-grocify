import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Listings from "./components/Listings";
import { Toaster } from "react-hot-toast";
import { SearchProvider } from "./context/SearchContext";
import ProductDetails from "./components/ProductDetails";
import SearchResults from "./components/SearchResults";
import Cart from "./components/Cart";

const App = () => {
  return (
     <SearchProvider>
    <BrowserRouter>
      {/* 🔥 Toast Container */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "14px",
            borderRadius: "16px",
          },
        }}
      />

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/more" element={<Listings />} />
         <Route path="/productDetails/:slug" element={<ProductDetails />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>

      <Footer />
    </BrowserRouter>
    </SearchProvider>
  );
};

export default App;

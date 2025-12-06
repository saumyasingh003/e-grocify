import React, { useState, useEffect } from "react";
import LoginModal from "./Login.jsx";
import RegisterModal from "./Register.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faBars,
  faXmark,
  faUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { cartCount } = useCart();

  // Check login status from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setProfileOpen(false);
    setOpen(false);
    // Reload to clear cart state
    window.location.reload();
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#be5b4c] text-white px-6 shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* LOGO */}
          <a href="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-28 h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">

            {/* DESKTOP CART */}
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="relative cursor-pointer flex items-center gap-3 text-lg font-medium"
            >
              <div className="relative">
                <FontAwesomeIcon
                  icon={faCartShopping}
                  className="text-2xl hover:text-white"
                />
                <span className="absolute -top-2 -right-2 bg-white text-[#be5b4c] text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              </div>
            </Link>

            {/* Profile Icon */}
            <div className="relative">
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm border border-white/10"
              >
                <FontAwesomeIcon icon={faUser} />
              </div>

              {/* PROFILE DROPDOWN */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 bg-white text-gray-800 rounded-xl shadow-2xl w-56 py-2 z-50 border border-gray-100 animate-in fade-in">
                  {isLoggedIn ? (
                    <>
                      {/* User Info */}
                      <div className="px-5 py-3 border-b border-gray-100">
                        <p className="font-bold text-gray-900 truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user?.email || ""}
                        </p>
                      </div>

                      {/* Profile Button */}
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full text-left px-5 py-2.5 hover:bg-gray-50 hover:text-[#be5b4c] font-medium flex items-center gap-3"
                      >
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                        Profile
                      </button>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-2.5 hover:bg-gray-50 hover:text-red-500 font-medium flex items-center gap-3 text-red-500"
                      >
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowLogin(true);
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-5 py-2.5 hover:bg-gray-50 hover:text-[#be5b4c] font-medium"
                      >
                        Login
                      </button>

                      <button
                        onClick={() => {
                          setShowRegister(true);
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-5 py-2.5 hover:bg-gray-50 hover:text-[#be5b4c] font-medium"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            className="md:hidden text-3xl cursor-pointer hover:text-gray-200 transition-colors"
            onClick={() => setOpen(!open)}
          >
            <FontAwesomeIcon icon={open ? faXmark : faBars} />
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden mt-4 px-4 pb-4 flex flex-col items-end gap-6 animate-in slide-in-from-top-5 duration-200">

            {/* MOBILE CART */}
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="relative cursor-pointer flex items-center gap-3 text-lg font-medium hover:text-gray-200 transition-colors"
            >
              <span>Cart</span>
              <div className="relative">
                <FontAwesomeIcon icon={faCartShopping} className="text-2xl" />
                <span className="absolute -top-2 -right-2 bg-white text-[#be5b4c] text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              </div>
            </Link>

            {/* PROFILE SECTION (MOBILE) */}
            <div className="flex flex-col items-end gap-3 w-full">
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 cursor-pointer text-lg font-medium"
              >
                <span>{isLoggedIn ? user?.name || "Account" : "Account"}</span>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} />
                </div>
              </div>

              {profileOpen && (
                <div className="bg-white text-gray-800 rounded-lg shadow-lg w-full py-2 flex flex-col items-center">
                  {isLoggedIn ? (
                    <>
                      {/* User Info (Mobile) */}
                      <div className="w-full px-4 py-3 border-b border-gray-100 text-center">
                        <p className="font-bold text-gray-900">{user?.name || "User"}</p>
                        <p className="text-sm text-gray-500">{user?.email || ""}</p>
                      </div>

                      {/* Profile (Mobile) */}
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          setOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full text-center px-4 py-3 hover:bg-gray-50 hover:text-[#be5b4c] font-medium border-b"
                      >
                        Profile
                      </button>

                      {/* Sign Out (Mobile) */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-center px-4 py-3 hover:bg-gray-50 text-red-500 font-medium"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowLogin(true);
                          setProfileOpen(false);
                          setOpen(false);
                        }}
                        className="w-full text-center px-4 py-3 hover:bg-gray-50 hover:text-[#be5b4c] font-medium border-b"
                      >
                        Login
                      </button>

                      <button
                        onClick={() => {
                          setShowRegister(true);
                          setProfileOpen(false);
                          setOpen(false);
                        }}
                        className="w-full text-center px-4 py-3 hover:bg-gray-50 hover:text-[#be5b4c] font-medium"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* LOGIN MODAL */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          openRegister={() => setShowRegister(true)}
        />
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          openLogin={() => setShowLogin(true)}
        />
      )}
    </>
  );
};

export default Navbar;

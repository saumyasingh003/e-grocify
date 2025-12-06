import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";

// Zod Schema
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginModal = ({ onClose, openRegister }) => {
  const overlayRef = useRef();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Close if clicked outside
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Controlled inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ======================
  // SUBMIT LOGIN
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Zod Validation
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      // 2️⃣ API CALL
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      // 3️⃣ Store token in localStorage
      if (res.data.user?.token) {
        localStorage.setItem("token", res.data.user.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // 4️⃣ Success Toast
      toast.success(res.data.message);

      // 5️⃣ Reload to fetch cart with new token
      window.location.reload();

      // 6️⃣ Close login modal
      onClose();

    } catch (error) {
      console.log("LOGIN ERROR:", error);

      // Extract backend error message
      const backendMsg =
        error?.response?.data?.message || "Login failed. Try again.";

      // Show backend message
      toast.error(backendMsg);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 z-[60] animate-in fade-in duration-200"
    >
      <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-200">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FontAwesomeIcon icon={faXmark} className="text-xl" />
        </button>

        {/* TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm">Sign in to continue your order</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-50 border ${errors.email ? "border-red-500" : "border-gray-200"
                } text-gray-900 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-[#be5b4c]/20`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD + EYE */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Password
            </label>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 bg-gray-50 border ${errors.password ? "border-red-500" : "border-gray-200"
                  } text-gray-900 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-[#be5b4c]/20`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-[#be5b4c]"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
            )}
          </div>

          {/* SUBMIT */}
          <button className="w-full mt-6 py-3.5 rounded-xl text-white font-bold text-lg bg-[#be5b4c] hover:bg-[#a0493d] shadow-lg transition-all duration-200">
            Login
          </button>
        </form>

        {/* REDIRECT */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => {
              onClose();
              openRegister();
            }}
            className="text-[#be5b4c] font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;

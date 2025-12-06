import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";

// ⭐ Correct ZOD schema
const registerSchema = z
  .object({
    fullName: z.string().min(3, "Full Name must be at least 3 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),

  })

const RegisterModal = ({ onClose, openLogin }) => {
  const overlayRef = useRef();

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  
  });

  // Overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ====================================
  // 🚀 SUBMIT HANDLER
  // ====================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Validate using ZOD
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({}); // clear errors

    try {
      // 2️⃣ Backend API CALL
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      // 3️⃣ Show backend message in toast
      toast.success(res.data.message);

      // 4️⃣ Open login after closing
      onClose();
      setTimeout(() => openLogin(), 300);

    } catch (error) {
      console.log("REGISTER ERROR:", error);

      // Backend message → Toast
      const backendMsg =
        error?.response?.data?.message || "Something went wrong";

      toast.error(backendMsg);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4 z-[60]"
    >
      <div className="bg-white p-8 rounded-3xl max-w-md w-full shadow-xl relative">

        {/* Close btn */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faXmark} className="text-xl" />
        </button>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-gray-500 text-sm">Join us for fresh food delivery</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-50 border ${
                errors.fullName ? "border-red-500" : "border-gray-200"
              } rounded-xl`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-50 border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } rounded-xl`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 bg-gray-50 border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } rounded-xl`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-gray-400"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

       

          {/* SUBMIT */}
          <button
            className="w-full py-3 bg-[#be5b4c] hover:bg-[#a0493d] text-white font-bold rounded-xl"
          >
            Create Account
          </button>
        </form>

        {/* Redirect */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => {
              onClose();
              openLogin();
            }}
            className="text-[#be5b4c] cursor-pointer font-semibold hover:underline"
          >
            Login Here
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;

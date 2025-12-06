import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand + Address */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Grocify Logo"
              className="w-16 h-16 object-contain"
            />
            <h2 className="text-[#be5b4c] text-2xl font-bold tracking-tight">Grocify</h2>
          </div>

          <div className="text-gray-600 text-sm leading-relaxed">
            <p>123 Market Street,</p>
            <p>Patna, Bihar, India</p>
            <p>PIN: 800001</p>
          </div>

          <div className="text-gray-600 text-sm space-y-1">
            <p><span className="font-semibold text-gray-900">Email:</span> support@grocify.com</p>
            <p><span className="font-semibold text-gray-900">Phone:</span> +91 98765 43210</p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-gray-900 text-lg font-bold mb-6">Quick Links</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="/" className="hover:text-[#be5b4c] transition-colors">Home</a></li>
            <li><a href="/about" className="hover:text-[#be5b4c] transition-colors">About Us</a></li>
            <li><a href="/products" className="hover:text-[#be5b4c] transition-colors">Products</a></li>
            <li><a href="/contact" className="hover:text-[#be5b4c] transition-colors">Contact</a></li>
            <li><a href="/faq" className="hover:text-[#be5b4c] transition-colors">FAQs</a></li>
          </ul>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="text-gray-900 text-lg font-bold mb-6">Follow Us</h3>
          <p className="text-gray-600 text-sm mb-4">Stay connected with us on social media for updates and offers.</p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#be5b4c] hover:text-white transition-all duration-300">
              <FaFacebook className="text-xl" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#be5b4c] hover:text-white transition-all duration-300">
              <FaInstagram className="text-xl" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#be5b4c] hover:text-white transition-all duration-300">
              <FaTwitter className="text-xl" />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Grocify. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

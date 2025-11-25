import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f5f9ff] border-t mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo + Description */}
        <div>
          <h2 className="text-2xl font-bold text-blue-700">TrustBank</h2>
          <p className="text-gray-600 mt-3 leading-relaxed">
            Empowering your financial future with secure, smart, and seamless
            banking solutions.
          </p>

          {/* Social media icons */}
          <div className="flex items-center gap-4 mt-4">
            <FaFacebook className="text-blue-700 text-xl hover:text-blue-500 cursor-pointer transition" />
            <FaInstagram className="text-pink-600 text-xl hover:text-pink-500 cursor-pointer transition" />
            <FaTwitter className="text-blue-500 text-xl hover:text-blue-400 cursor-pointer transition" />
            <FaLinkedin className="text-blue-700 text-xl hover:text-blue-500 cursor-pointer transition" />
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Banking Services</h3>
          <ul className="text-gray-600 space-y-2">
            <li>Online Banking</li>
            <li>Mobile Banking</li>
            <li>Savings Account</li>
            <li>Fixed Deposits</li>
            <li>Loan Services</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Support</h3>
          <ul className="text-gray-600 space-y-2">
            <li>Help Center</li>
            <li>Customer Support</li>
            <li>Report Fraud</li>
            <li>Security Tips</li>
            <li>FAQs</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Contact Us</h3>
          <ul className="text-gray-600 space-y-2">
            <li>📍 Bhavnagar, Gujarat</li>
            <li>📞 +91 9876543210</li>
            <li>✉ prajapatibansi1510@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} TrustBank. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;

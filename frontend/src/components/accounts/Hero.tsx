import React from "react";
import { FaShieldAlt, FaBalanceScale, FaInfoCircle } from "react-icons/fa";
const Hero: React.FC = () => {
  return (
    <div className="w-full bg-white shadow rounded-xl p-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Banking Rights & Safety Guidelines
      </h1>

      <div className="grid md:grid-cols-3 gap-6 text-gray-700">
        <div className="flex gap-3">
          <FaShieldAlt size={28} className="text-blue-600" />
          <p>All deposits insured up to ₹5,00,000 under RBI guidelines.</p>
        </div>

        <div className="flex gap-3">
          <FaBalanceScale size={28} className="text-blue-600" />
          <p>Right to fair interest rates & transparent charges.</p>
        </div>

        <div className="flex gap-3">
          <FaInfoCircle size={28} className="text-blue-600" />
          <p>Never share OTP, Debit Card PIN, CVV with anyone.</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;

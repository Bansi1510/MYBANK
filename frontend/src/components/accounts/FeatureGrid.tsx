import React from "react";
import {
  FaTrain,
  FaMobileAlt,
  FaBolt,
  FaWifi,
  FaCreditCard,
  FaBuilding,
  FaBus,
  FaGlobe,
} from "react-icons/fa";

const FeatureGrid: React.FC = () => {
  const features = [
    { name: "Railway Booking", icon: <FaTrain size={24} /> },
    { name: "Mobile Recharge", icon: <FaMobileAlt size={24} /> },
    { name: "Electricity Bill", icon: <FaBolt size={24} /> },
    { name: "Internet Bill", icon: <FaWifi size={24} /> },
    { name: "Credit Card Payment", icon: <FaCreditCard size={24} /> },
    { name: "Tax & PAN Services", icon: <FaBuilding size={24} /> },
    { name: "Bus Booking", icon: <FaBus size={24} /> },
    { name: "International Services", icon: <FaGlobe size={24} /> },
  ];

  return (
    <section className="">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Services</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white border p-5 rounded-xl shadow-sm text-center hover:shadow-md"
          >
            <div className="text-blue-600">{item.icon}</div>
            <p className="text-gray-800 font-medium mt-2">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default FeatureGrid;

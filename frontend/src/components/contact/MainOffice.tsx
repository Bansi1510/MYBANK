import React from "react";
import { FaBuilding } from "react-icons/fa";

const MainOffice: React.FC = () => {
  return (
    <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
      <div className="flex items-center mb-6 gap-4">
        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-violet-50 text-violet-700 text-2xl">
          <FaBuilding />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">Main Headquarters</h2>
      </div>

      <address className="not-italic max-w-md text-gray-700 space-y-2 text-lg">
        <p className="font-semibold text-gray-900">MyBank Global Headquarters</p>
        <p>Platinum Tower, Sector 5, Mumbai, India</p>
        <p>PIN: 400001</p>
        <p className="pt-2 text-sm text-gray-500">
          Operating Hours: Monday–Saturday, 9:00 AM – 6:00 PM (IST)
        </p>
      </address>
    </section>
  );
};

export default MainOffice;

import React from "react";
import { FaPhone, FaGlobe } from "react-icons/fa";

const ContactInfo: React.FC = () => {
  return (
    <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
      <div className="flex items-center mb-6 gap-4">
        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-amber-50 text-amber-700 text-2xl">
          <FaPhone />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">Contact Information</h2>
      </div>

      <div className="max-w-md space-y-4 text-gray-700 text-lg">
        <p>
          <strong className="text-slate-900">Customer Care (24/7):</strong> +91 1800-123-456
        </p>
        <p>
          <strong className="text-slate-900">International Helpline:</strong> +1 202-555-0183
        </p>
        <p>
          <strong className="text-slate-900">Email:</strong>{" "}
          <a href="mailto:support@mybank.com" className="text-sky-600 hover:underline">
            support@mybank.com
          </a>
        </p>
        <p className="flex items-center gap-2">
          <FaGlobe className="text-gray-500" />{" "}
          <a href="https://www.mybank.com" className="text-sky-600 hover:underline">
            www.mybank.com
          </a>
        </p>
      </div>
    </section>
  );
};

export default ContactInfo;

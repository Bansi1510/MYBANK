import React from "react";
import { motion } from "framer-motion";
import { CreditCard, Users, Wallet } from "lucide-react";

const services = [
  {
    icon: <CreditCard className="w-10 h-10 text-blue-600" />,
    title: "Debit / Credit Cards",
  },
  {
    icon: <Users className="w-10 h-10 text-blue-600" />,
    title: "Personal & Business Loans",
  },
  {
    icon: <Wallet className="w-10 h-10 text-blue-600" />,
    title: "Savings & Current Accounts",
  },
];

const Services = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Banking <span className="text-blue-600">Services</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {services.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="p-8 border rounded-2xl shadow-sm hover:shadow-xl bg-gray-50"
            >
              {item.icon}
              <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
              <p className="text-gray-500 mt-2">
                Modern banking built for speed & reliability.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

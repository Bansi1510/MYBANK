import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Wallet, Smartphone } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="w-12 h-12 text-blue-600" />,
    title: "Top-Tier Security",
    desc: "Bank-level encryption & fraud protection.",
  },
  {
    icon: <Smartphone className="w-12 h-12 text-blue-600" />,
    title: "Smart Digital Banking",
    desc: "Manage accounts, transfer funds & more.",
  },
  {
    icon: <Wallet className="w-12 h-12 text-blue-600" />,
    title: "Instant Transactions",
    desc: "Fast deposits and withdrawals anytime.",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose <span className="text-blue-600">MyBank?</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              {item.icon}
              <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
              <p className="mt-2 text-gray-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

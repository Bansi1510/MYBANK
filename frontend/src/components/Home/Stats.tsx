import React from "react";

const stats = [
  { number: "1M+", text: "Happy Customers" },
  { number: "₹10,000 Cr+", text: "Transactions Processed" },
  { number: "24/7", text: "Customer Support" },
  { number: "99.9%", text: "System Uptime" },
];

const Stats = () => {
  return (
    <section className="py-20 px-6 bg-blue-50">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-center">
        {stats.map((item, idx) => (
          <div key={idx}>
            <h3 className="text-4xl font-extrabold text-blue-700">
              {item.number}
            </h3>
            <p className="text-gray-600 mt-2">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;

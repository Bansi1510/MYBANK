import React from "react";

const CTA = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center">
      <h2 className="text-3xl font-bold">
        Start Your Banking Journey Today
      </h2>
      <p className="mt-3 opacity-90">
        Open an account in minutes and experience the future of banking.
      </p>

      <button className="mt-6 px-10 py-3 rounded-full bg-white text-blue-700 font-semibold shadow-lg">
        Open Account
      </button>
    </section>
  );
};

export default CTA;

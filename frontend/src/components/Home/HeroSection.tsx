import React from 'react';

const HeroSection: React.FC = () => (
  <section className="relative bg-linear-to-r from-blue-800 to-blue-600 text-white py-24 mt-25 px-6 rounded-xl max-w-6xl mx-auto shadow-lg overflow-hidden">
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-6">
        Secure Banking with <span className="text-yellow-400">MYBANK</span>
      </h1>
      <p className="text-lg font-medium mb-10 opacity-90">
        Banking that empowers your future. Fast, reliable, and completely secure.
      </p>
      <button className="inline-block bg-yellow-400 text-blue-900 font-bold uppercase px-10 py-4 rounded-lg shadow-lg hover:bg-yellow-500 transition">
        Get Started
      </button>
    </div>
    {/* Background decorative sphere */}
    <div className="absolute top-[-120px] right-[-120px] w-72 h-72 bg-yellow-400 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
  </section>
);

export default HeroSection;

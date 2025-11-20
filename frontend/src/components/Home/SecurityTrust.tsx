import React from 'react';

const SecurityTrust: React.FC = () => (
  <section className="flex flex-col md:flex-row items-center bg-blue-50 rounded-xl mt-10 p-12 gap-12 max-w-5xl mx-auto">
    <div className="flex-1 text-center md:text-left">
      <h3 className="text-2xl font-bold text-blue-700 mb-5">Your Security is Our Commitment</h3>
      <p className="text-blue-900 leading-relaxed">
        State-of-the-art encryption and 24/7 monitoring ensure your data and finances stay safe.
      </p>
    </div>
    <blockquote className="flex-1 border-l-4 border-yellow-400 pl-6 italic text-gray-700 bg-white p-6 rounded shadow">
      <p>"MYBANK’s security and support have made banking stress-free and reliable."</p>
      <footer className="font-semibold text-gray-900 mt-3">-  Bansi P.</footer>
    </blockquote>
  </section>
);

export default SecurityTrust;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "Experience Next-Generation Digital Banking",
    desc: "Smart, secure, and seamless financial services designed for your everyday life.",
    button: "Get Started",
  },
  {
    title: "Control Your Finances With Complete Transparency",
    desc: "Instant balance updates, secure payments, and effortless money management.",
    button: "View Accounts",
  },
  {
    title: "Your Money, Protected With Bank-Grade Security",
    desc: "Advanced encryption, fraud protection, and 24×7 monitoring to keep your money safe.",
    button: "Know More",
  },
  {
    title: "Grow Your Wealth With Smarter Investments",
    desc: "Build a stronger financial future with fixed deposits, SIPs, and secure saving options.",
    button: "Start Investing",
  },
  {
    title: "Bank Anywhere, Anytime — Without Compromise",
    desc: "Lightning-fast mobile banking powered by modern cloud infrastructure.",
    button: "Explore Features",
  },
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="
        relative 
        bg-gradient-to-br 
        from-blue-50 
        via-blue-100 
        to-blue-200 
        py-28 
        h-[450px] 
        flex 
        items-center 
        overflow-hidden
      "
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
              {slides[index].title}
            </h1>

            <p className="text-gray-700 mt-4 text-lg max-w-2xl mx-auto">
              {slides[index].desc}
            </p>

            <button
              className="
                mt-8 
                px-8 
                py-3 
                bg-blue-600 
                text-white 
                rounded-lg 
                shadow-md 
                hover:bg-blue-700 
                transition
              "
            >
              {slides[index].button}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-10 w-full flex justify-center gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${i === index ? "bg-blue-700 w-6" : "bg-blue-300 w-2"
              }`}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Hero;

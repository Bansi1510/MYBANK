import React from "react";

import {
  FaUniversity,
  FaMobileAlt,
  FaCreditCard,
  FaMoneyCheckAlt,
  FaPiggyBank,
  FaExchangeAlt,
} from "react-icons/fa";
import ServiceList from "../services_page/ServiceList";
import Navbar from "../shared/Navbar";

const Services: React.FC = () => {
  const services = [
    {
      icon: FaUniversity,
      title: "Account Management",
      description:
        "Effortlessly open, manage, or update your savings and current accounts with trusted security.",
    },
    {
      icon: FaMobileAlt,
      title: "Mobile Banking",
      description:
        "Bank anytime, anywhere with seamless mobile access and real-time financial tracking.",
    },
    {
      icon: FaCreditCard,
      title: "Debit & Credit Cards",
      description:
        "Get secure and globally accepted cards with instant controls, limits, and blocking options.",
    },
    {
      icon: FaMoneyCheckAlt,
      title: "Loans & Finance",
      description:
        "Choose from personal, home, car, and business loans with flexible EMIs and fast approvals.",
    },
    {
      icon: FaPiggyBank,
      title: "Investments",
      description:
        "Grow your wealth through fixed deposits, recurring deposits, and secure investment options.",
    },
    {
      icon: FaExchangeAlt,
      title: "Fund Transfers",
      description:
        "Transfer money safely and instantly using NEFT, RTGS, IMPS, or UPI — anytime.",
    },
  ];

  return (
    <>
      <Navbar />
      <section className="w-full mt-18 bg-gray-50 min-h-screen p-6 md:p-10 space-y-8">

        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Banking Services
          </h2>

          <p className="text-gray-600 max-w-2xl text-sm md:text-base leading-relaxed">
            Explore our secure, modern, and easy-to-use financial services designed
            to support your banking needs with complete trust and convenience.
          </p>
        </div>

        <ServiceList services={services} />
      </section>
    </>
  );
};

export default Services;
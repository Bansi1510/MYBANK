import React from "react";
import BankHistory from "../contact/BankHistory";
import BankAchievements from "../contact/BankAchievements";
import MainOffice from "../contact/MainOffice";
import ContactInfo from "../contact/ContactInfo";
import Navbar from "../shared/Navbar";

const Contant: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="w-full mt-18 min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
          <header className="mb-12 text-center">
            <p className="text-sm font-semibold tracking-wide text-sky-700 uppercase">
              MyBank
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Information Center
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-gray-600 text-base sm:text-lg">
              Find everything you need to know about MyBank’s history, achievements, headquarters, and contact information.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.3fr] gap-10">
            <section className="space-y-8">
              <BankHistory />
              <BankAchievements />
            </section>
            <aside className="space-y-8">
              <MainOffice />
              <ContactInfo />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contant;

import React from "react";
import Navbar from "../shared/Navbar";
import AccountContainer from "../accounts/AccountContainer";
import FeatureGrid from "../accounts/FeatureGrid";
import Hero from "../accounts/Hero";


export const Accounts: React.FC = () => {


  return (
    <>
      <Navbar />
      <div className="w-full mt-18 p-6 space-y-10 bg-gray-50 min-h-screen">
        <Hero />
        <AccountContainer />
        <FeatureGrid />
      </div>
    </>
  );
};

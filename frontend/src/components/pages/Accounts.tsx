import React from "react";

import Navbar from "../shared/Navbar";
import { useFetchAccountDetail } from "../hooks/useFetchAccountDetails";
import AccountContainer from "../accounts/AccountContainer";
import FeatureGrid from "../accounts/FeatureGrid";
import Hero from "../accounts/Hero";


export const Accounts: React.FC = () => {

  const { data, loading, error } = useFetchAccountDetail();
  console.log(data)
  if (loading) return <p>Loading account details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  return (
    <>
      <Navbar />
      <div className="w-full mt-18 p-6 space-y-10 bg-gray-50 min-h-screen">
        <Hero />
        <AccountContainer account={data} />
        <FeatureGrid />
      </div>
    </>
  );
};

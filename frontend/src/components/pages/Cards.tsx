import React from "react";
import MyCards from "../cards/MyCards";
import NewCardRequest from "../cards/NewCardRequest";
import CardStatus from "../cards/CardStatus";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

const Cards: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-6xl mt-18 mx-auto p-4 space-y-6">

        {/* Hero Section */}
        <div className="border rounded-lg bg-white p-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Card Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View your cards, request new cards, and track card request status.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MyCards />
          <CardStatus />
        </div>

        {/* Action Section */}
        <NewCardRequest />

      </div>
      <Footer />
    </>
  );
};

export default Cards;

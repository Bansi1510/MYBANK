import React from "react";
import MyCards from "../cards/MyCards";
import NewCardRequest from "../cards/NewCardRequest";
import CardStatus from "../cards/CardStatus";


const Cards: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Cards
      </h2>

      <MyCards />
      <NewCardRequest />
      <CardStatus />
    </div>
  );
};

export default Cards;

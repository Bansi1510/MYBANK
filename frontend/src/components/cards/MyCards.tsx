import React, { useEffect, useState } from "react";
import { getMyCardAPI, type MyCard } from "../services/card.service";



const MyCards: React.FC = () => {
  const [cards, setCards] = useState<MyCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCards = async () => {
    const data = await getMyCardAPI();
    if (!data) return;
    setCards(data);
    setLoading(false);

  };

  useEffect(() => {
    fetchMyCards();
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Loading cards...
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No cards found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="border rounded-lg bg-white p-5"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-800">
              {card.card_type.toUpperCase()} Card
            </h3>

            <span
              className={`text-xs px-2 py-0.5 rounded
                ${card.card_status === "active"
                  ? "bg-green-50 text-green-600"
                  : "bg-yellow-50 text-yellow-600"
                }`}
            >
              {card.card_status}
            </span>
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <p className="font-medium text-gray-700">
              {card.card_brand} • {card.card_variant}
            </p>

            <p className="tracking-widest">
              **** {card.last4}
            </p>

            {card.request_status && (
              <p className="text-[11px] text-gray-500">
                Request: {card.request_status}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyCards;

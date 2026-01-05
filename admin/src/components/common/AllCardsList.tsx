import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allCards, type Card } from "../services/card.api";

const AllCardsList: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await allCards();
      setCards(data);
    } catch (error) {
      console.error("❌ Failed to fetch cards", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = (
    cardId: string,
    status: "inactive" | "blocked"
  ) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, status } : card
      )
    );
  };

  const viewCard = (cardId: string) => {
    navigate(`${cardId}`);
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-semibold mb-6">
        All Issued Cards
      </h2>

      <div className="overflow-x-auto bg-white border rounded">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Account No</th>
              <th className="p-4 text-left">Card</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Issued At</th>
              <th className="p-4 text-left">Expiry</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {cards.map((card) => (
              <tr
                key={card.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4 capitalize">
                  {card.customer_name}
                </td>

                <td className="p-4 font-mono">
                  {card.account_number}
                </td>

                <td className="p-4">
                  **** **** **** {card.last4}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${card.status === "active"
                        ? "bg-green-100 text-green-700"
                        : card.status === "inactive"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {card.status}
                  </span>
                </td>

                <td className="p-4 text-gray-600">
                  {new Date(card.issued_at).toLocaleDateString()}
                </td>

                <td className="p-4">
                  {card.expiry_month}/{card.expiry_year}
                </td>

                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() => viewCard(card.id)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    See
                  </button>

                  {card.status !== "inactive" && (
                    <button
                      onClick={() =>
                        updateStatus(card.id, "inactive")
                      }
                      className="px-3 py-1.5 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      Inactive
                    </button>
                  )}

                  {card.status !== "blocked" && (
                    <button
                      onClick={() =>
                        updateStatus(card.id, "blocked")
                      }
                      className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && cards.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No cards found
          </div>
        )}

        {loading && (
          <div className="p-6 text-center text-gray-500">
            Loading cards...
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCardsList;

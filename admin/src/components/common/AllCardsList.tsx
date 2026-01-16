import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allCards, changeCardStatus, type Card } from "../services/card.api";

const AllCardsList: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);

  const [accountFilter, setAccountFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "blocked">("all");

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await allCards();
      setCards(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Failed to fetch cards", error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (
    cardId: string,
    status: "active" | "inactive" | "blocked"
  ) => {
    try {
      console.log("Change Card Status API Call:", { cardId, status });
      const res = await changeCardStatus(cardId, status);
      if (res) {
        setCards((prev) =>
          prev.map((card) =>
            card.id === cardId ? { ...card, status } : card
          )
        );
      }
    } catch (error) {
      console.error("❌ Failed to update card status", error);
    }
  };

  const viewCard = (cardId: string) => {
    navigate(`${cardId}`);
  };

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const accountMatch = card.account_number
        ?.toString()
        .includes(accountFilter);

      const statusMatch =
        statusFilter === "all" || card.status === statusFilter;

      return accountMatch && statusMatch;
    });
  }, [cards, accountFilter, statusFilter]);

  return (
    <div className="w-full p-6">
      {/* Header + Filters */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">All Issued Cards</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Account No"
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as typeof statusFilter)
            }
            className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Table */}
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
            {filteredCards.map((card) => (
              <tr key={card.id} className="border-t hover:bg-gray-50">
                <td className="p-4 capitalize">
                  {card.customer_name ?? "N/A"}
                </td>

                <td className="p-4 font-mono">
                  {card.account_number ?? "N/A"}
                </td>

                <td className="p-4">
                  **** **** **** {card.last4 ?? "XXXX"}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${card.status === "active"
                        ? "bg-green-100 text-green-700"
                        : card.status === "inactive"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {card.status}
                  </span>
                </td>

                <td className="p-4 text-gray-600">
                  {card.issued_at
                    ? new Date(card.issued_at).toLocaleDateString()
                    : "N/A"}
                </td>

                <td className="p-4">
                  {card.expiry_month}/{card.expiry_year}
                </td>

                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() => viewCard(card.id)}
                    className="px-3 py-1.5 w-20 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    See
                  </button>

                  <button
                    onClick={() => updateStatus(card.id, "active")}
                    disabled={card.status === "active"}
                    className={`px-3 py-1.5 w-20 text-white rounded bg-green-600 hover:bg-green-700 ${card.status === "active"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                      }`}
                  >
                    Active
                  </button>

                  <button
                    onClick={() => updateStatus(card.id, "inactive")}
                    disabled={card.status === "inactive"}
                    className={`px-3 py-1.5 w-20 text-white rounded bg-yellow-600 hover:bg-yellow-700 ${card.status === "inactive"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                      }`}
                  >
                    Inactive
                  </button>

                  <button
                    onClick={() => updateStatus(card.id, "blocked")}
                    disabled={card.status === "blocked"}
                    className={`px-3 py-1.5 w-20 text-white rounded bg-red-600 hover:bg-red-700 ${card.status === "blocked"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                      }`}
                  >
                    Block
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filteredCards.length === 0 && (
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

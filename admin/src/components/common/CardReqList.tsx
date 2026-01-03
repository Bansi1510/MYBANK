import React, { useEffect, useState } from "react";
import { allCardReqs, updateCardReqStatus, type CardRequest } from "../services/card.api";



const CardReqList: React.FC = () => {
  const [cardRequests, setCardRequests] = useState<CardRequest[]>([]);
  const fetchCard = async () => {
    const cardReq = await allCardReqs();
    setCardRequests(cardReq);
  }
  useEffect(() => {
    fetchCard();
  }, [])

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const res = await updateCardReqStatus(id, status);
    if (res) {
      fetchCard();
    }
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-semibold mb-6">Card Request List</h2>

      <div className="w-full overflow-x-auto border rounded bg-white">
        <table className="w-full border-collapse text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left font-semibold">Account No</th>
              <th className="p-4 text-left font-semibold">Card</th>
              <th className="p-4 text-left font-semibold">Variant</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Requested At</th>
              <th className="p-4 text-center font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {cardRequests.map((req) => (
              <tr
                key={req.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4">{req.account_number}</td>

                <td className="p-4 capitalize">
                  {req.card_type} / {req.card_brand}
                </td>

                <td className="p-4 capitalize">{req.card_variant}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${req.request_status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : req.request_status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {req.request_status}
                  </span>
                </td>

                <td className="p-4 text-gray-600">
                  {new Date(req.requested_at).toLocaleString()}
                </td>

                <td className="p-4 text-center space-x-3">
                  {req.request_status === "pending" ? (
                    <>
                      <button
                        onClick={() => updateStatus(req.id, "approved")}
                        className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, "rejected")}
                        className="px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cardRequests.length === 0 && (
          <p className="text-center text-gray-500 p-6">
            No card requests found
          </p>
        )}
      </div>
    </div>
  );
};

export default CardReqList;

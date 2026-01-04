import React, { useEffect, useState } from "react";
import {
  allCardReqs,
  updateCardReqStatus,
  type CardRequest,
} from "../../services/card.api";

const AdminCardRequestList: React.FC = () => {
  const [cardRequests, setCardRequests] = useState<CardRequest[]>([]);

  const fetchCardRequests = async () => {
    const data = await allCardReqs();
    setCardRequests(data);
  };

  useEffect(() => {
    fetchCardRequests();
  }, []);

  const updateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    const res = await updateCardReqStatus(id, status);
    if (res) fetchCardRequests();
  };

  const canTakeAction = (status: string) =>
    status === "pending" || status === "under_process";

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        Card Requests
      </h2>

      <div className="w-full overflow-x-auto bg-white border rounded">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left font-medium">Account No</th>
              <th className="p-4 text-left font-medium">Card</th>
              <th className="p-4 text-left font-medium">Variant</th>
              <th className="p-4 text-left font-medium">Status</th>
              <th className="p-4 text-left font-medium">Requested At</th>
              <th className="p-4 text-center font-medium">Action</th>
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

                <td className="p-4 capitalize">
                  {req.card_variant}
                </td>

                {/* STATUS BADGE */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${req.request_status === "pending" ||
                        req.request_status === "under_process"
                        ? "bg-yellow-100 text-yellow-700"
                        : req.request_status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {req.request_status}
                  </span>
                </td>

                <td className="p-4 text-gray-600">
                  {new Date(req.requested_at).toLocaleString()}
                </td>

                {/* ACTION COLUMN */}
                <td className="p-4 text-center">
                  {canTakeAction(req.request_status) ? (
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() =>
                          updateStatus(req.id, "approved")
                        }
                        className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(req.id, "rejected")
                        }
                        className="px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`text-sm font-medium
                        ${req.request_status === "approved"
                          ? "text-green-600"
                          : "text-red-600"
                        }
                      `}
                    >
                      {req.request_status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cardRequests.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No card requests found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCardRequestList;

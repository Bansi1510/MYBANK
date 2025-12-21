import React, { useEffect, useState } from "react";
import { newAccHisAPI, type AccountHistory } from "../../services/adminAccount.api";
import { FaSearch } from "react-icons/fa";

const NewAccountRequestHistory: React.FC = () => {
  const [historyData, setHistoryData] = useState<AccountHistory[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setHistoryData(await newAccHisAPI());
    };
    fetchData();
  }, []);

  // Filter history based on last 4 digits of Aadhar
  const filteredData = historyData.filter((item) =>
    item.aadhar_number.slice(-4).startsWith(search.trim())
  );

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white border rounded-xl shadow-sm">

        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Account Request History
            </h2>
            <p className="text-sm text-gray-500">
              Approved and rejected account requests
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search by last 4 digits of Aadhar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 text-left">ID</th>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Mobile</th>
                <th className="px-5 py-3 text-left">Aadhar</th>
                <th className="px-5 py-3 text-left">Type</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Decided By</th>
                <th className="px-5 py-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-3 text-gray-700">{item.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{item.name}</td>
                  <td className="px-5 py-3 text-gray-600">{item.email}</td>
                  <td className="px-5 py-3">{item.mobile_number}</td>
                  <td className="px-5 py-3">**** **** {item.aadhar_number.slice(-4)}</td>
                  <td className="px-5 py-3 capitalize">{item.requested_account_type}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${item.final_status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {item.final_status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">Admin #{item.decided_by}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {new Date(item.decided_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-3 text-center text-gray-500">
                    No accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default NewAccountRequestHistory;

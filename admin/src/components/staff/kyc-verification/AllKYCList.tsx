import React, { useEffect, useMemo, useState } from "react";
import { getAllKYCAPI, type KYCItem, getKYCById, type KYCDetail } from "../../services/kyc.api";

const AllKYCList: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [KYCs, setKYCs] = useState<KYCItem[]>([]);
  const [expandedKYC, setExpandedKYC] = useState<number | null>(null);
  const [kycDetails, setKycDetails] = useState<Record<number, KYCDetail>>({});
  const [loadingId, setLoadingId] = useState<number | null>(null);

  /* Fetch KYC list */
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllKYCAPI();
      if (!data) return;
      setKYCs(data);
    };
    fetchData();
  }, []);

  /* Filter */
  const filteredKYCs = useMemo(() => {
    if (statusFilter === "ALL") return KYCs;
    return KYCs.filter((k) => k.kyc_status === statusFilter);
  }, [statusFilter, KYCs]);

  /* Badge */
  const statusBadge = (status: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    if (status === "PENDING") return `${base} bg-yellow-100 text-yellow-700`;
    if (status === "VERIFIED") return `${base} bg-green-100 text-green-700`;
    return `${base} bg-red-100 text-red-700`;
  };

  /* Handle Details Click */
  const handleToggle = async (kyc_id: number) => {
    if (expandedKYC === kyc_id) {
      setExpandedKYC(null);
      return;
    }

    setExpandedKYC(kyc_id);

    if (kycDetails[kyc_id]) return;

    setLoadingId(kyc_id);
    const detail = await getKYCById(kyc_id);
    setLoadingId(null);

    if (detail) {
      setKycDetails((prev) => ({
        ...prev,
        [kyc_id]: detail,
      }));
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          KYC Management
        </h2>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">Customer</th>
              <th className="p-3 text-left text-sm font-semibold">Account No</th>
              <th className="p-3 text-left text-sm font-semibold">PAN</th>
              <th className="p-3 text-left text-sm font-semibold">Aadhaar</th>
              <th className="p-3 text-left text-sm font-semibold">Status</th>
              <th className="p-3 text-left text-sm font-semibold">Created</th>
              <th className="p-3 text-left text-sm font-semibold">Remarks</th>
              <th className="p-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredKYCs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No KYC records found
                </td>
              </tr>
            ) : (
              filteredKYCs.map((k) => {
                const isOpen = expandedKYC === k.kyc_id;
                const detail = kycDetails[k.kyc_id];

                return (
                  <React.Fragment key={k.kyc_id}>
                    {/* MAIN ROW */}
                    <tr className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{k.name}</td>
                      <td className="p-3">{k.account_number}</td>
                      <td className="p-3">{k.pan_number}</td>
                      <td className="p-3">XXXX-{k.aadhaar_last4}</td>
                      <td className="p-3">
                        <span className={statusBadge(k.kyc_status)}>
                          {k.kyc_status}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(k.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {k.rejection_reason || "-"}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggle(k.kyc_id)}
                          className="text-blue-600 text-sm font-semibold"
                        >
                          {isOpen ? "Hide" : "Details"}
                        </button>
                      </td>
                    </tr>

                    {/* DETAIL ROW */}
                    {isOpen && (
                      <tr className="bg-gray-50">
                        <td colSpan={8} className="p-4">
                          {loadingId === k.kyc_id ? (
                            <p className="text-sm text-gray-500">
                              Loading KYC details...
                            </p>
                          ) : detail ? (
                            <div className="grid grid-cols-2 gap-6 text-sm">
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Customer Info
                                </h4>
                                <p><b>Name:</b> {detail.name}</p>
                                <p><b>Email:</b> {detail.email}</p>
                                <p><b>Mobile:</b> {detail.mobile_number}</p>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">
                                  KYC Info
                                </h4>
                                <p><b>Type:</b> {detail.kyc_type}</p>
                                <p><b>Status:</b> {detail.kyc_status}</p>
                                <p>
                                  <b>Reason:</b>{" "}
                                  {detail.rejection_reason || "-"}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-red-500">
                              Failed to load KYC details
                            </p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllKYCList;

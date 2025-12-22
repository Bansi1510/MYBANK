import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User2, Mail, Phone, MapPin } from "lucide-react";

import type { RootState } from "../redux/store";
import { getProfileAPI } from "../services/user.servive";
import { setUserProfile } from "../redux/slices/authSlice";

const Profile: React.FC = () => {
  const dispatch = useDispatch();

  const userId = useSelector((state: RootState) => state.auth.userId);
  const user = useSelector((state: RootState) => state.auth.profile);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      const profileData = await getProfileAPI();
      dispatch(setUserProfile(profileData));
    };

    fetchProfile();
  }, [userId, dispatch]);

  if (!user)
    return (
      <div className="mt-10 text-center text-gray-500 text-lg">
        No user profile available
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="bg-white shadow rounded-xl p-8 border border-gray-200 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
          <User2 size={40} className="text-white" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 mt-1">User ID: {user.id}</p>
        </div>
      </div>

      {/* User Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

        {/* Basic Info */}
        <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" size={20} />
              <span className="text-gray-700">{user.email}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-green-600" size={20} />
              <span className="text-gray-700">{user.mobile_number}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-red-600" size={20} />
              <span className="text-gray-700">{user.address}</span>
            </div>
          </div>
        </div>

        {/* Other Details */}
        <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Information
          </h2>

          <p className="text-gray-700">
            <span className="font-medium">Created At:</span>{" "}
            {user.created_at
              ? new Date(user.created_at).toLocaleString()
              : "Not available"}
          </p>
        </div>
      </div>

      {/* Accounts */}
      <div className="bg-white shadow rounded-xl p-6 border border-gray-200 mt-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Linked Bank Accounts
        </h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-2 text-gray-700 font-medium">Account No.</th>
              <th className="py-3 px-2 text-gray-700 font-medium">Type</th>
              <th className="py-3 px-2 text-gray-700 font-medium">Balance</th>
              <th className="py-3 px-2 text-gray-700 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {user.accounts?.map((acc) => (
              <tr key={acc.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2">{acc.account_number}</td>
                <td className="py-3 px-2 capitalize">{acc.account_type}</td>
                <td className="py-3 px-2 font-medium text-gray-900">
                  ₹ {acc.balance}
                </td>
                <td className="py-3 px-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${acc.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {acc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Profile;

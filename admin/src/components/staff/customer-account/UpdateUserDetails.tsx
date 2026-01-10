import React, { useState } from "react";
import { getUserDetails, updateUserDetails, type UserDetails } from "../../services/staff.api";
import { useNavigate } from "react-router-dom";

const UpdateUserDetails: React.FC = () => {
  const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [user, setUser] = useState<UserDetails | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleGetDetails = async () => {
    if (!accountNumber || !aadharNumber) {
      alert("Account number and Aadhaar required");
      return;
    }
    const data = await getUserDetails(accountNumber, aadharNumber);
    if (data) setUser(data)
    setEditMode(false);
  };

  const handleSubmitUpdate = async () => {
    if (!user) {
      alert("User data not available");
      return;
    }
    console.log("UPDATED USER DATA:", user);
    const res = await updateUserDetails(user);
    if (res) {
      setEditMode(false);
      navigate(-1);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Update User Details (Staff Panel)
        </h1>
        <p className="text-gray-600">
          Fetch and update user details using account number
        </p>
      </div>

      {/* Search Section */}
      <div className="w-full bg-white p-4 mb-6 border rounded">
        <div className="grid grid-cols-3 gap-6 items-end">
          <div>
            <label className="block mb-1 font-medium">Account Number</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Aadhaar Number</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
            />
          </div>

          <button
            onClick={handleGetDetails}
            className="bg-blue-600 text-white py-2 rounded"
          >
            Get Details
          </button>
        </div>
      </div>

      {/* User Details */}
      {user && (
        <div className="w-full bg-white p-6 border rounded">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">User Information</h2>

            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="bg-yellow-500 text-white px-6 py-2 rounded"
              >
                Update
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Name */}
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                className={`w-full border px-3 py-2 rounded ${!editMode ? "bg-gray-100" : ""
                  }`}
                value={user.name}
                disabled={!editMode}
                onChange={(e) =>
                  setUser({ ...user, name: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                className={`w-full border px-3 py-2 rounded ${!editMode ? "bg-gray-100" : ""
                  }`}
                value={user.email}
                disabled={!editMode}
                onChange={(e) =>
                  setUser({ ...user, email: e.target.value })
                }
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block mb-1 font-medium">Mobile Number</label>
              <input
                className={`w-full border px-3 py-2 rounded ${!editMode ? "bg-gray-100" : ""
                  }`}
                value={user.mobile_number}
                disabled={!editMode}
                onChange={(e) =>
                  setUser({ ...user, mobile_number: e.target.value })
                }
              />
            </div>

            {/* Aadhaar */}
            <div>
              <label className="block mb-1 font-medium">Aadhaar Number</label>
              <input
                className="w-full border px-3 py-2 rounded bg-gray-100"
                value={user.aadhar_number}
                disabled
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block mb-1 font-medium">Account Number</label>
              <input
                className="w-full border px-3 py-2 rounded bg-gray-100"
                value={user.account_number}
                disabled
              />
            </div>

            {/* Account Type (Dropdown) */}
            <div>
              <label className="block mb-1 font-medium">Account Type</label>
              <select
                className={`w-full border px-3 py-2 rounded ${!editMode ? "bg-gray-100" : ""
                  }`}
                value={user.account_type}
                disabled={!editMode}
                onChange={(e) =>
                  setUser({ ...user, account_type: e.target.value })
                }
              >
                <option value="saving">Saving</option>
                <option value="current">Current</option>
                <option value="salary">Salary</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>

            {/* Balance */}
            <div>
              <label className="block mb-1 font-medium">Balance</label>
              <input
                className="w-full border px-3 py-2 rounded bg-gray-100"
                value={user.balance}
                disabled
              />
            </div>
          </div>

          {editMode && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmitUpdate}
                className="bg-green-600 text-white px-8 py-2 rounded"
              >
                Change
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateUserDetails;

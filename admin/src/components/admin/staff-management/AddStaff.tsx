import React, { useState } from "react";
import { addStaffAPI, type AddStaffData } from "../../services/admin.api";
import { useNavigate } from "react-router-dom";


const AddStaff: React.FC = () => {
  const [staff, setStaff] = useState<AddStaffData>({
    name: "",
    email: "",
    role: "staff",
    mobile_number: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "mobile_number" && !/^\d*$/.test(value)) return;

    setStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await addStaffAPI(staff);
    if (res) {
      navigate(-1);
    }

    console.log(staff);
    setLoading(false);

  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white border">

        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h1 className="text-lg font-semibold text-gray-800">
            Add Staff
          </h1>
          <p className="text-sm text-gray-500">
            Create a new staff account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6">

          <div className="grid grid-cols-12 gap-6">

            {/* Name */}
            <div className="col-span-12 md:col-span-6">
              <label className="block text-sm text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={staff.name}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Email */}
            <div className="col-span-12 md:col-span-6">
              <label className="block text-sm text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={staff.email}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Mobile */}
            <div className="col-span-12 md:col-span-6">
              <label className="block text-sm text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobile_number"
                value={staff.mobile_number}
                onChange={handleChange}
                maxLength={10}
                inputMode="numeric"
                required
                className="w-full border px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Password */}
            <div className="col-span-12 md:col-span-6">
              <label className="block text-sm text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={staff.password}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end border-t pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 text-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Add Staff"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddStaff;

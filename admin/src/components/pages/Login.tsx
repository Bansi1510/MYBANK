import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/Slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Login_API } from "../services/auth.api";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    role: "admin",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(data);

    const user = await Login_API(data);

    if (user?.role == 'admin') {
      navigate("/admin")
      dispatch(setUserData(user));
    } else if (user?.role == 'staff') {
      navigate("/staff");
      dispatch(setUserData(user));
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white border rounded-lg shadow-sm p-6">

          <h2 className="text-xl font-semibold text-center mb-5 text-gray-800">
            Login
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm text-gray-700">Role</label>
              <select
                name="role"
                value={data.role}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Login
            </button>

          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

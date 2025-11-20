import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
  
import { Link } from 'react-router-dom';
import type { RootState } from '../redux/store';
import { logout } from '../services/user.service';
import { Authactions } from '../redux/slices/authSlice';
import UserPopup from '../Nabvar/UserPopup';
const Navbar: React.FC = () => {
  const dispatch=useDispatch();
  const onLogoutHandler=async()=>{
    try {
      await logout();
      dispatch(Authactions.clearUser());
    } catch (error) {
      console.log("Log out error",error)
    }
  }
   const user = useSelector((state: RootState) => state.auth.user);
  
   return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          {/* Bank Logo as SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-blue-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-label="MYBANK Logo"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l9-7 9 7M4 10v10a1 1 0 001 1h3m10-11v11a1 1 0 001 1h3m-9-1v-6h4v6" />
          </svg>
          <span className="text-2xl font-semibold text-gray-900 select-none">MYBANK</span>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-10 font-medium text-gray-700">
          <li className="hover:text-blue-700 cursor-pointer transition-colors">Home</li>
          <li className="hover:text-blue-700 cursor-pointer transition-colors">Accounts</li>
          <li className="hover:text-blue-700 cursor-pointer transition-colors">Loans</li>
          <li className="hover:text-blue-700 cursor-pointer transition-colors">Investments</li>
          <li className="hover:text-blue-700 cursor-pointer transition-colors">Support</li>
        </ul>

        {/* Authentication Buttons */}
        <div className="flex items-center space-x-4">
          {!user?
          <Link to={"/login"}>
          <button
            type="button"
            className="px-5 py-2 border border-blue-600 text-blue-700 rounded-md font-semibold hover:bg-blue-50 transition"
          >
            Login
          </button>
          </Link>
          :
          <>
          <UserPopup/>
          <button
            type="button"
            className="px-5 py-2 bg-blue-700 text-white rounded-md font-semibold hover:bg-blue-800 transition"
            onClick={onLogoutHandler}
          >
            Logout
          </button>
          
          </>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../redux/store";
import { LogoutAPI } from "../services/auth.service";
import { clearAuth } from "../redux/slices/authSlice";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const loggedIn = useSelector((store: RootState) => store.auth.isAuthenticated);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const res = await LogoutAPI();
    if (res) {
      dispatch(clearAuth());

    }
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/30 backdrop-blur-xl shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-widest 
          bg-linear-to-r from-blue-700 to-indigo-700 
          bg-clip-text text-transparent drop-shadow-sm"
        >
          MYBANK
        </Link>

        {/* MENU — Desktop */}
        <div className="hidden md:flex items-center space-x-10 font-medium">
          <Link className="hover:text-blue-700 transition-all" to="/services">Services</Link>
          <Link className="hover:text-blue-700 transition-all" to="/accounts">Accounts</Link>
          <Link className="hover:text-blue-700 transition-all" to="/loans">Loans</Link>
          <Link className="hover:text-blue-700 transition-all" to="/cards">Cards</Link>
          <Link className="hover:text-blue-700 transition-all" to="/contact">Contact</Link>
        </div>

        {/* RIGHT SIDE BUTTON */}
        <div className="hidden md:flex items-center space-x-6">
          {!loggedIn ? (
            <Link to="/login">
              <button className="px-5 py-2 rounded-xl font-semibold 
                text-blue-600 border border-blue-600 
                hover:bg-blue-600 hover:text-white 
                transition-all shadow-sm">
                Login
              </button>
            </Link>
          ) : (<>
            <Link to={"/profile"}>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A8 8 0 0112 15a8 8 0 016.879 2.804M12 12a4 4 0 100-8 4 4 0 000 8z"
                  />
                </svg>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl 
             bg-linear-to-r from-red-500 to-red-600 
              text-white font-semibold 
              shadow-sm hover:shadow-md transition-all"
            >
              Logout
            </button>
          </>
          )}
        </div>

        {/* HAMBURGER BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col space-y-1"
        >
          <span className="w-7 h-1 bg-gray-800 rounded"></span>
          <span className="w-7 h-1 bg-gray-800 rounded"></span>
          <span className="w-7 h-1 bg-gray-800 rounded"></span>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl shadow-lg px-6 pb-6 space-y-4 border-t border-gray-200/40">

          <Link className="block text-lg font-medium hover:text-blue-600" to="#">Services</Link>
          <Link className="block text-lg font-medium hover:text-blue-600" to="#">Accounts</Link>
          <Link className="block text-lg font-medium hover:text-blue-600" to="#">Loans</Link>
          <Link className="block text-lg font-medium hover:text-blue-600" to="#">Contact</Link>

          {!loggedIn ? (
            <Link to="/login">
              <button
                onClick={() => setOpen(false)}
                className="w-full text-left text-blue-700 font-semibold text-lg hover:text-blue-900"
              >
                Login
              </button>
            </Link>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="w-full text-left text-red-600 font-semibold text-lg hover:text-red-800"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

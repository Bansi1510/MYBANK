import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const UserPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const togglePopup = () => setOpen((prev) => !prev);

   
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={popupRef}>
      {/* Profile Icon */}
      <button
        onClick={togglePopup}
        className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-800 transition"
      >
        <span className="text-white font-semibold text-lg">
          {user.full_name ? user.full_name[0].toUpperCase() : "U"}
        </span>
      </button>

      {/* Popup */}
      {open && (
        <div
          className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 transform transition-all duration-200"
        >
          {/* Small Arrow */}
          <div className="absolute -top-2 right-4 w-3 h-3 bg-white rotate-45 border-t border-l border-gray-100"></div>

          {/* Header */}
          <div className="flex items-center gap-4 p-5 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-lg font-bold">
              {user.full_name ? user.full_name[0].toUpperCase() : "U"}
            </div>
            <div className="flex flex-col">
              <h4 className="text-gray-900 font-semibold text-lg capitalize">
                {user.full_name}
              </h4>
              <p className="text-gray-500 text-sm truncate">{user.email}</p>
              <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-medium w-fit mt-1">
                {user.user_type.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 text-sm text-gray-700 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">📞 Phone:</span>
              <span className="font-medium">{user.phone}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">🪪 KYC:</span>
              {user.kyc_verified ? (
                <span className="text-green-600 font-medium">Verified</span>
              ) : (
                <span className="text-red-600 font-medium">Not Verified</span>
              )}
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">📅 Joined:</span>
              <span className="font-medium">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 rounded-b-2xl text-center py-2">
            <p className="text-xs text-gray-400">
              MYBANK • Secure Banking Experience
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPopup;

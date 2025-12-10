import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

type Props = {
  username: string;
  role: string;
  onLogout: () => void;
};

const PopupMenu: React.FC<Props> = ({ username, role, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <FaUserCircle
        size={34}
        className="cursor-pointer text-gray-700"
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow border rounded-md">
          <div className="p-3 border-b">
            <p className="font-semibold">{username}</p>
            <p className="text-sm text-gray-500">{role}</p>
          </div>

          <button className="w-full p-2 text-left hover:bg-gray-100">
            Profile
          </button>

          <button
            className="w-full p-2 text-left hover:bg-gray-100"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default PopupMenu;

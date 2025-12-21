import React from "react";
import { Outlet, Link, useMatch } from "react-router-dom";

const StaffManagement: React.FC = () => {
  const match = useMatch("/admin/staff/*");
  const isChildActive = !!match?.pathname.split("/")[3];

  const actions = [
    {
      title: "View Profiles",
      desc: "Check staff profiles and details",
      link: "profiles",
    },
    {
      title: "Add Staff",
      desc: "Add new staff members",
      link: "add",
    },
    {
      title: "Edit Staff",
      desc: "Update staff information",
      link: "edit",
    },
    {
      title: "Assign Roles",
      desc: "Manage roles and permissions",
      link: "roles",
    },
    {
      title: "Attendance",
      desc: "Monitor staff attendance",
      link: "attendance",
    },
    {
      title: "Leave Requests",
      desc: "Approve or reject leave requests",
      link: "leave-requests",
    },
    {
      title: "Performance Reports",
      desc: "View staff performance",
      link: "performance",
    },
    {
      title: "Settings",
      desc: "Staff management settings",
      link: "settings",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Parent Grid (Only show when no child route is active) */}
      {!isChildActive && (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Staff Management</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className="block bg-green-600 text-white p-6 rounded-xl shadow hover:bg-green-700 transition text-center"
              >
                <div className="text-lg font-semibold">{item.title}</div>
                <div className="text-sm opacity-80 mt-1">{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Child Routes Render Here */}
      <div className={isChildActive ? "min-h-screen bg-gray-50 p-6" : "mt-6"}>
        <Outlet />
      </div>
    </div>
  );
};

export default StaffManagement;

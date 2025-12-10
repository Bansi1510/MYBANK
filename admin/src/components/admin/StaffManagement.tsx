import React from "react";

const StaffManagement: React.FC = () => {
  const actions = [
    { title: "View Profiles", description: "Check staff profiles and details" },
    { title: "Assign Roles", description: "Manage roles and permissions" },
    { title: "Attendance", description: "Monitor staff attendance" },
    { title: "Performance Reports", description: "View staff performance" },
    { title: "Add Staff", description: "Add new staff members" },
    { title: "Edit Staff", description: "Update staff information" },
    { title: "Leave Requests", description: "Approve or reject leave requests" },
    { title: "Settings", description: "Staff management settings" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Staff Management</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="bg-green-600 text-white p-4 rounded-lg shadow hover:bg-green-700 transition-colors flex flex-col justify-between"
          >
            <span className="font-semibold">{action.title}</span>
            <span className="text-sm text-green-100">{action.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StaffManagement;

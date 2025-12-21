import React, { useEffect, useState } from "react";
import {
  deleteStaff,
  getStaffData,
  updateStaff,
  type StaffData,
} from "../../services/admin.api";

const StaffTable: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffData[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null);
  const isValidStaff = (staff: StaffData): string | null => {
    if (!staff.name.trim()) return "Name is required";
    if (!staff.email.trim()) return "Email is required";
    if (!staff.mobile_number.trim()) return "Mobile number is required";

    if (!/^\d{10}$/.test(staff.mobile_number)) {
      return "Mobile number must be exactly 10 digits";
    }

    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getStaffData();
      setStaffList(response);
    };
    fetchData();
  }, []);

  const handleEdit = (staff: StaffData) => {
    setSelectedStaff(staff);
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedStaff) return;
    const error = isValidStaff(selectedStaff);
    if (error) {
      alert(error);
      return;
    }
    console.log("Updated Staff Data:", selectedStaff);

    const res = await updateStaff(selectedStaff);

    if (res) {
      setStaffList((prev) =>
        prev.map((staff) =>
          staff.id === selectedStaff.id ? selectedStaff : staff
        )
      );

      setIsEditOpen(false);
      setSelectedStaff(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this staff member?"))
      return;

    if (
      !window.confirm(
        "This action is irreversible. Do you want to continue?"
      )
    )
      return;

    const res = await deleteStaff(id);
    if (res) {
      setStaffList((prev) => prev.filter((staff) => staff.id !== id));
    }
  };

  return (
    <>
      <section className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
        <header className="px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Staff Management
          </h2>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Mobile</th>
                <th className="px-5 py-3">Created At</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {staffList.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-gray-500"
                  >
                    No staff records available
                  </td>
                </tr>
              ) : (
                staffList.map((staff) => (
                  <tr
                    key={staff.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-3">{staff.id}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {staff.name}
                    </td>
                    <td className="px-5 py-3">{staff.email}</td>
                    <td className="px-5 py-3">{staff.mobile_number}</td>
                    <td className="px-5 py-3">
                      {new Date(
                        staff.created_at
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(staff)}
                          className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(staff.id)}
                          className="px-4 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isEditOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
            <div className="px-5 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                Edit Staff
              </h3>
            </div>

            <div className="p-5 space-y-4">
              <input
                type="text"
                value={selectedStaff.name}
                onChange={(e) =>
                  setSelectedStaff({
                    ...selectedStaff,
                    name: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Name"
              />

              <input
                type="email"
                value={selectedStaff.email}
                onChange={(e) =>
                  setSelectedStaff({
                    ...selectedStaff,
                    email: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Email"
              />

              <input
                type="text"
                value={selectedStaff.mobile_number}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setSelectedStaff({
                    ...selectedStaff,
                    mobile_number: value,
                  });
                }}
                inputMode="numeric"
                maxLength={10}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Mobile Number (10 digits)"
              />

            </div>

            <div className="px-5 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 text-sm rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm rounded text-white bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffTable;

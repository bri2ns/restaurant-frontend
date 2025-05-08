import React, { useEffect, useState } from "react";
import api from "../api";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: "",
    position: "",
    shift_times: "",
    hours_worked: 0,
  });
  const [editing, setEditing] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    position: "",
    shift_times: "",
    hours_worked: 0,
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await api.get("/staff");
      setStaff(res.data);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/staff", newStaff);
      setNewStaff({ name: "", position: "", shift_times: "", hours_worked: 0 });
      fetchStaff();
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/staff/${id}`);
      setStaff(staff.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const startEditing = (staffMember) => {
    setEditing(staffMember.id);
    setEditValues({
      name: staffMember.name,
      position: staffMember.position,
      shift_times: staffMember.shift_times,
      hours_worked: staffMember.hours_worked,
    });
  };

  const handleEditSave = async (id) => {
    try {
      await api.put(`/staff/${id}`, editValues);
      setEditing(null);
      fetchStaff();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Staff</h1>

      {/* Add Staff Form */}
      <form onSubmit={handleAdd} className="mb-8 space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newStaff.name}
            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Position"
            value={newStaff.position}
            onChange={(e) =>
              setNewStaff({ ...newStaff, position: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Shift Times"
            value={newStaff.shift_times}
            onChange={(e) =>
              setNewStaff({ ...newStaff, shift_times: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Hours Worked"
            value={newStaff.hours_worked}
            onChange={(e) =>
              setNewStaff({ ...newStaff, hours_worked: parseInt(e.target.value) })
            }
            className="border p-2 rounded"
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Staff
        </button>
      </form>

      {/* Staff Table */}
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Position</th>
            <th className="p-2">Shift</th>
            <th className="p-2">Hours Worked</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.id}</td>
              <td className="p-2">
                {editing === s.id ? (
                  <input
                    value={editValues.name}
                    onChange={(e) =>
                      setEditValues({ ...editValues, name: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  s.name
                )}
              </td>
              <td className="p-2">
                {editing === s.id ? (
                  <input
                    value={editValues.position}
                    onChange={(e) =>
                      setEditValues({ ...editValues, position: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  s.position
                )}
              </td>
              <td className="p-2">
                {editing === s.id ? (
                  <input
                    value={editValues.shift_times}
                    onChange={(e) =>
                      setEditValues({ ...editValues, shift_times: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  s.shift_times
                )}
              </td>
              <td className="p-2">
                {editing === s.id ? (
                  <input
                    type="number"
                    value={editValues.hours_worked}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        hours_worked: parseInt(e.target.value),
                      })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  s.hours_worked
                )}
              </td>
              <td className="p-2 space-x-2">
                {editing === s.id ? (
                  <>
                    <button
                      onClick={() => handleEditSave(s.id)}
                      className="text-green-600 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(s)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

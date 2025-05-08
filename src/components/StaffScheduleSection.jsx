import React, { useEffect, useState } from "react";
import api from "../api";

export default function StaffScheduleSection() {
  const [schedules, setSchedules] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [newEntry, setNewEntry] = useState({
    user_id: "",
    shift_start: "",
    shift_end: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    user_id: "",
    shift_start: "",
    shift_end: "",
  });

  useEffect(() => {
    fetchSchedules();
    fetchStaffMembers();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await api.get("/staff");
      setSchedules(res.data);
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
    }
  };

  const fetchStaffMembers = async () => {
    try {
      const res = await api.get("/staff/members"); // ✅ Fixed
      setStaffMembers(res.data);
    } catch (err) {
      console.error("Failed to fetch staff members:", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const selectedUser = staffMembers.find(
        (member) => member.id.toString() === newEntry.user_id.toString()
      );
  
      if (!selectedUser) throw new Error("User not found in staff list");
  
      await api.post("/staff", {
        ...newEntry,
        position: selectedUser.role, // Inject the required position
        shift_start: new Date(newEntry.shift_start).toISOString(),
        shift_end: new Date(newEntry.shift_end).toISOString(),
      });
  
      setNewEntry({ user_id: "", shift_start: "", shift_end: "" });
      fetchSchedules();
    } catch (err) {
      console.error("Failed to add schedule:", err);
    }
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;
    try {
      await api.delete(`/staff/${id}`);
      fetchSchedules();
    } catch (err) {
      console.error("Failed to delete schedule:", err);
    }
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditValues({
      user_id: entry.user.id,
      shift_start: entry.shift_start,
      shift_end: entry.shift_end,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ user_id: "", shift_start: "", shift_end: "" });
  };

  const handleSaveEdit = async (id) => {
    try {
      await api.patch(`/staff/${id}`, editValues);
      setEditingId(null);
      fetchSchedules();
    } catch (err) {
      console.error("Failed to update schedule:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Staff Schedule</h2>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="space-y-2 mb-4">
        <div className="flex gap-2">
          <select
            value={newEntry.user_id}
            onChange={(e) =>
              setNewEntry({ ...newEntry, user_id: e.target.value })
            }
            className="border p-2 rounded w-1/3"
            required
          >
            <option value="">Select Staff Member</option>
            {staffMembers.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.username} ({staff.role})
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={newEntry.shift_start}
            onChange={(e) =>
              setNewEntry({ ...newEntry, shift_start: e.target.value })
            }
            className="border p-2 rounded w-1/3"
            required
          />
          <input
            type="datetime-local"
            value={newEntry.shift_end}
            onChange={(e) =>
              setNewEntry({ ...newEntry, shift_end: e.target.value })
            }
            className="border p-2 rounded w-1/3"
            required
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Schedule
        </button>
      </form>

      {/* Table */}
      <table className="w-full text-left border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Shift Start</th>
            <th className="p-2">Shift End</th>
            <th className="p-2">Hours</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">
                {editingId === s.id ? (
                  <select
                    value={editValues.user_id}
                    onChange={(e) =>
                      setEditValues({ ...editValues, user_id: e.target.value })
                    }
                    className="border p-1 rounded w-full"
                  >
                    {staffMembers.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.username} ({staff.role})
                      </option>
                    ))}
                  </select>
                ) : (
                  `${s.user?.username || "Unknown"} (${s.position})`
                )}
              </td>
              <td className="p-2">
                {editingId === s.id ? (
                  <input
                    type="datetime-local"
                    value={editValues.shift_start}
                    onChange={(e) =>
                      setEditValues({ ...editValues, shift_start: e.target.value })
                    }
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  new Date(s.shift_start).toLocaleString()
                )}
              </td>
              <td className="p-2">
                {editingId === s.id ? (
                  <input
                    type="datetime-local"
                    value={editValues.shift_end}
                    onChange={(e) =>
                      setEditValues({ ...editValues, shift_end: e.target.value })
                    }
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  new Date(s.shift_end).toLocaleString()
                )}
              </td>
              <td className="p-2">{s.hours_worked}</td>
              <td className="p-2 space-x-2">
                {editingId === s.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(s.id)}
                      className="text-green-600 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-gray-600 hover:underline"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(s)}
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

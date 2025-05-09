import React, { useEffect, useState } from "react";
import api from "../../api";

export default function StaffManagement() {
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
      const res = await api.get("/staff/members");
      setStaffMembers(res.data);
    } catch (err) {
      console.error("Failed to fetch staff members:", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const selectedUser = staffMembers.find(
      (m) => m.id.toString() === newEntry.user_id.toString()
    );
    if (!selectedUser) return alert("Invalid user.");

    const start = new Date(newEntry.shift_start);
    const end = new Date(newEntry.shift_end);
    const hoursWorked = Math.round((end - start) / 3600000);

    try {
      await api.post("/staff", {
        user_id: parseInt(newEntry.user_id),
        position: selectedUser.role.toLowerCase(),
        shift_start: start.toISOString(),
        shift_end: end.toISOString(),
        hours_worked: hoursWorked,
        time_off_requested: false,
        status: "pending",
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
      user_id: entry.user?.id,
      shift_start: entry.shift_start,
      shift_end: entry.shift_end,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ user_id: "", shift_start: "", shift_end: "" });
  };

  const handleSaveEdit = async (id) => {
    const selectedUser = staffMembers.find(
      (m) => m.id.toString() === editValues.user_id.toString()
    );
    if (!selectedUser) return alert("Invalid user.");

    try {
      await api.patch(`/staff/${id}`, {
        ...editValues,
        position: selectedUser.role.toLowerCase(),
      });
      setEditingId(null);
      fetchSchedules();
    } catch (err) {
      console.error("Failed to update schedule:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Staff Schedule</h1>

      <form onSubmit={handleAdd} className="mb-6 grid grid-cols-4 gap-4">
        <select
          value={newEntry.user_id}
          onChange={(e) => setNewEntry({ ...newEntry, user_id: e.target.value })}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Staff</option>
          {staffMembers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.username} ({s.role})
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={newEntry.shift_start}
          onChange={(e) => setNewEntry({ ...newEntry, shift_start: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="datetime-local"
          value={newEntry.shift_end}
          onChange={(e) => setNewEntry({ ...newEntry, shift_end: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Shift
        </button>
      </form>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Position</th>
            <th className="p-2">Start</th>
            <th className="p-2">End</th>
            <th className="p-2">Hours</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.user?.username}</td>
              <td className="p-2">{s.position}</td>
              <td className="p-2">
                {editingId === s.id ? (
                  <input
                    type="datetime-local"
                    value={editValues.shift_start}
                    onChange={(e) =>
                      setEditValues({ ...editValues, shift_start: e.target.value })
                    }
                    className="border p-1 rounded"
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
                    className="border p-1 rounded"
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

import React, { useEffect, useState } from "react";
import api from "../api";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [displayedStaff, setDisplayedStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: "",
    position: "",
    shift_start: "",
    shift_end: "",
  });
  const [editing, setEditing] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    position: "",
    shift_start: "",
    shift_end: "",
  });
  const [filters, setFilters] = useState({ waitstaff: true, kitchen: true });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [staff, filters, currentPage]);

  const fetchStaff = async () => {
    try {
      const res = await api.get("/staff");
      const sorted = [...res.data].sort(
        (a, b) => new Date(b.shift_start) - new Date(a.shift_start)
      );
      setStaff(sorted);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    }
  };

  const applyFilters = () => {
    const filtered = staff.filter((s) => filters[s.position]);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setDisplayedStaff(filtered.slice(start, end));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const start = new Date(newStaff.shift_start);
    const end = new Date(newStaff.shift_end);
    const hours = Math.round((end - start) / 3600000);

    try {
      await api.post("/staff", {
        ...newStaff,
        hours_worked: hours,
      });
      setNewStaff({ name: "", position: "", shift_start: "", shift_end: "" });
      fetchStaff();
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/staff/${id}`);
      fetchStaff();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const startEditing = (s) => {
    setEditing(s.id);
    setEditValues({
      name: s.name,
      position: s.position,
      shift_start: s.shift_start,
      shift_end: s.shift_end,
    });
  };

  const handleEditSave = async (id) => {
    const start = new Date(editValues.shift_start);
    const end = new Date(editValues.shift_end);
    const hours = Math.round((end - start) / 3600000);

    try {
      await api.patch(`/staff/${id}`, {
        ...editValues,
        hours_worked: hours,
      });
      setEditing(null);
      fetchStaff();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleFilterChange = (role) => {
    setFilters({ ...filters, [role]: !filters[role] });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Staff</h1>

      <div className="mb-4">
        <label className="mr-4">
          <input
            type="checkbox"
            checked={filters.waitstaff}
            onChange={() => handleFilterChange("waitstaff")}
            className="mr-1"
          />
          Waitstaff
        </label>
        <label>
          <input
            type="checkbox"
            checked={filters.kitchen}
            onChange={() => handleFilterChange("kitchen")}
            className="mr-1"
          />
          Kitchen
        </label>
      </div>

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
            onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="datetime-local"
            value={newStaff.shift_start}
            onChange={(e) => setNewStaff({ ...newStaff, shift_start: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="datetime-local"
            value={newStaff.shift_end}
            onChange={(e) => setNewStaff({ ...newStaff, shift_end: e.target.value })}
            className="border p-2 rounded"
            required
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
            <th className="p-2">Shift Start</th>
            <th className="p-2">Shift End</th>
            <th className="p-2">Hours</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedStaff.map((s) => (
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
                {editing === s.id ? (
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

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        {[...Array(Math.ceil(staff.filter((s) => filters[s.position]).length / itemsPerPage)).keys()].map(
          (num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === num + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border-blue-600"
              }`}
            >
              {num + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}

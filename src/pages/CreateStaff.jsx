import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function CreateStaff() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    role: "waitstaff",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const decoded = jwtDecode(token);
    if (decoded?.role !== "manager") {
      return navigate("/unauthorized");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/users/create",
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Staff account created successfully.");
      setForm({ email: "", username: "", password: "", role: "waitstaff" });
    } catch (err) {
      console.error(err);
      setError("Failed to create account.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Create New Staff Account</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border p-2 rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Username</label>
          <input
            type="text"
            name="username"
            className="w-full border p-2 rounded"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            className="w-full border p-2 rounded"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Role</label>
          <select
            name="role"
            className="w-full border p-2 rounded"
            value={form.role}
            onChange={handleChange}
          >
            <option value="waitstaff">Waitstaff</option>
            <option value="kitchen">Kitchen</option>
            <option value="manager">Manager</option>
            <option value="inventory">Inventory</option>
          </select>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

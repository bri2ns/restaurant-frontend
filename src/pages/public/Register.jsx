import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/register", {
        ...form,
        role: "customer", // 🔒 Customer-only role
      });
      setSuccess("🎉 Account created successfully! You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Registration failed:", err);
      setError("❌ Failed to register. Try a different username or email.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-white text-black max-w-md w-full p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create a Customer Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        {success && <p className="text-green-600 mt-4 text-center">{success}</p>}

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline"
            >
              Login here
            </button>
          </p>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-gray-300"
          >
            ⬅ Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

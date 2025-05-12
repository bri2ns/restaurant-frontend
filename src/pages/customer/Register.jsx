import React, { useState } from "react";
import { registerCustomer } from "../../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await registerCustomer({
        username,
        email,
        password,
        role: "customer",
      });

      setSuccess("🎉 Registration successful! You can now log in.");
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Registration failed. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4">Create a Customer Account</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>

      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      {success && <p className="mt-4 text-green-600 text-sm">{success}</p>}
    </div>
  );
}

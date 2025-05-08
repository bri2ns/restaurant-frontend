import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    console.log("🔐 Attempting login with:");
    console.log("Username:", username);
    console.log("Password:", password);

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      console.log("Sending request to /auth/login...");
      console.log("Payload being sent:", formData.toString());
      const response = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("✅ Login successful:", response.data);

      const token = response.data.access_token || response.data;
      localStorage.setItem("token", token);
      console.log("📦 Token saved to localStorage:", token);

      const decoded = jwtDecode(token);
      console.log("🧬 Decoded token:", decoded);

      // Redirect based on role
      switch (decoded.role) {
        case "manager":
          navigate("/manager");
          break;
        // Add other roles here if needed
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("[FAIL] Login failed:", err.response?.data || err.message);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Manager Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            console.log("Username changed:", e.target.value);
          }}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            console.log("🔑 Password changed (hidden): [HIDDEN]");
          }}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
}

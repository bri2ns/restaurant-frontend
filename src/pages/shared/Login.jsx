import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const token = response.data.access_token || response.data;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);

      switch (decoded.role) {
        case "manager":
          navigate("/manager");
          break;
        case "waitstaff":
          navigate("/waitstaff");
          break;
        case "kitchen":
          navigate("/kitchen");
          break;
        case "inventory":
          navigate("/inventory");
          break;
        case "customer":
          navigate("/customer/dashboard");
          break;
        default:
          navigate("/unauthorized");
      }
    } catch (err) {
      console.error("[FAIL] Login error:", err.response?.data || err.message);
      setError("❌ Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="bg-white text-black max-w-md w-full p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-sm text-center mt-4">{error}</p>
        )}

        <div className="mt-6 text-center space-y-2">
          <p>
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:underline"
            >
              Register
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

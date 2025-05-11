import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let userRole = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role;
    } catch {
      userRole = null;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full bg-gray-800 text-white p-4 flex justify-between items-center shadow">
      <div
        className="text-lg font-semibold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Restaurant
      </div>

      <div className="space-x-4">
        {userRole ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-green-600 px-4 py-1 rounded hover:bg-green-700"
            >
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full bg-gray-800 text-white p-4 flex justify-end shadow">
      <button
        onClick={handleLogout}
        className="bg-red-600 px-4 py-1 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}

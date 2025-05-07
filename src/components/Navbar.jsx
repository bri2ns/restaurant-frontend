import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex space-x-4 items-center">
      <Link to="/" className="hover:underline">Reservations</Link>
      <Link to="/orders" className="hover:underline">Orders</Link>
      <Link to="/inventory" className="hover:underline">Inventory</Link>
      <Link to="/staff" className="hover:underline">Staff</Link>
      <button
        onClick={handleLogout}
        className="ml-auto bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
      >
        Logout
      </button>
    </nav>
  );
}

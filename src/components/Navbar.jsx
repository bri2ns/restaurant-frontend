import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex space-x-4">
      <Link to="/" className="hover:underline">Reservations</Link>
      <Link to="/orders" className="hover:underline">Orders</Link>
      <Link to="/inventory" className="hover:underline">Inventory</Link>
      <Link to="/staff" className="hover:underline">Staff</Link>
    </nav>
  );
}

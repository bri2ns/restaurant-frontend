import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Overview", path: "/manager" },
    { label: "Manage Staff", path: "/staff-management" },
    { label: "View Menu Items", path: "/menu" },
    { label: "Manage Inventory", path: "/inventory" },
    { label: "Reservations", path: "/reservations" },
  ];

  return (
    <aside className="w-64 bg-white border-r p-4 flex flex-col">
      <div className="text-center text-lg font-bold border p-2 mb-6">LOGO</div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full text-left p-2 rounded font-medium ${
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 text-gray-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

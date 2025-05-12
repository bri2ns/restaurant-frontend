import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  let role = "";

  try {
    if (token) {
      const decoded = jwtDecode(token);
      role = decoded.role;
    }
  } catch (e) {
    console.error("Failed to decode token:", e);
  }

  const managerItems = [
    { label: "Overview", path: "/manager" },
    { label: "Manage Staff", path: "/staff-management" },
    { label: "Create Staff", path: "/create-staff" },
    { label: "View Menu Items", path: "/manager/menu" },
    { label: "Manage Inventory", path: "/manager/inventory" },
    { label: "Inventory Report", path: "/manager/inventory-report" },
    { label: "Reservations", path: "/manager/reservations" },
  ];

  const waitstaffItems = [
    { label: "Create Order", path: "/waitstaff/orders" },
    { label: "My Orders", path: "/waitstaff/my-orders" },
    { label: "Schedule", path: "/waitstaff/schedule" },
    { label: "Reservations", path: "/waitstaff/reservations" },
  ];

  const kitchenItems = [
    { label: "Active Orders", path: "/kitchen" },
    { label: "History", path: "/kitchen/history" },
  ];

  const inventoryItems = [
    { label: "Inventory Dashboard", path: "/inventory" },
  ];

  const customerItems = [
    { label: "Dashboard", path: "/customer/dashboard" },
    { label: "Make Reservation", path: "/customer/reserve" },
    { label: "My Reservations", path: "/customer/my-reservations" },
  ];

  const navItems =
    role === "manager"
      ? managerItems
      : role === "waitstaff"
      ? waitstaffItems
      : role === "kitchen"
      ? kitchenItems
      : role === "inventory"
      ? inventoryItems
      : role === "customer"
      ? customerItems
      : [];

  return (
    <aside className="w-64 bg-white border-r p-4 flex flex-col">
      <div className="text-center text-lg font-bold border p-2 mb-6">Restaurant</div>
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

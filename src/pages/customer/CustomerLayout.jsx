import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between">
        <div className="text-xl font-bold text-blue-600">Restaurant</div>
        <div className="space-x-4">
          <NavLink
            to="/customer/reserve"
            className={({ isActive }) =>
              isActive ? "text-blue-700 font-semibold" : "text-gray-600 hover:text-blue-500"
            }
          >
            Make Reservation
          </NavLink>
          <NavLink
            to="/customer/my-reservations"
            className={({ isActive }) =>
              isActive ? "text-blue-700 font-semibold" : "text-gray-600 hover:text-blue-500"
            }
          >
            My Reservations
          </NavLink>
        </div>
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

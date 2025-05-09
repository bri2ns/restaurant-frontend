import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function WaitstaffLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r p-4">
        <h1 className="text-xl font-bold mb-6">Waitstaff Panel</h1>
        <nav className="space-y-2">
          <button onClick={() => navigate("/waitstaff/orders")} className="block w-full text-left p-2 hover:bg-gray-200 rounded">
            Create Order
          </button>
          <button onClick={() => navigate("/waitstaff/my-orders")} className="block w-full text-left p-2 hover:bg-gray-200 rounded">
            My Orders
          </button>
          <button onClick={() => navigate("/waitstaff/schedule")} className="block w-full text-left p-2 hover:bg-gray-200 rounded">
            My Schedule
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import api from "../api";

export default function ManagerDashboard() {
  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const decoded = jwtDecode(token);
        const role = decoded?.role;

        if (role !== "manager") return navigate("/unauthorized");

        const [resRes, resOrders, resInventory] = await Promise.all([
          api.get("/reservations", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/orders", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/inventory", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setReservations(resRes.data);
        setOrders(resOrders.data);
        setInventory(resInventory.data);
      } catch (err) {
        console.error("Dashboard load error:", err);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 border-r">
        <div className="text-center font-bold text-lg mb-6 border p-2">LOGO</div>
        <nav className="space-y-4">
          <div className="bg-gray-300 p-2 rounded font-semibold text-center">Overview</div>
          <button onClick={() => navigate("/staff")} className="block hover:underline">Manage Staff</button>
          <button onClick={() => navigate("/menu")} className="block hover:underline">View Menu Items</button>
          <button onClick={() => navigate("/inventory")} className="block hover:underline">Manage Inventory</button>
          <button onClick={() => navigate("/reservations")} className="block hover:underline">Reservations</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Dashboard Overview</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="border p-4 text-center rounded">Active Reservations: {reservations.length}</div>
            <div className="border p-4 text-center rounded">Current Orders: {orders.length}</div>
            <div className="border p-4 text-center rounded">
              Low Stock Alerts: {inventory.filter(i => i.quantity_on_hand <= i.reorder_level).length}
            </div>
          </div>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Staff Schedule</h2>
          <p className="text-gray-600">(Placeholder for schedule or upcoming shifts)</p>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Menu Items</h2>
          <p className="text-gray-600">(Placeholder for menu item summary or list)</p>
        </section>
      </main>
    </div>
  );
}

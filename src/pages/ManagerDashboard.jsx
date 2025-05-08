import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import StaffScheduleSection from "../components/StaffScheduleSection";

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
        if (decoded?.role !== "manager") return navigate("/unauthorized");

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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 border-r flex flex-col">
        <div className="text-center font-bold text-xl border p-2 mb-8">LOGO</div>
        <nav className="space-y-2">
          <button className="w-full text-left p-2 bg-gray-200 rounded">Overview</button>
          <button onClick={() => navigate("/staff-management")} className="w-full text-left p-2 hover:bg-gray-100 rounded">Manage Staff</button>
          <button onClick={() => navigate("/menu")} className="w-full text-left p-2 hover:bg-gray-100 rounded">View Menu Items</button>
          <button onClick={() => navigate("/inventory")} className="w-full text-left p-2 hover:bg-gray-100 rounded">Manage Inventory</button>
          <button onClick={() => navigate("/reservations")} className="w-full text-left p-2 hover:bg-gray-100 rounded">Reservations</button>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

        {/* Dashboard Overview */}
        <section className="border p-4 rounded shadow bg-white">
          <h2 className="text-xl font-semibold mb-6">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border p-4 text-center rounded shadow">
              <p className="font-semibold">Active Reservations</p>
              <p className="text-3xl font-bold text-blue-600">{reservations.length}</p>
            </div>
            <div className="bg-white border p-4 text-center rounded shadow">
              <p className="font-semibold">Current Orders</p>
              <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
            </div>
            <div className="bg-white border p-4 text-center rounded shadow">
              <p className="font-semibold">Low Stock Alerts</p>
              <p className="text-3xl font-bold text-red-600">{inventory.filter(i => i.quantity_on_hand <= i.reorder_level).length}</p>
            </div>
          </div>
        </section>

        {/* Staff Schedule */}
        <section className="border p-6 rounded shadow bg-white">
          <h2 className="text-xl font-semibold mb-4">Staff Schedule</h2>
          <StaffScheduleSection />
        </section>

        {/* Menu Items */}
        <section className="border p-6 rounded shadow bg-white">
          <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
          <p className="text-gray-600">(Placeholder for menu item summary or list)</p>
        </section>
      </main>
    </div>
  );
}

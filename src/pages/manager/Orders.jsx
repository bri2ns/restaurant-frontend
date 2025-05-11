import React, { useEffect, useState, useContext } from "react";
import api from "../../api";
import { RefreshContext } from "../../context/RefreshContext";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const refresh = useContext(RefreshContext);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refresh]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="mb-2 border p-2 bg-white">
            Table {order.table_number} — {order.status} — {order.items.length} items
          </li>
        ))}
      </ul>
    </div>
  );
}

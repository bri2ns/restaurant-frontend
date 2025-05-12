import React, { useEffect, useState } from "react";
import api from "../../api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markAsServed = async (orderId) => {
    try {
      setUpdatingId(orderId);
      const token = localStorage.getItem("token");
      await api.patch(
        `/orders/${orderId}/status`,
        { status: "served" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full border bg-white shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Table</th>
              <th className="p-2 border">Items</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-2">{order.id}</td>
                <td className="p-2">Table {order.table_number}</td>
                <td className="p-2">
                  {order.items_ordered.map((item, idx) => (
                    <div key={idx}>
                      {item} (x{order.quantities[idx]})
                    </div>
                  ))}
                </td>
                <td className="p-2 capitalize">{order.status}</td>
                <td className="p-2">
                  {order.status === "ready" && (
                    <button
                      onClick={() => markAsServed(order.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      disabled={updatingId === order.id}
                    >
                      {updatingId === order.id ? "Updating..." : "Mark as Served"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

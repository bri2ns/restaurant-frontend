import React, { useEffect, useState } from "react";
import api from "../../api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchOrders();
  }, []);

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
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-2">{order.id}</td>
                <td className="p-2">Table {order.table_number}</td>
                <td className="p-2">
                  <ul className="list-disc pl-4">
                    {order.items_ordered.map((item, index) => (
                      <li key={index}>
                        {item} x {order.quantities[index]}
                      </li>
                    ))}
                    {order.special_requests && (
                      <li className="italic text-gray-500">
                        Note: {order.special_requests}
                      </li>
                    )}
                  </ul>
                </td>
                <td className="p-2 capitalize text-blue-600">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

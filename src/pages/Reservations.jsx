import React, { useEffect, useState } from "react";
import api from "../api";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const res = await api.get("/reservations");
      setReservations(res.data);
    } catch (err) {
      console.error("Failed to load reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status: newStatus });
      fetchReservations(); // Refresh data
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.delete(`/reservations/${id}`);
      fetchReservations(); // Refresh data
    } catch (err) {
      console.error("Failed to cancel reservation:", err);
    }
  };

  if (loading) return <div className="p-4">Loading reservations...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reservations</h1>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Customer</th>
            <th className="p-2">Table</th>
            <th className="p-2">Date</th>
            <th className="p-2">Guests</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.id} className="border-t">
              <td className="p-2">{res.id}</td>
              <td className="p-2">{res.customer_name}</td>
              <td className="p-2">{res.table_number}</td>
              <td className="p-2">
                {res.date_time
                  ? new Date(res.date_time).toLocaleString()
                  : "Invalid Date"}
              </td>
              <td className="p-2">{res.guests_number}</td>
              <td className="p-2">
                <select
                  className="border rounded px-2 py-1"
                  value={res.status}
                  onChange={(e) => handleStatusChange(res.id, e.target.value)}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                  <option value="seated">Seated</option>
                </select>
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleCancel(res.id)}
                  className="text-red-600 hover:underline"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import api from "../../api";

export default function WaitstaffReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/reservations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReservations(res.data);
      } catch (err) {
        console.error("Failed to fetch reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Upcoming Reservations</h1>

      {loading ? (
        <p>Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <p>No upcoming reservations found.</p>
      ) : (
        <table className="w-full border bg-white shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Table</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Guests</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id} className="border-t">
                <td className="p-2">{res.customer_name}</td>
                <td className="p-2">{res.table_number}</td>
                <td className="p-2">{new Date(res.date_time).toLocaleDateString()}</td>
                <td className="p-2">{new Date(res.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td className="p-2">{res.number_of_guests}</td>
                <td className="p-2 capitalize">{res.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

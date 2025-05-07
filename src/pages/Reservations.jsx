import React, { useEffect, useState } from "react";
import api from "../api";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchReservations();
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.id} className="border-t">
              <td className="p-2">{res.id}</td>
              <td className="p-2">{res.customer_name}</td>
              <td className="p-2">{res.table_number}</td>
              <td className="p-2">{new Date(res.datetime).toLocaleString()}</td>
              <td className="p-2">{res.num_guests}</td>
              <td className="p-2">{res.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

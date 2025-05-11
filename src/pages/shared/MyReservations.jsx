import React, { useEffect, useState, useContext } from "react";
import api from "../../api";
import { RefreshContext } from "../../context/RefreshContext";

export default function MyReservations() {
  const [email, setEmail] = useState("");
  const [reservations, setReservations] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const refresh = useContext(RefreshContext);

  const fetchReservations = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await api.get("/reservations/by-email", { params: { email } });
      setReservations(res.data);
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submitted) fetchReservations();
  }, [refresh]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    fetchReservations();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold mb-4">My Reservations</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          View Reservations
        </button>
      </form>

      {loading && <p className="mt-4 text-gray-600">Loading...</p>}

      {reservations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Upcoming Bookings:</h3>
          <ul className="space-y-3">
            {reservations.map((res) => (
              <li key={res.id} className="border p-4 rounded">
                <p><strong>Table:</strong> {res.table_number}</p>
                <p><strong>Date:</strong> {new Date(res.date_time).toLocaleString()}</p>
                <p><strong>Status:</strong> {res.status}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {submitted && reservations.length === 0 && !loading && (
        <p className="mt-4 text-gray-500">No reservations found for this email.</p>
      )}
    </div>
  );
}

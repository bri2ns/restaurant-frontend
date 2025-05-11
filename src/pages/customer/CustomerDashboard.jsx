import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { RefreshContext } from "../../context/RefreshContext";

export default function CustomerDashboard() {
  const [nextReservation, setNextReservation] = useState(null);
  const refresh = useContext(RefreshContext);

  useEffect(() => {
    fetchReservations();
  }, [refresh]);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/reservations/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const future = res.data
        .filter((r) => r.status === "confirmed" && new Date(r.date_time) > new Date())
        .sort((a, b) => new Date(a.date_time) - new Date(b.date_time));

      setNextReservation(future[0] || null);
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>

      {nextReservation ? (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">📅 Your Next Reservation</h2>
          <p><strong>Date & Time:</strong> {new Date(nextReservation.date_time).toLocaleString()}</p>
          <p><strong>Table:</strong> {nextReservation.table_number}</p>
          <p><strong>Status:</strong> {nextReservation.status}</p>
        </div>
      ) : (
        <p className="text-gray-600 mb-6">You have no upcoming reservations.</p>
      )}

      <div className="flex flex-col gap-4">
        <Link
          to="/customer/reserve"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-center"
        >
          Make a New Reservation
        </Link>
        <Link
          to="/customer/my-reservations"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center"
        >
          View My Reservations
        </Link>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function MakeReservation() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (date && time) {
      fetchAvailableTables();
    }
  }, [date, time]);

  const fetchAvailableTables = async () => {
    try {
      const dateTime = new Date(`${date}T${time}`);
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/reservations/availability",
        {
          date_time: dateTime.toISOString(),
          guests_number: 0, // Show all available tables regardless of size
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTables(res.data.available_tables);
    } catch (err) {
      console.error("Failed to fetch tables:", err);
      setError("⚠️ Could not fetch available tables.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const dateTime = new Date(`${date}T${time}`);
      const token = localStorage.getItem("token");

      const selected = tables.find(
        (t) => t.table_number === Number(selectedTable)
      );
      const guests_number = selected ? selected.capacity : 0;

      await api.post(
        "/reservations",
        {
          table_number: Number(selectedTable),
          date_time: dateTime.toISOString(),
          customer_name: customerName,
          guests_number,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/customer/my-reservations");
    } catch (err) {
      console.error("Reservation failed", err);
      setError("❌ Unable to complete reservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
        Make a Reservation
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select a Table</option>
          {tables.map((t) => (
            <option key={t.table_number} value={t.table_number}>
              Table {t.table_number} — Seats {t.capacity}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Reservation"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
    </div>
  );
}

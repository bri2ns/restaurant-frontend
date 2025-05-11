import React, { useEffect, useState } from "react";
import api from "../../api";

export default function MakeReservation() {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({
    date: "",
    time: "",
    table_id: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await api.get("/tables");
        const available = res.data.filter(t => t.is_available);
        setTables(available);
      } catch (err) {
        console.error("❌ Failed to fetch tables", err);
        setError("Failed to load tables.");
      }
    };

    fetchTables();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const datetime = `${form.date}T${form.time}`;
    const payload = {
      table_id: form.table_id,
      date_time: datetime,
    };

    try {
      await api.post("/reservations", payload);
      setSuccess("✅ Reservation successful!");
      setForm({ date: "", time: "", table_id: "" });
    } catch (err) {
      console.error("❌ Reservation failed", err);
      setError("Unable to complete reservation.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Make a Reservation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-1/2 border p-2 rounded"
            required
          />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-1/2 border p-2 rounded"
            required
          />
        </div>

        <select
          name="table_id"
          value={form.table_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select a Table</option>
          {tables.map((table) => (
            <option key={table.id} value={table.id}>
              Table {table.table_number} — Seats {table.capacity}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Book Reservation
        </button>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
      </form>
    </div>
  );
}

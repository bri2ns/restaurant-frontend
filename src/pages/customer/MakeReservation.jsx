import React, { useState, useEffect, useContext } from "react";
import api from "../../api";
import { RefreshContext } from "../../context/RefreshContext";

export default function MakeReservation() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [availableTables, setAvailableTables] = useState([]);
  const [table, setTable] = useState("");
  const [message, setMessage] = useState("");
  const refresh = useContext(RefreshContext);

  useEffect(() => {
    if (date && time && guests) {
      fetchAvailability();
    }
  }, [date, time, guests, refresh]);

  const fetchAvailability = async () => {
    try {
      const res = await api.get("/reservations/available", {
        params: { date_time: `${date}T${time}`, guests_number: guests },
      });
      setAvailableTables(res.data);
    } catch (err) {
      console.error("Failed to fetch available tables:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reservations", {
        customer_name: name,
        email,
        phone,
        table_number: parseInt(table),
        date_time: `${date}T${time}`,
        guests_number: parseInt(guests),
      });
      setMessage("✅ Reservation successfully made!");
    } catch (err) {
      console.error("Failed to make reservation:", err);
      setMessage("❌ Failed to make reservation. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold mb-4">Make a Reservation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border rounded" />
        <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full p-2 border rounded" />

        <div className="flex gap-4">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="p-2 border rounded w-1/2" />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="p-2 border rounded w-1/2" />
        </div>

        <input type="number" min="1" placeholder="Number of Guests" value={guests} onChange={(e) => setGuests(e.target.value)} required className="w-full p-2 border rounded" />

        <select value={table} onChange={(e) => setTable(e.target.value)} required className="w-full p-2 border rounded">
          <option value="">Select a Table</option>
          {availableTables.map((t) => (
            <option key={t} value={t}>Table {t}</option>
          ))}
        </select>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Book Table</button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

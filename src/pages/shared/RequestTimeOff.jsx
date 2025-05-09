import React, { useState } from "react";
import api from "../../api";

export default function TimeOffRequest() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      return setMessage("Please select both start and end dates.");
    }

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/staff/time-off",
        {
          start_date: startDate,
          end_date: endDate,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("✅ Time-off request submitted successfully.");
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (err) {
      console.error("Error submitting time-off request:", err);
      setMessage("❌ Failed to submit time-off request.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h1 className="text-xl font-semibold mb-4">Request Time Off</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Reason (optional)</label>
          <textarea
            className="w-full border p-2 rounded"
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="E.g. family emergency, vacation..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Request
        </button>
        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
}

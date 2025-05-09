import React, { useEffect, useState } from "react";
import api from "../../api";
import RequestTimeOff from "./RequestTimeOff";
import RequestShiftChange from "./RequestShiftChange";

export default function MySchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTimeOffForm, setShowTimeOffForm] = useState(false);
  const [showShiftChangeForm, setShowShiftChangeForm] = useState(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/staff/schedule", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSchedule(res.data);
      } catch (err) {
        console.error("Failed to fetch schedule:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Schedule</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowTimeOffForm((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showTimeOffForm ? "Hide Time Off Request" : "Request Time Off"}
        </button>
        <button
          onClick={() => setShowShiftChangeForm((prev) => !prev)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {showShiftChangeForm ? "Hide Shift Change Form" : "Request Shift Change"}
        </button>
      </div>

      {loading ? (
        <p>Loading schedule...</p>
      ) : schedule.length === 0 ? (
        <p>No upcoming shifts found.</p>
      ) : (
        <table className="w-full border bg-white shadow-sm mb-8">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Start Time</th>
              <th className="p-2 border">End Time</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((shift) => (
              <tr key={shift.id} className="border-t">
                <td className="p-2">{new Date(shift.date).toLocaleDateString()}</td>
                <td className="p-2">{shift.start_time}</td>
                <td className="p-2">{shift.end_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Forms */}
      {showTimeOffForm && <RequestTimeOff />}
      {showShiftChangeForm && <RequestShiftChange />}
    </div>
  );
}

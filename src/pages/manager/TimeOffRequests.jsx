// src/components/staff/TimeOffRequests.jsx

import React, { useEffect, useState } from "react";
import api from "../../api";

export default function TimeOffRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/staff/time-off");
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch time-off requests:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Time Off Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No time-off requests found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Staff</th>
              <th className="p-2">Start Date</th>
              <th className="p-2">End Date</th>
              <th className="p-2">Reason</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.user?.username || "Unknown"}</td>
                <td className="p-2">{r.start_date}</td>
                <td className="p-2">{r.end_date}</td>
                <td className="p-2">{r.reason || "—"}</td>
                <td className="p-2 capitalize">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

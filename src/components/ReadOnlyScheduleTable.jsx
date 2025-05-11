import React, { useEffect, useState } from "react";
import api from "../api";

export default function ReadOnlyScheduleTable() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/staff", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(res.data);
      } catch (err) {
        console.error("Error fetching staff schedules:", err);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Position</th>
            <th className="p-2 text-left">Shift Start</th>
            <th className="p-2 text-left">Shift End</th>
            <th className="p-2 text-left">Hours</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.user?.username || "Unknown"}</td>
              <td className="p-2">{s.position}</td>
              <td className="p-2">{new Date(s.shift_start).toLocaleString()}</td>
              <td className="p-2">{new Date(s.shift_end).toLocaleString()}</td>
              <td className="p-2">{s.hours_worked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

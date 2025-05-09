import React from "react";

export default function TimeOffRequestTable({ timeOffRequests }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Time-Off Requests</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">User</th>
            <th className="p-2">Start</th>
            <th className="p-2">End</th>
            <th className="p-2">Reason</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {timeOffRequests.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.user?.username || r.user_id}</td>
              <td className="p-2">{new Date(r.start_date).toLocaleDateString()}</td>
              <td className="p-2">{new Date(r.end_date).toLocaleDateString()}</td>
              <td className="p-2">{r.reason || "—"}</td>
              <td className="p-2 capitalize">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

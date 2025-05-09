import React, { useState } from "react";
import api from "../../api";

export default function InventoryReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await api.get("/inventory/usage-report", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      setReportData(res.data);
    } catch (err) {
      console.error("Failed to fetch report:", err);
      setError("Failed to load usage report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Inventory Usage Report</h1>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <label className="flex flex-col">
          <span className="text-sm font-semibold mb-1">Start Date</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm font-semibold mb-1">End Date</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </label>

        <button
          onClick={fetchReport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 h-fit"
        >
          Generate Report
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-600">Loading report...</p>}

      {reportData.length > 0 && (
        <table className="w-full mt-6 border border-gray-300 bg-white">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Item</th>
              <th className="p-2">Category</th>
              <th className="p-2">Quantity Used</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((entry) => (
              <tr key={entry.item_id} className="border-t">
                <td className="p-2">{entry.item_name}</td>
                <td className="p-2 capitalize">{entry.category || "-"}</td>
                <td className="p-2">{entry.quantity_used}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

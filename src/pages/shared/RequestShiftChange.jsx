import React, { useState, useEffect } from "react";
import api from "../../api"; // Update to correct api import path

export default function RequestShiftChange() {
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [newShiftTime, setNewShiftTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch future shifts
    const fetchShifts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/schedule/my-shifts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter out past shifts
        const futureShifts = res.data.filter((shift) => {
          const shiftDate = new Date(shift.start_time);
          return shiftDate > new Date();
        });
        setShifts(futureShifts);
      } catch (err) {
        console.error("Error fetching shifts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedShift || !newShiftTime) {
      setMessage("Please select a shift and specify a new time.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/schedule/shift-change-request", // Assumes this endpoint exists
        {
          shift_id: selectedShift.id,
          new_shift_time: newShiftTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Your shift change request has been submitted.");
    } catch (err) {
      console.error("Error submitting shift change request:", err);
      setMessage("Failed to submit the request. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Request Shift Change</h1>

      {loading ? (
        <p>Loading your shifts...</p>
      ) : shifts.length === 0 ? (
        <p>No upcoming shifts found.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Select Shift</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setSelectedShift(JSON.parse(e.target.value))}
              value={selectedShift ? selectedShift.id : ""}
            >
              <option value="">--Select Shift--</option>
              {shifts.map((shift) => (
                <option key={shift.id} value={JSON.stringify(shift)}>
                  {new Date(shift.start_time).toLocaleString()} -{" "}
                  {new Date(shift.end_time).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">New Shift Time</label>
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => setNewShiftTime(e.target.value)}
              value={newShiftTime}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit Request
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}

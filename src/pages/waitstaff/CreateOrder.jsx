import React, { useEffect, useState } from "react";
import api from "../../api";

export default function CreateOrder() {
  const [tableNumber, setTableNumber] = useState("1");
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([
    { item: "", quantity: 1, request: "" },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/menu/");
        setMenuItems(res.data);
      } catch (err) {
        console.error("Failed to load menu:", err);
      }
    };

    fetchMenu();
  }, []);

  const handleItemChange = (index, key, value) => {
    const updated = [...orderItems];
    updated[index][key] = value;
    setOrderItems(updated);
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { item: "", quantity: 1, request: "" }]);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    const items_ordered = orderItems.map((entry) => entry.item);
    const quantities = orderItems.map((entry) => parseInt(entry.quantity));
    const special_requests = orderItems
      .map((entry) => entry.request || "")
      .join("; ");

    // Validation
    if (!tableNumber || !items_ordered.every(Boolean) || !quantities.every((q) => q > 0)) {
      setError("Please fill out all fields correctly.");
      return;
    }

    try {
      await api.post("/orders/", {
        table_number: parseInt(tableNumber),
        items_ordered,
        quantities,
        special_requests,
      });

      setSuccess("Order submitted!");
      setOrderItems([{ item: "", quantity: 1, request: "" }]);
    } catch (err) {
      console.error("❌ Order submission failed:", err);
      setError("Failed to submit order. Please check fields.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Order</h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Table Number</label>
        <select
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="border p-2 rounded"
        >
          {[...Array(10).keys()].map((n) => (
            <option key={n + 1} value={n + 1}>
              {n + 1}
            </option>
          ))}
        </select>
      </div>

      {orderItems.map((entry, idx) => (
        <div key={idx} className="mb-4 flex gap-2 items-center flex-wrap">
          <select
            value={entry.item}
            onChange={(e) => handleItemChange(idx, "item", e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select item</option>
            {menuItems.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={entry.quantity}
            onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
            className="border p-2 rounded w-20"
            placeholder="Qty"
          />

          <input
            type="text"
            value={entry.request}
            onChange={(e) => handleItemChange(idx, "request", e.target.value)}
            className="border p-2 rounded flex-1"
            placeholder="Special request"
          />
        </div>
      ))}

      <button
        onClick={handleAddItem}
        className="mb-4 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
      >
        + Add Item
      </button>

      <div>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Order
        </button>
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
}

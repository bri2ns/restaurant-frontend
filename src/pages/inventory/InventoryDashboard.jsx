import { useEffect, useState } from "react";
import api from "../../api";

export default function InventoryDashboard() {
  const [items, setItems] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get("/inventory");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
      alert("⚠️ Failed to load inventory.");
    }
  };

  const handleRestock = async (item) => {
    const suggestedQty = item.reorder_level + 10;
    const newQty = prompt(
      `Current qty: ${item.quantity_on_hand}\nEnter new stock quantity:`,
      suggestedQty
    );

    if (!newQty || isNaN(newQty) || parseInt(newQty) < 0) return;
    await updateQuantity(item.id, parseInt(newQty));
  };

  const handleEdit = async (item) => {
    const newQty = prompt(
      `Edit quantity for "${item.item_name}":`,
      item.quantity_on_hand
    );

    if (!newQty || isNaN(newQty) || parseInt(newQty) < 0) return;
    await updateQuantity(item.id, parseInt(newQty));
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      setLoadingId(itemId);
      await api.patch(`/inventory/${itemId}/reorder`, {
        quantity_on_hand: newQuantity, // ✅ Match backend expectations
      });
      await fetchInventory();
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Update failed. Please check your input or try again.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory Overview</h1>
      <table className="min-w-full bg-white shadow rounded-xl overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Item</th>
            <th className="p-3">Qty</th>
            <th className="p-3">Reorder Level</th>
            <th className="p-3">Supplier</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-3">{item.item_name}</td>
              <td className="p-3">{item.quantity_on_hand}</td>
              <td className="p-3">{item.reorder_level}</td>
              <td className="p-3">{item.supplier_info || "—"}</td>
              <td className="p-3">
                {item.quantity_on_hand <= item.reorder_level ? (
                  <span className="text-red-600 font-semibold">Low Stock</span>
                ) : (
                  <span className="text-green-600">OK</span>
                )}
              </td>
              <td className="p-3 flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  onClick={() => handleEdit(item)}
                  disabled={loadingId === item.id}
                >
                  {loadingId === item.id ? "Saving..." : "Edit"}
                </button>
                {item.quantity_on_hand <= item.reorder_level && (
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => handleRestock(item)}
                    disabled={loadingId === item.id}
                  >
                    {loadingId === item.id ? "Updating..." : "Restock"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

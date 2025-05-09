import { useEffect, useState } from "react";
import api from "../../api";

export default function InventoryDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const res = await api.get("/inventory");
    setItems(res.data);
  };

  const handleRestock = async (itemId, currentQty, reorderLevel) => {
    const suggestedQty = reorderLevel + 10;
    const newQty = prompt(
      `Current qty: ${currentQty}\nEnter new stock quantity:`,
      suggestedQty
    );

    if (!newQty || isNaN(newQty) || parseInt(newQty) < 0) return;

    try {
      setLoading(true);
      await api.patch(`/inventory/${itemId}/reorder`, { new_quantity: parseInt(newQty) });
      await fetchInventory();
    } catch (err) {
      console.error("Restock error:", err);  
      alert("Restock failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
              <td className="p-3">{item.supplier_name}</td>
              <td className="p-3">
                {item.quantity_on_hand <= item.reorder_level ? (
                  <span className="text-red-600 font-semibold">Low Stock</span>
                ) : (
                  <span className="text-green-600">OK</span>
                )}
              </td>
              <td className="p-3">
                {item.quantity_on_hand <= item.reorder_level && (
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() =>
                      handleRestock(item.id, item.quantity_on_hand, item.reorder_level)
                    }
                    disabled={loading}
                  >
                    {loading ? "Restocking..." : "Restock"}
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

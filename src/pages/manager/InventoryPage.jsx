import React, { useEffect, useState, useContext } from "react";
import api from "../../api";
import { RefreshContext } from "../../context/RefreshContext";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editedReorderLevels, setEditedReorderLevels] = useState({});
  const refresh = useContext(RefreshContext);

  const fetchInventory = async () => {
    try {
      const res = await api.get("/inventory");
      const items = res.data;

      const categorySet = new Set(
        items.map((item) => item.category?.trim().toLowerCase()).filter(Boolean)
      );

      setCategories(["all", ...Array.from(categorySet)]);
      setInventory(items);
      setFilteredInventory(items);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [refresh]);

  useEffect(() => {
    let filtered = [...inventory];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) => item.category?.toLowerCase() === selectedCategory
      );
    }

    if (search.trim()) {
      filtered = filtered.filter((item) =>
        item.item_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredInventory(filtered);
  }, [search, selectedCategory, inventory]);

  const isLowStock = (item) => item.quantity_on_hand <= item.reorder_level;

  const handleReorderLevelUpdate = async (itemId) => {
    const newLevel = parseInt(editedReorderLevels[itemId]);

    if (isNaN(newLevel) || newLevel < 0) {
      alert("Enter a valid reorder level.");
      return;
    }

    try {
      await api.patch(`/inventory/${itemId}`, { reorder_level: newLevel });
      alert("Reorder level updated.");
      fetchInventory();
    } catch (err) {
      console.error("Failed to update reorder level:", err);
      alert("Update failed.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all"
                ? "All Categories"
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full border border-gray-300 bg-white">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Item</th>
            <th className="p-2">Category</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Reorder Level</th>
            <th className="p-2">Supplier</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.item_name}</td>
              <td className="p-2 capitalize">{item.category || "-"}</td>
              <td className="p-2">{item.quantity_on_hand}</td>
              <td className="p-2">
                <input
                  type="number"
                  min="0"
                  className="w-20 border px-1 py-0.5 rounded text-sm"
                  value={
                    editedReorderLevels[item.id] !== undefined
                      ? editedReorderLevels[item.id]
                      : item.reorder_level
                  }
                  onChange={(e) =>
                    setEditedReorderLevels({
                      ...editedReorderLevels,
                      [item.id]: e.target.value,
                    })
                  }
                />
              </td>
              <td className="p-2">{item.supplier_info || "-"}</td>
              <td className="p-2">
                {isLowStock(item) ? (
                  <span className="text-red-600 font-semibold">Low Stock</span>
                ) : (
                  <span className="text-green-600">OK</span>
                )}
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleReorderLevelUpdate(item.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Update Level
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

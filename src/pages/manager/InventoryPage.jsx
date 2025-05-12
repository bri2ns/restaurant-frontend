import React, { useEffect, useState, useContext } from "react";
import api from "../../api";
import { RefreshContext } from "../../context/RefreshContext";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [search, setSearch] = useState("");
  const refresh = useContext(RefreshContext);

  const fetchInventory = async () => {
    try {
      const res = await api.get("/inventory");
      const items = res.data;
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

    if (search.trim()) {
      filtered = filtered.filter((item) =>
        item.item_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredInventory(filtered);
  }, [search, inventory]);

  const isLowStock = (item) => item.quantity_on_hand <= item.reorder_level;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
      </div>

      <table className="w-full border border-gray-300 bg-white">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Item</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Reorder Level</th>
            <th className="p-2">Supplier</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.item_name}</td>
              <td className="p-2">{item.quantity_on_hand}</td>
              <td className="p-2">{item.reorder_level}</td>
              <td className="p-2">{item.supplier_info || "-"}</td>
              <td className="p-2">
                {isLowStock(item) ? (
                  <span className="text-red-600 font-semibold">Low Stock</span>
                ) : (
                  <span className="text-green-600">OK</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

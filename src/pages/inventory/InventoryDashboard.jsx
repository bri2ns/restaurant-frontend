import { useEffect, useState } from "react";
import api from "../../api";

export default function InventoryDashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/inventory").then((res) => setItems(res.data));
  }, []);

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

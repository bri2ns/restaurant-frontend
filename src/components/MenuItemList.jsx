import React, { useEffect, useState } from "react";
import api from "../api";

export default function MenuItemList() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await api.get("/menu");
        setMenuItems(res.data);
      } catch (err) {
        setError("Failed to load menu items.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) return <div className="p-4">Loading menu items...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 space-y-4">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">{item.name}</h2>
          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
          <p className="text-md font-medium">${Number(item.price).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}

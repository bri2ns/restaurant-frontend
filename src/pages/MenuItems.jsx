import React, { useEffect, useState } from "react";
import api from "../api";

export default function MenuItems() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "" });
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", description: "", price: "" });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get("/menu");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/menu", {
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price)
      });
      setNewItem({ name: "", description: "", price: "" });
      fetchItems();
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/menu/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditValues({ name: item.name, description: item.description, price: item.price });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ name: "", description: "", price: "" });
  };

  const handleEditSave = async (id) => {
  const parsedPrice = parseFloat(editValues.price);

  if (isNaN(parsedPrice)) {
    alert("Please enter a valid number for price.");
    return;
  }

  try {
    await api.patch(`/menu/${id}`, {
      ...editValues,
      price: parsedPrice
    });
    setEditingId(null);
    fetchItems();
  } catch (err) {
    console.error("Failed to update item:", err.response?.data || err.message);
  }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Menu Items</h1>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="mb-6 space-y-2">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="border p-2 rounded w-1/3"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="border p-2 rounded w-1/3"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className="border p-2 rounded w-1/3"
            required
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Item</button>
      </form>

      {/* Table */}
      <table className="w-full border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Description</th>
            <th className="p-2">Price</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.id}</td>
              <td className="p-2">
                {editingId === item.id ? (
                  <input
                    value={editValues.name}
                    onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="p-2">
                {editingId === item.id ? (
                  <input
                    value={editValues.description}
                    onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  item.description
                )}
              </td>
              <td className="p-2">
                {editingId === item.id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editValues.price}
                    onChange={(e) => setEditValues({ ...editValues, price: e.target.value })}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  `$${item.price.toFixed(2)}`
                )}
              </td>
              <td className="p-2 space-x-2">
                {editingId === item.id ? (
                  <>
                    <button onClick={() => handleEditSave(item.id)} className="text-green-600 hover:underline">Save</button>
                    <button onClick={cancelEdit} className="text-gray-600 hover:underline">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(item)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

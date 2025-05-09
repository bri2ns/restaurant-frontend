// MenuItems.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function MenuItems() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "" });
  const [ingredients, setIngredients] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ inventory_item_id: "", quantity_required: "" });
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", description: "", price: "", ingredients: [] });
  const [editIngredient, setEditIngredient] = useState({ inventory_item_id: "", quantity_required: "" });

  useEffect(() => {
    fetchItems();
    fetchInventory();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get("/menu");
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch menu items:", err);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await api.get("/inventory");
      setInventoryItems(res.data);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    }
  };

  const handleAddIngredient = () => {
    const { inventory_item_id, quantity_required } = newIngredient;
    if (!inventory_item_id || !quantity_required || isNaN(quantity_required) || Number(quantity_required) <= 0) {
      alert("Please select a valid ingredient and enter a positive quantity.");
      return;
    }
    const alreadyAdded = ingredients.find((i) => i.inventory_item_id === inventory_item_id);
    if (alreadyAdded) {
      alert("This ingredient is already added.");
      return;
    }
    setIngredients([...ingredients, { ...newIngredient, quantity_required: Number(quantity_required) }]);
    setNewIngredient({ inventory_item_id: "", quantity_required: "" });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (ingredients.length === 0) {
      alert("Please add at least one ingredient.");
      return;
    }

    try {
      const res = await api.post("/menu", {
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
        ingredients
      });

      const newItemId = res.data.id;
      await api.patch(`/menu/${newItemId}/ingredients`, ingredients);

      setNewItem({ name: "", description: "", price: "" });
      setIngredients([]);
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
    setEditValues({
      name: item.name,
      description: item.description,
      price: item.price,
      ingredients: item.ingredients || [],
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ name: "", description: "", price: "", ingredients: [] });
  };

  const handleEditIngredientAdd = () => {
    const { inventory_item_id, quantity_required } = editIngredient;
    if (!inventory_item_id || !quantity_required || Number(quantity_required) <= 0) return;
    const alreadyExists = editValues.ingredients.some((i) => i.inventory_item_id === parseInt(inventory_item_id));
    if (alreadyExists) return;

    setEditValues({
      ...editValues,
      ingredients: [...editValues.ingredients, { inventory_item_id: parseInt(inventory_item_id), quantity_required: parseFloat(quantity_required) }]
    });
    setEditIngredient({ inventory_item_id: "", quantity_required: "" });
  };

  const handleEditIngredientRemove = (inventory_item_id) => {
    setEditValues({
      ...editValues,
      ingredients: editValues.ingredients.filter(i => i.inventory_item_id !== inventory_item_id)
    });
  };

  const handleEditSave = async (id) => {
    const parsedPrice = parseFloat(editValues.price);
    if (isNaN(parsedPrice)) {
      alert("Enter a valid price.");
      return;
    }

    try {
      await api.patch(`/menu/${id}`, {
        name: editValues.name,
        description: editValues.description,
        price: parsedPrice,
      });

      await api.patch(`/menu/${id}/ingredients`, editValues.ingredients);

      setEditingId(null);
      fetchItems();
    } catch (err) {
      console.error("Failed to update item:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Menu Items</h1>

      {/* Add form */}
      <form onSubmit={handleAdd} className="mb-6 space-y-4">
        <div className="flex gap-4">
          <input type="text" placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="border p-2 rounded w-1/3" required />
          <input type="text" placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="border p-2 rounded w-1/3" required />
          <input type="number" step="0.01" placeholder="Price" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} className="border p-2 rounded w-1/3" required />
        </div>

        <div className="flex gap-4 items-center">
          <select value={newIngredient.inventory_item_id} onChange={(e) => setNewIngredient({ ...newIngredient, inventory_item_id: e.target.value })} className="border p-2 rounded w-1/3">
            <option value="" disabled>Select Ingredient</option>
            {inventoryItems.map((inv) => (
              <option key={inv.id} value={inv.id}>{inv.item_name}</option>
            ))}
          </select>
          <input type="number" min="0.01" step="0.01" placeholder="Quantity" value={newIngredient.quantity_required} onChange={(e) => setNewIngredient({ ...newIngredient, quantity_required: e.target.value })} className="border p-2 rounded w-1/3" />
          <button type="button" onClick={handleAddIngredient} className="bg-gray-700 text-white px-3 py-2 rounded">Add Ingredient</button>
        </div>

        {ingredients.length > 0 && (
          <ul className="list-disc pl-6">
            {ingredients.map((ing, i) => {
              const item = inventoryItems.find(inv => inv.id === parseInt(ing.inventory_item_id));
              return <li key={i}>{item?.item_name || "Unknown"}: {ing.quantity_required}</li>;
            })}
          </ul>
        )}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Item</button>
      </form>

      {/* Table */}
      <table className="w-full border">
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
              <td className="p-2">{editingId === item.id ? <input value={editValues.name} onChange={(e) => setEditValues({ ...editValues, name: e.target.value })} className="border p-1 w-full" /> : item.name}</td>
              <td className="p-2">{editingId === item.id ? <input value={editValues.description} onChange={(e) => setEditValues({ ...editValues, description: e.target.value })} className="border p-1 w-full" /> : item.description}</td>
              <td className="p-2">{editingId === item.id ? <input type="number" step="0.01" value={editValues.price} onChange={(e) => setEditValues({ ...editValues, price: e.target.value })} className="border p-1 w-full" /> : `$${Number(item.price).toFixed(2)}`}</td>
              <td className="p-2 space-x-2">
                {editingId === item.id ? (
                  <>
                    <div className="space-y-2 mt-2">
                      <strong>Ingredients:</strong>
                      <ul className="list-disc pl-5">
                        {editValues.ingredients.map((ing, idx) => {
                          const item = inventoryItems.find(i => i.id === ing.inventory_item_id);
                          return (
                            <li key={idx}>
                              {item?.item_name || "Unknown"}: {ing.quantity_required}
                              <button onClick={() => handleEditIngredientRemove(ing.inventory_item_id)} className="ml-2 text-red-600 hover:underline">Remove</button>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="flex gap-2">
                        <select value={editIngredient.inventory_item_id} onChange={(e) => setEditIngredient({ ...editIngredient, inventory_item_id: e.target.value })} className="border p-1 rounded">
                          <option value="">Select</option>
                          {inventoryItems.map((inv) => (
                            <option key={inv.id} value={inv.id}>{inv.item_name}</option>
                          ))}
                        </select>
                        <input type="number" step="0.01" value={editIngredient.quantity_required} onChange={(e) => setEditIngredient({ ...editIngredient, quantity_required: e.target.value })} className="border p-1 rounded" />
                        <button onClick={handleEditIngredientAdd} className="text-green-700 hover:underline">Add</button>
                      </div>
                    </div>
                    <button onClick={() => handleEditSave(item.id)} className="text-green-600 hover:underline mt-2">Save</button>
                    <button onClick={cancelEdit} className="text-gray-600 hover:underline mt-2">Cancel</button>
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

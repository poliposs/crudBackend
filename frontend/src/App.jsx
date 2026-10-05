import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "http://localhost:8000";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  // READ: load all items once, when the page first appears
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_BASE}/items/`);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // CREATE
  const createItem = async () => {
    try {
      const response = await axios.post(`${API_BASE}/items/`, {
        name,
        description,
      });
      setItems([...items, response.data]);
      resetForm();
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  // UPDATE
  const updateItem = async () => {
    try {
      const response = await axios.put(`${API_BASE}/items/${editingId}`, {
        name,
        description,
      });
      setItems(items.map((item) => (item.id === editingId ? response.data : item)));
      resetForm();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // DELETE
  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE}/items/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description ?? "");
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
  };

  return (
    <div className="App">
      <h1>CRUD App with FastAPI and React</h1>

      <div className="item-form">
        <h2>{editingId ? "Edit Item" : "Add New Item"}</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {editingId ? (
          <>
            <button onClick={updateItem}>Update</button>
            <button onClick={resetForm}>Cancel</button>
          </>
        ) : (
          <button onClick={createItem}>Create</button>
        )}
      </div>

      <div className="items-list">
        <h2>Items</h2>
        {items.length === 0 ? (
          <p>No items found</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <button onClick={() => startEdit(item)}>Edit</button>
                <button onClick={() => deleteItem(item.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
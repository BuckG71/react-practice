import { useState, useEffect, useRef } from "react";
import { useItems } from "./useItems";
import { postNewItem, updateItem, deleteItem } from "./api";

function App() {
  const [items, setItems] = useItems();
  const [newItem, setNewItem] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const inputRef = useRef(null); // Create a ref for the input field
  const editInputRef = useRef(null);

  // Focus on the input field upon page load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingIndex]);

  useEffect(() => {
    fetch('http://localhost:3030/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  }, [setItems]);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditingValue(items[index].name); // Correctly set the editing value
  };

  const handleEditChange = (e) => {
    setEditingValue(e.target.value);
  };

  const handleEditSubmit = async () => {
    try {
      const id = items[editingIndex].id; // Get the correct ID
      const updatedItem = await updateItem(id, editingValue);
      console.log("Updated item:", updatedItem); // Debugging log
      if (updatedItem) {
        const updatedItems = [...items];
        updatedItems[editingIndex] = updatedItem;
        setItems(updatedItems);
        setEditingIndex(null);
        setEditingValue("");
      } else {
        console.error("Failed to update item: received undefined");
      }
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const handleAddItem = async () => {
    try {
      const item = await postNewItem(newItem); // Wait for the item to be added and returned
      setItems(prev => [...prev, item]); // Append the new item to the existing items array
      setNewItem(""); // Reset input after adding
      console.log("New item added and input reset");
      inputRef.current.focus(); // Refocus on the input field after adding an item
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  };

  const handleChange = (e) => {
    setNewItem(e.target.value);
    console.log("Input changed:", e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (editingIndex !== null) {
        handleEditSubmit();
      } else {
        handleAddItem();
      }
    }
  };

  const handleBlur = () => {
    if (editingIndex !== null) {
      handleEditSubmit();
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteItem(itemId);
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  return (
    <div>
      <h1>Item List</h1>
      <ul>
        {items?.map((item, index) => (
          <li key={item.id} className="editable-item">
            {editingIndex === index ? (
              <input
                type="text"
                value={editingValue}
                onChange={handleEditChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                ref={editInputRef}
                autoFocus
              />
            ) : (
              <div className="tooltip">
                {item.name} {/* Correctly display the item name */}
                <span className="tooltiptext">Click to edit</span>
              </div>
            )}
            <button className="edit-button" onClick={(e) => { e.stopPropagation(); handleEditClick(index); }}>Edit</button> {/* Edit button */}
            <button className="delete-button" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>Delete</button> {/* Delete button */}
          </li>
        ))}
      </ul>
      <input
        type="text"
        id="newItem"
        name="newItem"
        ref={inputRef} // Attach the ref to the input field
        onChange={handleChange}
        value={newItem}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleAddItem} className="spaced-button">Add Item</button>
    </div>
  );
}

export default App;
const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Import the database connection

const app = express();
app.use(cors());
app.use(express.json());

// CREATE - POST
app.post('/items', async (req, res) => {
  try {
    const { newItem } = req.body;
    console.log("Adding new item:", newItem); // Log the new item
    if (!newItem) {
      return res.status(400).json({ error: "newItem field is required" });
    }
    const newItemQuery = await pool.query(
      "INSERT INTO items (name) VALUES($1) RETURNING *",
      [newItem]
    );
    res.json(newItemQuery.rows[0]);
  } catch (err) {
    console.error("Error adding new item:", err.message); // Log the error
    res.status(500).json({ error: "Server error" });
  }
});

// READ - GET all items
app.get('/items', async (req, res) => {
  try {
    console.log("Fetching all items"); // Log fetching items
    const allItems = await pool.query("SELECT * FROM items ORDER BY id");
    res.json(allItems.rows);
  } catch (err) {
    console.error("Error fetching items:", err.message); // Log the error
    res.status(500).json({ error: "Server error" });
  }
});

// READ - GET one item
app.get('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching item with id:", id); // Log fetching item by id
    const item = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
    if (item.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item.rows[0]);
  } catch (err) {
    console.error("Error fetching item:", err.message); // Log the error
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE - PUT
app.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { item } = req.body;
    console.log("Updating item with id:", id, "to", item); // Log updating item
    if (!item) {
      return res.status(400).json({ error: "Item field is required" });
    }
    const updateItem = await pool.query(
      "UPDATE items SET name = $1 WHERE id = $2 RETURNING *",
      [item, id]
    );
    if (updateItem.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(updateItem.rows[0]);
  } catch (err) {
    console.error("Error updating item:", err.message); // Log the error
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE - DELETE
app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting item with id:", id); // Log deleting item by id
    const deleteItem = await pool.query(
      "DELETE FROM items WHERE id = $1 RETURNING *",
      [id]
    );
    if (deleteItem.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(deleteItem.rows[0]);
  } catch (err) {
    console.error("Error deleting item:", err.message); // Log the error
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3030, () => {
  console.log("Server is running on port 3030");
});
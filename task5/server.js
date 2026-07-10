const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store (Simulating a database)
let items = [
    { id: 1, name: "Project AirPro", status: "Completed" },
    { id: 2, name: "CodeVault App", status: "In Progress" }
];

// ==========================================
// RESTful API Endpoints (CRUD)
// ==========================================

// 1. READ (Get all items)
app.get('/api/items', (req, res) => {
    res.json(items);
});

// 2. CREATE (Post a new item)
app.post('/api/items', (req, res) => {
    const newItem = {
        id: items.length ? Math.max(...items.map(i => i.id)) + 1 : 1,
        name: req.body.name || "Untitled Item",
        status: req.body.status || "Pending"
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

// 3. UPDATE (Put / Modify an existing item)
app.put('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(i => i.id === id);

    if (itemIndex !== -1) {
        items[itemIndex].name = req.body.name || items[itemIndex].name;
        items[itemIndex].status = req.body.status || items[itemIndex].status;
        res.json(items[itemIndex]);
    } else {
        res.status(404).json({ message: "Item not found" });
    }
});

// 4. DELETE (Remove an item)
app.delete('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = items.length;
    items = items.filter(i => i.id !== id);

    if (items.length < initialLength) {
        res.json({ message: `Item ${id} deleted successfully.`, id: id });
    } else {
        res.status(404).json({ message: "Item not found" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running smoothly on http://localhost:${PORT}`);
});
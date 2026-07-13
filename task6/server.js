// server.js
const express = require('express');
const connectDB = require('./db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Init Middleware to parse incoming JSON payloads
app.use(express.json());

// Main Modular Routes
app.use('/api/auth', require('./routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running dynamically on port ${PORT}`));
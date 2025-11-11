/**
 * @fileoverview Main application entry point for HealthLink API.
 * Configures Express server, establishes database connection, sets up middleware,
 * and initializes API routes for the patient appointment management system.
 * 
 * @module server
 * @requires dotenv - Environment variable configuration
 * @requires express - Web application framework
 * @requires cors - Cross-Origin Resource Sharing middleware
 * @requires ./config/database - MongoDB connection handler
 * @requires ./routes/api - API route handlers
 * 
 * @author Ivan Yuri Pana, Jojit Sitoy, and Vin Belandres
 * @version 1.0.0
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('<h1>HealthLink API is running! 🩺</h1><p>Ready to connect.</p>');
});

app.use('/api', require('./routes/api'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
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
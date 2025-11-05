const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    
    await mongoose.connect(process.env.DATABASE_URL);
    
    console.log('MongoDB Connection Successful');
  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
    
    process.exit(1);
  }
};

module.exports = connectDB;
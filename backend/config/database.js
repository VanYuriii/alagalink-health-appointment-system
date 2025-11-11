const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Establishes a connection to the MongoDB database.
 * 
 * This function connects to MongoDB using the connection string provided
 * in the DATABASE_URL environment variable. If the connection fails,
 * the application will exit with an error code.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when connection is successful
 * @throws {Error} Throws an error if the MongoDB connection fails
 * @requires mongoose - MongoDB object modeling tool
 * @requires dotenv - Loads environment variables from .env file
 * 
 * @example
 * // main server file (e.g., server.js or index.js)
 * const connectDB = require('./config/db');
 * 
 * connectDB()
 *   .then(() => console.log('Database connected'))
 *   .catch(err => console.error(err));
 * 
 * @see {@link https://mongoosejs.com/docs/connections.html|Mongoose Connection Docs}
 */
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
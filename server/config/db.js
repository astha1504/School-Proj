const mongoose = require('mongoose');

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/school_management_system';
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`[MongoDB Error] Failed to connect: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;

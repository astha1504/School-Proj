const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    stack: 'MERN (MongoDB, Express, React, Node.js)',
    service: 'EduSphere ERP Backend Engine',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRoutes);

// Connect DB & Start Server
connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 EduSphere MERN Stack Backend Server Active!`);
    console.log(`📡 Express API Listening on http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
});

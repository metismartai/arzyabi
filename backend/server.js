// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const csvApiRoutes = require('./routes/csvApi');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api', csvApiRoutes);

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'OK', message: 'Server is running' });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



// server.js - The main entry point for your application
const express = require('express');
const cors = require('cors');
const csvHandler = require('./utils/csvHandler'); // CORRECTED: Path to handler
const csvApiRoutes = require('./routes/csvApi');   // CORRECTED: Path to routes

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
// All routes defined in csvApi.js will be prefixed with /api
app.use('/api', csvApiRoutes);

// --- Health Check Endpoint ---
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is healthy' });
});

// --- Start Server ---
// First, load the data from the CSV. Once data is loaded, start the server.
console.log('Attempting to load CSV data...');
csvHandler.loadData()
  .then(() => {
    console.log('Data loaded successfully. Starting server...');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log('API is available at /api');
    });
  })
  .catch(error => {
    console.error("FATAL: Failed to load data. Server will not start.", error);
    process.exit(1); // Exit the process with an error code
  });

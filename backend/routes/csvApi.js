// // csvApi.js
// const express = require('express');
// const cors = require('cors');
// const csvHandler = require('../utils/csvHandler');

// const app = express();
// const port = 3000;

// app.use(cors());
// app.use(express.json());

// // API Endpoint to get all approaches
// app.get('/approaches', (req, res) => {
//   const approaches = csvHandler.getApproaches();
//   res.json(approaches);
// });

// // API Endpoint to get a single approach by its code
// app.get('/approaches/:code', (req, res) => {
//   const { code } = req.params;
//   const approach = csvHandler.getApproachByCode(code);
//   if (approach) {
//     res.json(approach);
//   } else {
//     res.status(404).json({ error: 'Approach not found' });
//   }
// });

// // API Endpoint to get all available filter options
// app.get('/filters', (req, res) => {
//   const filters = csvHandler.getFilterOptions();
//   res.json(filters);
// });

// // Load data and start the server
// csvHandler.loadData()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Server is running on http://localhost:${port}`);
//       console.log('Available endpoints:');
//       console.log(`  GET http://localhost:${port}/approaches`);
//       console.log(`  GET http://localhost:${port}/approaches/:code`);
//       console.log(`  GET http://localhost:${port}/filters`);
//     });
//   })
//   .catch(error => {
//     console.error("Failed to start server:", error);
//     process.exit(1);
//   });


// routes/csvApi.js - Defines only the API routes
const express = require('express');
const router = express.Router(); // Use express.Router, not a full app
const csvHandler = require('../utils/csvHandler'); // Correct path to the handler

// API Endpoint to get all approaches
// Path is now '/' because '/api' is handled in server.js
router.get('/approaches', (req, res) => {
  const approaches = csvHandler.getApproaches();
  res.json(approaches);
});

// API Endpoint to get a single approach by its code
router.get('/approaches/:code', (req, res) => {
  const { code } = req.params;
  const approach = csvHandler.getApproachByCode(code);
  if (approach) {
    res.json(approach);
  } else {
    res.status(404).json({ error: 'Approach not found' });
  }
});

// API Endpoint to get all available filter options
router.get('/filters', (req, res) => {
  const filters = csvHandler.getFilterOptions();
  res.json(filters);
});

// Export the router so it can be used by server.js
module.exports = router;

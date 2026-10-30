// Import dependencies
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const exampleRoutes = require('./routes/example');
const imageRoutes = require('./routes/imageRouter');
const newsRoutes = require('./routes/newsRouter');

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies

// --- Routes ---
// Basic route for testing
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the NOVARIC Express API!' });
});

// Use the example routes
app.use('/api', exampleRoutes);
app.use('/api', imageRoutes);
app.use('/api', newsRoutes);

// --- Server Startup ---
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

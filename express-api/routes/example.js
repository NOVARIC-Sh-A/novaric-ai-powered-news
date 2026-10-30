const express = require('express');
const router = express.Router();

// @route   GET /api/greet
// @desc    Returns a simple greeting
// @access  Public
router.get('/greet', (req, res) => {
  try {
    const name = req.query.name || 'Guest';
    res.status(200).json({ message: `Hello, ${name}! Welcome to the NOVARIC API.` });
  } catch (error) {
    console.error('Error in /greet route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// You can add more routes here
// router.post('/submit-data', (req, res) => { ... });

module.exports = router;

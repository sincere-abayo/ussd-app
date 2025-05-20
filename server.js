const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { initializeDatabase } = require('./models/database');
const ussdRoutes = require('./routes/ussdRoutes');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
initializeDatabase();

// Routes
app.use('/ussd', ussdRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('USSD Application Server is running');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
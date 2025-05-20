const express = require('express');
const router = express.Router();
const { handleUSSD } = require('../controllers/ussdController');

// USSD endpoint
router.post('/', handleUSSD);

module.exports = router;
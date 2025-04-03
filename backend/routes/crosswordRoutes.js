//routes/crosswordRoutes.js
const express = require('express');
const router = express.Router();
const crosswordController = require('../controllers/crosswordController');

router.post('/saveGame ', crosswordController.saveGame);

module.exports = router;
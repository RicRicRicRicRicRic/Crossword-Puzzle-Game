// routes/wordsearchRoutes.js
const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordsearchController');

router.get('/lookup/:word', wordController.lookup);
router.get('/suggestions', wordController.suggestions);

module.exports = router;

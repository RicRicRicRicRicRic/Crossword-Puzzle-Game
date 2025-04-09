//routes/rankRoutes.js
const express = require('express');
const router = express.Router();
const rankController = require('../controllers/rankController');

router.post('/saveScore', rankController.saveScore);
router.post('/leaderboards', rankController.showLeaderboards);

module.exports = router;
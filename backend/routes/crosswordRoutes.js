//routes/crosswordRoutes.js
const express = require('express');
const router = express.Router();
const crosswordController = require('../controllers/crosswordController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/saveGame', authMiddleware, crosswordController.saveGame);
router.get('/games', crosswordController.getAllGames);
router.get('/games/:id', crosswordController.getGameById);

module.exports = router;

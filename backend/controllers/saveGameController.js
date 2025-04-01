//controllers/saveGameController.js
const db = require('../config/db');
const logger = require('../utils/logger');

exports.saveGame = async (req, res, next) => {
  let = {} = req.body;
    try {

    } catch(error){
        logger.error(error,"Error saving game");
        next(error);
    }
}
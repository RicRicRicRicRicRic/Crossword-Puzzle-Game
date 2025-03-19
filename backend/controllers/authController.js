//controllers/authController.js
const db = require('../config/db');
const logger = require('../utils/logger');

exports.register = async (req, res, next) => {
  const { player_name, password, email } = req.body;
  try {
    const [existing] = await db.query(
      'SELECT player_name, email FROM player_account WHERE player_name = ? OR email = ?',
      [player_name, email]
    );

    if (existing.length) {
      if (existing.some(user => user.player_name === player_name)) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
      if (existing.some(user => user.email === email)) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
    }

    const [result] = await db.query(
      'INSERT INTO player_account (player_name, password, email) VALUES (?, ?, ?)',
      [player_name, password, email]
    );
    
    res.status(201).json({ message: 'Registration was successful!', acc_ID: result.insertId });
  } catch (error) {
    logger.error(error, 'Unexpected error in registration');
    next(error);
  }
};

exports.login = async (req, res, next) => {
  // Your login logic here
};

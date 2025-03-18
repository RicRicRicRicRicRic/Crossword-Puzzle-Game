//controllers/authController.js
const db = require('../config/db');

exports.register = async (req, res, next) => {
  const { player_name, password, email } = req.body;
  try {

    const [existing] = await db.query(
      'SELECT * FROM player_account WHERE player_name = ? OR email = ?',
      [player_name, email]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        error: 'A user already has that username or email already exists',
      });
    }

    const result = await db.query(
      'INSERT INTO player_account (player_name, password, email) VALUES (?, ?, ?)',
      [player_name, password, email]
    );

    const newAccID = result[0].insertId;
    return res
      .status(201)
      .json({ message: 'Registration was successful!', acc_ID: newAccID });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

exports.login = async (req, res, next) => {

};

//controllers/authController.js
const db = require('../config/db');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.query(
      'SELECT * FROM player_account WHERE player_name = ? OR email = ?',
      [username, username]
    );

    console.log('Users found:', users);

    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const payload = {
      acc_ID: user.acc_ID,
      player_name: user.player_name,
      email: user.email,
    };
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const options = { expiresIn: '1h' };

    const token = jwt.sign(payload, secret, options);
    
    res.json({ user, token });
  } catch (error) {
    logger.error(error, 'Unexpected error in login');
    next(error);
  }
};

exports.register = async (req, res, next) => {
  const { player_name, password, email } = req.body;
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [existing] = await connection.query(
      "SELECT player_name, email FROM player_account WHERE player_name = ? OR email = ? FOR UPDATE",
      [player_name, email]
    );

    if (existing.length) {
      if (existing.some(user => user.email === email && user.player_name === player_name)) {
        await connection.rollback();
        return res.status(400).json({ error: "Email and Username are already taken" });
      }
      if (existing.some(user => user.player_name === player_name)) {
        await connection.rollback();
        return res.status(400).json({ error: "Username is already taken" });
      }
      if (existing.some(user => user.email === email)) {
        await connection.rollback();
        return res.status(400).json({ error: "Email is already in use" });
      }
    }

    const [[{ maxId } = {}]] = await connection.query(
      "SELECT MAX(CAST(SUBSTRING(acc_ID, 5) AS UNSIGNED)) AS maxId FROM player_account FOR UPDATE"
    );
    const nextId = (maxId || 0) + 1;
    const acc_ID = `acc_${nextId}`;

    const [result] = await connection.query(
      "INSERT INTO player_account (acc_ID, player_name, password, email) VALUES (?, ?, ?, ?)",
      [acc_ID, player_name, password, email]
    );
    await connection.commit();

    res.status(201).json({ message: "Registration was successful!", acc_ID });
  } catch (error) {
    if (connection) await connection.rollback();
    logger.error(error, "Unexpected error in registration");
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

//controllers/crosswordController.js
const db = require('../config/db');
const logger = require('../utils/logger');

exports.saveGame = async (req, res, next) => {
  let connection = null; // Declare connection with an initial null value
  try {
    const acc_ID = req.user.acc_ID;
    const { player_name, grid_size, grid_cell_numbers, grid_letters, def_Across_data, def_Down_data, grid_timer } = req.body;

    connection = await db.getConnection();

    // Begin a transaction if needed
    const [[{ maxId } = {}]] = await connection.query(
      "SELECT MAX(CAST(SUBSTRING(game_ID, 6) AS UNSIGNED)) AS maxId FROM crossword_game FOR UPDATE"
    );
    const nextId = (maxId || 0) + 1;
    const game_ID = `game_${nextId}`;

    await connection.query(
      `INSERT INTO crossword_game (
         game_ID,
         acc_ID,
         grid_size,
         grid_cell_numbers,
         grid_letters,
         def_Across_data,
         def_Down_data,
         grid_timer
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        game_ID,
        acc_ID,
        grid_size,
        JSON.stringify(grid_cell_numbers),
        JSON.stringify(grid_letters),
        JSON.stringify(def_Across_data),
        JSON.stringify(def_Down_data),
        grid_timer
      ]
    );

    res.json({ success: true, message: 'Game saved successfully!' });
  } catch (error) {
    logger.error(error, "Error saving game");
    res.status(500).json({ success: false, error: 'Error saving game.' });
    // Depending on your error-handling strategy, you may or may not call next(error) after sending a response.
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
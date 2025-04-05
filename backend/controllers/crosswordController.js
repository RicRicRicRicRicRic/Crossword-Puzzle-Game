//controllers/crosswordController.js
const db = require('../config/db');
const logger = require('../utils/logger');

function hasConflictFromPlacedWords(placedWords, gridSize) {
  const cells = Array.from({ length: gridSize * gridSize }, () => []);
  
  placedWords.forEach(word => {
    for (let i = 0; i < word.word.length; i++) {
      const row = word.position.row + (word.category === 'down' ? i : 0);
      const col = word.position.col + (word.category === 'across' ? i : 0);
      if (row < gridSize && col < gridSize) {
        const cellIndex = row * gridSize + col;
        cells[cellIndex].push(word.word[i]);
      }
    }
  });
  
  return cells.some(cell =>
    cell.length > 1 && !cell.every(letter => letter.toLowerCase() === cell[0].toLowerCase())
  );
}

exports.saveGame = async (req, res, next) => {
  let connection = null;
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized: No user data.' });
    }
    const acc_ID = req.user.acc_ID;
    const { 
      grid_size, 
      grid_cell_numbers, 
      grid_letters, 
      def_Across_data, 
      def_Down_data, 
      grid_timer, 
      placedWords,
      game_name
    } = req.body;
    
    if (!game_name || !game_name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Game name is required.'
      });
    }
    
    const hasLetters = JSON.parse(JSON.stringify(grid_letters)).some(row => row.some(cell => cell !== null));
    
    if (!hasLetters) {
      return res.status(400).json({
        success: false,
        error: 'Error: crossword game cannot be empty!'
      });
    }
    
    if (hasConflictFromPlacedWords(placedWords, grid_size)) {
      return res.status(400).json({
        success: false,
        error: 'Grid contains conflicts. Please resolve them before saving.'
      });
    }
    
    connection = await db.getConnection();
    
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
         grid_timer,
         game_name
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        game_ID,
        acc_ID,
        grid_size,
        JSON.stringify(grid_cell_numbers),
        JSON.stringify(grid_letters),
        JSON.stringify(def_Across_data),
        JSON.stringify(def_Down_data),
        grid_timer,
        game_name.trim()
      ]
    );
    
    res.json({ success: true, message: 'Game saved successfully!' });
  } catch (error) {
    logger.error(error, "Error saving game");
    res.status(500).json({ success: false, error: 'Error saving game.' });
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

exports.getAllGames = async (req, res, next) => {
  try {
    const [games] = await db.query(`
      SELECT 
        cg.game_ID,
        cg.game_name,
        cg.grid_size,
        cg.grid_timer as time,
        pa.player_name as created_by,
        pa.profile_img,
        cg.created_at
      FROM 
        crossword_game cg
      JOIN 
        player_account pa ON cg.acc_ID = pa.acc_ID
      ORDER BY 
        cg.created_at DESC
    `);
    
    res.json(games);
  } catch (error) {
    logger.error(error, 'Error fetching games');
    next(error);
  }
};

exports.getGameById = async (req, res, next) => {
  try {
    const gameId = req.params.id;
    
    const [games] = await db.query(`
      SELECT 
        cg.*,
        pa.player_name as created_by,
        pa.profile_img
      FROM 
        crossword_game cg
      JOIN 
        player_account pa ON cg.acc_ID = pa.acc_ID
      WHERE
        cg.game_ID = ?
    `, [gameId]);
    
    if (!games.length) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json(games[0]);
  } catch (error) {
    logger.error(error, 'Error fetching game');
    next(error);
  }
};
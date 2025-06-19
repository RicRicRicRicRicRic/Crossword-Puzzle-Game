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
        cg.created_at,
        cg.finished_players
      FROM
        crossword_game cg
      JOIN
        player_account pa ON cg.acc_ID = pa.acc_ID
      ORDER BY
        cg.created_at DESC
    `);

    // Parse finished_players for each game
    const gamesWithParsedFinishedPlayers = games.map(game => {
      // Check if finished_players is a string and not null/undefined
      if (typeof game.finished_players === 'string' && game.finished_players !== null) {
        try {
          // Attempt to parse the JSON string
          game.finished_players = JSON.parse(game.finished_players);
        } catch (e) {
          // Log error if parsing fails and set to empty array or null
          logger.error(`Failed to parse finished_players JSON for game_ID: ${game.game_ID}`, e);
          game.finished_players = null; // Or [] based on desired default
        }
      } else {
        // If it's already an array or null, keep it as is
        game.finished_players = game.finished_players || null; // Ensure it's null if undefined
      }
      return game;
    });

    res.json(gamesWithParsedFinishedPlayers);
  } catch (error) {
    logger.error(error, 'Error fetching games');
    next(error);
  }
};

exports.aboutGame = async (req, res, next) => {
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

    const game = games[0];
    // Parse finished_players for the single game being fetched
    if (typeof game.finished_players === 'string' && game.finished_players !== null) {
      try {
        game.finished_players = JSON.parse(game.finished_players);
      } catch (e) {
        logger.error(`Failed to parse finished_players JSON for game_ID: ${game.game_ID}`, e);
        game.finished_players = null;
      }
    } else {
      game.finished_players = game.finished_players || null;
    }

    res.json(game);
  } catch (error) {
    logger.error(error, 'Error fetching game');
    next(error);
  }
};

exports.startGame = async (req, res, next) => {
  try {
    const gameId = req.params.id;
    const [results] = await db.query(`
      SELECT
        grid_size,
        grid_letters,
        grid_cell_numbers,
        def_Across_data,
        def_Down_data,
        grid_timer
      FROM
        crossword_game
      WHERE
        game_ID = ?
    `, [gameId]);

    if (!results.length) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const { grid_size, grid_letters, grid_cell_numbers, def_Across_data, def_Down_data, grid_timer } = results[0];

    console.log("Raw data from DB: ", {
      grid_size,
      grid_letters,
      grid_cell_numbers,
      def_Across_data,
      def_Down_data,
      grid_timer
    });

    const parsedData = {
      gridLetters: grid_letters,
      gridCellNumbers: grid_cell_numbers,
      defAcrossData: def_Across_data,
      defDownData: def_Down_data
    };

    console.log("Parsed data before processing: ", parsedData);

    function safeJsonParse(data) {
      return typeof data === 'string' ? JSON.parse(data) : data;
    }

    parsedData.gridLetters = safeJsonParse(grid_letters);
    parsedData.gridCellNumbers = safeJsonParse(grid_cell_numbers);
    parsedData.defAcrossData = safeJsonParse(def_Across_data);
    parsedData.defDownData = safeJsonParse(def_Down_data);

    res.json({
      success: true,
      game: {
        gridSize: grid_size,
        gridLetters: parsedData.gridLetters,
        gridCellNumbers: parsedData.gridCellNumbers,
        definitionsAcross: parsedData.defAcrossData,
        definitionsDown: parsedData.defDownData,
        gridTimer: grid_timer
      }
    });

  } catch (error) {
    console.error("Error starting game:", error);
    res.status(500).json({ success: false, error: 'Error starting game.' });
    next(error);
  }
};

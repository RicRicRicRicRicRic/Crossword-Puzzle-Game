//controllers/rankController.js
const db = require('../config/db');
const logger = require('../utils/logger');

function safeJsonParse(data) {
  return typeof data === 'string' ? JSON.parse(data) : data;
}

exports.saveScore = async (req, res, next) => {
  let connection = null;
  try {
    const { gameId, score, timeLeft, userId } = req.body;
    
    if (gameId == null || score == null || userId == null) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required data: gameId, score, and userId are required' 
        });
      }
      

    connection = await db.getConnection();
    await connection.beginTransaction();

    // Check if game exists
    const [games] = await connection.query(
      'SELECT game_ID, finished_players FROM crossword_game WHERE game_ID = ?', 
      [gameId]
    );

    if (!games.length) {
      await connection.rollback();
      return res.status(404).json({ success: false, error: 'Game not found' });
    }

    const game = games[0];
    // Use safeJsonParse to avoid JSON parsing errors
    const finishedPlayers = game.finished_players ? safeJsonParse(game.finished_players) : [];
    
    // Check if player has already finished this game
    if (finishedPlayers.some(player => player.acc_ID === userId)) {
      await connection.rollback();
      return res.status(409).json({ 
        success: false, 
        error: 'You have already completed this game' 
      });
    }

    // Add player to finished_players
    const playerData = {
      acc_ID: userId,
      score,
      timeLeft,
      completedAt: new Date().toISOString()
    };
    
    finishedPlayers.push(playerData);

    // Update the game's finished_players
    await connection.query(
      'UPDATE crossword_game SET finished_players = ? WHERE game_ID = ?',
      [JSON.stringify(finishedPlayers), gameId]
    );

    // Update leaderboard
    await connection.query(
      'UPDATE leaderboards SET Total_Score = Total_Score + ?, games_completed = games_completed + 1 WHERE acc_ID = ?',
      [score, userId]
    );

    await connection.commit();
    
    return res.json({ 
      success: true, 
      message: 'Score saved successfully',
      totalScore: score,
      gameId
    });
    
  } catch (error) {
    if (connection) await connection.rollback();
    logger.error(error, 'Error saving score');
    // Return the response without calling next() to avoid sending headers twice.
    return res.status(500).json({ success: false, error: 'Error saving score' });
  } finally {
    if (connection) connection.release();
  }
};

exports.showLeaderboards = async (req, res, next) => {
  try {
    const [leaderboards] = await db.query(`
      SELECT 
        l.acc_ID,
        p.player_name,
        p.profile_img,
        l.Total_Score,
        l.games_completed
      FROM leaderboards l
      JOIN player_account p ON l.acc_ID = p.acc_ID
      ORDER BY l.Total_Score DESC
    `);
    
    res.json(leaderboards);
  } catch(error) {
    logger.error(error, 'Error fetching leaderboards');
    next(error);
  }
};
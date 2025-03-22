//controllers/profileController.js
const db = require('../config/db');
const logger = require('../utils/logger');

exports.updateProfile = async (req, res, next) => {
  const { acc_ID, player_name, email, password } = req.body;
  try {
    // Update the user's profile in the database using a parameterized query.
    const [result] = await db.query(
      "UPDATE player_account SET player_name = ?, email = ?, password = ? WHERE acc_ID = ?",
      [player_name, email, password, acc_ID]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ message: "Profile updated successfully!" });
  } catch (error) {
    logger.error(error, "Error updating profile");
    next(error);
  }
};

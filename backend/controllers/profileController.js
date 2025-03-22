//controllers/profileController.js
const db = require('../config/db');
const logger = require('../utils/logger');
const sharp = require('sharp'); 

exports.updateProfile = async (req, res, next) => {
  let { acc_ID, player_name, email, password, profile_img } = req.body;
  try {
    if (profile_img) {
      const base64Data = profile_img.replace(/^data:image\/\w+;base64,/, "");
      const imgBuffer = Buffer.from(base64Data, 'base64');
      
      const compressedBuffer = await sharp(imgBuffer)
        .resize({ width: 800 }) 
        .jpeg({ quality: 70 })  
        .toBuffer();
      profile_img = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
    }

    const [result] = await db.query(
      "UPDATE player_account SET player_name = ?, email = ?, password = ?, profile_img = ? WHERE acc_ID = ?",
      [player_name, email, password, profile_img, acc_ID]
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

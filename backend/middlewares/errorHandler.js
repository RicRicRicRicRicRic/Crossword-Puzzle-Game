//middlewares/errorHandler.js
// errorHandler.js
module.exports = (err, req, res, next) => {
  const r = req.body; 

  if (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  } else {
    next();
  }
};

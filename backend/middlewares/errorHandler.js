//middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
    req.log.error(err, 'Unhandled error occurred'); r
    res.status(500).json({ error: 'An unexpected error occurred' });
  };
  
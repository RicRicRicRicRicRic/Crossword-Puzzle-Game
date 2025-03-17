module.exports = (err, res, req, next) => {
    console.error(err)
    res.status(err.status || 500).json({error: err.message || 'Internal Server Error'});
};
// config/db.js
const mysql = require('mysql2');
const config = require('./config').db;

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

pool.promise().getConnection()
  .then(connection => {
    console.log('Connected to database!');
    connection.release();
  })
  .catch(error => {
    console.error('Error connecting to database:', error);
  });

module.exports = pool.promise();

// server.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const config = require('./config/config');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const httpLogger = require('./middlewares/pinoHttpLogger'); 

const app = express();

// Use the pino-http middleware
app.use(httpLogger);

// Helmet for security
app.use(helmet());

// Other middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', authRoutes);

// Confirm if server is running
app.get('/', (req, res) => {
  res.send('Express Server is Running');
});

// Error handling middleware should be last
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});

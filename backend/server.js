//server.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const config = require('./config/config');
const registerRoutesRoutes = require('./routes/registerRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();


// helmet for security
app.use(helmet());

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', registerRoutesRoutes);

// Confirm if server is running
app.get('/', (req, res) => {
  res.send('Express Server is Running');
});

// Error handling from middlewares
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});

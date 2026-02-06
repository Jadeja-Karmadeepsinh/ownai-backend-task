const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

app.use(express.json());

// Basic logging 
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

module.exports = app;


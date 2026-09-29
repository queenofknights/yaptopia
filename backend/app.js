const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/logger');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bottleRoutes = require('./routes/bottleRoutes');

const app = express();

// Middleware
app.use(helmet());

app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true, // Required for secure cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bottles', bottleRoutes);

// Unhandled Route Fallback
app.all('/{*splat}', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  err.isOperational = true;
  next(err);
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
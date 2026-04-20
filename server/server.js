const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/nutrition', require('./src/routes/nutritionRoutes'));
app.use('/api/recipes', require('./src/routes/recipeRoutes'));
app.use('/api/activity', require('./src/routes/activityRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));
app.use('/api/stats', require('./src/routes/statsRoutes'));

app.get('/', (req, res) => {
  res.send('Protus API is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong on the server'
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

module.exports = app;


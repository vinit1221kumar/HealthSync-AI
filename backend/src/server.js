require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const mealRoutes = require('./routes/mealRoutes');
const poseRoutes = require('./routes/poseRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middlewares
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HealthSync AI Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      health: '/api/health',
      ai: '/api/ai',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/pose', poseRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🏥 HealthSync AI Backend Server     ║
║   🚀 Server running on port ${PORT}     ║
║   🌍 Environment: ${config.nodeEnv.padEnd(11)}║
║   📊 API: http://localhost:${PORT}      ║
╚═══════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

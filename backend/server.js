const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: './config.env' });
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/passwords');

const app = express();

// Improved CORS configuration for mobile compatibility
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    // Allow specific origins
    const allowedOrigins = [
      'https://passm.vercel.app',
      'https://passm-frontend.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all for now, but log blocked origins
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin')} - User-Agent: ${req.get('User-Agent')}`);
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.json({ 
    message: 'PassM API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    cors: 'enabled'
  });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API test successful',
    cookies: req.cookies,
    headers: {
      origin: req.get('Origin'),
      userAgent: req.get('User-Agent'),
      accept: req.get('Accept')
    },
    timestamp: new Date().toISOString()
  });
});

console.log('Loaded MONGODB_URI:', process.env.MONGODB_URI);
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for Vercel serverless functions
module.exports = app;
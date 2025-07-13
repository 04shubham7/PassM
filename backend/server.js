const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: './config.env' });
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/passwords');

const app = express();
const corsOptions = {
  origin: true, // Allow all origins for deployment troubleshooting
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('PassM API is running');
});
console.log('Loaded MONGODB_URI:', process.env.MONGODB_URI);
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);

const PORT = process.env.PORT || 5000;

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for Vercel serverless functions
module.exports = app;
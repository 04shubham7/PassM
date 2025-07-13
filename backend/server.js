const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/passwords');

const app = express();
app.use(cors({
  origin: [
    'https://pass-m-3itr.vercel.app', // your deployed frontend URL
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://shubham1230101130:tBc3kiQrDkXdq7nk@cluster0.tbrbsay.mongodb.net/PassM", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('PassM API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);

const PORT = process.env.PORT || 5000;

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for Vercel serverless functions
module.exports = app;
const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  username: { type: String },
  password: { type: String, required: true }, // encrypted with AES
}, { timestamps: true });

module.exports = mongoose.model('Password', passwordSchema); 
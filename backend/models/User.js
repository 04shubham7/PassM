const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
  pendingEmail: { type: String },
  pendingEmailOtp: { type: String },
  pendingEmailOtpExpires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Signup
exports.signup = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format' });
    if (!isValidPassword(password)) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    if (!isValidPhone(phone)) return res.status(400).json({ error: 'Invalid phone number' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, phone, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format' });
    if (!isValidPassword(password)) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret_here', { expiresIn: '1d' });
    
    // Mobile-friendly cookie settings
    const cookieOptions = {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
      sameSite: 'lax', // More permissive for mobile browsers
    };

    // Only set secure in production with HTTPS
    if (process.env.NODE_ENV === 'production' && req.secure) {
      cookieOptions.secure = true;
    }

    console.log('Setting cookie with options:', cookieOptions);
    res.cookie('token', token, cookieOptions);
    
    // Also send token in response body for mobile fallback
    res.json({ 
      message: 'Login successful', 
      userId: user._id,
      token: token // Temporary fallback for mobile
    });
    console.log("login Success----------->")
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ error: err.message });
  }
};

// Helper to generate OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to send OTP email
async function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your PassM OTP',
    text: `Your OTP is: ${otp}`,
  });
}

const otpRateLimit = {};
function canSendOtp(key) {
  const now = Date.now();
  if (!otpRateLimit[key]) otpRateLimit[key] = [];
  otpRateLimit[key] = otpRateLimit[key].filter(ts => now - ts < 60 * 60 * 1000); // 1 hour
  if (otpRateLimit[key].length >= 5) return false;
  otpRateLimit[key].push(now);
  return true;
}

// Update sendOtp to use method and authenticated user
exports.sendOtp = async (req, res) => {
  try {
    // Only allow email method
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const key = user._id.toString();
    if (!canSendOtp(key)) return res.status(429).json({ error: 'Too many OTP requests. Please try again later.' });
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();
    if (!user.email) return res.status(400).json({ error: 'No email registered.' });
    console.log('Attempting to send OTP via email to', user.email, 'OTP:', otp);
    await sendOtpEmail(user.email, otp);
    console.log('OTP sent via email');
    res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({ error: err.message });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    // Get user from JWT, not from email in body
    const user = await User.findById(req.user.userId);
    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ message: 'OTP verified' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkAuth = (req, res) => {
  console.log('CheckAuth - Cookies:', req.cookies);
  console.log('CheckAuth - Headers:', req.headers);
  
  const token = req.cookies.token;
  if (!token) {
    console.log('CheckAuth - No token found in cookies');
    return res.status(401).json({ authenticated: false, error: 'No token found' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
    console.log('CheckAuth - Token verified successfully for user:', decoded.userId);
    res.json({ authenticated: true, userId: decoded.userId });
  } catch (err) {
    console.error('CheckAuth - Token verification failed:', err.message);
    res.status(401).json({ authenticated: false, error: 'Invalid token' });
  }
};

exports.logout = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
  };

  // Only set secure in production with HTTPS
  if (process.env.NODE_ENV === 'production' && req.secure) {
    cookieOptions.secure = true;
  }

  res.clearCookie('token', cookieOptions);
  res.json({ message: 'Logged out' });
};

function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}
function isValidPhone(phone) {
  return !phone || /^\+?[0-9]{10,15}$/.test(phone);
}

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ email: user.email, phone: user.phone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send OTP to new email for email change
exports.sendEmailChangeOtp = async (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!isValidEmail(newEmail)) return res.status(400).json({ error: 'Invalid email format' });
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Check if new email is already taken
    if (await User.findOne({ email: newEmail })) return res.status(400).json({ error: 'Email already in use' });
    const otp = generateOtp();
    user.pendingEmail = newEmail;
    user.pendingEmailOtp = otp;
    user.pendingEmailOtpExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();
    await sendOtpEmail(newEmail, otp);
    res.json({ message: 'OTP sent to new email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify OTP and update email
exports.verifyEmailChangeOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user || !user.pendingEmail || !user.pendingEmailOtp || !user.pendingEmailOtpExpires) {
      return res.status(400).json({ error: 'No pending email change' });
    }
    if (user.pendingEmailOtp !== otp || Date.now() > user.pendingEmailOtpExpires) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    // Update email
    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.pendingEmailOtp = undefined;
    user.pendingEmailOtpExpires = undefined;
    await user.save();
    res.json({ message: 'Email updated successfully', email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update profile (without direct email change)
exports.updateProfile = async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format' });
    if (!isValidPhone(phone)) return res.status(400).json({ error: 'Invalid phone number' });
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // If email is changed, require OTP verification
    if (email !== user.email) {
      // Do not update email here, require OTP flow
      return res.status(202).json({ message: 'OTP required for email change', otpRequired: true });
    }
    user.phone = phone;
    await user.save();
    res.json({ message: 'Profile updated', email: user.email, phone: user.phone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!isValidPassword(newPassword)) return res.status(400).json({ error: 'New password must be at least 8 characters' });
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 
module.exports = (req, res, next) => {
  if (!req.user.twofaVerified) {
    return res.status(401).json({ error: '2FA verification required' });
  }
  next();
}; 
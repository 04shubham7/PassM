module.exports = (req, res, next) => {
  req.user.twofaVerified = req.headers['x-2fa-verified'] === 'true';
  next();
}; 
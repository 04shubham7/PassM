const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = null;
  
  // Prefer cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('Token found in cookies');
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token found in Authorization header');
  }
  
  if (!token) {
    console.log('No token found in cookies or headers');
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
    req.user = decoded;
    console.log('Token verified successfully for user:', decoded.userId);
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
}; 
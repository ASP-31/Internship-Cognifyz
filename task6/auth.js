// auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header (Format: Bearer <token>)
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access Denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Injects payload (e.g., { id: "..." }) into the request object
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid or expired token.' });
  }
};
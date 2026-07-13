// routes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('./User');
const verifyToken = require('./auth');

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post(
  '/signup',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      user = new User({ name, email, password });
      await user.save();

      res.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid Credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid Credentials' });
      }

      // Generate JWT
      const payload = { id: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ success: true, token: `Bearer ${token}` });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/auth/dashboard
// @desc    A secure endpoint accessible only with a valid token
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    // req.user.id is pulled cleanly out of the decoded JWT payload
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      message: `Welcome to the secure dashboard, ${user.name}! Data access granted.`,
      user
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateBody, schemas } = require('../validation');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

// POST /api/auth/register
router.post('/register', validateBody(schemas.register), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    return res.status(201).json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email, stats: user.stats },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Could not create account' });
  }
});

// POST /api/auth/login
router.post('/login', validateBody(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email, stats: user.stats },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Could not log in' });
  }
});

module.exports = router;

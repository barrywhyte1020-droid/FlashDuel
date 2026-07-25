const express = require('express');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// GET /api/leaderboard/global  -> top users by wins, tie-broken by streak
router.get('/global', async (req, res) => {
  const users = await User.find({})
    .select('name avatarColor stats')
    .sort({ 'stats.wins': -1, 'stats.bestStreak': -1 })
    .limit(50);
  res.json(users);
});

module.exports = router;

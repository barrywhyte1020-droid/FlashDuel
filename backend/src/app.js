const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const deckRoutes = require('./routes/decks');
const duelRoutes = require('./routes/duels');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

// Auth routes are the most brute-forceable surface (login/register) — cap
// them tighter than the rest of the API.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in a few minutes.' },
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'flashduel-api' }));
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/decks', deckRoutes);
app.use('/api/duels', duelRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

module.exports = app;

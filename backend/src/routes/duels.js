const express = require('express');
const { nanoid } = require('nanoid');
const Duel = require('../models/Duel');
const Deck = require('../models/Deck');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');
const { computeScore } = require('../scoring');
const { validateBody, schemas } = require('../validation');

const router = express.Router();
router.use(requireAuth);

// POST /api/duels  -> host creates a duel on one of their decks
router.post('/', validateBody(schemas.createDuel), async (req, res) => {
  const { deckId, mode, secondsPerCard } = req.body;
  const deck = await Deck.findById(deckId);
  if (!deck) return res.status(404).json({ error: 'Deck not found' });
  if (!deck.cards.length) {
    return res.status(400).json({ error: 'Deck needs at least one card to start a duel' });
  }

  const duel = await Duel.create({
    code: nanoid(6).toUpperCase(),
    deck: deck._id,
    host: req.userId,
    mode: mode === 'live' ? 'live' : 'async',
    secondsPerCard: secondsPerCard || 15,
    players: [{ user: req.userId, joinedAt: new Date() }],
  });

  res.status(201).json(duel);
});

// POST /api/duels/join/:code  -> a friend joins with the invite code
router.post('/join/:code', async (req, res) => {
  const duel = await Duel.findOne({ code: req.params.code.toUpperCase() });
  if (!duel) return res.status(404).json({ error: 'No duel found with that code' });
  if (duel.status === 'completed') {
    return res.status(400).json({ error: 'This duel has already finished' });
  }

  const already = duel.players.find((p) => p.user.toString() === req.userId);
  if (!already) {
    if (duel.players.length >= 2) {
      return res.status(400).json({ error: 'This duel already has two players' });
    }
    duel.players.push({ user: req.userId, joinedAt: new Date() });
    duel.status = 'in_progress';
    await duel.save();
  }

  res.json(duel);
});

// GET /api/duels/:id
router.get('/:id', async (req, res) => {
  const duel = await Duel.findById(req.params.id)
    .populate('deck')
    .populate('players.user', 'name avatarColor');
  if (!duel) return res.status(404).json({ error: 'Duel not found' });
  res.json(duel);
});

// POST /api/duels/:id/submit  -> a player submits their completed round
// body: { answers: [{ cardId, correct, responseTimeMs }] }
router.post('/:id/submit', validateBody(schemas.submitDuel), async (req, res) => {
  const duel = await Duel.findById(req.params.id);
  if (!duel) return res.status(404).json({ error: 'Duel not found' });

  const player = duel.players.find((p) => p.user.toString() === req.userId);
  if (!player) return res.status(403).json({ error: 'You are not part of this duel' });

  const { answers } = req.body;
  const { score, accuracy, avgResponseTimeMs } = computeScore(answers || []);

  player.answers = answers || [];
  player.score = score;
  player.accuracy = accuracy;
  player.avgResponseTimeMs = avgResponseTimeMs;
  player.finishedAt = new Date();

  const bothDone = duel.players.length === 2 && duel.players.every((p) => p.finishedAt);
  if (bothDone) {
    duel.status = 'completed';
    const [a, b] = duel.players;
    duel.winner = a.score === b.score ? null : (a.score > b.score ? a.user : b.user);
    await updateStatsForDuel(duel);
  }

  await duel.save();
  res.json(duel);
});

async function updateStatsForDuel(duel) {
  const [a, b] = duel.players;
  for (const p of duel.players) {
    const user = await User.findById(p.user);
    if (!user) continue;
    user.stats.totalDuels += 1;
    const won = duel.winner && duel.winner.toString() === p.user.toString();
    if (won) {
      user.stats.wins += 1;
      user.stats.currentStreak += 1;
      user.stats.bestStreak = Math.max(user.stats.bestStreak, user.stats.currentStreak);
    } else if (duel.winner) {
      user.stats.losses += 1;
      user.stats.currentStreak = 0;
    }
    await user.save();
  }
}

module.exports = router;

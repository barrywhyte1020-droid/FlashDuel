const express = require('express');
const { nanoid } = require('nanoid');
const Deck = require('../models/Deck');
const requireAuth = require('../middleware/auth');
const { validateBody, schemas } = require('../validation');

const router = express.Router();
router.use(requireAuth);

// GET /api/decks  -> decks owned by the current user
router.get('/', async (req, res) => {
  const decks = await Deck.find({ owner: req.userId }).sort({ updatedAt: -1 });
  res.json(decks);
});

// GET /api/decks/public?search=  -> browse shared decks
router.get('/public', async (req, res) => {
  const search = req.query.search || '';
  const decks = await Deck.find({
    isPublic: true,
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } },
    ],
  })
    .limit(50)
    .populate('owner', 'name');
  res.json(decks);
});

// GET /api/decks/:id
router.get('/:id', async (req, res) => {
  const deck = await Deck.findById(req.params.id);
  if (!deck) return res.status(404).json({ error: 'Deck not found' });
  res.json(deck);
});

// POST /api/decks
router.post('/', validateBody(schemas.createDeck), async (req, res) => {
  const { title, subject, description, color } = req.body;
  const deck = await Deck.create({
    title,
    subject,
    description,
    color,
    owner: req.userId,
    cards: [],
  });
  res.status(201).json(deck);
});

// PATCH /api/decks/:id  -> update deck metadata / sharing
router.patch('/:id', validateBody(schemas.updateDeck), async (req, res) => {
  const deck = await Deck.findOne({ _id: req.params.id, owner: req.userId });
  if (!deck) return res.status(404).json({ error: 'Deck not found' });

  const { title, subject, description, color, isPublic } = req.body;
  if (title !== undefined) deck.title = title;
  if (subject !== undefined) deck.subject = subject;
  if (description !== undefined) deck.description = description;
  if (color !== undefined) deck.color = color;
  if (isPublic !== undefined) {
    deck.isPublic = isPublic;
    if (isPublic && !deck.shareCode) deck.shareCode = nanoid(8);
  }

  await deck.save();
  res.json(deck);
});

// DELETE /api/decks/:id
router.delete('/:id', async (req, res) => {
  const deck = await Deck.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  if (!deck) return res.status(404).json({ error: 'Deck not found' });
  res.json({ success: true });
});

// ---- Cards (embedded in the deck) ----

// POST /api/decks/:id/cards
router.post('/:id/cards', validateBody(schemas.card), async (req, res) => {
  const deck = await Deck.findOne({ _id: req.params.id, owner: req.userId });
  if (!deck) return res.status(404).json({ error: 'Deck not found' });

  const { question, answer, hint } = req.body;
  deck.cards.push({ question, answer, hint });
  await deck.save();
  res.status(201).json(deck);
});

// PATCH /api/decks/:id/cards/:cardId
router.patch('/:id/cards/:cardId', validateBody(schemas.card.partial()), async (req, res) => {
  const deck = await Deck.findOne({ _id: req.params.id, owner: req.userId });
  if (!deck) return res.status(404).json({ error: 'Deck not found' });

  const card = deck.cards.id(req.params.cardId);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  const { question, answer, hint } = req.body;
  if (question !== undefined) card.question = question;
  if (answer !== undefined) card.answer = answer;
  if (hint !== undefined) card.hint = hint;

  await deck.save();
  res.json(deck);
});

// DELETE /api/decks/:id/cards/:cardId
router.delete('/:id/cards/:cardId', async (req, res) => {
  const deck = await Deck.findOne({ _id: req.params.id, owner: req.userId });
  if (!deck) return res.status(404).json({ error: 'Deck not found' });

  deck.cards.id(req.params.cardId)?.deleteOne();
  await deck.save();
  res.json(deck);
});

// PATCH /api/decks/:id/cards/:cardId/review -> Leitner box update after Study Mode review
router.patch('/:id/cards/:cardId/review', validateBody(schemas.cardReview), async (req, res) => {
  const deck = await Deck.findOne({ _id: req.params.id, owner: req.userId });
  if (!deck) return res.status(404).json({ error: 'Deck not found' });

  const card = deck.cards.id(req.params.cardId);
  if (!card) return res.status(404).json({ error: 'Card not found' });

  const { correct } = req.body;
  if (correct) {
    card.box = Math.min(5, card.box + 1);
    card.timesCorrect += 1;
  } else {
    card.box = 1;
    card.timesWrong += 1;
  }
  card.lastReviewedAt = new Date();

  await deck.save();
  res.json(card);
});

module.exports = router;

const mongoose = require('mongoose');

// Cards are embedded documents inside a Deck (see Deck.js). This schema
// is exported separately so it can be reused / validated independently
// (e.g. from the card-editor routes) without duplicating field defs.
const CardSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    hint: { type: String, trim: true, default: '' },
    // spaced-repetition bookkeeping for solo Study Mode
    box: { type: Number, default: 1, min: 1, max: 5 }, // Leitner box 1-5
    lastReviewedAt: { type: Date, default: null },
    timesCorrect: { type: Number, default: 0 },
    timesWrong: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = CardSchema;

const mongoose = require('mongoose');

const PlayerResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    joinedAt: { type: Date, default: null },
    finishedAt: { type: Date, default: null },
    answers: [
      {
        cardId: { type: mongoose.Schema.Types.ObjectId },
        correct: { type: Boolean, default: false },
        responseTimeMs: { type: Number, default: 0 },
      },
    ],
    accuracy: { type: Number, default: 0 }, // 0-1
    avgResponseTimeMs: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
  },
  { _id: false }
);

const DuelSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // short invite code
    deck: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mode: { type: String, enum: ['async', 'live'], default: 'async' },
    secondsPerCard: { type: Number, default: 15 },
    status: {
      type: String,
      enum: ['waiting', 'in_progress', 'completed', 'expired'],
      default: 'waiting',
    },
    players: [PlayerResultSchema],
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Duel', DuelSchema);

const mongoose = require('mongoose');
const CardSchema = require('./Card');

const DeckSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    color: { type: String, default: '#5B4FE9' }, // accent color shown on the deck tile
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: false }, // deck sharing toggle
    shareCode: { type: String, unique: true, sparse: true },
    cards: [CardSchema],
  },
  { timestamps: true }
);

DeckSchema.virtual('cardCount').get(function () {
  return this.cards.length;
});
DeckSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Deck', DeckSchema);

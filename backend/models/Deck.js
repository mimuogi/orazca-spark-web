const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
});

const DeckSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: String,
  format: { type: String, default: 'Casual' }, // ej: Commander, Modern
  mainboard: [CardSchema],
  sideboard: [CardSchema],
  maybeboard: [CardSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Deck', DeckSchema);


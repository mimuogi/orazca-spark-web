const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
});

const DeckSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: {type:String,},
  coverImage: { type: String, required: false },
  format: { type: String, default: 'Casual' }, // ej: Commander, Modern
  mainboard: [CardSchema],
  sideboard: [CardSchema],
  maybeboard: [CardSchema],
  commander: [CardSchema],
  status: {
    type: String,
    enum: ['public', 'private', 'draft'],
    default: 'draft',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: {type: Date, default: Date.now },
});

module.exports = mongoose.model('Deck', DeckSchema);


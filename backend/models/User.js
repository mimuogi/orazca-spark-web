const mongoose = require('mongoose');
const Post = require('./Post');
const Deck = require('./Deck');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// 🧹 Eliminar contenido relacionado antes de borrar el usuario
UserSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const userId = this._id;

  await Post.deleteMany({ authorId: userId });
  await Deck.deleteMany({ userId });

  await Post.updateMany(
    { 'votes.userId': userId },
    { $pull: { votes: { userId } } }
  );

  await Post.updateMany(
    { 'comments.userId': userId },
    { $pull: { comments: { userId } } }
  );

  next();
});

module.exports = mongoose.model('User', UserSchema);
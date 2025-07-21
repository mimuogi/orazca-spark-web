const mongoose = require('mongoose');
const Post = require('./Post');
const Deck = require('./Deck');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  favoritePosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  favoriteDecks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deck' }],
  profilePicture: { type: String, default: 'default-profile.png' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  birthday: { type: Date, default: null },
  socialLinks: {
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

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

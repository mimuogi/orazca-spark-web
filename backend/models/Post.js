const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const VoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  value: { type: String, enum: ['like', 'dislike'] }
}, { _id: false });

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coverImage: { type: String, required: false },
  contentMarkdown: { type: String, required: true },
  tags: [String],
  votes: [VoteSchema],
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);

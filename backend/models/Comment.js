const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date },
  deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Comment', CommentSchema);

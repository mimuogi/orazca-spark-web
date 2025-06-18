const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { verifyToken } = require('../middleware/authMiddleware');
const { updateVoteCounts } = require('../utils/voteUtils');

const slugify = (str) =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');

// GET all públicos
router.get('/', async (req, res) => {
  const posts = await Post.find({ status: 'public' })
    .populate('authorId', 'username')
    .sort({ createdAt: -1 });
  res.json(posts);
});

// GET solo del usuario
router.get('/mine', verifyToken, async (req, res) => {
  const posts = await Post.find({ authorId: req.user.userId })
    .populate('authorId', 'username')
    .sort({ createdAt: -1 });
  res.json(posts);
});

// GET por ID
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('authorId', 'username');
  if (!post || post.status !== 'public') {
    return res.status(404).json({ error: 'Post no encontrado o no es público' });
  }
  res.json(post);
});


// CREATE
router.post('/', verifyToken, async (req, res) => {
  try {
    const slug = slugify(req.body.title);
    const post = new Post({
      ...req.body,
      slug,
      authorId: req.user.userId
    });
    const saved = await post.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear post', details: err.message });
  }
});

// UPDATE
router.put('/:id', verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post no encontrado' });
  if (post.authorId.toString() !== req.user.userId) return res.status(403).json({ error: 'No autorizado' });

  Object.assign(post, req.body, { updatedAt: Date.now() });
  await post.save();
  res.json(post);
});

// DELETE
router.delete('/:id', verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post no encontrado' });
  if (post.authorId.toString() !== req.user.userId) return res.status(403).json({ error: 'No autorizado' });

  await post.deleteOne();
  res.json({ message: 'Post eliminado' });
});

// LIKE
router.post('/:id/like', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const post = await Post.findById(req.params.id);
  const existingVote = post.votes.find(v => v.userId.toString() === userId);

  if (existingVote) {
    if (existingVote.value === 'like') return res.status(400).json({ error: 'Ya diste like' });
    existingVote.value = 'like';
  } else {
    post.votes.push({ userId, value: 'like' });
  }

  updateVoteCounts(post);
  await post.save();
  res.json(post);
});

// DISLIKE
router.post('/:id/dislike', verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const post = await Post.findById(req.params.id);
  const existingVote = post.votes.find(v => v.userId.toString() === userId);

  if (existingVote) {
    if (existingVote.value === 'dislike') return res.status(400).json({ error: 'Ya diste dislike' });
    existingVote.value = 'dislike';
  } else {
    post.votes.push({ userId, value: 'dislike' });
  }

  updateVoteCounts(post);
  await post.save();
  res.json(post);
});

// ADD comment
router.post('/:id/comments', verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({
    userId: req.user.userId,
    text: req.body.text
  });
  await post.save();
  res.status(201).json(post);
});

// UPDATE comment
router.put('/:postId/comments/:commentId', verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  const comment = post.comments.id(req.params.commentId);
  if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });
  if (comment.userId.toString() !== req.user.userId) return res.status(403).json({ error: 'No autorizado' });

  comment.text = req.body.text;
  await post.save();
  res.json(post);
});

// DELETE comment
router.delete('/:postId/comments/:commentId', verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  const comment = post.comments.id(req.params.commentId);
  if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });
  if (comment.userId.toString() !== req.user.userId) return res.status(403).json({ error: 'No autorizado' });

  comment.deleteOne();
  await post.save();
  res.json({ message: 'Comentario eliminado' });
});

module.exports = router;

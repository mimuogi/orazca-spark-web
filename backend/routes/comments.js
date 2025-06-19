const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/comments?postId=<id>
router.get('/', async (req, res) => {
  const { postId } = req.query;
  if (!postId) return res.status(400).json({ error: 'postId is required' });

  try {
    const comments = await Comment.find({ postId })
      .sort({ createdAt: 1 })
      .populate('userId', 'username')
      .lean();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/comments
router.post('/', verifyToken, async (req, res) => {
  const { postId, text, parentId = null } = req.body;
  if (!postId || !text?.trim()) {
    return res.status(400).json({ error: 'postId y text son requeridos' });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });

    const comment = new Comment({
      postId,
      userId: req.user.userId,
      parentId,
      text: text.trim(),
    });

    await comment.save();
    return res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al crear comentario' });
  }
});

// PUT /api/comments/:id
router.put('/:id', verifyToken, async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'Texto requerido' });

  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });

    if (comment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'No autorizado para editar este comentario' });
    }

    comment.text = text.trim();
    comment.editedAt = new Date();
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al editar comentario' });
  }
});

// DELETE /api/comments/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });

    const post = await Post.findById(comment.postId);
    const isAuthor = comment.userId.toString() === req.user.userId;
    const isPostOwner = post && post.authorId.toString() === req.user.userId;

    if (!isAuthor && !isPostOwner) {
      return res.status(403).json({ error: 'No autorizado para eliminar este comentario' });
    }

    await comment.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar comentario' });
  }
});

module.exports = router;

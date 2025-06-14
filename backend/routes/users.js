const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Deck = require('../models/Deck');
const { verifyToken } = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Crear usuario (registro)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = new User({ username, email, passwordHash });
    await user.save();
    res.status(201).json({ message: 'Usuario creado correctamente' });
  } catch (err) {
    res.status(400).json({ error: 'Error al registrar usuario', details: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'Credenciales incorrectas' });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

// Obtener perfil publico
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username bio location createdAt profilePicture socialLinks followers following favoritePosts favoriteDecks badges achievements')
      .populate('followers', 'username')
      .populate('following', 'username')
      .populate('favoritePosts', 'title')
      .populate('favoriteDecks', 'title');

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario', details: err.message });
  }
});

// Obtener perfil privado (con token)
router.get('/:id/private', verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const user = await User.findById(req.params.id)
      .select('-passwordHash');

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario', details: err.message });
  }
});



// Editar perfil extendido
router.put('/:id', verifyToken, async (req, res) => {
  const updates = { ...req.body };
  if (updates.password) {
    updates.passwordHash = await bcrypt.hash(updates.password, 10);
    delete updates.password;
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar usuario', details: err.message });
  }
});

// Seguir usuario
router.post('/:id/follow', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    const targetUser = await User.findById(req.params.id);

    if (!targetUser.followers.includes(currentUser._id)) {
      targetUser.followers.push(currentUser._id);
      currentUser.following.push(targetUser._id);
      await targetUser.save();
      await currentUser.save();
    }

    res.json({ message: 'Seguido con éxito' });
  } catch (err) {
    res.status(400).json({ error: 'Error al seguir usuario', details: err.message });
  }
});

// Dejar de seguir usuario
router.post('/:id/unfollow', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    const targetUser = await User.findById(req.params.id);

    targetUser.followers.pull(currentUser._id);
    currentUser.following.pull(targetUser._id);
    await targetUser.save();
    await currentUser.save();

    res.json({ message: 'Dejó de seguir al usuario' });
  } catch (err) {
    res.status(400).json({ error: 'Error al dejar de seguir', details: err.message });
  }
});

// Agregar post a favoritos
router.post('/:id/favoritePost', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { postId } = req.body;
    if (!user.favoritePosts.includes(postId)) {
      user.favoritePosts.push(postId);
      await user.save();
    }
    res.json({ message: 'Post agregado a favoritos' });
  } catch (err) {
    res.status(400).json({ error: 'Error al agregar post', details: err.message });
  }
});

// Eliminar post de favoritos
router.delete('/:id/favoritePost/:postId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.favoritePosts.pull(req.params.postId);
    await user.save();
    res.json({ message: 'Post eliminado de favoritos' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar post', details: err.message });
  }
});

// Agregar deck a favoritos
router.post('/:id/favoriteDeck', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { deckId } = req.body;
    if (!user.favoriteDecks.includes(deckId)) {
      user.favoriteDecks.push(deckId);
      await user.save();
    }
    res.json({ message: 'Deck agregado a favoritos' });
  } catch (err) {
    res.status(400).json({ error: 'Error al agregar deck', details: err.message });
  }
});

// Eliminar deck de favoritos
router.delete('/:id/favoriteDeck/:deckId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.favoriteDecks.pull(req.params.deckId);
    await user.save();
    res.json({ message: 'Deck eliminado de favoritos' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar deck', details: err.message });
  }
});

module.exports = router;


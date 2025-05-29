const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
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

  const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: '7d'
  });

  res.json({ token, username: user.username });
});

// Obtener perfil del usuario autenticado
router.get('/me', verifyToken, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-passwordHash');
  res.json(user);
});

// Actualizar perfil
router.put('/me', verifyToken, async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { username, email },
      { new: true }
    ).select('-passwordHash');
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar usuario', details: err.message });
  }
});

// Eliminar cuenta
router.delete('/me', verifyToken, async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    await user.deleteOne();
    
  res.json({ message: 'Cuenta eliminada' });
});

module.exports = router;

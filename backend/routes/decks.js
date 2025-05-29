const express = require('express');
const router = express.Router();
const Deck = require('../models/Deck');
const { verifyToken } = require('../middleware/authMiddleware');

// GET all
router.get('/', async (req, res) => {
  const decks = await Deck.find().populate('userId', 'username');
  res.json(decks);
});

// GET by ID
router.get('/:id', async (req, res) => {
  const deck = await Deck.findById(req.params.id).populate('userId', 'username');
  if (!deck) return res.status(404).json({ error: 'Mazo no encontrado' });
  res.json(deck);
});

// CREATE
router.post('/', verifyToken, async (req, res) => {
  const newDeck = new Deck({
    ...req.body,
    userId: req.user.userId
  });
  const saved = await newDeck.save();
  res.status(201).json(saved);
});

// UPDATE
router.put('/:id', verifyToken, async (req, res) => {
  const deck = await Deck.findById(req.params.id);
  if (!deck) return res.status(404).json({ error: 'Mazo no encontrado' });
  if (deck.userId.toString() !== req.user.userId) return res.status(403).json({ error: 'No autorizado' });

  Object.assign(deck, req.body);
  await deck.save();
  res.json(deck);
});

// DELETE
router.delete('/:id', verifyToken, async (req, res) => {
  const deck = await Deck.findById(req.params.id);
  if (!deck) return res.status(404).json({ error: 'Mazo no encontrado' });
  if (deck.userId.toString() !== req.user.userId) return res.status(403).json({ error: 'No autorizado' });

  await deck.deleteOne();
  res.json({ message: 'Mazo eliminado' });
});

module.exports = router;

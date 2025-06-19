const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor backend en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err.message);
  });
  

app.get('/', (req, res) => res.send('Orazca Spark API'));

const indexRouter = require('./routes/index');
app.use('/api', indexRouter);
const deckRoutes = require('./routes/decks');
app.use('/api/decks', deckRoutes);
const postsRoutes = require('./routes/posts');
app.use('/api/posts', postsRoutes)
const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const commentRoutes = require('./routes/comments');
app.use('/api/comments', commentRoutes);

const uploadRoutes = require('./routes/uploads');
app.use('/api/uploads', uploadRoutes);
app.use('/uploads', express.static('uploads'));

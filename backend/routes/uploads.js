const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user?.userId;
    const postId = req.body?.postId;

    if (!userId || !postId) {
      return cb(new Error('Missing userId or postId'));
    }

    const destPath = path.join('uploads', userId.toString(), postId.toString());
    fs.mkdirSync(destPath, { recursive: true });
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', verifyToken, upload.array('images'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No se subieron archivos' });
  }
  const userId = req.user.userId;
  const postId = req.body.postId;
  const urls = req.files.map(file => `/uploads/${userId}/${postId}/${file.filename}`);
  res.json({ urls });
});

module.exports = router;

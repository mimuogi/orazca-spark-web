const express = require('express');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const router = express.Router();

router.get('/', (req, res) => {
  // Detectar idioma: 'en' o 'es'
  const langHeader = req.headers['accept-language'] || '';
  const lang = langHeader.startsWith('en') ? 'en' : 'es';

  // Detectar tipo de contenido deseado
  const accept = req.headers['accept'] || '';
  const wantsMarkdown = accept.includes('text/markdown');
  const wantsHtml = accept.includes('text/html');

  const mdPath = path.join(__dirname, '..', 'docs', lang, 'OrazcaSpark_API.md');

  fs.readFile(mdPath, 'utf8', (err, markdown) => {
    if (err) {
      return res.status(500).send('⚠️ Error loading documentation file');
    }

    if (wantsMarkdown) {
      res.setHeader('Content-Type', 'text/markdown');
      return res.send(markdown);
    }

    if (wantsHtml || accept === '*/*') {
      const html = marked.parse(markdown);
      return res.send(`
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Orazca Spark API</title>
            <style>
              body { font-family: sans-serif; max-width: 800px; margin: 2rem auto; padding: 1rem; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ccc; padding: 8px; }
              pre { background: #f4f4f4; padding: 10px; }
              code { font-family: monospace; background: #eee; padding: 2px 4px; border-radius: 4px; }
            </style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `);
    }

    // Fallback para formatos no soportados
    res.status(406).send('Supported formats: text/html, text/markdown');
  });
});

module.exports = router;

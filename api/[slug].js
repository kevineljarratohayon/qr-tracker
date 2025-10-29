const fetch = require('node-fetch');      // CommonJS
const links = require('./links.json');   // CommonJS

const LOG_ENDPOINT = process.env.LOG_ENDPOINT;

module.exports = async function handler(req, res) {
  const { slug } = req.query;
  const target = links[slug];

  if (!target) {
    res.status(404).send('Not found');
    return;
  }

  // Información del visitante
  const ua = req.headers['user-agent'] || '';
  const ref = req.headers['referer'] || '';
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

  // Enviar log a Google Apps Script
  try {
    await fetch(LOG_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, target, userAgent: ua, referrer: ref })
    });
  } catch (err) {
    console.error('Log error', err);
  }

  // Redirigir al destino (ej: Google)
  res.writeHead(302, { Location: target });
  res.end();
};

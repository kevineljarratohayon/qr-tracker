import fetch from 'node-fetch';

const links = require('../links.json');

const LOG_ENDPOINT = process.env.LOG_ENDPOINT;

export default async function handler(req, res) {
  const { slug } = req.query;
  const target = links[slug];

  if (!target) {
    res.status(404).send('Not found');
    return;
  }

  const ua = req.headers['user-agent'] || '';
  const ref = req.headers['referer'] || '';
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

  try {
    await fetch(LOG_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, target, userAgent: ua, referrer: ref })
    });
  } catch (err) {
    console.error('Log error', err);
  }

  res.writeHead(302, { Location: target });
  res.end();
}

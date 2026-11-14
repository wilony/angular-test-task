require('dotenv').config({ path: require('path').join(__dirname, '.env'), quiet: true });
const express = require('express');
const cors = require('cors');

const API_URL = 'https://api.api-ninjas.com/v1/imagetotext';
const MAX_IMAGE_BYTES = 200 * 1024; // free tier 200KB
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const UPSTREAM_TIMEOUT_MS = 15000;
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';

if (!process.env.API_NINJAS_KEY) {
  console.error('API_NINJAS_KEY is not set');
  process.exit(1);
}

const app = express();
app.use(cors({ origin: CORS_ORIGIN, methods: ['POST'] }));

const rawImage = express.raw({ type: ALLOWED_TYPES, limit: MAX_IMAGE_BYTES });

app.post('/api/ocr', rawImage, async (req, res) => {
  if (!Buffer.isBuffer(req.body) || !req.body.length) {
    return res.status(400).json({ error: 'Expected an image/jpeg or image/png body' });
  }

  const body = new FormData();
  body.append('image', new Blob([req.body], { type: req.headers['content-type'] }), 'image');

  try {
    const upstream = await fetch(API_URL, {
      method: 'POST',
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY },
      body,
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    res
      .status(upstream.status)
      .type(upstream.headers.get('content-type') || 'application/json')
      .send(await upstream.text());
  } catch (err) {
    if (err.name === 'TimeoutError') {
      return res.status(504).json({ error: 'Upstream request timed out' });
    }

    res.status(502).json({ error: 'Upstream request failed' });
  }
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Image is too large' });
  }

  next(err);
});

app.listen(PORT, () => console.log(`OCR server listening on http://localhost:${PORT}`));

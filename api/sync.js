const { put, list, del } = require('@vercel/blob');

const BLOB_PATH = 'cria-ativos-state.json';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    try {
      let body = '';
      for await (const chunk of req) body += chunk;

      const blob = await put(BLOB_PATH, body, {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      });

      return res.status(200).json({ ok: true, url: blob.url });
    } catch (e) {
      return res.status(500).json({ ok: false, error: e.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: 'cria-ativos-state' });
      if (!blobs.length) return res.status(200).json({ ok: false });

      const r = await fetch(blobs[0].url);
      const text = await r.text();
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(text);
    } catch (e) {
      return res.status(500).json({ ok: false, error: e.message });
    }
  }

  return res.status(405).end();
};

const { put } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { imageData, filename } = JSON.parse(body);

    const base64 = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');
    const mime = (imageData.match(/^data:(image\/[a-z]+);/) || [])[1] || 'image/png';

    const blob = await put(`cria-ativos-images/${filename}`, buffer, {
      access: 'public',
      contentType: mime,
    });

    return res.status(200).json({ ok: true, url: blob.url });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
};

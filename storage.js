// /api/storage.js
// Shared key-value storage for the Advertiser Onboarding dashboard, backed by Vercel KV.
// This replaces Claude.ai's window.storage API so the site works once deployed on Vercel.
//
// Requires a Vercel KV database connected to this project (see README.md).
// The @vercel/kv package reads its connection details automatically from the
// KV_REST_API_URL / KV_REST_API_TOKEN environment variables Vercel sets up for you.

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const key = req.query.key;
      if (!key) return res.status(400).json({ error: 'Missing key' });
      const value = await kv.get(key);
      if (value === null || value === undefined) return res.status(404).json(null);
      return res.status(200).json({ key, value });
    }

    if (method === 'POST') {
      const { key, value } = req.body || {};
      if (!key) return res.status(400).json({ error: 'Missing key' });
      await kv.set(key, value);
      return res.status(200).json({ key, value });
    }

    if (method === 'DELETE') {
      const key = req.query.key;
      if (!key) return res.status(400).json({ error: 'Missing key' });
      await kv.del(key);
      return res.status(200).json({ key, deleted: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).json({ error: `Method ${method} not allowed` });
  } catch (err) {
    console.error('storage api error:', err);
    return res.status(500).json({ error: 'Storage operation failed' });
  }
}

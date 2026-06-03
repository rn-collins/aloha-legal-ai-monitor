import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

function parseRedisVal(val) {
  if (!val) return null;
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { return JSON.parse(val); } catch { return val; } }
  return val;
}

export default async function handler(req, res) {
  try {
    const [docsRaw, lastSweep, barCount, judicialCount] = await Promise.all([
      redis.get('legal_ai:documents'),
      redis.get('legal_ai:last_sweep'),
      redis.get('legal_ai:bar_count'),
      redis.get('legal_ai:judicial_count'),
    ]);

    const docs = parseRedisVal(docsRaw) || [];
    const categories = {};
    for (const d of docs) {
      categories[d.category] = (categories[d.category] || 0) + 1;
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      ok: true,
      last_sweep: lastSweep,
      total: docs.length,
      bar_count: barCount || 0,
      judicial_count: judicialCount || 0,
      categories,
      documents: docs,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

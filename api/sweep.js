import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const EXA_SEARCHES = [
  { query: 'state bar association artificial intelligence ethics opinion guidance 2026', category: 'State Bar Guidance' },
  { query: 'ABA formal opinion artificial intelligence generative AI ethics lawyers 2026', category: 'ABA Guidance' },
  { query: 'federal court judge standing order AI artificial intelligence disclosure attorneys 2026', category: 'Judicial Standing Orders' },
  { query: 'state bar AI ethics rule amendment proposed lawyers technology 2026', category: 'Bar Rule Amendments' },
  { query: 'law firm AI policy artificial intelligence attorney professional responsibility 2026', category: 'Professional Responsibility' },
];

function parseRedisVal(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') { try { return JSON.parse(value); } catch { return []; } }
  return value;
}

async function fetchExa() {
  const key = process.env.EXA_API_KEY;
  if (!key) throw new Error('EXA_API_KEY is not configured');

  const since = new Date();
  since.setDate(since.getDate() - 180);
  const seen = new Set();
  const items = [];
  const sources = [];

  await Promise.all(EXA_SEARCHES.map(async ({ query, category }) => {
    const source = { category, ok: false, item_count: 0, error: null };
    try {
      const response = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key },
        body: JSON.stringify({
          query,
          numResults: 10,
          startPublishedDate: since.toISOString().split('T')[0],
          useAutoprompt: true,
          type: 'neural',
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      for (const result of (data.results || [])) {
        if (!result.url || seen.has(result.url)) continue;
        seen.add(result.url);
        items.push({
          source: category.split(' ')[0],
          category,
          title: result.title || 'Untitled',
          id: result.url,
          date: (result.publishedDate || '').slice(0, 10),
          status: '',
          url: result.url,
          abstract: (result.text || result.snippet || '').slice(0, 300),
        });
        source.item_count += 1;
      }
      source.ok = true;
    } catch (error) {
      source.error = error.message;
    }
    sources.push(source);
  }));

  items.sort((a, b) => b.date.localeCompare(a.date));
  const successful = sources.filter(source => source.ok).length;
  if (successful === 0) throw new Error('All discovery sources failed');
  if (items.length === 0) throw new Error('Discovery returned zero records; previous dataset retained');
  return { items, sources, successful, failed: sources.length - successful };
}

async function setHealth(fields) {
  await redis.set('legal_ai:source_health', fields);
}

export default async function handler(req, res) {
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  const attemptedAt = new Date().toISOString();
  await redis.set('legal_ai:last_attempt', attemptedAt);

  try {
    const result = await fetchExa();
    const previous = parseRedisVal(await redis.get('legal_ai:documents'));
    const previousIds = new Set(previous.map(document => document.id));
    const newItems = result.items.filter(document => !previousIds.has(document.id));
    const categories = {};
    for (const item of result.items) categories[item.category] = (categories[item.category] || 0) + 1;

    const health = {
      status: result.failed === 0 ? 'healthy' : 'degraded',
      checked_at: attemptedAt,
      last_success: attemptedAt,
      successful_sources: result.successful,
      failed_sources: result.failed,
      total_sources: result.sources.length,
      sources: result.sources,
      error: null,
    };

    await Promise.all([
      redis.set('legal_ai:documents', result.items),
      redis.set('legal_ai:last_sweep', attemptedAt),
      redis.set('legal_ai:last_success', attemptedAt),
      redis.set('legal_ai:last_error', ''),
      redis.set('legal_ai:bar_count', result.items.filter(item => item.category === 'State Bar Guidance').length),
      redis.set('legal_ai:judicial_count', result.items.filter(item => item.category === 'Judicial Standing Orders').length),
      setHealth(health),
    ]);

    const webhook = process.env.SLACK_WEBHOOK_URL;
    if (newItems.length > 0 && /^https:\/\//.test(webhook || '')) {
      const top = newItems[0];
      try {
        const response = await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: `*Legal AI Guidance Monitor* — ${newItems.length} new candidate${newItems.length > 1 ? 's' : ''}\n*${top.category}:* ${top.title}\n${top.url}` }),
        });
        if (!response.ok) console.warn(`Slack alert failed: ${response.status}`);
      } catch (error) {
        console.warn('Slack alert failed without interrupting the sweep:', error.message);
      }
    }

    res.json({ ok: true, status: health.status, total: result.items.length, new_this_sweep: newItems.length, categories, source_health: health });
  } catch (error) {
    const lastSuccess = await redis.get('legal_ai:last_success');
    const health = {
      status: 'failed',
      checked_at: attemptedAt,
      last_success: lastSuccess || null,
      successful_sources: 0,
      failed_sources: EXA_SEARCHES.length,
      total_sources: EXA_SEARCHES.length,
      sources: [],
      error: error.message,
    };
    await Promise.all([
      redis.set('legal_ai:last_error', error.message),
      setHealth(health),
    ]);
    res.status(503).json({ ok: false, error: 'Source refresh failed; previous verified data was retained.', source_health: health });
  }
}

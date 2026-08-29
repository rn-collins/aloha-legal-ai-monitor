import { Redis } from '@upstash/redis';

const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
import { PRIMARY, VERIFIED_ON, DUTIES, CONVERGENCE } from './register.js';
const STALE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;
const OFFICIAL_HOSTS = ['americanbar.org','calbar.ca.gov','floridabar.org','nycbar.org','dcbar.org','uscourts.gov','.uscourts.gov','.gov'];
function parse(value, fallback=[]) { if (!value) return fallback; if (Array.isArray(value) || typeof value === 'object') return value; if (typeof value === 'string') { try { return JSON.parse(value); } catch { return fallback; } } return fallback; }
function official(url) { try { const host=new URL(url).hostname.toLowerCase(); return OFFICIAL_HOSTS.some(item=>item.startsWith('.')?host.endsWith(item):host===item||host.endsWith('.'+item)); } catch { return false; } }

export default async function handler(req,res) {
 if (req.method !== 'GET' && req.method !== 'HEAD') {
  res.setHeader('Allow','GET, HEAD');
  return res.status(405).json({ok:false,error:'Method not allowed'});
 }
 try {
  const [storedRaw,lastSuccess,legacyLastSweep,lastAttempt,lastError,healthRaw] = await Promise.all([
    redis.get('legal_ai:documents'), redis.get('legal_ai:last_success'), redis.get('legal_ai:last_sweep'), redis.get('legal_ai:last_attempt'),
    redis.get('legal_ai:last_error'), redis.get('legal_ai:source_health')
  ]);
  const stored=parse(storedRaw);
  const additions=stored.filter(document=>official(document.url)).map(document=>({ ...document, source_tier:'Primary-source candidate', verified_on:null, status:'Candidate — open and verify' }));
  const seen=new Set(PRIMARY.map(document=>document.url));
  const documents=[...PRIMARY,...additions.filter(document=>!seen.has(document.url))];
  const categories={}; for(const document of documents) categories[document.category]=(categories[document.category]||0)+1;

  const parsedHealth=parse(healthRaw,{});
  const successTime=lastSuccess || parsedHealth.last_success || legacyLastSweep || null;
  const ageMs=successTime ? Date.now()-new Date(successTime).getTime() : null;
  const stale=!successTime || !Number.isFinite(ageMs) || ageMs>STALE_AFTER_MS;
  const sourceHealth={
    status: stale ? 'stale' : (parsedHealth.status || (lastError ? 'failed' : successTime ? 'healthy' : 'unknown')),
    checked_at: parsedHealth.checked_at || lastAttempt || null,
    last_success: successTime,
    age_hours: Number.isFinite(ageMs) ? Math.round(ageMs/360000)/10 : null,
    stale,
    cadence:'Weekly · Mondays 09:00 UTC',
    successful_sources: parsedHealth.successful_sources ?? null,
    failed_sources: parsedHealth.failed_sources ?? null,
    total_sources: parsedHealth.total_sources ?? 5,
    sources: parsedHealth.sources || [],
    error: parsedHealth.error || lastError || null,
  };

  res.setHeader('Cache-Control','public, max-age=60, stale-while-revalidate=300');
  res.setHeader('Access-Control-Allow-Origin','https://aloha-legal-ai-monitor.vercel.app');
  res.json({
    ok:true,
    methodology:'Primary authorities are hand-verified: each document was opened and read before its analysis was written, and each record states what its source does not establish alongside what it does. Official-domain search discoveries remain candidates until a reviewer verifies the document and characterization.',
    verified_on:VERIFIED_ON,
    last_sweep:sourceHealth.last_success,
    source_health:sourceHealth,
    data_freshness:stale?'verified-register-current-discovery-overdue':'current',
    duties:DUTIES,
    convergence:CONVERGENCE,
    total:documents.length,
    verified_count:PRIMARY.length,
    candidate_count:documents.length-PRIMARY.length,
    bar_count:documents.filter(document=>document.category.includes('Bar')).length,
    judicial_count:documents.filter(document=>document.category==='Judicial Standing Orders').length,
    categories,
    documents,
  });
 } catch(error) {
  res.status(500).json({ ok:false, error:'Unable to load verified authority register.', source_health:{status:'failed',stale:true,last_success:null} });
 }
}

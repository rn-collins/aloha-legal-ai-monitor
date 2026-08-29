import { Redis } from '@upstash/redis';

const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
const VERIFIED_ON = '2026-08-17';
const STALE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;
const PRIMARY = [
 {source:'ABA',category:'ABA Guidance',title:'ABA Formal Opinion 512 — Generative Artificial Intelligence Tools',date:'2024-07-29',url:'https://www.americanbar.org/content/dam/aba/administrative/professional_responsibility/ethics-opinions/aba-formal-opinion-512.pdf',abstract:'Official ABA ethics opinion addressing competence, confidentiality, client communication, candor, supervision, and fees.',jurisdiction:'United States · ABA Model Rules',authority_type:'Formal ethics opinion'},
 {source:'California',category:'State Bar Guidance',title:'Ethics & Technology Resources — 2026 Practical Guidance for Generative and Agentic AI',date:'2026-05-14',url:'https://www.calbar.ca.gov/index.php/legal-professionals/ethics-compliance-practice-resources/ethics/ethics-technology-resources',abstract:'Official State Bar resource page for the updated 2026 practical guidance, including agentic AI considerations.',jurisdiction:'California',authority_type:'State bar practical guidance'},
 {source:'Florida',category:'State Bar Guidance',title:'Florida Bar Ethics Opinion 24-1',date:'2024-01-19',url:'https://www.floridabar.org/etopinions/opinion-24-1/',abstract:'Official advisory opinion on confidentiality, competence, billing, advertising, supervision, and informed consent when lawyers use generative AI.',jurisdiction:'Florida',authority_type:'Advisory ethics opinion'},
 {source:'NYC Bar',category:'State Bar Guidance',title:'Formal Opinion 2024-5 — Generative AI in the Practice of Law',date:'2024-08-07',url:'https://www.nycbar.org/reports/formal-opinion-2024-5-generative-ai-in-the-practice-of-law/',abstract:'Official city bar opinion applying New York professional-responsibility duties to generative AI use.',jurisdiction:'New York',authority_type:'Formal ethics opinion'},
 {source:'D.C. Bar',category:'State Bar Guidance',title:'D.C. Bar Ethics Opinion 388 — Attorneys’ Use of Generative Artificial Intelligence in Client Matters',date:'2024-04-01',url:'https://www.dcbar.org/for-lawyers/legal-ethics/ethics-opinions-210-present/ethics-opinion-388',abstract:'Official D.C. Bar opinion on competence, confidentiality, supervision, candor, fees, and client communication.',jurisdiction:'District of Columbia',authority_type:'Ethics opinion'},
 {source:'M.D. Florida',category:'Judicial Standing Orders',title:'Standing Order of Judge Moe Requiring Disclosure of the Use of Artificial Intelligence',date:'2026-05-27',url:'https://www.flmd.uscourts.gov/standing-order-judge-moe-requiring-disclosure-use-artificial-intelligence',abstract:'Official court page for Judge Anne-Leigh Gaylord Moe’s standing order in case 6:24-cv-1987-AGM-RMN, requiring disclosure of artificial-intelligence use.',jurisdiction:'U.S. District Court · Middle District of Florida',authority_type:'Judicial standing order'},
 {source:'M.D. Florida',category:'Judicial Standing Orders',title:'Standing Order of Judge Berger on AI',date:'2026-04-02',url:'https://www.flmd.uscourts.gov/standing-order-judge-berger-ai',abstract:'Official court page for Judge Wendy W. Berger’s standing order addressing artificial intelligence.',jurisdiction:'U.S. District Court · Middle District of Florida',authority_type:'Judicial standing order'},
 {source:'Ninth Circuit',category:'Professional Responsibility',title:'Lnu v. Blanche — Sanctions for Fabricated AI Authorities and Misrepresentations',date:'2026-06-03',url:'https://cdn.ca9.uscourts.gov/datastore/opinions/2026/06/03/24-4790.pdf',abstract:'Published Ninth Circuit opinion explaining that the violation arose from signing and filing papers containing nonexistent cases, false quotations, and misrepresentations—not from AI use alone.',jurisdiction:'U.S. Court of Appeals · Ninth Circuit',authority_type:'Published sanctions order'}
].map((document,index)=>({ ...document, id:'primary-'+(index+1), source_tier:'Primary authority', verified_on:VERIFIED_ON, status:'Verified official source' }));

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
    methodology:'Primary authorities are hand-verified. Official-domain search discoveries remain candidates until a reviewer verifies the document and characterization.',
    verified_on:VERIFIED_ON,
    last_sweep:sourceHealth.last_success,
    source_health:sourceHealth,
    data_freshness:stale?'verified-register-current-discovery-overdue':'current',
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

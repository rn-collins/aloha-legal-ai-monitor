import { Redis } from '@upstash/redis';

const redis = new Redis({url:process.env.UPSTASH_REDIS_REST_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN});
const VERIFIED_ON='2026-08-16';
const PRIMARY=[
 {source:'ABA',category:'ABA Guidance',title:'ABA Formal Opinion 512 — Generative Artificial Intelligence Tools',date:'2024-07-29',url:'https://www.americanbar.org/content/dam/aba/administrative/professional_responsibility/ethics-opinions/aba-formal-opinion-512.pdf',abstract:'Official ABA ethics opinion addressing competence, confidentiality, client communication, candor, supervision, and fees.',jurisdiction:'United States · ABA Model Rules',authority_type:'Formal ethics opinion'},
 {source:'California',category:'State Bar Guidance',title:'Ethics & Technology Resources — 2026 Practical Guidance for Generative and Agentic AI',date:'2026-05-14',url:'https://www.calbar.ca.gov/index.php/legal-professionals/ethics-compliance-practice-resources/ethics/ethics-technology-resources',abstract:'Official State Bar resource page for the updated 2026 practical guidance, including agentic AI considerations.',jurisdiction:'California',authority_type:'State bar practical guidance'},
 {source:'Florida',category:'State Bar Guidance',title:'Florida Bar Ethics Opinion 24-1',date:'2024-01-19',url:'https://www.floridabar.org/etopinions/opinion-24-1/',abstract:'Official advisory opinion on confidentiality, competence, billing, advertising, supervision, and informed consent when lawyers use generative AI.',jurisdiction:'Florida',authority_type:'Advisory ethics opinion'},
 {source:'NYC Bar',category:'State Bar Guidance',title:'Formal Opinion 2024-5 — Generative AI in the Practice of Law',date:'2024-08-07',url:'https://www.nycbar.org/reports/formal-opinion-2024-5-generative-ai-in-the-practice-of-law/',abstract:'Official city bar opinion applying New York professional-responsibility duties to generative AI use.',jurisdiction:'New York',authority_type:'Formal ethics opinion'},
 {source:'D.C. Bar',category:'State Bar Guidance',title:'D.C. Bar Ethics Opinion 388 — Attorneys’ Use of Generative Artificial Intelligence',date:'2024-04-01',url:'https://www.dcbar.org/for-lawyers/legal-ethics/ethics-opinions-210-present/ethics-opinion-388',abstract:'Official D.C. Bar opinion on competence, confidentiality, supervision, candor, fees, and client communication.',jurisdiction:'District of Columbia',authority_type:'Ethics opinion'}
].map((d,i)=>({...d,id:'primary-'+(i+1),source_tier:'Primary authority',verified_on:VERIFIED_ON,status:'Verified official source'}));

const OFFICIAL_HOSTS=['americanbar.org','calbar.ca.gov','floridabar.org','nycbar.org','dcbar.org','uscourts.gov','.uscourts.gov','.gov'];
function parse(v){if(!v)return[];if(Array.isArray(v))return v;if(typeof v==='string'){try{return JSON.parse(v)}catch{return[]}}return[]}
function official(url){try{const h=new URL(url).hostname.toLowerCase();return OFFICIAL_HOSTS.some(x=>x.startsWith('.')?h.endsWith(x):h===x||h.endsWith('.'+x))}catch{return false}}
export default async function handler(req,res){
 try{
  let stored=[];try{stored=parse(await redis.get('legal_ai:documents'))}catch{}
  const additions=stored.filter(d=>official(d.url)).map(d=>({...d,source_tier:'Primary-source candidate',verified_on:null,status:'Candidate — open and verify'}));
  const seen=new Set(PRIMARY.map(d=>d.url));const documents=[...PRIMARY,...additions.filter(d=>!seen.has(d.url))];
  const categories={};for(const d of documents)categories[d.category]=(categories[d.category]||0)+1;
  res.setHeader('Cache-Control','public, max-age=300, stale-while-revalidate=3600');
  res.setHeader('Access-Control-Allow-Origin','https://aloha-legal-ai-monitor.vercel.app');
  res.json({ok:true,methodology:'Primary authorities are hand-verified. Official-domain search discoveries remain candidates until a reviewer verifies the document and characterization.',verified_on:VERIFIED_ON,last_sweep:VERIFIED_ON,total:documents.length,verified_count:PRIMARY.length,candidate_count:documents.length-PRIMARY.length,bar_count:documents.filter(d=>d.category.includes('Bar')).length,judicial_count:documents.filter(d=>d.category==='Judicial Standing Orders').length,categories,documents});
 }catch(err){res.status(500).json({ok:false,error:'Unable to load verified authority register.'})}
}
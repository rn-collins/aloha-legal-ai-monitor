export default function handler(req, res) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Legal AI Guidance Monitor — Aloha AI Consulting</title>
<meta name="description" content="Bar, ABA and federal-court authorities on lawyers' use of AI — each one opened, characterised and dated by hand, with search results kept separate from law. Built by RN Collins, JD Candidate.">
<meta property="og:title" content="Legal AI Guidance Monitor — Aloha AI Consulting">
<meta property="og:description" content="Bar, ABA and federal-court authorities on lawyers' use of AI — each one opened, characterised and dated by hand.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://aloha-legal-ai-monitor.vercel.app">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Legal AI Guidance Monitor — Aloha AI Consulting">
<meta name="twitter:description" content="Bar, ABA and federal-court authorities on lawyers' use of AI — each one opened, characterised and dated by hand.">
<link rel="canonical" href="https://aloha-legal-ai-monitor.vercel.app">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:image" content="https://aloha-legal-ai-monitor.vercel.app/og-image.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Legal AI Guidance Monitor — Aloha AI Consulting">
<meta name="twitter:image" content="https://aloha-legal-ai-monitor.vercel.app/og-image.png">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Syne:wght@500;700&family=Manrope:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Syne:wght@500;700&family=Manrope:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"></noscript>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Manrope',sans-serif;background:#F6F3EC;color:#1C1B1F;min-height:100vh}
  .skip-link{position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden}
  .skip-link:focus{position:static;width:auto;height:auto;padding:4px 8px;background:#1B7A68;color:white;font-size:12px;z-index:100}
  .page{max-width:900px;margin:0 auto;padding:52px 48px}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:28px;border-bottom:1px solid #D0CEC8}
  .brand{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#1B7A68;margin-bottom:10px;display:flex;align-items:center;gap:6px}
  .brand-dot{width:8px;height:8px;border-radius:50%;background:#1B7A68}
  .doc-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;line-height:1.2}
  .doc-sub{font-size:11px;color:#605D59;font-family:'DM Mono',monospace;margin-top:6px}
  .status-pill{display:flex;align-items:center;gap:6px;background:white;border:.5px solid #D0CEC8;border-radius:20px;padding:6px 14px;font-family:'DM Mono',monospace;font-size:10px;color:#605D59;white-space:nowrap}
  .pulse{width:7px;height:7px;border-radius:50%;background:#1B7A68;animation:pulse 2s ease-in-out infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  .health-banner{display:flex;justify-content:space-between;gap:18px;align-items:center;background:white;border:1px solid #D0CEC8;border-left:5px solid #B8842A;border-radius:8px;padding:14px 16px;margin-bottom:18px}
  .health-banner.healthy{border-left-color:#1B7A68}.health-banner.failed,.health-banner.stale{border-left-color:#C24A2E}
  .health-title{font-family:'Syne',sans-serif;font-size:11px;font-weight:700}.health-detail{font-size:10px;color:#605D59;margin-top:4px;line-height:1.5}.health-state{font-family:'DM Mono',monospace;font-size:10px;text-transform:uppercase;white-space:nowrap}
  .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px}
  .stat-card{background:white;border:.5px solid #D0CEC8;border-radius:8px;padding:16px 18px}
  .stat-label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#6E6B66;margin-bottom:6px}
  .stat-value{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:#1B7A68;line-height:1}
  .stat-sub{font-size:10px;color:#6E6B66;margin-top:4px}
  .cat-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}
  .cat-pill{font-family:'DM Mono',monospace;font-size:10px;padding:4px 10px;border-radius:20px;border:.5px solid;cursor:pointer;transition:all .15s}
  .cat-pill.active{background:#1B7A68;color:white;border-color:#1B7A68}
  .cat-pill.inactive{background:white;color:#605D59;border-color:#8F8B84}
  .cat-pill:focus-visible{outline:2px solid #1B7A68;outline-offset:2px}
  .section-label{font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#605D59;margin-bottom:14px}
  .doc-list{display:flex;flex-direction:column;gap:10px;margin-bottom:40px}
  .doc-card{background:white;border:.5px solid #D0CEC8;border-radius:8px;padding:16px 20px;display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:start;transition:box-shadow .15s,border-color .15s;text-decoration:none;color:inherit}
  .doc-card:hover{box-shadow:0 2px 12px rgba(0,0,0,.06);border-color:#1B7A68}
  .doc-card:focus-visible{outline:2px solid #1B7A68;outline-offset:2px}
  .badge{font-family:'DM Mono',monospace;font-size:9px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:3px 8px;border-radius:4px;white-space:nowrap;margin-top:2px}
  .badge-State{background:#D4EDE8;color:#1B7A68}
  .badge-ABA{background:#FDF3DC;color:#B8842A}
  .badge-Judicial{background:#E8D4ED;color:#6B2937}
  .badge-Bar{background:#D4E8F0;color:#1E3651}
  .badge-Professional{background:#F0EDE8;color:#5A5855}
  .doc-title-text{font-size:13px;font-weight:600;color:#1C1B1F;line-height:1.4;margin-bottom:4px}
  .doc-meta{font-family:'DM Mono',monospace;font-size:10px;color:#6E6B66}
  .doc-abstract{font-size:11px;color:#5A5855;line-height:1.55;margin-top:6px}
  .no-results{text-align:center;padding:40px;color:#635F5A;font-size:13px}
  .disclaimer{font-size:10px;color:#5A5651;font-family:'DM Mono',monospace;margin-bottom:28px;padding:10px 14px;border:.5px solid #D0CEC8;border-radius:6px;background:white;line-height:1.6}
  .footer{border-top:.5px solid #D0CEC8;padding-top:24px;display:flex;justify-content:space-between;align-items:flex-end}
  .footer-name{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600}
  .footer-creds{font-size:10px;color:#635F5A;margin-top:3px;font-family:'DM Mono',monospace;line-height:1.6}
  .footer-contact{text-align:right;font-size:10px;font-family:'DM Mono',monospace;line-height:1.9}
  .footer-contact a{color:#1B7A68;text-decoration:none}
  .footer-contact a:hover{text-decoration:underline}
  .footer-contact a:focus-visible{outline:2px solid #1B7A68;outline-offset:2px}
  @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}
  @media print{body{background:#fff}.page{max-width:none;padding:20px}.pulse{animation:none}.cat-row,#authority-search,label[for="authority-search"]{display:none}.doc-card{break-inside:avoid;box-shadow:none}.footer{break-inside:avoid}a{color:#000}}
  @media(max-width:640px){.page{padding:28px 16px}.stats-row{grid-template-columns:1fr 1fr}.header{flex-direction:column;gap:16px}.footer{flex-direction:column;gap:16px}.footer-contact{text-align:left}}
</style>
</head>
<body>
<a href="#main-content" class="skip-link">Skip to main content</a>
<div class="page">
  <header class="header">
    <div>
      <div class="brand"><span class="brand-dot" aria-hidden="true"></span>Aloha AI Consulting</div>
      <h1 class="doc-title">Legal AI Guidance Monitor</h1>
      <p class="doc-sub">Verified primary authorities, official-source candidates, and review status — without treating search results as law</p>
    </div>
    <div class="status-pill" role="status" aria-live="polite" aria-label="Last updated"><span class="pulse" aria-hidden="true"></span><span id="last-updated">Loading...</span></div>
  </header>
  <main id="main-content">
  <section class="health-banner" id="source-health" role="status" aria-live="polite">
    <div><div class="health-title">Source health is loading</div><div class="health-detail">Checking refresh cadence and the most recent successful source sweep.</div></div>
    <div class="health-state" id="health-state">Checking</div>
  </section>
  <div class="stats-row" role="region" aria-label="Summary statistics">
    <div class="stat-card"><div class="stat-label">Total Items</div><div class="stat-value" id="stat-total" aria-live="polite">—</div><div class="stat-sub">authority register</div></div>
    <div class="stat-card"><div class="stat-label">Verified</div><div class="stat-value" id="stat-verified" aria-live="polite">—</div><div class="stat-sub">opened · characterized</div></div>
    <div class="stat-card"><div class="stat-label">Candidates</div><div class="stat-value" id="stat-candidate" aria-live="polite">—</div><div class="stat-sub">official domain · review needed</div></div>
    <div class="stat-card"><div class="stat-label">Verified On</div><div class="stat-value" id="stat-date" style="font-size:18px">—</div><div class="stat-sub">manual source check</div></div>
  </div>
  <label class="section-label" for="authority-search">Search authorities</label><input id="authority-search" type="search" placeholder="Jurisdiction, duty, opinion, or authority type" style="width:100%;padding:12px 14px;border:1px solid #D0CEC8;border-radius:8px;background:#fff;margin:8px 0 18px;font:inherit"><nav class="cat-row" id="cat-row" aria-label="Filter by category"></nav>
  <div class="disclaimer" role="note">Authority boundary: “Verified” means the official source was opened and characterized on the stated date. Candidates are limited to official domains but still require document-level review. Commentary and commercial trackers are excluded. Not legal advice.</div>
  <h2 class="section-label" id="results-label">Verified authorities and candidates</h2>
  <div class="doc-list" id="doc-list" role="list" aria-labelledby="results-label"><div class="no-results" style="padding:60px">Loading legal AI guidance data...</div></div>
  </main>
  <footer class="footer">
    <div>
      <div class="footer-name">RN Collins</div>
      <div class="footer-creds">
        Neuroscientist &middot; MS Anatomy &amp; Neurobiology, BU School of Medicine<br>
        JD Candidate &middot; Northeastern University School of Law<br>
        AI Workflow Developer &middot; Croke Fairchild Duarte &amp; Beres<br>
        Law Clerk &middot; Gordon Rees Scully Mansukhani &middot; Antithesis Law
      </div>
    </div>
    <div class="footer-contact">
      <a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=collins.ra@northeastern.edu&amp;su=Legal%20AI%20Workflow%20%E2%80%94%20Discovery%20Call%20Request" target="_blank" rel="noopener">collins.ra@northeastern.edu</a><br>
      <a href="tel:+18606814438">860-681-4438</a><br>
      <a href="https://aloha-ai-consulting.vercel.app/" target="_blank" rel="noopener">aloha-ai-consulting.vercel.app</a>
    </div>
  </footer>
</div>
<script>
let allDocs=[],activeFilter='All',searchTerm='';
function badgeClass(cat){
  if(cat==='State Bar Guidance') return 'badge-State';
  if(cat==='ABA Guidance') return 'badge-ABA';
  if(cat==='Judicial Standing Orders') return 'badge-Judicial';
  if(cat==='Bar Rule Amendments') return 'badge-Bar';
  return 'badge-Professional';
}
function formatDate(d){
  if(!d) return '';
  return new Date(d+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}
function shortSource(cat){
  const map={'State Bar Guidance':'BAR','ABA Guidance':'ABA','Judicial Standing Orders':'COURT','Bar Rule Amendments':'RULES','Professional Responsibility':'POLICY'};
  return map[cat]||cat.split(' ')[0].toUpperCase();
}
function escHtml(s){
  if(!s) return '';
  const d=document.createElement('div');
  d.appendChild(document.createTextNode(s));
  return d.innerHTML;
}
function renderDocs(docs){
  const list=document.getElementById('doc-list');
  if(!docs.length){list.innerHTML='<div class="no-results">No items match this filter.</div>';return;}
  list.innerHTML=docs.map(d=>
    '<div role="listitem"><a class="doc-card" href="'+escHtml(d.url)+'" target="_blank" rel="noopener noreferrer">'+
    '<div class="badge '+badgeClass(d.category)+'" aria-hidden="true">'+shortSource(d.category)+'</div>'+
    '<div>'+
    '<div class="doc-title-text">'+escHtml(d.title)+'</div>'+
    '<div class="doc-meta">'+escHtml(d.category)+' &nbsp;&middot;&nbsp; '+formatDate(d.date)+'</div>'+
    '<div class="doc-meta">'+escHtml(d.jurisdiction||'Jurisdiction not captured')+' &nbsp;·&nbsp; '+escHtml(d.authority_type||'Authority type pending')+'</div>'+(d.abstract?'<div class="doc-abstract">'+escHtml(d.abstract)+(d.abstract.length>=300?'&hellip;':'')+'</div>':'')+'<div class="doc-meta" style="margin-top:8px;color:'+(d.verified_on?'#1B7A68':'#7A5713')+'">'+escHtml(d.status||d.source_tier)+(d.verified_on?' · verified '+escHtml(d.verified_on):'')+'</div>'+
    '</div></a></div>'
  ).join('');
}
function setFilter(cat){
  activeFilter=cat;
  document.querySelectorAll('.cat-pill').forEach(p=>{
    p.classList.toggle('active',p.dataset.cat===cat);
    p.classList.toggle('inactive',p.dataset.cat!==cat);
    p.setAttribute('aria-pressed',p.dataset.cat===cat?'true':'false');
  });
  const base=cat==='All'?allDocs:allDocs.filter(d=>d.category===cat);renderDocs(base.filter(d=>[d.title,d.abstract,d.jurisdiction,d.authority_type,d.source].join(' ').toLowerCase().includes(searchTerm)));
}
async function load(){
  try{
    const res=await fetch('/api/data');
    const data=await res.json();
    if(!data.ok) throw new Error(data.error);
    allDocs=data.documents||[];
    document.getElementById('stat-total').textContent=data.total;
    document.getElementById('stat-verified').textContent=data.verified_count;
    document.getElementById('stat-candidate').textContent=data.candidate_count;
    document.getElementById('stat-date').textContent=data.verified_on;
    const health=data.source_health||{};
    const healthBox=document.getElementById('source-health');
    const healthState=document.getElementById('health-state');
    const state=health.stale?'stale':(health.status||'unknown');
    healthBox.classList.add(state);
    healthState.textContent=state;
    const lastSuccess=health.last_success?new Date(health.last_success):null;
    const checked=health.checked_at?new Date(health.checked_at):null;
    const freshness=lastSuccess?'Last successful refresh '+lastSuccess.toLocaleString('en-US',{dateStyle:'medium',timeStyle:'short'})+'.':'No successful automated refresh has been recorded.';
    const failure=health.error?' Latest attempt failed; previously verified data is still shown.':'';
    healthBox.querySelector('.health-title').textContent=state==='healthy'?'Sources healthy':state==='degraded'?'Some sources failed':state==='stale'?'Discovery sweep overdue':state==='failed'?'Source refresh failed':'Source health unavailable';
    const manual=state==='stale'?' The verified authority register was manually checked on '+data.verified_on+'.':'';
    healthBox.querySelector('.health-detail').textContent=freshness+' '+(health.cadence||'Weekly cadence.')+manual+failure+(checked?' Last checked '+checked.toLocaleString('en-US',{dateStyle:'medium',timeStyle:'short'})+'.':'');
    document.getElementById('last-updated').textContent=lastSuccess?'Updated '+lastSuccess.toLocaleDateString('en-US',{month:'short',day:'numeric'}):'No successful sweep';
    const cats=['All',...Object.keys(data.categories||{}).sort()];
    document.getElementById('cat-row').innerHTML=cats.map(c=>{
      const count=c==='All'?allDocs.length:(data.categories?.[c]||0);
      return '<button class="cat-pill '+(c==='All'?'active':'inactive')+'" data-cat="'+c+'" onclick="setFilter(this.dataset.cat)" aria-pressed="'+(c==='All'?'true':'false')+'">'+escHtml(c)+' ('+count+')</button>';
    }).join('');
    renderDocs(allDocs);
  } catch(err){
    document.getElementById('doc-list').innerHTML='<div class="no-results">Unable to load guidance data. Please try again later.</div>';
    document.getElementById('last-updated').textContent='Update unavailable';
    const healthBox=document.getElementById('source-health');
    healthBox.classList.add('failed');
    healthBox.querySelector('.health-title').textContent='Data endpoint unavailable';
    healthBox.querySelector('.health-detail').textContent='The monitor could not verify freshness. Do not rely on cached records until service is restored.';
    document.getElementById('health-state').textContent='Failed';
  }
}
document.getElementById('authority-search').addEventListener('input',e=>{searchTerm=e.target.value.trim().toLowerCase();setFilter(activeFilter)});
load();
</script>
</body>
</html>`;
  res.setHeader('Content-Type','text/html');
  res.send(html);
}

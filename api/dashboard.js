export default function handler(req, res) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Legal AI Guidance Monitor — Aloha AI Consulting</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Syne:wght@500;700&family=Manrope:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Manrope',sans-serif;background:#F6F3EC;color:#1C1B1F;min-height:100vh}
  .page{max-width:900px;margin:0 auto;padding:52px 48px}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:28px;border-bottom:1px solid #D0CEC8}
  .brand{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#1B7A68;margin-bottom:10px;display:flex;align-items:center;gap:6px}
  .brand-dot{width:8px;height:8px;border-radius:50%;background:#1B7A68}
  .doc-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;line-height:1.2}
  .doc-sub{font-size:11px;color:#7A7875;font-family:'DM Mono',monospace;margin-top:6px}
  .status-pill{display:flex;align-items:center;gap:6px;background:white;border:.5px solid #D0CEC8;border-radius:20px;padding:6px 14px;font-family:'DM Mono',monospace;font-size:10px;color:#7A7875;white-space:nowrap}
  .pulse{width:7px;height:7px;border-radius:50%;background:#1B7A68;animation:pulse 2s ease-in-out infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:32px}
  .stat-card{background:white;border:.5px solid #D0CEC8;border-radius:8px;padding:16px 18px}
  .stat-label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#B8B4AE;margin-bottom:6px}
  .stat-value{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:#1B7A68;line-height:1}
  .stat-sub{font-size:10px;color:#9A9890;margin-top:4px}
  .cat-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}
  .cat-pill{font-family:'DM Mono',monospace;font-size:10px;padding:4px 10px;border-radius:20px;border:.5px solid;cursor:pointer;transition:all .15s}
  .cat-pill.active{background:#1B7A68;color:white;border-color:#1B7A68}
  .cat-pill.inactive{background:white;color:#7A7875;border-color:#D0CEC8}
  .section-label{font-family:'Syne',sans-serif;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#7A7875;margin-bottom:14px}
  .doc-list{display:flex;flex-direction:column;gap:10px;margin-bottom:40px}
  .doc-card{background:white;border:.5px solid #D0CEC8;border-radius:8px;padding:16px 20px;display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:start;transition:box-shadow .15s,border-color .15s;text-decoration:none;color:inherit}
  .doc-card:hover{box-shadow:0 2px 12px rgba(0,0,0,.06);border-color:#1B7A68}
  .badge{font-family:'DM Mono',monospace;font-size:9px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:3px 8px;border-radius:4px;white-space:nowrap;margin-top:2px}
  .badge-State{background:#D4EDE8;color:#1B7A68}
  .badge-ABA{background:#FDF3DC;color:#B8842A}
  .badge-Judicial{background:#E8D4ED;color:#6B2937}
  .badge-Bar{background:#D4E8F0;color:#1E3651}
  .badge-Professional{background:#F0EDE8;color:#5A5855}
  .doc-title-text{font-size:13px;font-weight:600;color:#1C1B1F;line-height:1.4;margin-bottom:4px}
  .doc-meta{font-family:'DM Mono',monospace;font-size:10px;color:#9A9890}
  .doc-abstract{font-size:11px;color:#5A5855;line-height:1.55;margin-top:6px}
  .no-results{text-align:center;padding:40px;color:#9A9890;font-size:13px}
  .footer{border-top:.5px solid #D0CEC8;padding-top:24px;display:flex;justify-content:space-between;align-items:flex-end}
  .footer-name{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600}
  .footer-creds{font-size:10px;color:#9A9890;margin-top:3px;font-family:'DM Mono',monospace;line-height:1.6}
  .footer-contact{text-align:right;font-size:10px;font-family:'DM Mono',monospace;line-height:1.9}
  .footer-contact a{color:#1B7A68;text-decoration:none}
  @media(max-width:640px){.page{padding:28px 16px}.stats-row{grid-template-columns:1fr 1fr}.header{flex-direction:column;gap:16px}.footer{flex-direction:column;gap:16px}.footer-contact{text-align:left}}
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div>
      <div class="brand"><span class="brand-dot"></span>Aloha AI Consulting</div>
      <div class="doc-title">Legal AI Guidance Monitor</div>
      <div class="doc-sub">Automated system tracking state bar AI ethics developments via aggregated legal sources and weekly search sweeps</div>
    </div>
    <div class="status-pill"><span class="pulse"></span><span id="last-updated">Loading...</span></div>
  </div>
  <div class="stats-row">
    <div class="stat-card"><div class="stat-label">Total Items</div><div class="stat-value" id="stat-total">—</div><div class="stat-sub">last 180 days</div></div>
    <div class="stat-card"><div class="stat-label">Bar Guidance</div><div class="stat-value" id="stat-bar">—</div><div class="stat-sub">state bars</div></div>
    <div class="stat-card"><div class="stat-label">Judicial Orders</div><div class="stat-value" id="stat-judicial">—</div><div class="stat-sub">AI disclosure</div></div>
    <div class="stat-card"><div class="stat-label">Sources</div><div class="stat-value" id="stat-sources">5</div><div class="stat-sub">bar · ABA · courts</div></div>
  </div>
  <div class="cat-row" id="cat-row"></div>
  <div class="section-label">Recent Guidance</div>
  <div class="doc-list" id="doc-list"><div class="no-results" style="padding:60px">Loading legal AI guidance data...</div></div>
  <div class="footer">
    <div>
      <div class="footer-name">RN Collins</div>
      <div class="footer-creds">
        Neuroscientist · MS Anatomy &amp; Neurobiology, BU School of Medicine<br>
        JD Candidate · Northeastern University School of Law<br>
        AI Workflow Developer · Croke Fairchild Duarte &amp; Beres<br>
        Law Clerk · Gordon Rees Scully Mansukhani · Antithesis Law<br>
        Legal AI Guidance Monitor · automated system tracking state bar AI ethics developments — deployed infrastructure, not a prototype
      </div>
    </div>
    <div class="footer-contact">
      <a href="https://mail.google.com/mail/?view=cm&fs=1&to=collins.ra@northeastern.edu&su=Legal%20AI%20Workflow%20—%20Discovery%20Call%20Request" target="_blank">collins.ra@northeastern.edu</a><br>
      <a href="tel:+18606814438">860-681-4438</a><br>
      <a href="https://rncollins.com/aloha-ai-consulting" target="_blank">rncollins.com/aloha-ai-consulting</a>
    </div>
  </div>
</div>
<script>
let allDocs=[],activeFilter='All';
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
  const map={'State Bar Guidance':'BAR','ABA Guidance':'ABA','Judicial Standing Orders':'COURT','Bar Rule Amendments':'RULES','Professional Responsibility':'PROF'};
  return map[cat]||cat.split(' ')[0].toUpperCase();
}
function renderDocs(docs){
  const list=document.getElementById('doc-list');
  if(!docs.length){list.innerHTML='<div class="no-results">No items match this filter.</div>';return;}
  list.innerHTML=docs.map(d=>\`
    <a class="doc-card" href="\${d.url}" target="_blank" rel="noopener">
      <div class="badge \${badgeClass(d.category)}">\${shortSource(d.category)}</div>
      <div>
        <div class="doc-title-text">\${d.title}</div>
        <div class="doc-meta">\${d.category} &nbsp;·&nbsp; \${formatDate(d.date)}</div>
        \${d.abstract?\`<div class="doc-abstract">\${d.abstract}\${d.abstract.length>=300?'…':''}</div>\`:''}
      </div>
    </a>
  \`).join('');
}
function setFilter(cat){
  activeFilter=cat;
  document.querySelectorAll('.cat-pill').forEach(p=>{
    p.classList.toggle('active',p.dataset.cat===cat);
    p.classList.toggle('inactive',p.dataset.cat!==cat);
  });
  renderDocs(cat==='All'?allDocs:allDocs.filter(d=>d.category===cat));
}
async function load(){
  try{
    const res=await fetch('/api/data');
    const data=await res.json();
    if(!data.ok) throw new Error(data.error);
    allDocs=data.documents||[];
    document.getElementById('stat-total').textContent=data.total;
    document.getElementById('stat-bar').textContent=data.bar_count;
    document.getElementById('stat-judicial').textContent=data.judicial_count;
    if(data.last_sweep){
      const d=new Date(data.last_sweep);
      document.getElementById('last-updated').textContent='Updated '+d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
    } else {
      document.getElementById('last-updated').textContent='Awaiting first sweep';
    }
    const cats=['All',...Object.keys(data.categories||{}).sort()];
    document.getElementById('cat-row').innerHTML=cats.map(c=>{
      const count=c==='All'?allDocs.length:(data.categories?.[c]||0);
      return \`<button class="cat-pill \${c==='All'?'active':'inactive'}" data-cat="\${c}" onclick="setFilter('\${c}')">\${c} (\${count})</button>\`;
    }).join('');
    renderDocs(allDocs);
  } catch(err){
    document.getElementById('doc-list').innerHTML=\`<div class="no-results">Error: \${err.message}<br><br>Run the sweep first: <code>/api/sweep</code></div>\`;
    document.getElementById('last-updated').textContent='Not yet swept';
  }
}
load();
</script>
</body>
</html>`;
  res.setHeader('Content-Type','text/html');
  res.send(html);
}

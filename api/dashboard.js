import { PRIMARY, DUTIES, CONVERGENCE, VERIFIED_ON, ANALYSIS_REVIEWED_ON } from './register.js';

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const SHORT = {
  'State Bar Guidance': 'BAR',
  'ABA Guidance': 'ABA',
  'Judicial Standing Orders': 'COURT',
  'Bar Rule Amendments': 'RULES',
  'Professional Responsibility': 'CASE',
};

const longDate = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

function field(label, body) {
  if (!body) return '';
  return `<div class="field"><h4>${esc(label)}</h4><p>${esc(body)}</p></div>`;
}

function brief(entry) {
  const dutyTags = (entry.duties || []).map((key) => `<li>${esc(DUTIES[key])}</li>`).join('');
  const docLink = entry.documentUrl && entry.documentUrl !== entry.url
    ? `<a class="doc-link" href="${esc(entry.documentUrl)}" rel="noopener noreferrer">Read the document itself</a>`
    : '';
  return `<article class="brief${entry.unretrieved ? ' brief--unread' : ''}" id="${esc(entry.id)}"
    data-category="${esc(entry.category)}" data-jurisdiction="${esc(entry.jurisdiction)}"
    data-year="${esc(entry.year)}" data-duties="${esc((entry.duties || []).join(' '))}"
    data-date="${esc(entry.date)}" data-title="${esc(entry.title)}"
    data-text="${esc([entry.title, entry.jurisdiction, entry.authority_type, entry.citation, entry.abstract, entry.holding, entry.establishes, entry.limits, entry.matters, entry.action].filter(Boolean).join(' ').toLowerCase())}">
    <header class="brief-head">
      <span class="badge badge--${esc((SHORT[entry.category] || 'DOC').toLowerCase())}">${esc(SHORT[entry.category] || 'DOC')}</span>
      <div class="brief-headings">
        <h3><a href="${esc(entry.url)}" rel="noopener noreferrer">${esc(entry.title)}</a></h3>
        <p class="cite">${esc(entry.citation)}</p>
        <p class="rail">${esc(entry.jurisdiction)} · ${esc(entry.authority_type)} · ${esc(longDate(entry.date))}</p>
      </div>
      <a class="permalink" href="#${esc(entry.id)}" aria-label="Permanent link to ${esc(entry.title)}">#</a>
    </header>
    <p class="lede">${esc(entry.abstract)}</p>
    <div class="fields">
      ${field('Weight', entry.binding)}
      ${field(entry.unretrieved ? 'Why there is no summary here' : 'What it holds', entry.holding || entry.limits)}
      ${entry.unretrieved ? '' : field('What it establishes', entry.establishes)}
      ${entry.unretrieved ? '' : field('What it does not establish', entry.limits)}
      ${field('Why it matters', entry.matters)}
      ${field('What to do with it', entry.action)}
    </div>
    ${dutyTags ? `<div class="duties"><h4>Duties addressed</h4><ul>${dutyTags}</ul></div>` : ''}
    <footer class="brief-foot">
      <p><strong>Retrieval.</strong> ${esc(entry.retrieval)}</p>
      <p>Source verified ${esc(longDate(VERIFIED_ON))} · analysis reviewed ${esc(longDate(ANALYSIS_REVIEWED_ON))}</p>
      ${docLink}
    </footer>
  </article>`;
}

function matrixRow(entry) {
  const cells = Object.keys(DUTIES).map((key) => {
    const on = (entry.duties || []).includes(key);
    return `<td class="${on ? 'on' : 'off'}"><span class="sr-only">${on ? 'Addresses' : 'Does not address'} ${esc(DUTIES[key])}</span><span aria-hidden="true">${on ? '●' : '·'}</span></td>`;
  }).join('');
  return `<tr><th scope="row"><a href="#${esc(entry.id)}">${esc(entry.source)} — ${esc(entry.authority_type)}</a></th>${cells}</tr>`;
}

export default function handler(req, res) {
  const jurisdictions = [...new Set(PRIMARY.map((entry) => entry.jurisdiction))].sort();
  const categories = [...new Set(PRIMARY.map((entry) => entry.category))].sort();
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Legal AI Guidance Monitor — Aloha AI Consulting</title>
<meta name="description" content="Eight primary authorities on lawyers' use of AI, each one opened and read, with what it holds set against what it does not establish. Bar guidance, standing orders and a published sanctions order, kept separate from search results.">
<meta property="og:title" content="Legal AI Guidance Monitor — Aloha AI Consulting">
<meta property="og:description" content="Eight primary authorities on lawyers' use of AI, each with what it holds set against what it does not establish.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://aloha-legal-ai-monitor.vercel.app">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Legal AI Guidance Monitor — Aloha AI Consulting">
<meta name="twitter:description" content="Eight primary authorities on lawyers' use of AI, each with what it holds set against what it does not establish.">
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
  :root{
    --paper:#F6F3EC; --ink:#1C1B1F; --ink-soft:#4A4741; --rule:#D0CEC8; --rule-soft:#E2DFD8;
    --card:#FFFFFF; --teal:#136356; --teal-deep:#0C4238; --clay:#8A4A1E; --ochre:#7A5713; --brick:#A6371F;
  }
  body{font-family:'Manrope',system-ui,sans-serif;background:var(--paper);color:var(--ink);min-height:100vh;line-height:1.6;-webkit-text-size-adjust:100%}
  .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
  .skip-link{position:absolute;left:-9999px}
  .skip-link:focus{position:static;display:inline-block;padding:6px 10px;background:var(--teal);color:#fff;font-size:13px}
  a{color:var(--teal-deep)}
  a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible{outline:3px solid var(--clay);outline-offset:2px;border-radius:3px}
  .page{max-width:920px;margin:0 auto;padding:52px max(20px,4vw) 64px}
  .header{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:32px;padding-bottom:26px;border-bottom:1px solid var(--rule)}
  .brand{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--teal);margin-bottom:10px;display:flex;align-items:center;gap:6px}
  .brand-dot{width:8px;height:8px;border-radius:50%;background:var(--teal)}
  .doc-title{font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(30px,6vw,40px);font-weight:600;line-height:1.1}
  .doc-sub{font-size:13px;color:var(--ink-soft);margin-top:8px;max-width:52ch}
  .status-pill{display:flex;align-items:center;gap:6px;background:var(--card);border:1px solid var(--rule);border-radius:20px;padding:6px 14px;font-family:'DM Mono',ui-monospace,monospace;font-size:10px;color:var(--ink-soft);white-space:nowrap}
  .pulse{width:7px;height:7px;border-radius:50%;background:var(--teal)}
  @media(prefers-reduced-motion:no-preference){.pulse{animation:pulse 2s ease-in-out infinite}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  .standfirst{font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;line-height:1.5;color:var(--ink);max-width:62ch;margin-bottom:22px}
  .standfirst em{font-style:italic}
  .health-banner{display:flex;justify-content:space-between;gap:18px;align-items:center;flex-wrap:wrap;background:var(--card);border:1px solid var(--rule);border-left:5px solid var(--ochre);border-radius:8px;padding:14px 16px;margin-bottom:18px}
  .health-banner.healthy{border-left-color:var(--teal)}.health-banner.failed,.health-banner.stale{border-left-color:var(--brick)}
  .health-title{font-family:'Syne',sans-serif;font-size:12px;font-weight:700}
  .health-detail{font-size:12px;color:var(--ink-soft);margin-top:4px;line-height:1.55}
  .health-state{font-family:'DM Mono',ui-monospace,monospace;font-size:10px;text-transform:uppercase;white-space:nowrap;color:var(--ink-soft)}
  .stats-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:34px}
  .stat-card{background:var(--card);border:1px solid var(--rule);border-radius:8px;padding:14px 16px}
  .stat-label{font-family:'DM Mono',ui-monospace,monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:6px}
  .stat-value{font-family:'Cormorant Garamond',Georgia,serif;font-size:30px;font-weight:600;color:var(--teal-deep);line-height:1;font-variant-numeric:lining-nums tabular-nums;font-feature-settings:'lnum' 1,'tnum' 1}
  .stat-sub{font-size:11px;color:var(--ink-soft);margin-top:4px}
  h2.rubric{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-soft);margin:44px 0 14px;padding-bottom:8px;border-bottom:1px solid var(--rule)}
  h2.rubric:first-of-type{margin-top:0}
  .prose p{max-width:66ch;margin-bottom:14px;font-size:15px}
  .prose h3{font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:600;margin:22px 0 8px}
  .note{background:var(--card);border:1px solid var(--rule);border-left:4px solid var(--clay);border-radius:8px;padding:14px 16px;font-size:13px;color:var(--ink-soft);margin:18px 0}
  .note strong{color:var(--ink)}
  .controls{background:var(--card);border:1px solid var(--rule);border-radius:10px;padding:16px;margin-bottom:20px;display:grid;gap:14px}
  .controls .row{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
  .controls label{display:grid;gap:5px;font-family:'DM Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft);min-width:0}
  .controls input,.controls select{font:inherit;font-family:'Manrope',sans-serif;font-size:14px;color:var(--ink);padding:9px 11px;border:1px solid #9C978E;border-radius:6px;background:#fff;width:100%;min-width:0}
  .controls .actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
  .controls button{font:inherit;font-size:13px;font-weight:600;padding:8px 14px;border-radius:6px;border:1px solid var(--teal);background:#fff;color:var(--teal-deep);cursor:pointer}
  .controls button:hover{background:#EAF2EF}
  .result-count{font-family:'DM Mono',ui-monospace,monospace;font-size:11px;color:var(--ink-soft)}
  .matrix-wrap{position:relative;overflow-x:auto;border:1px solid var(--rule);border-radius:8px;background:var(--card)}
  table.matrix{border-collapse:collapse;width:100%;min-width:720px;font-size:12px}
  table.matrix th,table.matrix td{border-bottom:1px solid var(--rule-soft);padding:9px 10px;text-align:left;vertical-align:bottom}
  table.matrix thead th{font-family:'DM Mono',ui-monospace,monospace;font-size:9px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-soft);font-weight:500;line-height:1.35}
  table.matrix tbody th{font-weight:600;white-space:nowrap}
  table.matrix td{text-align:center;font-size:15px}
  table.matrix td.on{color:var(--teal-deep)}
  table.matrix td.off{color:#6E6960}
  .briefs{display:grid;gap:16px}
  .brief{background:var(--card);border:1px solid var(--rule);border-radius:10px;padding:20px 22px;scroll-margin-top:16px}
  .brief:target{border-color:var(--teal);box-shadow:0 0 0 3px rgba(19,99,86,.14)}
  .brief--unread{border-left:5px solid var(--ochre)}
  .brief-head{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:start}
  .badge{font-family:'DM Mono',ui-monospace,monospace;font-size:9px;font-weight:600;letter-spacing:.06em;padding:5px 7px;border-radius:4px;background:#EDEAE2;color:var(--ink-soft);white-space:nowrap}
  .badge--aba{background:#E4EEEB;color:var(--teal-deep)}
  .badge--bar{background:#EFE9DC;color:var(--ochre)}
  .badge--court{background:#E9E4F0;color:#4A3A73}
  .badge--case{background:#F3E2DC;color:var(--brick)}
  .brief-headings h3{font-family:'Cormorant Garamond',Georgia,serif;font-size:23px;font-weight:600;line-height:1.22}
  .brief-headings h3 a{text-decoration:none}
  .brief-headings h3 a:hover{text-decoration:underline}
  .cite{font-family:'DM Mono',ui-monospace,monospace;font-size:11px;color:var(--ink-soft);margin-top:6px;line-height:1.5}
  .rail{font-size:12px;color:var(--ink-soft);margin-top:4px}
  .permalink{font-family:'DM Mono',ui-monospace,monospace;font-size:15px;text-decoration:none;color:#6E6960;padding:2px 6px;border-radius:4px}
  .permalink:hover{color:var(--teal-deep);background:#EAF2EF}
  .lede{font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;line-height:1.5;margin:14px 0 4px;max-width:64ch}
  .fields{display:grid;gap:12px;margin-top:14px;padding-top:14px;border-top:1px solid var(--rule-soft)}
  .field h4{font-family:'DM Mono',ui-monospace,monospace;font-size:9px;font-weight:500;letter-spacing:.09em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:4px}
  .field p{font-size:14.5px;max-width:70ch}
  .duties{margin-top:14px}
  .duties h4{font-family:'DM Mono',ui-monospace,monospace;font-size:9px;font-weight:500;letter-spacing:.09em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:6px}
  .duties ul{list-style:none;display:flex;flex-wrap:wrap;gap:6px}
  .duties li{font-size:11.5px;padding:3px 9px;border-radius:999px;background:#EDEAE2;color:var(--ink-soft)}
  .brief-foot{margin-top:16px;padding-top:12px;border-top:1px solid var(--rule-soft);font-size:12px;color:var(--ink-soft)}
  .brief-foot p{margin-bottom:4px;max-width:74ch}
  .doc-link{display:inline-block;margin-top:6px;font-size:12px;font-weight:600}
  .candidates{display:grid;gap:10px}
  .candidate{background:var(--card);border:1px solid var(--rule);border-left:4px solid var(--ochre);border-radius:8px;padding:14px 16px}
  .candidate h3{font-size:15px;font-weight:600;line-height:1.4}
  .candidate .rail{margin-top:4px}
  .empty{background:var(--card);border:1px dashed var(--rule);border-radius:8px;padding:22px;font-size:14px;color:var(--ink-soft)}
  .footer{margin-top:52px;padding-top:22px;border-top:1px solid var(--rule);display:flex;justify-content:space-between;gap:22px;flex-wrap:wrap;font-size:12px;color:var(--ink-soft)}
  .footer-name{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;color:var(--ink);margin-bottom:6px}
  .footer-creds{line-height:1.7}
  .footer-contact{line-height:1.9;text-align:right}
  @media(max-width:640px){
    .page{padding:32px 18px 48px}
    .brief-head{grid-template-columns:auto 1fr}
    .permalink{display:none}
    .footer-contact{text-align:left}
    table.matrix{min-width:640px}
  }
</style>
</head>
<body>
<a href="#main-content" class="skip-link">Skip to main content</a>
<div class="page">
  <header class="header">
    <div>
      <div class="brand"><span class="brand-dot" aria-hidden="true"></span>Aloha AI Consulting</div>
      <h1 class="doc-title">Legal AI Guidance Monitor</h1>
      <p class="doc-sub">Eight primary authorities on lawyers’ use of artificial intelligence, each one opened and read, with what it holds set against what it does not establish.</p>
    </div>
    <div class="status-pill" role="status" aria-live="polite"><span class="pulse" aria-hidden="true"></span><span id="last-updated">Checking discovery sweep…</span></div>
  </header>
  <main id="main-content">

  <p class="standfirst">Most collections of AI guidance are lists of links. A link tells you a document exists. It does not tell you whether the document binds you, what it actually decided, or — the part that gets lawyers into trouble — how far it can be stretched before it snaps. Every record below carries both halves.</p>

  <section class="health-banner" id="source-health" role="status" aria-live="polite">
    <div><div class="health-title">Discovery sweep status is loading</div><div class="health-detail">The eight authorities below are hand-verified and do not depend on this check. The check reports only whether the automated search for <em>new</em> official-domain material has run recently.</div></div>
    <div class="health-state" id="health-state">Checking</div>
  </section>
  <noscript><p class="note"><strong>JavaScript is off.</strong> The sweep-status banner above and the candidate list at the foot of this page are both filled in by a request to <code>/api/data</code>, so neither is showing you anything right now — ignore them. Everything that matters on this page is printed in the HTML: all ${PRIMARY.length} authorities, their analyses, the duty matrix and the convergence table are below, complete and in date order. Filtering and sorting are the only other things you lose.</p></noscript>

  <div class="stats-row" role="region" aria-label="Register summary">
    <div class="stat-card"><div class="stat-label">Read and analysed</div><div class="stat-value">${PRIMARY.filter((e) => !e.unretrieved).length}</div><div class="stat-sub">document opened before writing</div></div>
    <div class="stat-card"><div class="stat-label">Listed, not read</div><div class="stat-value">${PRIMARY.filter((e) => e.unretrieved).length}</div><div class="stat-sub">retrieval blocked · flagged</div></div>
    <div class="stat-card"><div class="stat-label">Binding authority</div><div class="stat-value">3</div><div class="stat-sub">one published order · two standing orders</div></div>
    <div class="stat-card"><div class="stat-label">Candidates</div><div class="stat-value" id="stat-candidate">—</div><div class="stat-sub">official domain · unreviewed</div></div>
  </div>

  <h2 class="rubric" id="how-to-read">How to read this register</h2>
  <div class="prose">
    <p>Three kinds of document sit in this register and they carry entirely different weight. Getting them confused is the most common error in this area, and it runs in both directions.</p>
    <h3>Ethics guidance binds no one</h3>
    <p>ABA Formal Opinion 512, the Florida and D.C. opinions, and California’s Practical Guidance are advisory. They interpret rules of professional conduct; they do not enact them. Their force comes from being persuasive to the body that <em>does</em> discipline you — which is why the Ninth Circuit’s reach for California’s guidance in a sanctions order matters more than the guidance’s own disclaimer.</p>
    <h3>A standing order binds exactly one courtroom</h3>
    <p>The two Middle District of Florida orders in this register were entered two months apart, in the same district, by two judges, and they impose different things. One demands two certification texts reproduced verbatim under penalty of perjury; the other prescribes no wording at all. Neither is “the federal rule.” A filing protocol written for one of them fails the other, and that is the practical lesson: the compliance unit is the judge, not the district and not the country.</p>
    <h3>One document here is law</h3>
    <p><em>Lnu v. Blanche</em> is a published Ninth Circuit order and therefore precedential in that circuit. It is also the document that locates the duty most precisely — not at research, not at drafting, but at signing and filing.</p>
    <h3>What “verified” means here, and what it does not</h3>
    <p>Verified means a person opened the document at the cited URL, read the passage the analysis rests on, and recorded the date. It does not mean the authority is current, that it has not been superseded, or that its analysis fits your matter. Where retrieval failed, the record says so and carries no summary — there is one such record below, and it is deliberately left unread rather than filled in from memory.</p>
    <div class="note"><strong>Authority boundary.</strong> Candidates discovered by the automated sweep are restricted to official domains but have not been opened by anyone. They are listed separately, below the register, and carry no characterisation. Commentary and commercial trackers are excluded entirely. Nothing here is legal advice.</div>
  </div>

  <h2 class="rubric" id="convergence">Where the authorities agree</h2>
  <div class="prose">
    <p>Independent bodies construing different rule sets have landed in the same place on four propositions. Convergence is the most useful signal a register like this can surface, because it tells a reader which positions are safe to plan around and which are still one jurisdiction’s view.</p>
  </div>
  <div class="briefs" style="margin-top:6px">
    ${CONVERGENCE.map((item) => `<article class="brief"><h3 class="lede" style="margin-top:0;font-weight:600">${esc(item.proposition)}</h3><div class="fields"><div class="field"><h4>Held or stated by</h4><p>${item.holdings.map((id) => {
      const entry = PRIMARY.find((e) => e.id === id);
      return `<a href="#${esc(id)}">${esc(entry.source)}</a>`;
    }).join(' · ')}</p></div>${field('Note', item.also)}</div></article>`).join('')}
  </div>

  <h2 class="rubric" id="duty-matrix">Which authority speaks to which duty</h2>
  <div class="prose"><p>Read down a column to find every authority that addresses a duty you are worried about. A dot means the document treats that duty substantively, not that it merely mentions it. The New York opinion has no dots because it was not read.</p></div>
  <div class="matrix-wrap">
    <table class="matrix">
      <caption class="sr-only">Duties addressed by each authority in the register</caption>
      <thead><tr><th scope="col">Authority</th>${Object.values(DUTIES).map((label) => `<th scope="col">${esc(label)}</th>`).join('')}</tr></thead>
      <tbody>${PRIMARY.map(matrixRow).join('')}</tbody>
    </table>
  </div>

  <h2 class="rubric" id="register">The register</h2>
  <form class="controls" id="controls" role="search" aria-label="Filter the authority register">
    <div class="row">
      <label for="q">Search every field
        <input id="q" name="q" type="search" placeholder="informed consent, billing, certification…" autocomplete="off">
      </label>
      <label for="cat">Authority class
        <select id="cat" name="cat"><option value="">All classes</option>${categories.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select>
      </label>
      <label for="jur">Jurisdiction
        <select id="jur" name="jur"><option value="">All jurisdictions</option>${jurisdictions.map((j) => `<option value="${esc(j)}">${esc(j)}</option>`).join('')}</select>
      </label>
      <label for="duty">Duty
        <select id="duty" name="duty"><option value="">All duties</option>${Object.entries(DUTIES).map(([k, v]) => `<option value="${esc(k)}">${esc(v)}</option>`).join('')}</select>
      </label>
      <label for="sort">Order
        <select id="sort" name="sort"><option value="date-desc">Newest first</option><option value="date-asc">Oldest first</option><option value="title">Title A–Z</option><option value="jurisdiction">Jurisdiction</option></select>
      </label>
    </div>
    <div class="actions">
      <button type="submit">Apply filters</button>
      <button type="button" id="reset">Clear</button>
      <button type="button" id="copy-view" hidden>Copy link to this view</button>
      <span class="result-count" id="count" role="status" aria-live="polite">${PRIMARY.length} of ${PRIMARY.length} authorities</span>
    </div>
    <noscript><p class="result-count">Filtering needs JavaScript. All ${PRIMARY.length} authorities are printed in full below regardless.</p></noscript>
  </form>

  <div class="briefs" id="briefs">${PRIMARY.map(brief).join('')}</div>
  <p class="empty" id="no-results" hidden>No authority in the register matches those filters.</p>

  <h2 class="rubric" id="candidates">Discovered candidates — nobody has opened these</h2>
  <div class="prose"><p>The weekly sweep searches official domains for new material. What it finds appears here without characterisation, because characterising a document nobody has read is exactly the failure this register exists to avoid. Treat these as leads.</p></div>
  <div class="candidates" id="candidate-list"><p class="empty">Loading discovered candidates…</p></div>
  <noscript><p class="empty">Discovered candidates are fetched at page load and cannot be shown without JavaScript. Nothing is being hidden from you: candidates are unreviewed search results by definition, and the verified register above does not depend on them.</p></noscript>

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
      <a href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=collins.ra@northeastern.edu&amp;su=Legal%20AI%20Workflow%20%E2%80%94%20Discovery%20Call%20Request" rel="noopener">collins.ra@northeastern.edu</a><br>
      <a href="tel:+18606814438">860-681-4438</a><br>
      <a href="https://aloha-ai-consulting.vercel.app/" rel="noopener">aloha-ai-consulting.vercel.app</a>
    </div>
  </footer>
</div>
<script>
(function () {
  var briefs = Array.prototype.slice.call(document.querySelectorAll('#briefs .brief[data-title]'));
  var container = document.getElementById('briefs');
  var form = document.getElementById('controls');
  var count = document.getElementById('count');
  var none = document.getElementById('no-results');
  var copy = document.getElementById('copy-view');
  var fields = { q: document.getElementById('q'), cat: document.getElementById('cat'), jur: document.getElementById('jur'), duty: document.getElementById('duty'), sort: document.getElementById('sort') };

  function readUrl() {
    var params = new URLSearchParams(location.search);
    Object.keys(fields).forEach(function (key) {
      var value = params.get(key);
      if (value !== null) fields[key].value = value;
    });
  }

  function writeUrl() {
    var params = new URLSearchParams();
    Object.keys(fields).forEach(function (key) {
      var value = fields[key].value;
      if (value && !(key === 'sort' && value === 'date-desc')) params.set(key, value);
    });
    var query = params.toString();
    history.replaceState(null, '', query ? '?' + query + location.hash : location.pathname + location.hash);
  }

  function apply() {
    var q = fields.q.value.trim().toLowerCase();
    var shown = 0;
    briefs.forEach(function (node) {
      var ok = (!q || node.dataset.text.indexOf(q) !== -1)
        && (!fields.cat.value || node.dataset.category === fields.cat.value)
        && (!fields.jur.value || node.dataset.jurisdiction === fields.jur.value)
        && (!fields.duty.value || node.dataset.duties.split(' ').indexOf(fields.duty.value) !== -1);
      node.hidden = !ok;
      if (ok) shown += 1;
    });
    var order = fields.sort.value;
    var sorted = briefs.slice().sort(function (a, b) {
      if (order === 'date-asc') return a.dataset.date.localeCompare(b.dataset.date);
      if (order === 'title') return a.dataset.title.localeCompare(b.dataset.title);
      if (order === 'jurisdiction') return a.dataset.jurisdiction.localeCompare(b.dataset.jurisdiction) || a.dataset.date.localeCompare(b.dataset.date);
      return b.dataset.date.localeCompare(a.dataset.date);
    });
    sorted.forEach(function (node) { container.appendChild(node); });
    count.textContent = shown + ' of ' + briefs.length + ' authorities';
    none.hidden = shown !== 0;
    writeUrl();
  }

  form.addEventListener('submit', function (event) { event.preventDefault(); apply(); });
  Object.keys(fields).forEach(function (key) {
    fields[key].addEventListener(key === 'q' ? 'input' : 'change', apply);
  });
  document.getElementById('reset').addEventListener('click', function () {
    fields.q.value = ''; fields.cat.value = ''; fields.jur.value = ''; fields.duty.value = ''; fields.sort.value = 'date-desc';
    apply();
  });
  if (navigator.clipboard) {
    copy.hidden = false;
    copy.addEventListener('click', function () {
      navigator.clipboard.writeText(location.href).then(function () {
        var was = copy.textContent;
        copy.textContent = 'Link copied';
        setTimeout(function () { copy.textContent = was; }, 1800);
      });
    });
  }
  readUrl();
  apply();
  if (location.hash) {
    var target = document.querySelector(location.hash);
    if (target && target.hidden) { document.getElementById('reset').click(); }
    if (target) target.scrollIntoView();
  }

  function text(node, value) { if (node) node.textContent = value; }

  fetch('/api/data').then(function (response) { return response.json(); }).then(function (data) {
    if (!data.ok) throw new Error('unavailable');
    var health = data.source_health || {};
    var box = document.getElementById('source-health');
    var state = health.stale ? 'stale' : (health.status || 'unknown');
    box.classList.add(state);
    text(document.getElementById('health-state'), state);
    var success = health.last_success ? new Date(health.last_success) : null;
    text(box.querySelector('.health-title'),
      state === 'healthy' ? 'Discovery sweep is current'
      : state === 'degraded' ? 'Some discovery sources failed'
      : state === 'stale' ? 'Discovery sweep is overdue'
      : state === 'failed' ? 'Discovery sweep failed'
      : 'Discovery sweep status unavailable');
    text(box.querySelector('.health-detail'),
      (success ? 'Last successful discovery sweep ' + success.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) + '. ' : 'No successful automated discovery sweep has been recorded. ')
      + String(health.cadence || 'Weekly cadence').replace(/\.?$/, '.')
      + ' The eight authorities above were verified by hand on ' + data.verified_on + ' and do not depend on this sweep.'
      + (health.error ? ' The latest attempt reported: ' + health.error : ''));
    text(document.getElementById('last-updated'), success ? 'Sweep ' + success.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No successful sweep');

    var candidates = (data.documents || []).filter(function (doc) { return doc.source_tier !== 'Primary authority'; });
    text(document.getElementById('stat-candidate'), candidates.length);
    var list = document.getElementById('candidate-list');
    list.textContent = '';
    if (!candidates.length) {
      var empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = 'The last sweep surfaced no new official-domain candidates. That is not evidence that nothing was published — it means this search did not find it. Check the issuing bodies directly.';
      list.appendChild(empty);
      return;
    }
    candidates.forEach(function (doc) {
      var card = document.createElement('article');
      card.className = 'candidate';
      var heading = document.createElement('h3');
      var link = document.createElement('a');
      link.href = doc.url; link.rel = 'noopener noreferrer'; link.textContent = doc.title || doc.url;
      heading.appendChild(link);
      var rail = document.createElement('p');
      rail.className = 'rail';
      rail.textContent = [doc.category, doc.jurisdiction, doc.date].filter(Boolean).join(' · ') + ' — unreviewed candidate; nobody has opened this.';
      card.appendChild(heading); card.appendChild(rail);
      list.appendChild(card);
    });
  }).catch(function () {
    var box = document.getElementById('source-health');
    box.classList.add('failed');
    text(box.querySelector('.health-title'), 'Discovery endpoint unavailable');
    text(box.querySelector('.health-detail'), 'The sweep status could not be read. The eight verified authorities above are printed from this page and are unaffected.');
    text(document.getElementById('health-state'), 'Failed');
    text(document.getElementById('last-updated'), 'Sweep status unavailable');
    text(document.getElementById('stat-candidate'), '—');
    document.getElementById('candidate-list').textContent = 'Candidate list unavailable.';
  });
})();
</script>
</body>
</html>`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.send(html);
}

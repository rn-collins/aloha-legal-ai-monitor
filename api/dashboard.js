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
<style>
@font-face{font-family:'Manuale';font-style:italic;font-weight:400;font-display:swap;src:url('/fonts/manuale-italic-400-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Manuale';font-style:italic;font-weight:400;font-display:swap;src:url('/fonts/manuale-italic-400-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Manuale';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/manuale-normal-400-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Manuale';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/manuale-normal-400-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Manuale';font-style:normal;font-weight:500;font-display:swap;src:url('/fonts/manuale-normal-500-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Manuale';font-style:normal;font-weight:500;font-display:swap;src:url('/fonts/manuale-normal-500-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Manuale';font-style:normal;font-weight:600;font-display:swap;src:url('/fonts/manuale-normal-600-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Manuale';font-style:normal;font-weight:600;font-display:swap;src:url('/fonts/manuale-normal-600-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Manuale';font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/manuale-normal-700-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Manuale';font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/manuale-normal-700-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Golos Text';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/golostext-normal-400-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Golos Text';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/golostext-normal-400-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Golos Text';font-style:normal;font-weight:500;font-display:swap;src:url('/fonts/golostext-normal-500-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Golos Text';font-style:normal;font-weight:500;font-display:swap;src:url('/fonts/golostext-normal-500-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Golos Text';font-style:normal;font-weight:600;font-display:swap;src:url('/fonts/golostext-normal-600-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Golos Text';font-style:normal;font-weight:600;font-display:swap;src:url('/fonts/golostext-normal-600-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Golos Text';font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/golostext-normal-700-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Golos Text';font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/golostext-normal-700-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
/* Legal AI Guidance Monitor — a looseleaf citator, not a dashboard.

   This build declared Cormorant Garamond, Syne, Manrope and DM Mono on
   #F6F3EC, and so did aloha-ai-governance and set-for-life. One stylesheet,
   three unrelated builds.

   What this actually is: eight primary authorities on lawyers' use of AI, each
   one opened and read, with its citation, what it holds, what it does not
   establish, the duties it reaches, and the date a person verified it — plus a
   duty matrix and a separately fenced list of leads nobody has read. That is a
   citator: the looseleaf service a practitioner keeps in a binder and files
   updates into. It should look like one, not like a SaaS console.

   Manuale sets the reading text — it is a book serif, drawn for long passages.
   Golos Text sets the apparatus: citations, dates, duty keys, controls, matrix
   headers. Neither family is used anywhere else in this estate, and both are
   self-hosted from /fonts, which the build's own font-src 'self' already
   allows, so no CSP is touched.

   COLOUR RULE: structure is achromatic. Every hue on this page carries
   meaning and nothing else does — green for a healthy sweep, ochre for unread
   or degraded, brick for failed, stale or review-due, and the four badge hues
   for authority class. Teal previously did double duty as both the Aloha
   accent and "healthy"/"duty addressed", so green could not mean green. There
   is no decorative accent now; links and focus are ink. */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --paper: #FAF8F4;      /* warm book white — off the estate cream */
  --paper-sunk: #F2EFE9; /* the tint behind apparatus blocks */
  --ink: #14161A;
  --ink-soft: #43464C;
  --ink-key: #3A3D43;
  --rule: #14161A;       /* structural rules are ink, not grey */
  --rule-mid: #A8A49C;
  --rule-soft: #DCD8D0;
  /* Semantics — unchanged in meaning, and now the only hues on the page. */
  --ok: #14614A;
  --ochre: #6E4E10;
  --brick: #98301A;
}

body {
  font-family: 'Manuale', Georgia, serif;
  background: var(--paper);
  color: var(--ink);
  min-height: 100vh;
  line-height: 1.62;
  -webkit-text-size-adjust: 100%;
  font-synthesis-weight: none;
}

/* The apparatus — everything that is a key rather than prose. */
.brand, .doc-sub, .status-pill, .health-state, .stat-label, .stat-sub,
.rubric, .controls label, .controls input, .controls select, .controls button,
.result-count, .badge, .cite, .rail, .permalink, .field h4, .duties h4,
.duties li, table.matrix, .brief-foot, .footer, .doc-link, .empty {
  font-family: 'Golos Text', system-ui, sans-serif;
}
.cite, .rail, .stat-value, .status-pill, .health-state, table.matrix {
  font-variant-numeric: tabular-nums lining-nums;
  font-feature-settings: 'tnum' 1, 'lnum' 1;
}

.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
.skip-link { position: absolute; left: -9999px; }
.skip-link:focus { position: static; display: inline-block; padding: 7px 11px; background: var(--ink); color: var(--paper); font-size: 13px; font-family: 'Golos Text', sans-serif; font-weight: 600; }
a { color: var(--ink); text-underline-offset: 2px; text-decoration-thickness: 1px; }
a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, summary:focus-visible {
  outline: 3px solid var(--ink); outline-offset: 2px; border-radius: 0;
}

.page { max-width: 960px; margin: 0 auto; padding: 46px max(20px,4vw) 64px; }

/* --- binder head -------------------------------------------------------- */
.header {
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 20px; flex-wrap: wrap; margin-bottom: 30px; padding-bottom: 16px;
  border-bottom: 3px solid var(--rule);
}
.brand { font-size: 10px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase; color: var(--ink-key); margin-bottom: 12px; display: flex; align-items: center; gap: 7px; }
.brand-dot { width: 7px; height: 7px; border-radius: 0; background: var(--ink); }
.doc-title { font-family: 'Manuale', Georgia, serif; font-size: clamp(31px,6vw,44px); font-weight: 700; line-height: 1.06; letter-spacing: -.014em; }
.doc-sub { font-size: 13px; color: var(--ink-soft); margin-top: 9px; max-width: 56ch; line-height: 1.6; }
.status-pill {
  display: flex; align-items: center; gap: 7px;
  background: transparent; border: 0; border-top: 3px solid var(--rule);
  border-radius: 0; padding: 7px 0 0; font-size: 10px; font-weight: 600;
  letter-spacing: .07em; text-transform: uppercase; color: var(--ink-key); white-space: nowrap;
}
.pulse { width: 7px; height: 7px; border-radius: 50%; background: var(--ok); }
@media (prefers-reduced-motion: no-preference) { .pulse { animation: pulse 2s ease-in-out infinite; } }
@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .35 } }

.standfirst {
  font-family: 'Manuale', Georgia, serif; font-size: 19px; line-height: 1.58;
  color: var(--ink); max-width: 64ch; margin-bottom: 24px;
}
.standfirst em { font-style: italic; }

/* --- sweep status: a stamped strip ------------------------------------- */
.health-banner {
  display: flex; justify-content: space-between; gap: 18px; align-items: center;
  flex-wrap: wrap; background: var(--paper-sunk);
  border: 0; border-left: 4px solid var(--ochre); border-radius: 0;
  padding: 13px 16px; margin-bottom: 18px;
}
.health-banner.healthy { border-left-color: var(--ok); }
.health-banner.failed, .health-banner.stale { border-left-color: var(--brick); }
.health-title { font-family: 'Manuale', Georgia, serif; font-size: 17px; font-weight: 700; line-height: 1.28; }
.health-detail { font-size: 13px; color: var(--ink-soft); margin-top: 4px; line-height: 1.55; max-width: 76ch; }
.health-state { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; white-space: nowrap; color: var(--ink-key); }

/* --- summary figures: ruled columns ------------------------------------ */
.stats-row {
  display: grid; grid-template-columns: repeat(auto-fit,minmax(150px,1fr)); gap: 0;
  margin-bottom: 30px; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule);
}
.stat-card { background: transparent; border: 0; border-left: 1px solid var(--rule-soft); border-radius: 0; padding: 13px 16px; }
.stat-card:first-child { border-left: 0; padding-left: 0; }
.stat-label { font-size: 9px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: var(--ink-key); margin-bottom: 6px; }
.stat-value { font-family: 'Manuale', Georgia, serif; font-size: 32px; font-weight: 700; color: var(--ink); line-height: 1; }
.stat-sub { font-size: 11px; color: var(--ink-soft); margin-top: 4px; line-height: 1.45; }

/* --- tab dividers ------------------------------------------------------- */
h2.rubric {
  font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
  color: var(--ink); margin: 46px 0 14px; padding-bottom: 7px;
  border-bottom: 3px solid var(--rule);
}
h2.rubric:first-of-type { margin-top: 0; }

.prose p { max-width: 68ch; margin-bottom: 14px; font-size: 16px; line-height: 1.66; }
.prose h3 { font-family: 'Manuale', Georgia, serif; font-size: 21px; font-weight: 700; margin: 24px 0 8px; line-height: 1.25; }
.note {
  background: var(--paper-sunk); border: 0; border-left: 4px solid var(--rule-mid);
  border-radius: 0; padding: 13px 16px; font-size: 14px; color: var(--ink-soft); margin: 18px 0; max-width: 72ch;
}
.note strong { color: var(--ink); }

/* --- controls: a filing slip, squared off ------------------------------ */
.controls {
  background: var(--paper-sunk); border: 0; border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule); border-radius: 0;
  padding: 16px 0; margin-bottom: 22px; display: grid; gap: 14px;
}
.controls .row { display: grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap: 12px; padding: 0 14px; }
.controls label { display: grid; gap: 5px; font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-key); min-width: 0; }
.controls input, .controls select {
  font-family: 'Golos Text', sans-serif; font-size: 14px; color: var(--ink);
  padding: 9px 11px; border: 1px solid var(--rule-mid); border-radius: 0;
  background: #fff; width: 100%; min-width: 0;
}
.controls .actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; padding: 0 14px; }
.controls button {
  font-family: 'Golos Text', sans-serif; font-size: 12px; font-weight: 700;
  letter-spacing: .06em; text-transform: uppercase; padding: 9px 15px;
  border-radius: 0; border: 1px solid var(--ink); background: var(--ink); color: var(--paper); cursor: pointer;
}
.controls button#reset, .controls button#copy-view { background: transparent; color: var(--ink); }
.controls button:hover { background: var(--ink-soft); color: var(--paper); border-color: var(--ink-soft); }
.result-count { font-size: 11px; font-weight: 600; color: var(--ink-key); letter-spacing: .04em; }

/* --- duty matrix: a ruled table, not a bordered box -------------------- */
.matrix-wrap { position: relative; overflow-x: auto; border: 0; border-top: 3px solid var(--rule); border-radius: 0; background: transparent; }
table.matrix { border-collapse: collapse; width: 100%; min-width: 720px; font-size: 12px; }
table.matrix th, table.matrix td { border-bottom: 1px solid var(--rule-soft); padding: 9px 10px; text-align: left; vertical-align: bottom; }
table.matrix thead th { font-size: 9px; letter-spacing: .07em; text-transform: uppercase; color: var(--ink-key); font-weight: 700; line-height: 1.35; border-bottom: 1px solid var(--rule); }
table.matrix tbody th { font-weight: 600; white-space: nowrap; font-size: 12.5px; }
table.matrix td { text-align: center; font-size: 15px; }
table.matrix td.on { color: var(--ink); font-weight: 700; }   /* "addressed" is now weight, not teal */
table.matrix td.off { color: #6A655C; }

/* --- the register: numbered entries on rules, not cards ---------------- */
.briefs { display: grid; gap: 0; }
.brief {
  background: transparent; border: 0; border-top: 1px solid var(--rule-mid);
  border-radius: 0; padding: 22px 0 24px; scroll-margin-top: 16px;
}
.brief:first-child { border-top: 0; }
.brief:target {
  /* there is no card to ring any more, so :target bleeds instead */
  background: var(--paper-sunk);
  box-shadow: -14px 0 0 var(--paper-sunk), 14px 0 0 var(--paper-sunk);
}
.brief--unread { border-left: 0; padding-left: 14px; box-shadow: inset 4px 0 0 var(--ochre); }
.brief-head { display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: start; }
.badge {
  font-size: 9px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  padding: 4px 7px; border-radius: 0; background: var(--paper-sunk); color: var(--ink-key); white-space: nowrap;
}
/* Badge hue encodes authority class, so it is information and stays. */
.badge--aba   { background: #E1EBE7; color: #14513E; }
.badge--bar   { background: #EFE7D6; color: #6A4A0F; }
.badge--court { background: #E6E1EE; color: #453569; }
.badge--case  { background: #F3E1DB; color: #8C2C17; }
.brief-headings h3 { font-family: 'Manuale', Georgia, serif; font-size: 23px; font-weight: 700; line-height: 1.2; }
.brief-headings h3 a { text-decoration: none; }
.brief-headings h3 a:hover { text-decoration: underline; }
.cite { font-size: 11.5px; font-weight: 500; color: var(--ink-key); margin-top: 6px; line-height: 1.5; letter-spacing: .01em; }
.rail { font-size: 12px; color: var(--ink-soft); margin-top: 4px; }
.permalink { font-size: 15px; text-decoration: none; color: #6A655C; padding: 2px 6px; border-radius: 0; }
.permalink:hover { color: var(--ink); background: var(--paper-sunk); }
.lede { font-family: 'Manuale', Georgia, serif; font-size: 18px; line-height: 1.52; margin: 14px 0 4px; max-width: 66ch; }
.fields { display: grid; gap: 12px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--rule-soft); }
.field h4 { font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-key); margin-bottom: 4px; }
.field p { font-size: 15px; max-width: 72ch; line-height: 1.6; }
.duties { margin-top: 14px; }
.duties h4 { font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-key); margin-bottom: 6px; }
.duties ul { list-style: none; display: flex; flex-wrap: wrap; gap: 6px; }
.duties li { font-size: 11px; font-weight: 500; padding: 3px 9px; border-radius: 0; background: transparent; border: 1px solid var(--rule-mid); color: var(--ink-key); }
.brief-foot { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--rule-soft); font-size: 12px; color: var(--ink-soft); }
.brief-foot p { margin-bottom: 4px; max-width: 76ch; line-height: 1.55; }
.doc-link { display: inline-block; margin-top: 6px; font-size: 12px; font-weight: 700; letter-spacing: .03em; }

.candidates { display: grid; gap: 0; }
.candidate {
  background: transparent; border: 0; border-top: 1px solid var(--rule-soft);
  border-radius: 0; padding: 14px 0 14px 14px; box-shadow: inset 4px 0 0 var(--ochre);
}
.candidate h3 { font-family: 'Manuale', Georgia, serif; font-size: 16px; font-weight: 700; line-height: 1.35; }
.candidate .rail { margin-top: 4px; }
.empty { background: var(--paper-sunk); border: 0; border-radius: 0; padding: 20px; font-size: 14px; color: var(--ink-soft); }

.footer {
  margin-top: 52px; padding-top: 20px; border-top: 3px solid var(--rule);
  display: flex; justify-content: space-between; gap: 22px; flex-wrap: wrap;
  font-size: 12px; color: var(--ink-soft);
}
.footer-name { font-family: 'Manuale', Georgia, serif; font-weight: 700; font-size: 17px; color: var(--ink); margin-bottom: 5px; }
.footer-creds { line-height: 1.75; }
.footer-contact { line-height: 1.9; text-align: right; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
@media (forced-colors: active) {
  .brief, .candidate, .stats-row, .stat-card, .health-banner, .controls,
  table.matrix th, table.matrix td, .matrix-wrap, h2.rubric, .header, .footer { border-color: CanvasText; }
  .badge, .duties li { border: 1px solid CanvasText; background: Canvas; color: CanvasText; }
  .brief--unread, .candidate { box-shadow: none; border-left: 4px solid CanvasText; }
  .brief:target { box-shadow: none; outline: 2px solid Highlight; }
  .pulse, .brand-dot { forced-color-adjust: none; background: CanvasText; }
  .controls button { background: ButtonFace; color: ButtonText; border-color: CanvasText; }
}
@media print {
  body { background: #fff; color: #000; font-size: 11pt; }
  .page { max-width: none; padding: 0; }
  .controls, .status-pill, .skip-link, .permalink { display: none; }
  .brief, .candidate { break-inside: avoid; }
  .matrix-wrap { overflow: visible; }
  .doc-link[href]::after, .brief-headings h3 a[href]::after { content: ' (' attr(href) ')'; font-size: 8pt; color: #444; word-break: break-all; }
  h2.rubric { break-after: avoid; }
}
@media (max-width: 640px) {
  .page { padding: 30px 18px 48px; }
  .brief-head { grid-template-columns: auto 1fr; }
  .permalink { display: none; }
  .footer-contact { text-align: left; }
  table.matrix { min-width: 640px; }
  .stat-card { border-left: 0; padding-left: 0; }
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

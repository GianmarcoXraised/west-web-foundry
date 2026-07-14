'use strict';

const { SITE, NAV } = require('./data');

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Organization + WebSite structured data present on every page (SEO / AEO / GEO).
function orgJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': SITE.baseUrl + '/#organization',
    name: SITE.name,
    description:
      'West Web Foundry designs, builds, hosts and maintains websites for small and medium businesses. Every client gets a named human account manager. Optimised for SEO, AEO and GEO.',
    url: SITE.baseUrl,
    email: SITE.email,
    foundingDate: SITE.founded,
    areaServed: 'Worldwide',
    slogan: 'Websites cast to last.',
    knowsAbout: ['Web design', 'Web development', 'SEO', 'Answer Engine Optimization', 'Generative Engine Optimization', 'Website hosting', 'Website maintenance'],
    makesOffer: [
      { '@type': 'Offer', name: 'Foundry Start' },
      { '@type': 'Offer', name: 'Foundry Growth' },
      { '@type': 'Offer', name: 'Foundry Commerce' },
    ],
  };
}

function navHtml(active) {
  const links = NAV.map(
    (n) =>
      `<li><a href="${n.href}"${active === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`
  ).join('');
  return `
<header class="nav" id="siteNav">
  <div class="wrap nav-inner">
    <a class="logo" href="/" aria-label="${esc(SITE.name)} home">
      <img class="logo-img" src="/logo.svg" alt="" width="40" height="40">
      <span class="logo-name">West Web Foundry</span>
    </a>
    <nav class="nav-links" id="navLinks" aria-label="Primary">
      <ul>${links}</ul>
      <a class="nav-login mobile-only" href="/login">Client login</a>
      <a class="btn btn-molten mobile-only" href="/book">Book a call</a>
    </nav>
    <div class="nav-cta">
      <a class="nav-login" href="/login">Client login</a>
      <a class="btn btn-molten" href="/book">Book a call</a>
    </div>
    <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>`;
}

function footerHtml() {
  const cols = NAV.map((n) => `<a href="${n.href}">${esc(n.label)}</a>`).join('');
  return `
<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div class="footer-brand">
        <a class="logo" href="/"><img class="logo-img" src="/logo.svg" alt="" width="40" height="40"><span class="logo-name">West Web Foundry</span></a>
        <p>Websites cast to last — designed, built and cared for by real people. One upfront price, one small monthly fee, a named human who looks after everything.</p>
        <a class="btn btn-molten" href="/book">Book a free call</a>
      </div>
      <nav class="footer-links" aria-label="Footer">
        <div><h4>Explore</h4>${cols}</div>
        <div><h4>Clients</h4><a href="/login">Client login</a><a href="/register">Create account</a><a href="/book">Book a call</a></div>
        <div><h4>Legal</h4><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></div>
      </nav>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} ${esc(SITE.name)} · All prices include VAT.</span>
      <span>Made with care by real people.</span>
    </div>
  </div>
</footer>`;
}

/**
 * layout({ title, description, canonical, active, jsonld, bodyClass, content })
 */
function layout(opts) {
  const {
    title,
    description,
    canonical = '/',
    active = '',
    jsonld = [],
    bodyClass = '',
    content = '',
  } = opts;

  const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const url = SITE.baseUrl + (canonical === '/' ? '/' : canonical);
  const schemas = [orgJsonLd(), ...jsonld];
  const jsonldTags = schemas
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="theme-color" content="#E4560A">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="/logo.svg">
<link rel="stylesheet" href="/css/site.css">
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFB86B"/><stop offset="1" stop-color="#E4560A"/></linearGradient></defs></svg>
${jsonldTags}
</head>
<body class="${esc(bodyClass)}">
<div class="aurora" aria-hidden="true"><span class="orb o1"></span><span class="orb o2"></span><span class="orb o3"></span><span class="grain"></span></div>
<a class="skip" href="#main">Skip to content</a>
${navHtml(active)}
<main id="main">
${content}
</main>
${footerHtml()}
<script src="/js/site.js" defer></script>
</body>
</html>`;
}

module.exports = { layout, esc };

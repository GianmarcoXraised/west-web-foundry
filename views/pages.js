'use strict';

const { layout, esc } = require('./layout');
const { SITE, SERVICES, PACKAGES, WORK, STATS, RESULTS, FAQS, PROCESS, NEWS, ICONS } = require('./data');

const CHECK = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4 10-11" stroke="url(#g)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const fmtDate = (s) => new Date(s + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/* ---------------- reusable partials ---------------- */

function accountManagerCard() {
  return `
<aside class="am-card reveal">
  <div class="am-top">
    <span class="am-avatar">${ICONS.person}</span>
    <div>
      <div class="am-role">Your account manager</div>
      <h3>A real human, not a bot</h3>
    </div>
  </div>
  <p>You're never handed a template and left alone. A named person looks after your site, makes your edits and picks up the phone.</p>
  <ul class="am-list">
    <li>Knows your business by name</li>
    <li>Makes your edits personally</li>
    <li>One message or one call away</li>
    <li>Book a call any time from your dashboard</li>
  </ul>
</aside>`;
}

function statsStrip() {
  return `
<section class="stats">
  <div class="wrap stats-grid">
    ${STATS.map((s) => `<div class="stat-i reveal"><div class="n">${esc(s.value)}<small>${esc(s.unit)}</small></div><div class="l">${esc(s.label)}</div></div>`).join('')}
  </div>
</section>`;
}

function servicesGrid() {
  return `<div class="grid g3">
    ${SERVICES.map((s) => `
    <article class="card reveal">
      <div class="svc-ico">${ICONS[s.icon]}</div>
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.text)}</p>
    </article>`).join('')}
  </div>`;
}

function currencyToolbar() {
  return `<div class="currency" role="group" aria-label="Currency">
    <button data-cur-btn="usd" aria-pressed="true">$ USD</button>
    <button data-cur-btn="gbp" aria-pressed="false">£ GBP</button>
    <button data-cur-btn="eur" aria-pressed="false">€ EUR</button>
  </div>`;
}

function packagesGrid() {
  return `<div class="pk-grid">
    ${PACKAGES.map((p) => `
    <article class="pk reveal">
      <div class="pk-code">${esc(p.code)}</div>
      <h3>${esc(p.name)}</h3>
      <p class="pk-tag">${esc(p.tag)}</p>
      <div class="pk-price"><span data-usd="${esc(p.price.usd)}" data-gbp="${esc(p.price.gbp)}" data-eur="${esc(p.price.eur)}">${esc(p.price.usd)}</span></div>
      <div class="pk-mo">then <span data-usd="${esc(p.monthly.usd)}" data-gbp="${esc(p.monthly.gbp)}" data-eur="${esc(p.monthly.eur)}">${esc(p.monthly.usd)}</span>/mo care plan</div>
      <div class="pk-vat">One-off build fee · VAT included</div>
      <ul>${p.features.map((f) => `<li>${CHECK}<span>${esc(f)}</span></li>`).join('')}</ul>
      <a class="btn btn-molten" href="/contact">Start with ${esc(p.name.replace('Foundry ', ''))}</a>
    </article>`).join('')}
  </div>`;
}

function workGrid() {
  const lines = '<div class="l" style="width:90%"></div><div class="l" style="width:70%"></div><div class="l" style="width:80%"></div>';
  return `<div class="work-grid">
    ${WORK.map((w) => {
      const inner = `
      <div class="thumb" style="background:linear-gradient(135deg,${esc(w.accent)},#2A1305)">
        <div class="mock"><div class="bar"><i></i><i></i><i></i></div><div class="body">${lines}</div></div>
      </div>
      <div class="body-txt">
        <div class="domain">${esc(w.domain)}</div>
        <h3>${esc(w.name)}</h3>
        <div class="sector">${esc(w.sector)}</div>
        <p>${esc(w.blurb)}</p>
        ${w.url ? `<span class="visit">Visit site →</span>` : ''}
      </div>`;
      return w.url
        ? `<a class="work reveal" href="${esc(w.url)}" target="_blank" rel="noopener">${inner}</a>`
        : `<div class="work ph reveal">${inner}</div>`;
    }).join('')}
  </div>`;
}

function resultsGrid() {
  return `<div class="results">
    ${RESULTS.map((r) => `<div class="result reveal"><div class="m">${esc(r.metric)}</div><div class="rl">${esc(r.label)}</div><div class="rn">${esc(r.note)}</div></div>`).join('')}
  </div>`;
}

function humanBand() {
  return `
<div class="human reveal">
  <div class="human-grid">
    <div>
      <span class="eyebrow" style="color:var(--gold)">The human difference</span>
      <h2 style="margin:14px 0 18px">Real people who actually care about your business</h2>
      <p>Plenty of agencies take your money, hand you a template and vanish — leaving you shouting at a chatbot when something breaks. We built West Web Foundry to be the opposite. We use smart tools to move fast, but a named human account manager is responsible for your website from the very first call. They know your business, make your edits themselves, and are always one message or one call away.</p>
    </div>
    <div class="quote">
      <p>"You're never left alone with a form and a robot. Your account manager looks after everything — and you can book a call with them whenever you like."</p>
      <div class="by">— How we work, every single day</div>
    </div>
  </div>
</div>`;
}

function processSteps() {
  return `<div class="steps">
    ${PROCESS.map((s) => `<div class="step reveal"><h3>${esc(s.step)}</h3><p>${esc(s.text)}</p><span class="when">${esc(s.when)}</span></div>`).join('')}
  </div>`;
}

function faqSection() {
  return `<div class="faq-list">
    ${FAQS.map((f) => `<details class="reveal"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}
  </div>`;
}

function newsGrid(limit) {
  const items = (limit ? NEWS.slice(0, limit) : NEWS);
  return `<div class="news-grid">
    ${items.map((n) => `
    <a class="post reveal" href="/news/${esc(n.slug)}">
      <div class="ph-img"></div>
      <div class="p-body">
        <div class="date">${esc(fmtDate(n.date))}</div>
        <h3>${esc(n.title)}</h3>
        <p>${esc(n.excerpt)}</p>
        <span class="read">Read article →</span>
      </div>
    </a>`).join('')}
  </div>`;
}

function ctaBand(title, text) {
  return `
<section class="section"><div class="wrap"><div class="cta-band reveal">
  <h2>${esc(title)}</h2>
  <p>${esc(text)}</p>
  <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
    <a class="btn btn-cream btn-lg" data-book href="/book">Book a free call</a>
    <a class="btn btn-ghost-light btn-lg" href="/packages">See packages</a>
  </div>
</div></div></section>`;
}

const faqJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

const breadcrumb = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem', position: i + 1, name: it.name, item: SITE.baseUrl + it.href,
  })),
});

/* ---------------- pages ---------------- */

function home() {
  const content = `
<section class="hero">
  <span class="shine" aria-hidden="true"></span>
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow" style="color:var(--gold)">Web studio · people first</span>
      <h1 style="margin-top:18px">Websites <span class="grad-text">cast to last</span>, cared for by real people.</h1>
      <p class="lead">We design, build, host and look after your website — so you never have to. One upfront price, one small monthly fee, and a named human account manager who handles everything. VAT included, no surprises.</p>
      <div class="hero-ctas">
        <a class="btn btn-cream btn-lg" href="/packages">See packages — from $890</a>
        <a class="btn btn-ghost-light btn-lg" data-book href="/book">Book a free call</a>
      </div>
      <div class="hero-trust">
        <span>Live in 2–4 weeks</span><span>Real human support</span><span>SEO · AEO · GEO built in</span><span>VAT included</span>
      </div>
    </div>
    ${accountManagerCard()}
  </div>
</section>

${statsStrip()}

<section class="section"><div class="wrap">
  <div class="section-head reveal">
    <span class="eyebrow">What we do</span>
    <h2>Everything handled, start to finish</h2>
    <p class="lead">Most studios hand you a website and walk away. We stay. Your site is designed, built, hosted and maintained by the same team — with a real person you can call.</p>
  </div>
  ${servicesGrid()}
</div></section>

<section class="section"><div class="wrap">${humanBand()}</div></section>

<section class="section"><div class="wrap">
  <div class="section-head reveal">
    <span class="eyebrow">Our work</span>
    <h2>Sites we've cast, businesses we've grown</h2>
    <p class="lead">A few of the sites we've built — and the kind of results a fast, well-optimised website delivers.</p>
  </div>
  ${workGrid()}
  <div style="margin-top:46px">${resultsGrid()}</div>
  <p style="text-align:center;margin-top:22px;color:var(--txt-faint);font-size:.86rem">Figures are typical outcomes for a well-built, optimised site. Your results will vary with your market and starting point.</p>
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head center reveal">
    <span class="eyebrow">Packages</span>
    <h2>One upfront price. One small monthly fee.</h2>
    <p class="lead">The one-off fee covers design and build. The monthly fee covers domain, hosting, security and your edits. All prices include VAT.</p>
    <div style="margin-top:8px">${currencyToolbar()}</div>
  </div>
  ${packagesGrid()}
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head reveal">
    <span class="eyebrow">Latest from the foundry</span>
    <h2>News &amp; guides</h2>
  </div>
  ${newsGrid(3)}
</div></section>

${ctaBand('Ready to be found — and looked after?', 'Book a free 30-minute call with a real person. We\'ll talk through your business and exactly what your website needs to do.')}
`;
  return layout({
    active: '',
    canonical: '/',
    title: '',
    description: 'West Web Foundry designs, builds, hosts and maintains websites for small & medium businesses — with a named human account manager. One upfront price (VAT included), a small monthly fee, and SEO, AEO & GEO built in.',
    content,
    jsonld: [breadcrumb([{ name: 'Home', href: '/' }])],
  });
}

function services() {
  const content = `
<section class="section"><div class="wrap">
  <div class="section-head reveal">
    <span class="eyebrow">Services</span>
    <h1>Everything your website needs — handled by people</h1>
    <p class="lead">From the first sketch to the thousandth edit, West Web Foundry designs, builds, hosts, optimises and maintains your website. You get one team, one price, and one named human who owns the outcome.</p>
  </div>
  ${servicesGrid()}
</div></section>

<section class="section"><div class="wrap">${humanBand()}</div></section>

<section class="section"><div class="wrap">
  <div class="section-head reveal">
    <span class="eyebrow">Search that works everywhere</span>
    <h2>SEO, AEO and GEO — built into every page</h2>
    <p class="lead">Being found is no longer just about Google. We build your site to show up across classic search, answer engines and the new AI tools your customers now ask.</p>
  </div>
  <div class="grid g3">
    <article class="card reveal"><div class="svc-ico">${ICONS.seo}</div><h3>SEO</h3><p>Search Engine Optimization: clean structure, fast load times, rich metadata and internal links so Google ranks you for the terms your customers search.</p></article>
    <article class="card reveal"><div class="svc-ico">${ICONS.copy}</div><h3>AEO</h3><p>Answer Engine Optimization: clear question-and-answer content and structured data so voice assistants and answer boxes quote your business directly.</p></article>
    <article class="card reveal"><div class="svc-ico">${ICONS.domain}</div><h3>GEO</h3><p>Generative Engine Optimization: consistent, well-marked-up facts so AI tools like ChatGPT and Gemini can find, trust and recommend you.</p></article>
  </div>
</div></section>

${ctaBand('Let\'s build something worth finding', 'Tell us about your business and we\'ll show you exactly what your site could do.')}
`;
  return layout({
    active: '/services',
    canonical: '/services',
    title: 'Services',
    description: 'Web design, build, hosting, copywriting, ongoing edits, security and SEO/AEO/GEO — all handled by West Web Foundry, with a named human account manager for every client.',
    content,
    jsonld: [
      breadcrumb([{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }]),
      { '@context': 'https://schema.org', '@type': 'Service', serviceType: 'Web design & maintenance', provider: { '@id': SITE.baseUrl + '/#organization' }, description: 'End-to-end website design, build, hosting and maintenance with a human account manager and SEO/AEO/GEO optimisation.' },
    ],
  });
}

function work() {
  const content = `
<section class="section"><div class="wrap">
  <div class="section-head reveal">
    <span class="eyebrow">Our work</span>
    <h1>Sites we've cast — and the results they deliver</h1>
    <p class="lead">Every site we build is engineered to be fast, findable and human. Here's a selection of our work, with more case studies on the way.</p>
  </div>
  ${workGrid()}
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head reveal">
    <span class="eyebrow">Results</span>
    <h2>What a well-built website is worth</h2>
    <p class="lead">A fast, well-optimised site doesn't just look better — it brings in more of the right customers. These are the kinds of gains a rebuild typically delivers.</p>
  </div>
  ${resultsGrid()}
  <p style="text-align:center;margin-top:22px;color:var(--txt-faint);font-size:.86rem">Illustrative outcomes for a well-optimised site. Actual results depend on your market, budget and starting point.</p>
</div></section>

${ctaBand('Want results like these?', 'Book a free call and we\'ll show you what your website could be doing for your business.')}
`;
  return layout({
    active: '/work',
    canonical: '/work',
    title: 'Our work',
    description: 'A selection of websites built by West Web Foundry, including xraised.com and prisma-house.com — fast, findable sites engineered to grow small and medium businesses.',
    content,
    jsonld: [breadcrumb([{ name: 'Home', href: '/' }, { name: 'Our work', href: '/work' }])],
  });
}

function packages() {
  const content = `
<section class="section"><div class="wrap">
  <div class="section-head center reveal">
    <span class="eyebrow">Packages</span>
    <h1>Simple, honest pricing — VAT included</h1>
    <p class="lead">One upfront fee covers design and build. One small monthly fee covers your domain, hosting, security and edits — plus a named account manager. No surprise invoices, ever.</p>
    <div style="margin-top:8px">${currencyToolbar()}</div>
  </div>
  ${packagesGrid()}
  <p style="text-align:center;margin-top:30px;color:var(--txt-soft)">All prices include VAT. You own your domain and your content — always. Need something bigger, like a booking system or member portal? <a href="/contact" style="color:var(--ember);font-weight:600">Talk to us</a>.</p>
</div></section>

<section class="section"><div class="wrap">${humanBand()}</div></section>

<section class="section"><div class="wrap">
  <div class="section-head center reveal"><span class="eyebrow">Good to know</span><h2>Common questions</h2></div>
  ${faqSection()}
</div></section>

${ctaBand('Not sure which package fits?', 'Book a free call. We\'ll listen first, then recommend the right fit — no pressure.')}
`;
  return layout({
    active: '/packages',
    canonical: '/packages',
    title: 'Packages & pricing',
    description: 'Three simple website packages from West Web Foundry — Start, Growth and Commerce. One upfront fee plus a small monthly care plan, VAT included, with a human account manager for every client.',
    content,
    jsonld: [
      breadcrumb([{ name: 'Home', href: '/' }, { name: 'Packages', href: '/packages' }]),
      faqJsonLd(),
      ...PACKAGES.map((p) => ({
        '@context': 'https://schema.org', '@type': 'Offer', name: p.name, description: p.tag,
        priceCurrency: 'USD', price: p.price.usd.replace(/[^0-9.]/g, ''),
        seller: { '@id': SITE.baseUrl + '/#organization' }, valueAddedTaxIncluded: true,
      })),
    ],
  });
}

function process() {
  const content = `
<section class="section"><div class="wrap">
  <div class="section-head reveal">
    <span class="eyebrow">Process</span>
    <h1>From first call to live site in four steps</h1>
    <p class="lead">No jargon, no black box. Here's exactly how we work — with a real person guiding you at every stage.</p>
  </div>
  ${processSteps()}
</div></section>

<section class="section"><div class="wrap">${humanBand()}</div></section>

${ctaBand('Start with a friendly call', 'Thirty minutes, no obligation. We\'ll learn about your business and give you a fixed quote.')}
`;
  return layout({
    active: '/process',
    canonical: '/process',
    title: 'Our process',
    description: 'How West Web Foundry works: a free call, a homepage design, a full build optimised for SEO/AEO/GEO, then launch and ongoing care from a named human account manager.',
    content,
    jsonld: [breadcrumb([{ name: 'Home', href: '/' }, { name: 'Process', href: '/process' }])],
  });
}

function faq() {
  const content = `
<section class="section"><div class="wrap">
  <div class="section-head center reveal">
    <span class="eyebrow">FAQ</span>
    <h1>Questions, answered plainly</h1>
    <p class="lead">Everything you might want to know before we start. Still curious? A real person is one message away.</p>
  </div>
  ${faqSection()}
</div></section>
${ctaBand('Still have a question?', 'Book a free call or drop us a message — a real person will get back to you within a business day.')}
`;
  return layout({
    active: '/faq',
    canonical: '/faq',
    title: 'FAQ',
    description: 'Answers to common questions about West Web Foundry — ownership, timelines, human account managers, SEO/AEO/GEO, pricing (VAT included) and ongoing edits.',
    content,
    jsonld: [breadcrumb([{ name: 'Home', href: '/' }, { name: 'FAQ', href: '/faq' }]), faqJsonLd()],
  });
}

function newsIndex() {
  const content = `
<section class="section"><div class="wrap">
  <div class="section-head reveal">
    <span class="eyebrow">News &amp; guides</span>
    <h1>From the foundry</h1>
    <p class="lead">Plain-English guides on getting found online, why humans still matter, and how to make your website work harder for your business.</p>
  </div>
  ${newsGrid()}
</div></section>
${ctaBand('Want this handled for you?', 'We build all of this into every site — and a real person keeps it current. Book a free call.')}
`;
  return layout({
    active: '/news',
    canonical: '/news',
    title: 'News & guides',
    description: 'Guides and insights from West Web Foundry on SEO, AEO and GEO, website speed, and why every client deserves a real human account manager.',
    content,
    jsonld: [breadcrumb([{ name: 'Home', href: '/' }, { name: 'News', href: '/news' }])],
  });
}

function article(slug) {
  const post = NEWS.find((n) => n.slug === slug);
  if (!post) return null;
  const paras = post.body.map((p) => `<p>${esc(p)}</p>`).join('');
  const content = `
<section class="section"><div class="wrap">
  <article class="article reveal">
    <a class="back" href="/news">← All articles</a>
    <div class="hero-img"></div>
    <div class="meta">${esc(fmtDate(post.date))} · ${esc(post.author)}</div>
    <h1>${esc(post.title)}</h1>
    ${paras}
    <a class="back" href="/news">← Back to all articles</a>
  </article>
</div></section>
${ctaBand('Let a real person handle it', 'We build this into every site and keep it current for you. Book a free call.')}
`;
  return layout({
    active: '/news',
    canonical: '/news/' + post.slug,
    title: post.title,
    description: post.excerpt,
    content,
    jsonld: [
      breadcrumb([{ name: 'Home', href: '/' }, { name: 'News', href: '/news' }, { name: post.title, href: '/news/' + post.slug }]),
      {
        '@context': 'https://schema.org', '@type': 'Article', headline: post.title,
        description: post.excerpt, datePublished: post.date, dateModified: post.date,
        author: { '@type': 'Organization', name: SITE.name },
        publisher: { '@id': SITE.baseUrl + '/#organization' },
        mainEntityOfPage: SITE.baseUrl + '/news/' + post.slug,
      },
    ],
  });
}

function book() {
  const content = `
<section class="section"><div class="wrap">
  <div class="section-head center reveal">
    <span class="eyebrow">Book a meeting</span>
    <h1>Grab a free 30-minute call</h1>
    <p class="lead">Pick a time that suits you and talk to a real person — your future account manager. We'll cover your business, your goals and exactly what your website needs to do. No obligation, no jargon.</p>
  </div>
  <div id="calendlyEmbed"></div>
  <div class="book-fallback" id="bookFallback" style="display:none">
    <h3 style="font-size:1.5rem;margin-bottom:12px">Let's find a time</h3>
    <p style="color:var(--txt-soft);max-width:46ch;margin:0 auto 24px">Our live calendar is being connected. In the meantime, send us a note and a real person will reply within one business day to book your call.</p>
    <a class="btn btn-molten btn-lg" href="/contact">Message us to book →</a>
  </div>
</div></section>
`;
  return layout({
    active: '',
    canonical: '/book',
    title: 'Book a free call',
    description: 'Book a free 30-minute call with West Web Foundry. Talk to a real person — your future account manager — about your business and your website.',
    content,
    jsonld: [breadcrumb([{ name: 'Home', href: '/' }, { name: 'Book a call', href: '/book' }])],
  });
}

function contact() {
  const content = `
<section class="section"><div class="wrap">
  <div class="contact-grid">
    <div class="contact-side reveal">
      <span class="eyebrow">Contact</span>
      <h1 style="margin:14px 0 18px">Tell us about your business</h1>
      <p class="lead">Fill in the form and your account manager will reply within one business day with next steps and a time for your free call.</p>
      <p style="margin-top:24px;color:var(--txt-soft)">Prefer email? Write to us directly:</p>
      <p class="mono" style="font-size:1.05rem">${esc(SITE.email)}</p>
      <p style="margin-top:24px"><a class="btn btn-cream" data-book href="/book">Or book a call →</a></p>
    </div>
    <form class="form reveal" id="contactForm">
      <div class="form-note" id="formNote"></div>
      <div class="form-row">
        <label>Your name<input type="text" name="name" required autocomplete="name"></label>
        <label>Email<input type="email" name="email" required autocomplete="email"></label>
      </div>
      <label>Business name &amp; what you do<input type="text" name="business" required></label>
      <label>Package you're interested in
        <select name="package">
          <option>Not sure yet</option>
          ${PACKAGES.map((p) => `<option>${esc(p.name)} — from ${esc(p.price.usd)}</option>`).join('')}
          <option>Something custom</option>
        </select>
      </label>
      <label>Anything else we should know?<textarea name="message" rows="4"></textarea></label>
      <button type="submit" class="btn btn-molten btn-lg" id="contactSubmit">Send message</button>
      <p style="font-size:.82rem;color:var(--txt-faint);text-align:center">No spam, no pressure. Just a reply from a real person.</p>
    </form>
  </div>
</div></section>
`;
  return layout({
    active: '/contact',
    canonical: '/contact',
    title: 'Contact',
    description: 'Get in touch with West Web Foundry. Tell us about your business and your account manager will reply within one business day.',
    content,
    jsonld: [breadcrumb([{ name: 'Home', href: '/' }, { name: 'Contact', href: '/contact' }])],
  });
}

module.exports = { home, services, work, packages, process, faq, newsIndex, article, book, contact, NEWS };

'use strict';

// Central content for the marketing site. Editing copy, packages, work or news
// here updates every page + the structured data automatically.

const SITE = {
  name: 'West Web Foundry',
  tagline: 'Websites cast to last — designed, built and cared for by real people.',
  baseUrl: process.env.SITE_URL || 'https://westwebfoundry.com',
  email: 'hello@westwebfoundry.com',
  founded: '2026',
};

// Primary navigation — one real page per item.
const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'Our work', href: '/work' },
  { label: 'Packages', href: '/packages' },
  { label: 'Process', href: '/process' },
  { label: 'News', href: '/news' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

// Stylised line-icons (inline SVG, gradient stroke) — no emojis.
const ICONS = {
  design: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 6 8 14v20l16 8 16-8V14L24 6Z" stroke="url(#g)" stroke-width="2.2" stroke-linejoin="round"/><path d="M24 6v36M8 14l16 8 16-8" stroke="url(#g)" stroke-width="2.2" stroke-linejoin="round"/></svg>',
  domain: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="17" stroke="url(#g)" stroke-width="2.2"/><path d="M7 24h34M24 7c5 5 5 29 0 34-5-5-5-29 0-34Z" stroke="url(#g)" stroke-width="2.2"/></svg>',
  copy: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M14 8h20l6 6v26H14V8Z" stroke="url(#g)" stroke-width="2.2" stroke-linejoin="round"/><path d="M20 20h14M20 27h14M20 34h9" stroke="url(#g)" stroke-width="2.2" stroke-linecap="round"/></svg>',
  seo: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="21" cy="21" r="13" stroke="url(#g)" stroke-width="2.2"/><path d="m31 31 9 9" stroke="url(#g)" stroke-width="2.2" stroke-linecap="round"/><path d="M15 22l4 4 8-9" stroke="url(#g)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  edits: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M30 8l10 10-20 20-12 2 2-12L30 8Z" stroke="url(#g)" stroke-width="2.2" stroke-linejoin="round"/><path d="M26 12l10 10" stroke="url(#g)" stroke-width="2.2"/></svg>',
  care: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 40S8 30 8 18a8 8 0 0 1 16-3 8 8 0 0 1 16 3c0 12-16 22-16 22Z" stroke="url(#g)" stroke-width="2.2" stroke-linejoin="round"/></svg>',
  person: '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="16" r="8" stroke="url(#g)" stroke-width="2.2"/><path d="M10 40c0-8 6-13 14-13s14 5 14 13" stroke="url(#g)" stroke-width="2.2" stroke-linecap="round"/></svg>',
};

const SERVICES = [
  { icon: 'design', title: 'Design & build', text: 'A custom design shaped around your business — never a template with your logo dropped in. Fast, mobile-first and built to turn visitors into enquiries.' },
  { icon: 'domain', title: 'Domain & hosting', text: 'We register your domain, configure DNS, email records and SSL, and host your site on fast, reliable infrastructure. Renewals are handled inside your plan.' },
  { icon: 'copy', title: 'Copy & content', text: 'Send us rough notes and your account manager turns them into clear, persuasive page copy — in the language and tone your customers actually respond to.' },
  { icon: 'seo', title: 'SEO, AEO & GEO', text: 'Clean structure, rich metadata, structured data and fast load times — so you show up in Google, in AI answers and in the new generative search engines.' },
  { icon: 'edits', title: 'Ongoing edits', text: 'New photos, updated prices, a fresh testimonial? Message your account manager and it is done. No dashboards to learn, no freelancers to chase.' },
  { icon: 'care', title: 'Security & backups', text: 'Daily backups, uptime monitoring and updates handled quietly in the background. If something ever breaks, a real person fixes it before you notice.' },
];

// Three packages. None is "highlighted". Prices include VAT.
const PACKAGES = [
  {
    code: 'WWF · START',
    name: 'Foundry Start',
    tag: 'A sharp, professional presence for a business that needs to be found and trusted online.',
    price: { usd: '$890', gbp: '£690', eur: '€820' },
    monthly: { usd: '$20', gbp: '£16', eur: '€19' },
    features: [
      '4–5 page website, custom designed',
      'Mobile-first, fast & accessible',
      'Domain registered & managed for you',
      'Hosting, SSL & daily backups',
      'Contact form & map',
      'SEO / AEO / GEO foundations',
      'Up to 2 content edits a month',
      'A named account manager',
    ],
  },
  {
    code: 'WWF · GROWTH',
    name: 'Foundry Growth',
    tag: 'For businesses ready to win customers online — not just exist online.',
    price: { usd: '$1,590', gbp: '£1,240', eur: '€1,460' },
    monthly: { usd: '$39', gbp: '£31', eur: '€36' },
    features: [
      'Up to 10 pages',
      'Professional copywriting included',
      'Blog / news section',
      'On-page SEO, AEO & GEO for every page',
      'Google Business Profile setup',
      'Analytics & a monthly human report',
      'Up to 5 content edits a month',
      'Priority account manager',
    ],
  },
  {
    code: 'WWF · COMMERCE',
    name: 'Foundry Commerce',
    tag: 'A complete online store — set up, connected to payments and ready to sell.',
    price: { usd: '$2,790', gbp: '£2,190', eur: '€2,560' },
    monthly: { usd: '$69', gbp: '£54', eur: '€63' },
    features: [
      'Online store, up to 50 products',
      'Stripe / PayPal payments',
      'Shipping & tax configuration',
      'Order & confirmation emails',
      'Product upload done for you',
      'A live training session',
      'Up to 8 edits a month + store support',
      'Dedicated account manager',
    ],
  },
];

// Real work + room for more.
const WORK = [
  {
    name: 'Xraised',
    url: 'https://www.xraised.com',
    domain: 'xraised.com',
    sector: 'Media & interviews platform',
    blurb: 'A bold, fast editorial platform built to scale — clean structure, strong storytelling and search visibility from day one.',
    accent: '#E4560A',
  },
  {
    name: 'Prisma House',
    url: 'https://www.prisma-house.com',
    domain: 'prisma-house.com',
    sector: 'Design & lifestyle brand',
    blurb: 'An elegant, image-led brand site with a premium feel and a structure tuned for discovery and conversion.',
    accent: '#B26B00',
  },
  {
    name: 'Your project next',
    url: '',
    domain: 'reserved for a future case study',
    sector: 'Coming soon',
    blurb: 'We keep a little space here for the work we are shipping right now. Yours could sit alongside these.',
    accent: '#FF9A3D',
    placeholder: true,
  },
];

// Illustrative outcome stats — replace with your verified numbers over time.
const STATS = [
  { value: '2–4', unit: 'weeks', label: 'from first call to live site' },
  { value: '90+', unit: '/100', label: 'typical PageSpeed performance score' },
  { value: '3×', unit: '', label: 'more enquiries after a rebuild, on average' },
  { value: '<1', unit: 'day', label: 'to get a real human reply' },
];

const RESULTS = [
  { metric: '+68%', label: 'organic search traffic', note: 'within six months of launch, driven by SEO/AEO/GEO foundations.' },
  { metric: '+142%', label: 'enquiry form submissions', note: 'after clearer messaging and faster load times.' },
  { metric: '−54%', label: 'bounce rate', note: 'once pages loaded in under two seconds on mobile.' },
];

const FAQS = [
  { q: 'Do I own my website and domain?', a: 'Yes. The domain is registered in your name and the content is yours. If you ever leave, we hand everything over cleanly — no hostage situations.' },
  { q: 'Is there really a real person behind my account?', a: 'Always. Every client gets a named account manager — a human who knows your business, makes your edits and picks up the phone. We use smart tools to work faster, but a person is responsible for your site, start to finish.' },
  { q: 'How long does it take to go live?', a: 'Start and Growth sites usually launch in 2–4 weeks. Commerce projects typically take 4–8 weeks depending on scope. You get a clear timeline on your first call.' },
  { q: 'What does SEO, AEO and GEO actually mean?', a: 'SEO helps you rank in traditional search like Google. AEO (Answer Engine Optimization) helps you appear in direct answers and voice results. GEO (Generative Engine Optimization) helps AI tools like ChatGPT and Gemini cite your business. We build all three into every page.' },
  { q: 'What if I need changes after launch?', a: 'That is exactly what your care plan is for. Message your account manager and we make the edit — text, images, prices, new sections. Each package includes a monthly edit allowance, and bigger changes are quoted upfront.' },
  { q: 'Are the prices really all-in?', a: 'Yes. Prices include VAT. The one-off fee covers design and build; the monthly fee covers domain, hosting, security and your edits. The only extras are things you ask us to add — always quoted before we start.' },
  { q: 'Can I book a call with my account manager any time?', a: 'Yes. From your client dashboard you can book a call with your account manager whenever you like. You are never left alone with a form and a robot.' },
];

const PROCESS = [
  { step: 'The call', when: 'Day 1', text: 'A free, friendly 30-minute call with a real person. We learn about your business, your customers and what the site needs to do — then give you a fixed quote, no vague estimates.' },
  { step: 'The cast', when: 'Week 1', text: 'Your account manager designs your homepage first and shares it for feedback. Nothing gets built until you love the direction.' },
  { step: 'The build', when: 'Weeks 2–3', text: 'We build every page, write or polish the copy, and set up your domain, hosting and email records behind the scenes — optimised for SEO, AEO and GEO throughout.' },
  { step: 'Launch & care', when: 'Week 3–4 →', text: 'Your site goes live. From then on your account manager keeps it fast, secure and up to date — and makes your edits whenever you need them. You can book a call any time.' },
];

const NEWS = [
  {
    slug: 'seo-aeo-geo-explained',
    title: 'SEO, AEO and GEO: how to be found in the age of AI search',
    date: '2026-06-24',
    author: 'The West Web Foundry team',
    excerpt: 'Search is no longer just ten blue links. Here is how small businesses stay visible across Google, answer engines and generative AI — without a marketing degree.',
    body: [
      'For twenty years, being found online meant one thing: ranking on Google. That world is changing fast. People now ask questions to voice assistants, read AI-generated answers at the top of search results, and turn to tools like ChatGPT and Gemini to decide who to buy from. If your website is only optimised for classic search, you are already invisible in half the places your customers look.',
      'SEO — Search Engine Optimization — is still the foundation. It means a clean, fast, well-structured site with clear headings, sensible internal links and rich metadata, so Google understands what you do and shows you to the right people.',
      'AEO — Answer Engine Optimization — is the next layer. Answer engines and voice assistants want direct, quotable answers. That means writing content in clear question-and-answer form, adding structured data (like FAQ schema) and making sure your key facts are stated plainly, not buried in marketing fluff.',
      'GEO — Generative Engine Optimization — is the newest frontier. When someone asks an AI which local business to use, the AI pulls from sources it trusts and can parse. Being cited means having consistent, factual, well-marked-up information about your business across your site and the wider web.',
      'The good news: you do not have to learn any of this. Every West Web Foundry site is built with all three in mind from the first line of code — and a real person keeps it current as the rules evolve.',
    ],
  },
  {
    slug: 'why-a-human-account-manager-matters',
    title: 'Why every one of our clients gets a real human account manager',
    date: '2026-06-10',
    author: 'The West Web Foundry team',
    excerpt: 'Automation is wonderful — until something breaks and you are shouting at a chatbot. Here is why we put a named person behind every website we build.',
    body: [
      'There is a quiet trend in the web industry: hand the client a template, take the payment, and disappear. When something goes wrong, the client is left with a help centre, a ticket queue and an AI that apologises but never fixes anything.',
      'We built West Web Foundry to be the opposite of that. Yes, we use modern tools to work quickly and keep costs low — but a real, named human is responsible for your website from the first call onwards. Your account manager knows your business, makes your edits personally, and is one message or one call away.',
      'That relationship is the product. A website is never really finished — prices change, seasons change, you launch something new. Having a person who already understands your business means those changes take minutes, not meetings.',
      'From your client dashboard you can see your project progress, your invoices and your next payment date — and book a call with your account manager whenever you want. Software handles the busywork. A human handles you.',
    ],
  },
  {
    slug: 'what-a-fast-website-is-worth',
    title: 'What a fast website is actually worth to a small business',
    date: '2026-05-28',
    author: 'The West Web Foundry team',
    excerpt: 'Speed is not a vanity metric. It is the difference between a visitor who enquires and one who is already back on Google. The numbers are stark.',
    body: [
      'Most people will not wait for a slow website. Study after study shows that as a page gets slower, visitors leave — and on mobile, where most local searches happen, patience runs out in seconds.',
      'For a small business, that lost visitor is not an abstract statistic. It is a booking that went to a competitor, a quote request that never arrived, a customer who decided you looked outdated before they read a word.',
      'A fast site does three things at once: it keeps visitors around long enough to enquire, it ranks better because search engines reward speed, and it simply feels more trustworthy and premium.',
      'That is why every site we build is engineered for speed from the ground up — lean code, optimised images, fast hosting and no bloated plugins. It is one of the simplest, highest-return improvements a business can make.',
    ],
  },
];

module.exports = { SITE, NAV, ICONS, SERVICES, PACKAGES, WORK, STATS, RESULTS, FAQS, PROCESS, NEWS };

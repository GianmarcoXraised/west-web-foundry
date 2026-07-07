/* West Web Foundry — marketing site interactions */
(function () {
  'use strict';

  // Mobile nav
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Currency toggle (persists across pages)
  var saved = null;
  try { saved = localStorage.getItem('wwf_cur'); } catch (e) {}
  var current = saved || 'usd';
  function applyCurrency(cur) {
    current = cur;
    document.querySelectorAll('[data-usd]').forEach(function (el) {
      if (el.dataset[cur]) el.textContent = el.dataset[cur];
    });
    document.querySelectorAll('[data-cur-btn]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-cur-btn') === cur ? 'true' : 'false');
    });
    try { localStorage.setItem('wwf_cur', cur); } catch (e) {}
  }
  document.querySelectorAll('[data-cur-btn]').forEach(function (b) {
    b.addEventListener('click', function () { applyCurrency(b.getAttribute('data-cur-btn')); });
  });
  if (document.querySelector('[data-usd]')) applyCurrency(current);

  // Scroll reveal
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Calendly wiring (book buttons + optional inline embed)
  (function initBooking() {
    fetch('/api/config').then(function (r) { return r.json(); }).then(function (cfg) {
      var url = cfg && cfg.calendlyUrl;
      document.querySelectorAll('[data-book]').forEach(function (a) {
        if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
        else { a.href = '/contact'; }
      });
      var embed = document.getElementById('calendlyEmbed');
      if (embed) {
        if (url) {
          embed.className = 'calendly-inline-widget book-embed';
          embed.setAttribute('data-url', url);
          var css = document.createElement('link');
          css.rel = 'stylesheet'; css.href = 'https://assets.calendly.com/assets/external/widget.css';
          document.head.appendChild(css);
          var js = document.createElement('script');
          js.src = 'https://assets.calendly.com/assets/external/widget.js'; js.async = true;
          document.body.appendChild(js);
        } else {
          var fb = document.getElementById('bookFallback');
          if (fb) fb.style.display = 'block';
        }
      }
    }).catch(function () {});
  })();

  // Contact form
  var form = document.getElementById('contactForm');
  if (form) {
    var note = document.getElementById('formNote');
    var submit = document.getElementById('contactSubmit');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      note.className = 'form-note';
      var f = new FormData(form);
      submit.disabled = true; submit.textContent = 'Sending…';
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'), email: f.get('email'),
          business: f.get('business'), package: f.get('package'),
          message: f.get('message') || ''
        })
      }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.d.error || 'Something went wrong.');
          note.textContent = "Thanks — we've got your message and your account manager will reply within one business day.";
          note.classList.add('ok', 'show');
          form.reset();
        }).catch(function (err) {
          note.textContent = err.message;
          note.classList.add('err', 'show');
        }).finally(function () {
          submit.disabled = false; submit.textContent = 'Send message';
        });
    });
  }
})();

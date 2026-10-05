// Scroll-nav
window.addEventListener('scroll', function () {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 80);
});

// Mobile menu
var menu = document.getElementById('mobileMenu');
document.getElementById('hamburger').addEventListener('click', function () { menu.classList.toggle('open'); });
document.getElementById('mobileClose').addEventListener('click', function () { menu.classList.remove('open'); });
menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); }); });

// Language toggle (keuze blijft bewaard tussen pagina's via localStorage)
var lang = 'nl';
try { lang = localStorage.getItem('e4-lang') || 'nl'; } catch (e) {}
var langBtn = document.getElementById('langBtn');
function renderLangBtn() {
  var nlClass = lang === 'nl' ? 'active' : 'inactive';
  var enClass = lang === 'en' ? 'active' : 'inactive';
  langBtn.innerHTML = '<span class="' + nlClass + '">NL</span><span class="lang-sep">/</span><span class="' + enClass + '">EN</span>';
}
function setLang(l) {
  lang = l;
  try { localStorage.setItem('e4-lang', l); } catch (e) {}
  document.querySelectorAll('[data-nl]').forEach(function (el) {
    var val = el.getAttribute('data-' + l);
    if (val === null) return;
    if (el.tagName === 'META') el.setAttribute('content', val);
    else el.innerHTML = val;
  });
  document.documentElement.lang = l;
  renderLangBtn();
}
langBtn.addEventListener('click', function () { setLang(lang === 'nl' ? 'en' : 'nl'); });
setLang(lang);

// Formulier: inline verzenden naar Netlify + bevestigingsbericht in beeld
function showFormSuccess(form) {
  var wrap = form.parentNode;
  var msg = wrap.querySelector('.form-success');
  form.style.display = 'none';
  if (msg) { msg.hidden = false; msg.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
}
document.querySelectorAll('form[data-netlify]').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var body = new URLSearchParams(new FormData(form)).toString();
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
      .then(function () { showFormSuccess(form); })
      .catch(function () { showFormSuccess(form); });
  });
});

// Diensten-accordion (homepage): één rij tegelijk open
document.querySelectorAll('.acc-list').forEach(function (list) {
  var items = list.querySelectorAll('.acc-item');
  items.forEach(function (it, idx) {
    if (idx === 0) it.classList.add('open');
    var row = it.querySelector('.acc-row');
    if (row) row.addEventListener('click', function () {
      var wasOpen = it.classList.contains('open');
      items.forEach(function (o) { o.classList.remove('open'); });
      if (!wasOpen) it.classList.add('open');
    });
  });
});

// Diensten-matrix (factor-plot): klik een dienst, factoren schuiven mee
(function () {
  var tabs = document.querySelectorAll('.mx-tab');
  if (!tabs.length) return;
  // Factoren: vacaturevolume · integratie · snelheid van impact · continuïteit · kosten per hire
  // Let op: op 'kosten per hire' betekent hoog duurder, niet beter.
  var VALS = { rpo: [75,60,25,90,20], ir: [75,95,80,50,50], ws: [20,10,80,25,80] };
  var markers = document.querySelectorAll('.mx-marker');
  var panels = document.querySelectorAll('.mx-panel');
  function select(k) {
    var v = VALS[k]; if (!v) return;
    markers.forEach(function (m, i) { m.style.left = v[i] + '%'; });
    panels.forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-k') === k); });
    tabs.forEach(function (t) { t.classList.toggle('on', t.getAttribute('data-k') === k); });
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { select(t.getAttribute('data-k')); }); });
  select('rpo'); // matrix opent op de eerste dienst (volgorde: RPO, Interim, W&S)
})();

// Scroll-reveal: elementen faden zacht omhoog zodra ze in beeld komen
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Inhoudsblokken, niet hele secties: .g-sec heeft een eigen achtergrondkleur,
  // dus opacity:0 daarop laat de pagina erdoorheen schijnen (lichte flits op donker).
  // De quote-sectie staat er bewust niet in: die hoort er gewoon te staan.
  var sel = [
    '.g-head', '.g-block', '.g-person', '.g-services-media', '.g-acc-body',   // redesign
    '.service-card', '.team-card', '.testi-card', '.case-card', '.stat',      // overige pagina's
    '.info-card', '.detail-text', '.acc-list', '.mx-body', '.contact-form',
    '.about-left', '.cta-left', '.cta-right', '.logos', '.related-services h2'
  ].join(', ');
  var els = [].slice.call(document.querySelectorAll(sel));
  if (!els.length) return;
  els.forEach(function (el) {
    el.classList.add('reveal');
    var sibs = el.parentElement ? [].slice.call(el.parentElement.children) : [];
    var idx = sibs.indexOf(el);
    if (idx > 0) el.style.transitionDelay = Math.min(idx * 80, 320) + 'ms';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      // Ook tonen als het element al voorbij is gescrold (boven de viewport),
      // anders blijft het permanent onzichtbaar bij snel scrollen of een sprong.
      if (e.isIntersecting || e.boundingClientRect.top < 0) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

// Logostrip: dupliceer de set voor een naadloze marquee-loop
(function () {
  var lm = document.getElementById('logoMarquee');
  if (lm) lm.innerHTML += lm.innerHTML;
})();

// Cases: "Bekijk meer cases" uitklappen
(function () {
  var btn = document.getElementById('casesMoreBtn');
  var wrap = document.getElementById('casesMore');
  if (!btn || !wrap) return;
  var lbl = btn.querySelector('span[data-nl]');
  btn.addEventListener('click', function () {
    var isOpen = !wrap.hidden;
    wrap.hidden = isOpen;
    btn.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
    if (lbl) {
      lbl.setAttribute('data-nl', isOpen ? 'Bekijk meer cases' : 'Toon minder');
      lbl.setAttribute('data-en', isOpen ? 'View more cases' : 'Show less');
      lbl.textContent = (document.documentElement.lang === 'en')
        ? (isOpen ? 'View more cases' : 'Show less')
        : (isOpen ? 'Bekijk meer cases' : 'Toon minder');
    }
  });
})();

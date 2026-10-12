// nav + progress + reveals
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const progress = document.getElementById('progress');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('x', open);
  burger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open'); burger.classList.remove('x');
}));

window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progress.style.width = pct + '%';
}, { passive: true });

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// gallery filter
const chips = document.querySelectorAll('.chip');
const cards = [...document.querySelectorAll('.card')];
chips.forEach(c => c.addEventListener('click', () => {
  chips.forEach(x => x.classList.remove('active'));
  c.classList.add('active');
  const f = c.dataset.filter;
  cards.forEach(card => {
    const show = f === 'all' || card.dataset.cat === f;
    card.classList.toggle('hide', !show);
  });
}));

// lightbox with before/after slider
const lb = document.getElementById('lightbox');
const lbArt = document.getElementById('lbArt');
const lbAfter = document.getElementById('lbAfter');
const lbTitle = document.getElementById('lbTitle');
const lbMeta = document.getElementById('lbMeta');
const slider = document.getElementById('lbSlider');
const handle = document.getElementById('lbHandle');
let visible = [];
let idx = 0;

function refreshVisible() { visible = cards.filter(c => !c.classList.contains('hide')); }
function openLb(card) {
  refreshVisible();
  idx = visible.indexOf(card);
  renderLb();
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('lbClose').focus();
}
function renderLb() {
  const c = visible[idx];
  if (!c) return;
  lbTitle.textContent = c.dataset.title;
  lbMeta.textContent = c.dataset.meta + '  ·  ' + (idx + 1) + ' of ' + visible.length;
  lbArt.className = 'lbArt ' + c.dataset.art;
  lbAfter.className = 'lbAfter ' + c.dataset.art;
  slider.value = 50; paintSlider();
}
function paintSlider() {
  const v = slider.value;
  lbAfter.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
  lbAfter.style.width = '100%';
  handle.style.left = v + '%';
}
slider.addEventListener('input', paintSlider);
function closeLb() {
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
function step(d) { idx = (idx + d + visible.length) % visible.length; renderLb(); }

cards.forEach(c => c.addEventListener('click', () => openLb(c)));
document.getElementById('lbClose').addEventListener('click', closeLb);
document.getElementById('lbPrev').addEventListener('click', () => step(-1));
document.getElementById('lbNext').addEventListener('click', () => step(1));
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
window.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowRight') step(1);
  if (e.key === 'ArrowLeft') step(-1);
});

// testimonial rotator
const quotes = [
  { t: 'June made the whole day feel easy. The photos look like how the light actually felt.', n: 'Maya and Tom · Wedding clients' },
  { t: 'Our brand finally looks like us. Sharp, warm, and full of personality on every page.', n: 'Priya S. · Founder, Fern Bakery' },
  { t: 'The studio session was calm and quick, and the prints are now the centerpiece of our home.', n: 'Daniel K. · Portrait client' }
];
let qi = 0, qtimer;
const qText = document.getElementById('quoteText');
const qName = document.getElementById('quoteName');
const qDots = document.getElementById('quoteDots');
quotes.forEach((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
  b.addEventListener('click', () => showQ(i, true));
  qDots.appendChild(b);
});
function showQ(i, manual) {
  qi = (i + quotes.length) % quotes.length;
  qText.style.opacity = 0;
  setTimeout(() => {
    qText.textContent = quotes[qi].t;
    qName.textContent = quotes[qi].n;
    qText.style.opacity = 1;
  }, 180);
  [...qDots.children].forEach((d, j) => d.classList.toggle('on', j === qi));
  if (manual) restartQ();
}
function restartQ() { clearInterval(qtimer); qtimer = setInterval(() => showQ(qi + 1), 5000); }
document.getElementById('quotePrev').addEventListener('click', () => showQ(qi - 1, true));
document.getElementById('quoteNext').addEventListener('click', () => showQ(qi + 1, true));
showQ(0); restartQ();

// plan preselect from pricing
document.querySelectorAll('[data-plan]').forEach(a => a.addEventListener('click', () => {
  document.getElementById('fPlan').value = a.dataset.plan;
}));

// booking validation
const form = document.getElementById('bookForm');
const err = document.getElementById('formErr');
const ok = document.getElementById('formOk');
form.addEventListener('submit', e => {
  e.preventDefault();
  err.hidden = true; ok.hidden = true;
  const name = document.getElementById('fName').value.trim();
  const email = document.getElementById('fEmail').value.trim();
  const date = document.getElementById('fDate').value;
  const msg = document.getElementById('fMsg').value.trim();
  const problems = [];
  if (name.length < 2) problems.push('Please add your name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems.push('Please add a valid email.');
  if (!date) problems.push('Please pick a preferred date.');
  if (msg.length < 10) problems.push('Tell me a little more (10+ characters).');
  if (problems.length) { err.textContent = problems.join(' '); err.hidden = false; return; }
  ok.textContent = 'Thanks ' + name.split(' ')[0] + '. Your request for ' + date + ' is noted. I will reply to ' + email + ' within one business day.';
  ok.hidden = false;
  form.reset();
  document.getElementById('fPlan').selectedIndex = 1;
});

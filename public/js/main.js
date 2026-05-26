/* ============ NAV SCROLL + MOBILE TOGGLE ============ */
const nav = document.querySelector('.nav');
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) nav?.classList.add('scrolled');
  else nav?.classList.remove('scrolled');
});

burger?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
});

/* ============ REVEAL ON SCROLL ============ */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* ============ HERO SLIDER ============ */
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
const prevBtn = document.querySelector('.hero-arrow.prev');
const nextBtn = document.querySelector('.hero-arrow.next');
let current = 0;
let timer = null;

function goTo(i) {
  if (!slides.length) return;
  current = (i + slides.length) % slides.length;
  slides.forEach((s, idx) => s.classList.toggle('active', idx === current));
  dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
}
function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }
function restart() {
  clearInterval(timer);
  timer = setInterval(next, 6500);
}
if (slides.length) {
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); restart(); }));
  nextBtn?.addEventListener('click', () => { next(); restart(); });
  prevBtn?.addEventListener('click', () => { prev(); restart(); });
  restart();
}

/* ============ STAT COUNTERS ============ */
const statNums = document.querySelectorAll('[data-count]');
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count, 10);
    const dur = 1600;
    const start = performance.now();
    const suffix = el.dataset.suffix || '';
    function step(t) {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.firstChild.nodeValue = Math.floor(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.firstChild.nodeValue = target;
    }
    requestAnimationFrame(step);
    statObs.unobserve(el);
  });
}, { threshold: 0.5 });
statNums.forEach(n => statObs.observe(n));

/* ============ PROJECT FILTERS ============ */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.projects-grid .proj-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    projectCards.forEach(card => {
      const cat = card.dataset.cat;
      const show = f === 'all' || cat === f;
      card.style.display = show ? '' : 'none';
    });
  });
});

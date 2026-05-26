  /* ===== PAGE LOAD ===== */
  requestAnimationFrame(() => document.body.classList.add('kick'));
  function dismissLoader() {
    setTimeout(() => {
      document.getElementById('loader')?.classList.add('gone');
      document.body.classList.remove('loading');
    }, 1400);
  }
  if (document.readyState === 'complete') dismissLoader();
  else window.addEventListener('load', dismissLoader);

  /* ===== CUSTOM CURSOR ===== */
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsHover) {
    const dot  = document.querySelector('.c-dot');
    const ring = document.querySelector('.c-ring');
    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let rx = mx, ry = my;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      document.body.classList.add('cursor-on');
    });
    document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on'));

    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    const grow = 'a, button, .project-card, input, textarea, select, .num';
    document.querySelectorAll(grow).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
    });
  }

  /* ===== SCROLL REVEAL ===== */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.rv, .stg, .img-rv').forEach(el => revealIO.observe(el));

  /* ===== COUNTERS ===== */
  const counters = document.querySelectorAll('[data-target]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix ?? '+';
      const duration = 1800;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  /* ===== HERO SLIDESHOW ===== */
  const slides = document.querySelectorAll('.hero-slide');
  const nums   = document.querySelectorAll('.hero-pager .num');
  let current = 0;
  function go(idx) {
    current = (idx + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    nums.forEach((n, i)   => n.classList.toggle('active', i === current));
  }
  nums.forEach((n, i) => n.addEventListener('click', () => go(i)));
  document.querySelector('.hero-arrows .prev')?.addEventListener('click', () => go(current - 1));
  document.querySelector('.hero-arrows .next')?.addEventListener('click', () => go(current + 1));
  let auto = setInterval(() => go(current + 1), 7000);
  const hero = document.querySelector('.hero');
  hero?.addEventListener('mouseenter', () => clearInterval(auto));
  hero?.addEventListener('mouseleave', () => auto = setInterval(() => go(current + 1), 7000));

  /* ===== SCROLL TO TOP ===== */
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    toTop?.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  toTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ===== LIGHT PARALLAX ===== */
  const parallaxEls = [
    document.querySelector('.philosophy .img'),
    document.querySelector('.cta .left')
  ].filter(Boolean);
  function applyParallax() {
    const vh = window.innerHeight;
    parallaxEls.forEach(el => {
      const r = el.getBoundingClientRect();
      const center = r.top + r.height/2;
      const dist = (center - vh/2) / vh;
      const shift = -dist * 22;
      el.style.backgroundPositionY = `calc(50% + ${shift}px)`;
    });
  }
  window.addEventListener('scroll', applyParallax, { passive: true });
  window.addEventListener('resize', applyParallax);
  applyParallax();

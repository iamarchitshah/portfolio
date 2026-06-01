/* ============================================================
   ARCHIT SHAH PORTFOLIO — script.js
   Vanilla JS · All animations & interactions
   ============================================================ */

'use strict';

// ============================================================
// 1. PAGE LOADER
// ============================================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      // Trigger hero animations after loader
      document.querySelectorAll('#hero .reveal-up, #hero .reveal-right').forEach((el, i) => {
        setTimeout(() => el.classList.add('in-view'), i * 120);
      });
    }
  }, 2500);
});

// ============================================================
// 2. CUSTOM CURSOR
// ============================================================
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left  = mouseX + 'px';
  cursorDot.style.top   = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Cursor hover/click states
document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card, .service-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});
document.addEventListener('mousedown', () => cursorRing.classList.add('click'));
document.addEventListener('mouseup',   () => cursorRing.classList.remove('click'));

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => { cursorDot.style.opacity = '0'; cursorRing.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursorDot.style.opacity = '1'; cursorRing.style.opacity = '0.7'; });

// ============================================================
// 3. MOUSE GLOW EFFECT
// ============================================================
const mouseGlow = document.createElement('div');
mouseGlow.className = 'mouse-glow';
document.body.appendChild(mouseGlow);

document.addEventListener('mousemove', (e) => {
  mouseGlow.style.left = e.clientX + 'px';
  mouseGlow.style.top  = e.clientY + 'px';
});

// ============================================================
// 4. NAVBAR — scroll behavior + hamburger
// ============================================================
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity   = navLinks.classList.contains('open') ? '0' : '1';
  spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

// Close mobile nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

// Active nav highlight on scroll
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop, height = sec.offsetHeight, id = sec.id;
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

// ============================================================
// 5. SCROLL PROGRESS BAR
// ============================================================
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
});

// ============================================================
// 6. BACK TO TOP
// ============================================================
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ============================================================
// 7. THEME TOGGLE
// ============================================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});

// ============================================================
// 8. TYPING EFFECT
// ============================================================
const typedEl = document.getElementById('typedText');
const phrases = [
  'Full Stack Developer',
  'AI Enthusiast',
  'Blockchain Developer',
  'Problem Solver',
  'Open Source Contributor'
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function typeEffect() {
  const phrase = phrases[phraseIdx];
  if (!isDeleting) {
    typedEl.textContent = phrase.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === phrase.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
  } else {
    typedEl.textContent = phrase.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeEffect, isDeleting ? 60 : 90);
}

// Start after loader
setTimeout(typeEffect, 2800);

// ============================================================
// 9. PARTICLE CANVAS
// ============================================================
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];
let canvasW, canvasH;

function resizeCanvas() {
  canvasW = canvas.width  = canvas.offsetWidth;
  canvasH = canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvasW;
    this.y  = Math.random() * canvasH;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size   = Math.random() * 2 + 0.5;
    this.alpha  = Math.random() * 0.4 + 0.1;
    this.color  = Math.random() > 0.5 ? '#5d9cf5' : '#a78bfa';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvasW || this.y < 0 || this.y > canvasH) this.reset();
  }
  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(120, Math.floor(canvasW * canvasH / 8000));
  particles = Array.from({ length: count }, () => new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.globalAlpha = (1 - dist / 120) * 0.12;
        ctx.strokeStyle = '#5d9cf5';
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvasW, canvasH);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ============================================================
// 10. INTERSECTION OBSERVER — Scroll Reveals
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      // Animate skills bars when visible
      if (entry.target.classList.contains('skill-card')) {
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) fill.style.width = fill.dataset.width + '%';
      }
      // Animate stat counters
      if (entry.target.classList.contains('stat-card')) {
        animateCounter(entry.target.querySelector('.stat-number'));
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ============================================================
// 11. COUNTER ANIMATION
// ============================================================
function animateCounter(el) {
  if (!el || el.dataset.animated) return;
  el.dataset.animated = 'true';
  const target = parseInt(el.dataset.count);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

// ============================================================
// 12. SKILLS FILTER
// ============================================================
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    document.querySelectorAll('.skill-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
      if (show) {
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeSlideIn 0.4s ease forwards';
      }
    });
  });
});

// ============================================================
// 13. 3D TILT CARD EFFECT
// ============================================================
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    const rotX = (-y / rect.height) * 12;
    const rotY = ( x / rect.width)  * 12;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => card.style.transition = '', 500);
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.15s ease';
  });
});

// ============================================================
// 14. MAGNETIC BUTTON EFFECT
// ============================================================
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ============================================================
// 15. TESTIMONIALS SLIDER
// ============================================================
const testTrack  = document.getElementById('testTrack');
const testDotsEl = document.getElementById('testDots');
const testPrev   = document.getElementById('testPrev');
const testNext   = document.getElementById('testNext');

if (testTrack) {
  const cards = testTrack.querySelectorAll('.test-card');
  let currentTest = 0;
  let autoSlide;
  const perView = window.innerWidth < 768 ? 1 : 2;

  // Create dots
  const totalDots = Math.ceil(cards.length / perView);
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('div');
    dot.className = 'test-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    testDotsEl.appendChild(dot);
  }

  function goToSlide(idx) {
    currentTest = Math.max(0, Math.min(idx, totalDots - 1));
    const slideW = testTrack.parentElement.offsetWidth;
    testTrack.style.transform = `translateX(-${currentTest * slideW}px)`;
    testTrack.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    document.querySelectorAll('.test-dot').forEach((d, i) => d.classList.toggle('active', i === currentTest));
  }

  testPrev.addEventListener('click', () => { goToSlide(currentTest - 1); resetAutoSlide(); });
  testNext.addEventListener('click', () => { goToSlide((currentTest + 1) % totalDots); resetAutoSlide(); });

  function startAutoSlide() { autoSlide = setInterval(() => goToSlide((currentTest + 1) % totalDots), 4500); }
  function resetAutoSlide() { clearInterval(autoSlide); startAutoSlide(); }
  startAutoSlide();

  window.addEventListener('resize', () => {
    const slideW = testTrack.parentElement.offsetWidth;
    testTrack.style.transition = 'none';
    testTrack.style.transform = `translateX(-${currentTest * slideW}px)`;
  });

  // Touch / swipe support
  let touchStartX = 0;
  testTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  testTrack.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goToSlide(currentTest + 1) : goToSlide(currentTest - 1);
  });
}

// ============================================================
// 16. CONTACT FORM VALIDATION
// ============================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'formName',    errId: 'nameError',    msg: 'Please enter your name.',          check: v => v.length >= 2 },
      { id: 'formEmail',   errId: 'emailError',   msg: 'Please enter a valid email.',      check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { id: 'formSubject', errId: 'subjectError', msg: 'Please enter a subject.',          check: v => v.length >= 3 },
      { id: 'formMessage', errId: 'messageError', msg: 'Message must be at least 10 chars.', check: v => v.length >= 10 }
    ];

    fields.forEach(f => {
      const input = document.getElementById(f.id);
      const err   = document.getElementById(f.errId);
      const val   = input.value.trim();
      if (!f.check(val)) {
        input.classList.add('error');
        err.textContent = f.msg;
        valid = false;
      } else {
        input.classList.remove('error');
        err.textContent = '';
      }
    });

    if (valid) {
      const submitText  = document.getElementById('submitText');
      const formSuccess = document.getElementById('formSuccess');
      const btn         = contactForm.querySelector('button[type=submit]');

      submitText.textContent = 'Sending...';
      btn.disabled = true;

      // Simulate async submit
      setTimeout(() => {
        submitText.textContent = 'Send Message';
        btn.disabled = false;
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      }, 1800);
    }
  });

  // Clear errors on input
  contactForm.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errEl = document.getElementById(input.id.replace('form', '').toLowerCase() + 'Error');
      if (errEl) errEl.textContent = '';
    });
  });
}

// ============================================================
// 17. PARALLAX SCROLL EFFECT (Hero)
// ============================================================
const heroContent = document.querySelector('.hero-content');
const heroImage   = document.querySelector('.hero-image-wrap');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY < window.innerHeight) {
    if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
    if (heroImage)   heroImage.style.transform   = `translateY(${scrollY * 0.1}px)`;
  }
});

// ============================================================
// 18. SMOOTH SCROLL for anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});

// ============================================================
// 19. TEXT REVEAL ANIMATION (hero name)
// ============================================================
(function glitchTitle() {
  const nameEl = document.querySelector('.name-text');
  if (!nameEl) return;
  const original = nameEl.textContent;
  const chars    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';

  let triggered = false;
  setTimeout(() => {
    if (triggered) return;
    triggered = true;
    let iteration = 0;
    const interval = setInterval(() => {
      nameEl.textContent = original.split('').map((char, idx) => {
        if (idx < iteration) return original[idx];
        return char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (iteration >= original.length) clearInterval(interval);
      iteration += 0.4;
    }, 40);
  }, 2800);
})();

// ============================================================
// 20. FADE-SLIDE ANIMATION (CSS keyframe injection)
// ============================================================
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: none; }
    }
  `;
  document.head.appendChild(style);
})();

// ============================================================
// 21. SECTION REVEAL — skills bars on scroll
// ============================================================
// Already handled by revealObserver above for skill-card elements
// Extra: trigger in-view for all stat-cards that enter viewport
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target.querySelector('.stat-number'));
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-card').forEach(el => statObserver.observe(el));

// ============================================================
// 22. PERFORMANCE — requestIdleCallback for non-critical tasks
// ============================================================
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Pre-fetch nav links
    document.querySelectorAll('.nav-link').forEach(l => {
      const href = l.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) target.dataset.preloaded = 'true';
      }
    });
  });
}

// ============================================================
// 23. CERT CARDS — floating micro-animation
// ============================================================
document.querySelectorAll('.cert-card').forEach((card, i) => {
  card.style.animationDelay = (i * 0.15) + 's';
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = `0 0 40px var(--primary-glow), 0 20px 60px rgba(0,0,0,0.3)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

// ============================================================
// 24. DYNAMIC BACKGROUND GRADIENT SHIFT
// ============================================================
let hueShift = 0;
function shiftGradient() {
  hueShift = (hueShift + 0.08) % 360;
  // Subtle hue animation on gradient text elements
  document.querySelectorAll('.gradient-text').forEach(el => {
    el.style.filter = `hue-rotate(${Math.sin(hueShift * 0.01) * 15}deg)`;
  });
  requestAnimationFrame(shiftGradient);
}
shiftGradient();

// ============================================================
// 25. CONSOLE EASTER EGG
// ============================================================
console.log('%c✨ Archit Shah Portfolio', 'font-size: 24px; font-weight: bold; color: #5d9cf5; font-family: Syne, sans-serif;');
console.log('%cBuilt with ❤️ using pure HTML · CSS · Vanilla JS', 'font-size: 14px; color: #a78bfa;');
console.log('%cLooking to hire? → archit.shah@example.com', 'font-size: 12px; color: #7888aa;');

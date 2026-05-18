/* ================================================================
   L'ORDRE DES LANTERNES — Wiki
   main.js — Main script
   ================================================================
   Author:      Willy Dessalines
   Project:     L'Ordre des Lanternes (LODL)

   TABLE OF CONTENTS
   -----------------
   1.  Global constants & state
   2.  i18n engine
   3.  Password gate
   4.  Carousel (with tab-switch fix)
   5.  Sylph cursor trail
   6.  Lanternerie panel
   7.  Login / register panel
   8.  Mobile menu (hamburger)
   9.  Search bar
   10. Initialization (DOMContentLoaded)
   11. Hero logo observer (wordmark reveal on scroll)
================================================================ */


/* ================================================================
   1. GLOBAL CONSTANTS & STATE
================================================================ */
const PASSWORD    = 'lanternes2025'; /* TODO (Phase 2): Remove — replaced by Supabase Auth */
const TOTAL_SLIDES = 8;

let currentSlide     = 0;
let isTransitioning  = false;
let carouselInterval = null;

let trailH      = 42;
let trailS      = 85;
let trailL      = 65;
let trailActive = true;

let isRegisterMode  = false;
let mobileMenuOpen  = false;

const COLOR_PRESETS = [
  { name: 'Or',     h: 42,  s: 85, l: 65 },
  { name: 'Bleu',   h: 210, s: 90, l: 65 },
  { name: 'Violet', h: 270, s: 80, l: 65 },
  { name: 'Vert',   h: 140, s: 75, l: 55 },
  { name: 'Rouge',  h: 0,   s: 85, l: 60 },
  { name: 'Blanc',  h: 50,  s: 20, l: 95 },
  { name: 'Cyan',   h: 185, s: 85, l: 60 },
  { name: 'Rose',   h: 320, s: 80, l: 70 },
];

/*
  Static search index.
  TODO (Phase 1): Replace with dynamic Sanity CMS queries.
*/
const SEARCH_INDEX = [
  { cat: 'Le Monde',      title: "Terre d'Ailleurs" },
  { cat: 'Le Monde',      title: 'La Terre Sablière' },
  { cat: 'Le Monde',      title: 'La Terre des Géants' },
  { cat: 'Le Monde',      title: 'Les Portails' },
  { cat: 'Le Monde',      title: 'Le Monde Commun' },
  { cat: "L'Histoire",    title: "La Fondation de l'Ordre" },
  { cat: "L'Histoire",    title: 'La Guerre des Lanternes' },
  { cat: "L'Histoire",    title: "L'Ère des Sylphes" },
  { cat: 'Organisations', title: "L'Ordre des Lanternes" },
  { cat: 'Organisations', title: 'Les Ligues' },
  { cat: 'Organisations', title: 'Le Tribunal des Lanternes' },
  { cat: 'Personnages',   title: 'Chloé' },
  { cat: 'Personnages',   title: 'Cloche' },
  { cat: 'Personnages',   title: 'Merlin' },
  { cat: 'Personnages',   title: 'Galaad du Lac' },
  { cat: 'Magie',         title: 'Les Sylphes' },
  { cat: 'Magie',         title: 'La Brume Crépusculaire' },
  { cat: 'Magie',         title: 'Les Lanternes' },
  { cat: 'Glossaire',     title: 'Lanterneur / Lanterneuse' },
  { cat: 'Glossaire',     title: 'Sylphe' },
  { cat: 'Glossaire',     title: 'Ailleurs' },
];


/* ================================================================
   2. i18n ENGINE
   Switches UI language between French and English.
   Translation strings are in locales/fr.js and locales/en.js.
================================================================ */
let currentLang = localStorage.getItem('lodl-lang') || 'fr';

function getTranslation(key, lang) {
  const t = lang === 'en' ? LODL_LANG_EN : LODL_LANG_FR;
  return key.split('.').reduce((obj, part) => obj && obj[part], t) || key;
}

function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const t = getTranslation(el.getAttribute('data-i18n'), lang);
    if (t && t !== el.getAttribute('data-i18n')) el.textContent = t;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const t = getTranslation(el.getAttribute('data-i18n-placeholder'), lang);
    if (t && t !== el.getAttribute('data-i18n-placeholder')) el.placeholder = t;
  });
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('data-lang', lang);
  document.querySelectorAll('.lang-btn, .mobile-lang-btn').forEach(btn => {
    const active = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

/* Called from onclick="setLanguage('fr')" in HTML */
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lodl-lang', lang);
  applyTranslations(lang);
}


/* ================================================================
   3. PASSWORD GATE
   Client-side check. TODO (Phase 2): Replace with Supabase Auth.
================================================================ */
function checkPassword() {
  const input   = document.getElementById('pwd-input');
  const errorEl = document.getElementById('gate-error');
  if (input.value === PASSWORD) {
    document.getElementById('gate').style.display = 'none';
    document.getElementById('wiki').style.display = 'block';
    sessionStorage.setItem('lodl-auth', '1');
  } else {
    errorEl.textContent = getTranslation('gate.error', currentLang);
    input.value = '';
    input.focus();
  }
}


/* ================================================================
   4. CAROUSEL
   Infinite auto-advancing slideshow.
   Tab-switch bug fix: stops/restarts interval on visibilitychange.
================================================================ */
function moveCarouselTo(index, animate) {
  ['heroTrack', 'gateTrack'].forEach(id => {
    const track = document.getElementById(id);
    if (!track) return;
    track.style.transition = animate
      ? 'transform 1.1s cubic-bezier(0.77,0,0.175,1)'
      : 'none';
    track.style.transform = `translateX(-${index * 100}%)`;
  });
}

function jumpCarouselTo(index) {
  ['heroTrack', 'gateTrack'].forEach(id => {
    const track = document.getElementById(id);
    if (!track) return;
    track.style.transition = 'none';
    track.style.transform  = `translateX(-${index * 100}%)`;
    track.offsetHeight; /* Force reflow */
  });
}

function updateCarouselDots(activeIndex) {
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.className = 'dot' + (i === activeIndex ? ' active' : '');
    dot.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
  });
}

function advanceCarousel() {
  if (isTransitioning) return;
  isTransitioning = true;
  currentSlide++;
  moveCarouselTo(currentSlide, true);
  updateCarouselDots(currentSlide >= TOTAL_SLIDES ? 0 : currentSlide);
  setTimeout(() => { isTransitioning = false; }, 1400);
}

function goToSlide(index) {
  if (isTransitioning) return;
  isTransitioning = true;
  currentSlide    = index;
  moveCarouselTo(index, true);
  updateCarouselDots(index);
}

function startCarouselInterval() {
  if (carouselInterval) clearInterval(carouselInterval);
  carouselInterval = setInterval(advanceCarousel, 5000);
}

function initCarousel() {
  const dotsContainer = document.getElementById('heroDots');
  if (!dotsContainer) return;

  for (let i = 0; i < TOTAL_SLIDES; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Diapositive ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  }

  startCarouselInterval();

  const heroTrack = document.getElementById('heroTrack');
  if (heroTrack) {
    heroTrack.addEventListener('transitionend', e => {
      if (e.propertyName !== 'transform') return;
      if (currentSlide === TOTAL_SLIDES) { currentSlide = 0; jumpCarouselTo(0); }
      isTransitioning = false;
    });
  }

  /* Tab visibility fix */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(carouselInterval);
      carouselInterval = null;
    } else {
      isTransitioning = false;
      if (currentSlide >= TOTAL_SLIDES) currentSlide = 0;
      jumpCarouselTo(currentSlide);
      setTimeout(startCarouselInterval, 300);
    }
  });
}


/* ================================================================
   5. SYLPH CURSOR TRAIL
   Glowing particles following the mouse.
   Disabled on touch devices (no mouse cursor).
================================================================ */
function initCursorTrail() {
  /* Skip on touch devices */
  if (window.matchMedia('(hover: none)').matches) return;

  const canvas = document.getElementById('cursorCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const particles = [];

  window.addEventListener('mousemove', e => {
    if (!trailActive) return;
    for (let i = 0; i < 4; i++) {
      particles.push({
        x: e.clientX + (Math.random() - 0.5) * 12,
        y: e.clientY + (Math.random() - 0.5) * 12,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5 - 0.8,
        life: 1, size: Math.random() * 3 + 1.5,
      });
    }
  });

  (function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (trailActive) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.028; p.size *= 0.975;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle   = `hsla(${trailH},${trailS}%,${trailL}%,${p.life * 0.9})`;
        ctx.shadowBlur  = 12;
        ctx.shadowColor = `hsla(${trailH},100%,${trailL}%,${p.life})`;
        ctx.fill();
      }
    }
    requestAnimationFrame(renderLoop);
  })();
}


/* ================================================================
   6. LANTERNERIE PANEL
================================================================ */
function openLanternerie(e) {
  e.preventDefault();
  closeMobileMenu(); /* Close mobile menu if open */
  const panel = document.getElementById('lanternerie-panel');
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
}

function closeLanternerie() {
  const panel = document.getElementById('lanternerie-panel');
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
}

function updateColorPreview() {
  const p = document.getElementById('colorPreview');
  if (p) p.style.background = `hsl(${trailH},${trailS}%,${trailL}%)`;
}

function clearPresetSelection() {
  document.querySelectorAll('.preset').forEach(p => p.classList.remove('selected'));
}

function initColorWheel() {
  const canvas = document.getElementById('colorWheel');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 90, cy = 90, r = 85;
  for (let a = 0; a < 360; a++) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, 'white');
    g.addColorStop(1, `hsl(${a},100%,50%)`);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, (a-1)*Math.PI/180, (a+1)*Math.PI/180);
    ctx.closePath(); ctx.fillStyle = g; ctx.fill();
  }
  function pick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top  - cy;
    const dist = Math.sqrt(x*x + y*y);
    if (dist > r) return;
    let a = Math.atan2(y, x) * 180 / Math.PI;
    if (a < 0) a += 360;
    trailH = Math.round(a);
    trailS = Math.round((dist/r) * 85 + 15);
    updateColorPreview(); clearPresetSelection();
  }
  canvas.addEventListener('mousedown', e => { pick(e); canvas.addEventListener('mousemove', pick); });
  window.addEventListener('mouseup', () => canvas.removeEventListener('mousemove', pick));
}

function initColorPresets() {
  const container = document.getElementById('presetColors');
  if (!container) return;
  COLOR_PRESETS.forEach((preset, i) => {
    const s = document.createElement('div');
    s.className = 'preset' + (i === 0 ? ' selected' : '');
    s.title     = preset.name;
    s.setAttribute('role', 'button');
    s.setAttribute('aria-label', preset.name);
    s.style.background = `hsl(${preset.h},${preset.s}%,${preset.l}%)`;
    s.onclick = () => {
      trailH = preset.h; trailS = preset.s; trailL = preset.l;
      const sl = document.getElementById('brightnessSlider');
      if (sl) sl.value = preset.l;
      updateColorPreview(); clearPresetSelection(); s.classList.add('selected');
    };
    container.appendChild(s);
  });
}


/* ================================================================
   7. LOGIN / REGISTER PANEL
   TODO (Phase 2): Connect to Supabase Auth.
================================================================ */
function toggleLogin(e) {
  e.stopPropagation();
  const panel  = document.getElementById('login-panel');
  const isOpen = panel.classList.toggle('open');
  e.currentTarget.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function toggleMode() {
  isRegisterMode = !isRegisterMode;
  document.getElementById('pseudo-field').style.display  = isRegisterMode ? 'flex' : 'none';
  document.getElementById('confirm-field').style.display = isRegisterMode ? 'flex' : 'none';
  const titleEl = document.getElementById('login-panel-title');
  if (titleEl) titleEl.textContent = isRegisterMode
    ? getTranslation('login.registerTitle', currentLang)
    : getTranslation('login.title', currentLang);
  const submitBtn = document.getElementById('login-submit-btn');
  if (submitBtn) submitBtn.textContent = isRegisterMode
    ? getTranslation('login.registerBtn', currentLang)
    : getTranslation('login.submitBtn', currentLang);
  const textEl = document.querySelector('[data-i18n="login.toggleText"]');
  const linkEl = document.querySelector('[data-i18n="login.toggleLink"]');
  if (textEl) textEl.textContent = isRegisterMode
    ? getTranslation('login.hasAccount', currentLang)
    : getTranslation('login.toggleText', currentLang);
  if (linkEl) linkEl.textContent = isRegisterMode
    ? getTranslation('login.signInLink', currentLang)
    : getTranslation('login.toggleLink', currentLang);
}


/* ================================================================
   8. MOBILE MENU (hamburger)
   Circular button that opens a full-screen nav overlay.
   Closes on: link click, outside click, Escape key, resize to desktop.

   BREAKPOINT NOTE: The hamburger activates at 1100px (matching
   the CSS media query in style.css section 19). Any change to
   that CSS breakpoint must also be updated here.
================================================================ */
function openMobileMenu() {
  mobileMenuOpen = true;
  const btn  = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (btn)  btn.classList.add('open');
  if (menu) menu.classList.add('open');
  document.body.style.overflow = 'hidden'; /* Prevent background scroll */
}

function closeMobileMenu() {
  mobileMenuOpen = false;
  const btn  = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  if (btn)  btn.classList.remove('open');
  if (menu) menu.classList.remove('open');
  document.body.style.overflow = '';
}

function toggleMobileMenu() {
  mobileMenuOpen ? closeMobileMenu() : openMobileMenu();
}

function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  if (btn) btn.addEventListener('click', toggleMobileMenu);

  /* Close on any link click inside the mobile menu */
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* Close on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenuOpen) closeMobileMenu();
  });

  /*
    Close mobile menu when window resizes back to desktop width.
    IMPORTANT: this threshold (1100px) must match the CSS breakpoint
    in style.css section 19 (@media max-width: 1100px).
  */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100 && mobileMenuOpen) closeMobileMenu();
  });
}


/* ================================================================
   9. SEARCH BAR
   TODO (Phase 1): Replace SEARCH_INDEX with Sanity CMS queries.
================================================================ */
function initSearch() {
  const input    = document.getElementById('heroSearch');
  const dropdown = document.getElementById('searchDropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    dropdown.innerHTML = '';
    if (q.length < 2) { dropdown.classList.remove('visible'); return; }
    const results = SEARCH_INDEX.filter(e =>
      e.title.toLowerCase().includes(q) || e.cat.toLowerCase().includes(q)
    ).slice(0, 6);
    if (results.length === 0) {
      dropdown.innerHTML = `<div class="search-no-result">${getTranslation('search.noResult', currentLang)}</div>`;
    } else {
      results.forEach(entry => {
        const link = document.createElement('a');
        link.className = 'search-result';
        link.href      = '#';
        link.setAttribute('role', 'option');
        link.innerHTML = `<span class="search-result-cat">${entry.cat}</span><span class="search-result-title">${entry.title}</span>`;
        dropdown.appendChild(link);
      });
    }
    dropdown.classList.add('visible');
  });

  document.addEventListener('click', e => {
    const wrap = document.querySelector('.hero-search-wrap');
    if (wrap && !wrap.contains(e.target)) dropdown.classList.remove('visible');
  });
}


/* ================================================================
   11. HERO LOGO OBSERVER
   Uses IntersectionObserver to watch .hero-main-title.
   When the title scrolls out of the viewport, adds .logo-visible to
   .header-logo so the wordmark fades in. Removes it when the title
   scrolls back into view (user returns to the top).
================================================================ */
function initLogoObserver() {
  const heroTitle  = document.querySelector('.hero-main-title');
  const headerLogo = document.querySelector('.header-logo');
  if (!heroTitle || !headerLogo) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      /* Toggle .logo-visible: true when title is NOT intersecting */
      headerLogo.classList.toggle('logo-visible', !entry.isIntersecting);
    });
  }, { threshold: 0 });

  observer.observe(heroTitle);
}


/* ================================================================
   10. INITIALIZATION
   All DOM-dependent code runs after the page is fully loaded.
================================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* Session persistence */
  if (sessionStorage.getItem('lodl-auth') === '1') {
    document.getElementById('gate').style.display = 'none';
    document.getElementById('wiki').style.display = 'block';
  }

  /* Password gate: Enter key */
  const pwdInput = document.getElementById('pwd-input');
  if (pwdInput) pwdInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkPassword(); });

  /* Login panel: close on outside click */
  document.addEventListener('click', e => {
    const panel       = document.getElementById('login-panel');
    const headerRight = document.querySelector('.header-right');
    if (panel && headerRight && !headerRight.contains(e.target)) {
      panel.classList.remove('open');
      const btn = document.querySelector('.login-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });

  /* Lanternerie: brightness slider */
  const slider = document.getElementById('brightnessSlider');
  if (slider) {
    slider.addEventListener('input', function () {
      trailL = parseInt(this.value, 10);
      updateColorPreview();
    });
  }

  /* Lanternerie: trail toggle */
  const toggle = document.getElementById('trailToggle');
  if (toggle) toggle.addEventListener('change', function () { trailActive = this.checked; });

  /* Apply saved language */
  applyTranslations(currentLang);

  /* Initialize all modules */
  initCursorTrail();
  initColorWheel();
  initColorPresets();
  initCarousel();
  initMobileMenu();
  initSearch();
  initLogoObserver();
  updateColorPreview();

});
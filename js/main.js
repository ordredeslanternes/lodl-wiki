/* ============================================
   L'ORDRE DES LANTERNES — Wiki
   main.js — script principal
   ============================================ */

/* ══════════════════════════════════════
   VARIABLES GLOBALES
   (déclarées ici pour être accessibles partout)
══════════════════════════════════════ */
const PASSWORD = "lanternes2025";
const TOTAL    = 8;

let cur            = 0;
let isTransitioning = false;
let trailH         = 42;
let trailS         = 85;
let trailL         = 65;
let trailActive    = true;
let isRegisterMode = false;

const PRESETS = [
  { name: 'Or',     h: 42,  s: 85, l: 65 },
  { name: 'Bleu',   h: 210, s: 90, l: 65 },
  { name: 'Violet', h: 270, s: 80, l: 65 },
  { name: 'Vert',   h: 140, s: 75, l: 55 },
  { name: 'Rouge',  h: 0,   s: 85, l: 60 },
  { name: 'Blanc',  h: 50,  s: 20, l: 95 },
  { name: 'Cyan',   h: 185, s: 85, l: 60 },
  { name: 'Rose',   h: 320, s: 80, l: 70 },
];

const SEARCH_DATA = [
  { cat: 'Le Monde',       title: "Terre d'Ailleurs" },
  { cat: 'Le Monde',       title: 'La Terre Sablière' },
  { cat: 'Le Monde',       title: 'La Terre des Géants' },
  { cat: 'Le Monde',       title: 'Les Portails' },
  { cat: 'Le Monde',       title: 'Le Monde Commun' },
  { cat: "L'Histoire",     title: "La Fondation de l'Ordre" },
  { cat: "L'Histoire",     title: 'La Guerre des Lanternes' },
  { cat: "L'Histoire",     title: "L'Ère des Sylphes" },
  { cat: 'Organisations',  title: "L'Ordre des Lanternes" },
  { cat: 'Organisations',  title: 'Les Ligues' },
  { cat: 'Organisations',  title: 'Le Tribunal des Lanternes' },
  { cat: 'Personnages',    title: 'Chloé' },
  { cat: 'Personnages',    title: 'Cloche' },
  { cat: 'Personnages',    title: 'Merlin' },
  { cat: 'Personnages',    title: 'Galaad du Lac' },
  { cat: 'Magie',          title: 'Les Sylphes' },
  { cat: 'Magie',          title: 'La Brume Crépusculaire' },
  { cat: 'Magie',          title: 'Les Lanternes' },
  { cat: 'Glossaire',      title: 'Lanterneur / Lanterneuse' },
  { cat: 'Glossaire',      title: 'Sylphe' },
  { cat: 'Glossaire',      title: 'Ailleurs' },
];

/* ══════════════════════════════════════
   FONCTIONS GLOBALES
   (appelées depuis les onclick="" du HTML)
══════════════════════════════════════ */

function checkPassword() {
  const input = document.getElementById('pwd-input');
  if (input.value === PASSWORD) {
    document.getElementById('gate').style.display  = 'none';
    document.getElementById('wiki').style.display  = 'block';
    sessionStorage.setItem('lodl-auth', '1');
  } else {
    document.getElementById('gate-error').textContent = 'Mot de passe incorrect. Les archives restent scellées.';
    input.value = '';
    input.focus();
  }
}

function openLanternerie(e) {
  e.preventDefault();
  document.getElementById('lanternerie-panel').classList.add('open');
}

function closeLanternerie() {
  document.getElementById('lanternerie-panel').classList.remove('open');
}

function toggleLogin(e) {
  e.stopPropagation();
  document.getElementById('login-panel').classList.toggle('open');
}

function toggleMode() {
  isRegisterMode = !isRegisterMode;
  document.getElementById('pseudo-field').style.display   = isRegisterMode ? 'flex' : 'none';
  document.getElementById('confirm-field').style.display  = isRegisterMode ? 'flex' : 'none';
  document.getElementById('login-panel-title').textContent = isRegisterMode ? 'Créer un compte' : 'Connexion';
  document.getElementById('login-submit-btn').textContent  = isRegisterMode ? "Rejoindre l'Ordre" : "Entrer dans l'Ordre";
  document.querySelector('.login-toggle').innerHTML = isRegisterMode
    ? 'Déjà un compte ? <span>Se connecter</span>'
    : 'Pas encore de compte ? <span>S\'inscrire</span>';
}

function updatePreview() {
  document.getElementById('colorPreview').style.background = `hsl(${trailH},${trailS}%,${trailL}%)`;
}

function clearPresets() {
  document.querySelectorAll('.preset').forEach(p => p.classList.remove('selected'));
}

function updateDots(active) {
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.className = 'dot' + (i === active ? ' active' : '');
  });
}

/* ══════════════════════════════════════
   CARROUSEL
══════════════════════════════════════ */

function moveTo(index, animate) {
  ['heroTrack', 'gateTrack'].forEach(id => {
    const t = document.getElementById(id);
    if (!t) return;
    t.style.transition = animate ? 'transform 1.1s cubic-bezier(0.77,0,0.175,1)' : 'none';
    t.style.transform  = `translateX(-${index * 100}%)`;
  });
}

function jumpTo(index) {
  ['heroTrack', 'gateTrack'].forEach(id => {
    const t = document.getElementById(id);
    if (!t) return;
    t.style.transition = 'none';
    t.style.transform  = `translateX(-${index * 100}%)`;
    t.offsetHeight; // force le recalcul du navigateur
  });
}

function advance() {
  if (isTransitioning) return;
  isTransitioning = true;
  cur++;
  moveTo(cur, true);
  updateDots(cur >= TOTAL ? 0 : cur);
  setTimeout(() => { isTransitioning = false; }, 1400);
}

function goTo(n) {
  if (isTransitioning) return;
  isTransitioning = true;
  cur = n;
  moveTo(n, true);
  updateDots(n);
}

function initCarousel() {
  const dots = document.getElementById('heroDots');
  for (let i = 0; i < TOTAL; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goTo(i);
    dots.appendChild(d);
  }

  setInterval(advance, 5000);

  const heroTrack = document.getElementById('heroTrack');
  if (heroTrack) {
    heroTrack.addEventListener('transitionend', e => {
      if (e.propertyName !== 'transform') return;
      if (cur === TOTAL) {
        cur = 0;
        jumpTo(0);
      }
      isTransitioning = false;
    });
  }
}

/* ══════════════════════════════════════
   CURSEUR SYLPHE (filament de lumière)
══════════════════════════════════════ */

function initCursor() {
  const canvas = document.getElementById('cursorCanvas');
  const ctx    = canvas.getContext('2d');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const pts = [];

  window.addEventListener('mousemove', e => {
    if (!trailActive) return;
    for (let i = 0; i < 4; i++) {
      pts.push({
        x:    e.clientX + (Math.random() - .5) * 12,
        y:    e.clientY + (Math.random() - .5) * 12,
        vx:   (Math.random() - .5) * 2.5,
        vy:   (Math.random() - .5) * 2.5 - .8,
        life: 1,
        size: Math.random() * 3 + 1.5,
      });
    }
  });

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (trailActive) {
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.028;
        p.size *= 0.975;
        if (p.life <= 0) { pts.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle    = `hsla(${trailH},${trailS}%,${trailL}%,${p.life * 0.9})`;
        ctx.shadowBlur   = 12;
        ctx.shadowColor  = `hsla(${trailH},100%,${trailL}%,${p.life})`;
        ctx.fill();
      }
    }
    requestAnimationFrame(loop);
  })();
}

/* ══════════════════════════════════════
   ROUE CHROMATIQUE (Lanternerie)
══════════════════════════════════════ */

function initColorWheel() {
  const canvas = document.getElementById('colorWheel');
  const ctx    = canvas.getContext('2d');
  const cx = 90, cy = 90, r = 85;

  for (let a = 0; a < 360; a++) {
    const start = (a - 1) * Math.PI / 180;
    const end   = (a + 1) * Math.PI / 180;
    const g     = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, 'white');
    g.addColorStop(1, `hsl(${a},100%,50%)`);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
  }

  function pick(e) {
    const rect = canvas.getBoundingClientRect();
    const x    = e.clientX - rect.left - cx;
    const y    = e.clientY - rect.top  - cy;
    const dist = Math.sqrt(x * x + y * y);
    if (dist > r) return;
    let a = Math.atan2(y, x) * 180 / Math.PI;
    if (a < 0) a += 360;
    trailH = Math.round(a);
    trailS = Math.round((dist / r) * 85 + 15);
    updatePreview();
    clearPresets();
  }

  canvas.addEventListener('mousedown', e => {
    pick(e);
    canvas.addEventListener('mousemove', pick);
  });
  window.addEventListener('mouseup', () => canvas.removeEventListener('mousemove', pick));
}

function initPresets() {
  const container = document.getElementById('presetColors');
  PRESETS.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'preset' + (i === 0 ? ' selected' : '');
    el.title     = p.name;
    el.style.background = `hsl(${p.h},${p.s}%,${p.l}%)`;
    el.onclick = () => {
      trailH = p.h; trailS = p.s; trailL = p.l;
      document.getElementById('brightnessSlider').value = p.l;
      updatePreview();
      clearPresets();
      el.classList.add('selected');
    };
    container.appendChild(el);
  });
}

/* ══════════════════════════════════════
   RECHERCHE
══════════════════════════════════════ */

function initSearch() {
  const searchInput    = document.getElementById('heroSearch');
  const searchDropdown = document.getElementById('searchDropdown');
  if (!searchInput) return;

  searchInput.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    searchDropdown.innerHTML = '';
    if (q.length < 2) { searchDropdown.classList.remove('visible'); return; }
    const results = SEARCH_DATA.filter(d =>
      d.title.toLowerCase().includes(q) || d.cat.toLowerCase().includes(q)
    ).slice(0, 6);
    if (results.length === 0) {
      searchDropdown.innerHTML = '<div class="search-no-result">Aucun résultat trouvé dans les archives.</div>';
    } else {
      results.forEach(r => {
        const el = document.createElement('a');
        el.className = 'search-result';
        el.href      = '#';
        el.innerHTML = `<span class="search-result-cat">${r.cat}</span><span class="search-result-title">${r.title}</span>`;
        searchDropdown.appendChild(el);
      });
    }
    searchDropdown.classList.add('visible');
  });

  document.addEventListener('click', e => {
    const wrap = document.querySelector('.hero-search-wrap');
    if (wrap && !wrap.contains(e.target)) searchDropdown.classList.remove('visible');
  });
}

/* ══════════════════════════════════════
   INITIALISATION
   (tout ce qui nécessite que le DOM soit chargé)
══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* Vérification session */
  if (sessionStorage.getItem('lodl-auth') === '1') {
    document.getElementById('gate').style.display = 'none';
    document.getElementById('wiki').style.display = 'block';
  }

  /* Touche Entrée sur le mot de passe */
  const pwdInput = document.getElementById('pwd-input');
  if (pwdInput) {
    pwdInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkPassword(); });
  }

  /* Fermer le panel de connexion en cliquant ailleurs */
  document.addEventListener('click', e => {
    const panel = document.getElementById('login-panel');
    const headerRight = document.querySelector('.header-right');
    if (panel && headerRight && !headerRight.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  /* Slider luminosité */
  const slider = document.getElementById('brightnessSlider');
  if (slider) {
    slider.addEventListener('input', function () {
      trailL = parseInt(this.value);
      updatePreview();
    });
  }

  /* Toggle filament */
  const trailToggle = document.getElementById('trailToggle');
  if (trailToggle) {
    trailToggle.addEventListener('change', function () {
      trailActive = this.checked;
    });
  }

  /* Lancement */
  initCursor();
  initColorWheel();
  initPresets();
  initCarousel();
  initSearch();
  updatePreview();

});

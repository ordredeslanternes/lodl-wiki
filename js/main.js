/* ============================================
   L'ORDRE DES LANTERNES — Wiki
   Script principal
   ============================================ */

/* ── MOT DE PASSE ── */
const PASSWORD = "lanternes2025";

function checkPassword() {
  const v = document.getElementById('pwd-input').value;
  if (v === PASSWORD) {
    document.getElementById('gate').style.display = 'none';
    document.getElementById('wiki').style.display = 'block';
    sessionStorage.setItem('lodl-auth', '1');
  } else {
    document.getElementById('gate-error').textContent = 'Mot de passe incorrect. Les archives restent scellées.';
    document.getElementById('pwd-input').value = '';
    document.getElementById('pwd-input').focus();
  }
}

document.getElementById('pwd-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') checkPassword();
});

if (sessionStorage.getItem('lodl-auth') === '1') {
  document.getElementById('gate').style.display = 'none';
  document.getElementById('wiki').style.display = 'block';
}

/* ── DIAPORAMA INFINI ── */
const TOTAL = 8;
let cur = 0;
let isTransitioning = false;
const tracks = ['heroTrack', 'gateTrack'];

function moveTo(index, animate) {
  tracks.forEach(id => {
    const t = document.getElementById(id);
    t.style.transition = animate ? 'transform 1.1s cubic-bezier(0.77,0,0.175,1)' : 'none';
    t.style.transform = `translateX(-${index * 100}%)`;
  });
}

function jumpTo(index) {
  tracks.forEach(id => {
    const t = document.getElementById(id);
    t.style.transition = 'none';
    t.style.transform = `translateX(-${index * 100}%)`;
    t.offsetHeight; // force le navigateur à recalculer avant d'animer
  });
}

function initCarousel() {
  const dots = document.getElementById('heroDots');
  for (let i = 0; i < TOTAL; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.onclick = () => { if (!isTransitioning) goTo(i); };
    dots.appendChild(d);
  }

  setInterval(() => { if (!isTransitioning) advance(); }, 5000);

  document.getElementById('heroTrack').addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;
    if (cur === TOTAL) {
      cur = 0;
      jumpTo(0);
    }
    isTransitioning = false;
  });
}

function advance() {
  isTransitioning = true;
  cur++;
  moveTo(cur, true);
  updateDots(cur >= TOTAL ? 0 : cur);
  setTimeout(() => { isTransitioning = false; }, 1400);
}

function goTo(n) {
  isTransitioning = true;
  cur = n;
  moveTo(n, true);
  updateDots(n);
}

function updateDots(active) {
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.className = 'dot' + (i === active ? ' active' : '');
  });
}

/* ── CURSEUR SYLPHE (filament de lumière) ── */
(function () {
  const canvas = document.getElementById('cursorCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const pts = [];

  window.addEventListener('mousemove', e => {
    if (!trailActive) return;
    for (let i = 0; i < 4; i++) {
      pts.push({
        x: e.clientX + (Math.random() - .5) * 12,
        y: e.clientY + (Math.random() - .5) * 12,
        vx: (Math.random() - .5) * 2.5,
        vy: (Math.random() - .5) * 2.5 - .8,
        life: 1,
        size: Math.random() * 3 + 1.5
      });
    }
  });

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (trailActive) {
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        p.life -= 0.028;
        p.size *= 0.975;
        if (p.life <= 0) { pts.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${trailH},${trailS}%,${trailL}%,${p.life * 0.9})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${trailH},100%,${trailL}%,${p.life})`;
        ctx.fill();
      }
    }
    requestAnimationFrame(loop);
  })();
})();

/* ── PANNEAU LANTERNERIE ── */
let trailH = 42, trailS = 85, trailL = 65, trailActive = true;

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

function openLanternerie(e) {
  e.preventDefault();
  document.getElementById('lanternerie-panel').classList.add('open');
}
function closeLanternerie() {
  document.getElementById('lanternerie-panel').classList.remove('open');
}

// Roue chromatique
(function () {
  const canvas = document.getElementById('colorWheel');
  const ctx = canvas.getContext('2d');
  const cx = 90, cy = 90, r = 85;

  for (let a = 0; a < 360; a++) {
    const start = (a - 1) * Math.PI / 180;
    const end   = (a + 1) * Math.PI / 180;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
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
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
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
})();

document.getElementById('brightnessSlider').addEventListener('input', function () {
  trailL = parseInt(this.value);
  updatePreview();
});

document.getElementById('trailToggle').addEventListener('change', function () {
  trailActive = this.checked;
});

function updatePreview() {
  document.getElementById('colorPreview').style.background = `hsl(${trailH},${trailS}%,${trailL}%)`;
}

function clearPresets() {
  document.querySelectorAll('.preset').forEach(p => p.classList.remove('selected'));
}

// Couleurs prédéfinies
(function () {
  const container = document.getElementById('presetColors');
  PRESETS.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'preset' + (i === 0 ? ' selected' : '');
    el.title = p.name;
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
})();

/* ── INITIALISATION ── */
updatePreview();
initCarousel();

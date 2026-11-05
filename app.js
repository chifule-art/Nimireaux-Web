/* ==========================================================================
   NIMIREAUX UGANDA LIMITED • PRESTIGE EDITION
   HAUTE COUTURE LUXURY INTERACTION ENGINE
   ========================================================================== */

let currentAct = 0;
const totalActs = 7;
let isActTransitioning = false;
let audioEnabled = true;

const actNames = [
  'I • PROLOGUE',
  'II • TERROIR',
  'III • ATELIERS',
  'IV • PURITY',
  'V • RESERVE',
  'VI • CONCIERGE',
  'VII • SALON'
];

/* ==========================================================================
   ACT NAVIGATION ENGINE
   ========================================================================== */
function goToAct(index) {
  if (index < 0 || index >= totalActs) return;
  if (index === currentAct && document.querySelector('.editorial-act.active')) return;

  isActTransitioning = true;
  playAcousticChime('transition');

  // Switch Editorial Acts
  const acts = document.querySelectorAll('.editorial-act');
  acts.forEach(a => a.classList.remove('active'));

  const targetAct = document.getElementById(`act${index}`);
  if (targetAct) {
    targetAct.classList.add('active');
  }

  // Switch Photographic Scenic Stage
  const scenes = document.querySelectorAll('.scenic-slide');
  scenes.forEach(s => {
    const sIdx = parseInt(s.getAttribute('data-scene'));
    if (sIdx === index) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });

  // Switch Top Nav Tabs
  const tabs = document.querySelectorAll('.act-tab');
  tabs.forEach(t => {
    const tIdx = parseInt(t.getAttribute('data-act'));
    if (tIdx === index) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  currentAct = index;
  updateCapsuleDock();

  setTimeout(() => {
    isActTransitioning = false;
  }, 750);
}

function nextAct() {
  if (currentAct < totalActs - 1) {
    goToAct(currentAct + 1);
  }
}

function prevAct() {
  if (currentAct > 0) {
    goToAct(currentAct - 1);
  }
}

/* ==========================================================================
   FLOATING CAPSULE SCRUBBER DOCK
   ========================================================================== */
function updateCapsuleDock() {
  const nameEl = document.getElementById('dockActName');
  const countEl = document.getElementById('dockCounter');
  const fillEl = document.getElementById('dockProgressFill');

  if (nameEl) nameEl.textContent = actNames[currentAct];
  if (countEl) countEl.textContent = `${String(currentAct + 1).padStart(2, '0')} / 07`;
  if (fillEl) {
    const pct = ((currentAct + 1) / totalActs) * 100;
    fillEl.style.width = `${pct}%`;
  }
}

/* ==========================================================================
   DEBOUNCED SCROLL & KEYBOARD LISTENERS
   ========================================================================== */
let scrollDeltaAccumulator = 0;
let scrollLock = false;

window.addEventListener('wheel', (e) => {
  if (window.innerWidth <= 1024) return; // Allow normal scroll on mobile/tablet
  e.preventDefault();

  if (scrollLock) return;

  scrollDeltaAccumulator += e.deltaY;

  if (Math.abs(scrollDeltaAccumulator) >= 60) {
    scrollLock = true;
    if (scrollDeltaAccumulator > 0) {
      nextAct();
    } else {
      prevAct();
    }
    scrollDeltaAccumulator = 0;
    setTimeout(() => {
      scrollLock = false;
    }, 750);
  }
}, { passive: false });

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
    nextAct();
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
    prevAct();
  }
});

/* Touch Swipe Navigation */
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  if (window.innerWidth <= 1024) return;
  const touchEndY = e.changedTouches[0].clientY;
  const diff = touchStartY - touchEndY;
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextAct();
    else prevAct();
  }
}, { passive: true });

/* ==========================================================================
   DUAL ATMOSPHERIC THEME SWITCHER (Noir Emerald <-> Champagne Ivory)
   ========================================================================== */
const themeToggleBtn = document.getElementById('themeToggleBtn');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    playAcousticChime('click');
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);

    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.className = newTheme === 'light' ? 'fa-regular fa-sun' : 'fa-solid fa-circle-half-stroke';
    }
  });
}

/* ==========================================================================
   ACT II: TERROIR REGIONAL SPECIMENS
   ========================================================================== */
const terroirData = [
  {
    origin: 'ORIGIN REGION: MASINDI CORRIDOR',
    img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1400&q=85',
    varietal: 'White Dent Elite',
    purity: '99.9% Clean',
    farmers: '8,500+ Stewards'
  },
  {
    origin: 'ORIGIN REGION: ACHOLI BASIN',
    img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1400&q=85',
    varietal: 'Heritage Sorghum & Millet',
    purity: '99.8% Clean',
    farmers: '4,200+ Stewards'
  },
  {
    origin: 'ORIGIN REGION: EASTERN HIGHLANDS',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=85',
    varietal: 'High-Gluten Hard Wheat',
    purity: '100% Verified',
    farmers: '3,800+ Stewards'
  }
];

function inspectTerroir(index) {
  playAcousticChime('click');

  const tiles = document.querySelectorAll('.terroir-tile');
  tiles.forEach(t => t.classList.remove('active'));
  if (tiles[index]) tiles[index].classList.add('active');

  const data = terroirData[index];
  if (!data) return;

  const oEl = document.getElementById('terroirOrigin');
  const imgEl = document.getElementById('terroirImg');
  const vEl = document.getElementById('terroirVarietal');
  const pEl = document.getElementById('terroirPurity');
  const fEl = document.getElementById('terroirFarmers');

  if (oEl) oEl.textContent = data.origin;
  if (imgEl) imgEl.src = data.img;
  if (vEl) vEl.textContent = data.varietal;
  if (pEl) pEl.textContent = data.purity;
  if (fEl) fEl.textContent = data.farmers;
}

/* ==========================================================================
   ACT III: ATELIER ENGINEERING PHASES
   ========================================================================== */
const atelierData = [
  {
    title: 'Phase I: Hydrothermal Moisture Conditioning',
    desc: 'Computer-calibrated water misting elevates kernel moisture to exactly 14.2%, mellowing the inner endosperm starch while imparting elastic resilience to the outer bran shell for clean separation.',
    target: '14.2% H₂O',
    rest: '12 - 16 Hours',
    yield: '100% Intact',
    rpm: '1,450 RPM',
    gap: '0.18 mm',
    temp: '36.2 °C'
  },
  {
    title: 'Phase II: Multi-Break Cast-Iron Corrugation',
    desc: 'Precision-grooved chilled iron rollers run at differential speeds, gently peeling the outer husk without pulverizing, liberating pristine white starch semolina with negligible heat creation.',
    target: 'Sub-Micron Shear',
    rest: 'Continuous Flow',
    yield: '72% Flavour Core',
    rpm: '1,680 RPM',
    gap: '0.12 mm',
    temp: '41.5 °C'
  },
  {
    title: 'Phase III: High-Speed Plansifting & Air Classification',
    desc: 'Multi-deck oscillating silk sieves separate flour particles by micronic density, ensuring uniform granulometry (120 μm) while air currents sweep away stray fibrous particles.',
    target: '120 μm Sift',
    rest: 'Vibratory Separation',
    yield: '0.0% Vitreous Husk',
    rpm: '2,200 RPM',
    gap: '0.08 mm',
    temp: '32.0 °C'
  },
  {
    title: 'Phase IV: UNBS Mandatory Micro-Fortification',
    desc: 'Automated gravimetric dosers introduce bioavailable Vitamin A, Zinc, Iron, and Folic Acid at micro-gram precision, thoroughly blending the nutrients into every single bag.',
    target: 'UNBS Fortified',
    rest: 'Hermetic Bagging',
    yield: 'Bio-Available',
    rpm: '950 RPM',
    gap: 'Automated Dose',
    temp: '28.4 °C'
  }
];

function switchAtelierPhase(index) {
  playAcousticChime('click');

  const btns = document.querySelectorAll('.atelier-phase-btn');
  btns.forEach(b => b.classList.remove('active'));
  if (btns[index]) btns[index].classList.add('active');

  const p = atelierData[index];
  if (!p) return;

  const titleEl = document.getElementById('phaseTitle');
  const descEl = document.getElementById('phaseDesc');
  const targetEl = document.getElementById('pmTarget');
  const restEl = document.getElementById('pmRest');
  const yieldEl = document.getElementById('pmYield');
  const rpmEl = document.getElementById('athRpm');
  const gapEl = document.getElementById('athGap');
  const tempEl = document.getElementById('athTemp');

  if (titleEl) titleEl.textContent = p.title;
  if (descEl) descEl.textContent = p.desc;
  if (targetEl) targetEl.textContent = p.target;
  if (restEl) restEl.textContent = p.rest;
  if (yieldEl) yieldEl.textContent = p.yield;
  if (rpmEl) rpmEl.textContent = p.rpm;
  if (gapEl) gapEl.textContent = p.gap;
  if (tempEl) tempEl.textContent = p.temp;
}

/* ==========================================================================
   ACT V: RESERVE FLOUR SOMMELIER
   ========================================================================== */
const reserveData = [
  {
    badge: 'MAISON SELECTION • GRADE 1',
    title: 'Superfine Posho Flour (Grade 1 Royal)',
    desc: 'Refined from pure vitreous endosperm with zero bran specks, micro-fortified with Vitamin A, Zinc, Iron, and Folic Acid.',
    granulo: '120 μm (Silk Patent)',
    energy: '362 kcal / 1,514 kJ',
    carbs: '78.4 g',
    protein: '8.9 g',
    vitA: '1.8 mg / kg',
    zinc: '32.0 mg / kg'
  },
  {
    badge: 'WHOLE GRAIN • HIGH FIBER',
    title: 'Whole Grain Maize Flour (Artisanal Brown)',
    desc: 'Slow-milled retention of natural maize germ and aleurone layers, rich in complex dietary fiber and authentic toasted aroma.',
    granulo: '220 μm (Stone Texture)',
    energy: '348 kcal / 1,455 kJ',
    carbs: '72.1 g',
    protein: '10.2 g',
    vitA: '1.5 mg / kg',
    zinc: '38.0 mg / kg'
  },
  {
    badge: 'BAKER’S GRAND CRU',
    title: 'Baker’s Special Hard Wheat Flour',
    desc: 'Milled from high-altitude hard wheat cultivars with extraordinary gluten matrix resilience and high water absorption.',
    granulo: '140 μm (Patent Flour)',
    energy: '370 kcal / 1,548 kJ',
    carbs: '74.5 g',
    protein: '12.8 g',
    vitA: '1.2 mg / kg',
    zinc: '28.0 mg / kg'
  },
  {
    badge: 'WELLNESS BIO-ELIXIR',
    title: 'Nutri-Composite Multi-Grain Porridge Flour',
    desc: 'Nutrient-rich composite blend of roasted white maize, finger millet, red sorghum, and toasted soya for growing children and vitality.',
    granulo: '160 μm (Porridge Silk)',
    energy: '385 kcal / 1,610 kJ',
    carbs: '69.0 g',
    protein: '14.6 g',
    vitA: '2.2 mg / kg',
    zinc: '45.0 mg / kg'
  }
];

function selectReserveFlour(index) {
  playAcousticChime('click');

  const items = document.querySelectorAll('.sommelier-item');
  items.forEach(i => i.classList.remove('active'));
  if (items[index]) items[index].classList.add('active');

  const d = reserveData[index];
  if (!d) return;

  const bEl = document.getElementById('rfscBadge');
  const tEl = document.getElementById('rfscTitle');
  const dEl = document.getElementById('rfscDesc');
  const gEl = document.getElementById('specGranulo');
  const eEl = document.getElementById('specEnergy');
  const cEl = document.getElementById('specCarbs');
  const pEl = document.getElementById('specProtein');
  const vaEl = document.getElementById('specVitA');
  const zEl = document.getElementById('specZinc');

  if (bEl) bEl.textContent = d.badge;
  if (tEl) tEl.textContent = d.title;
  if (dEl) dEl.textContent = d.desc;
  if (gEl) gEl.textContent = d.granulo;
  if (eEl) eEl.textContent = d.energy;
  if (cEl) cEl.textContent = d.carbs;
  if (pEl) pEl.textContent = d.protein;
  if (vaEl) vaEl.textContent = d.vitA;
  if (zEl) zEl.textContent = d.zinc;
}

function inquireProductReserve() {
  const activeTitle = document.getElementById('rfscTitle')?.textContent || 'Superfine Posho Flour';
  goToAct(6);
  const notes = document.getElementById('pNotes');
  if (notes) {
    notes.value = `Commercial purchase inquiry regarding ${activeTitle}. Requesting minimum order volume (MOQ), tiered wholesale pricing, and packaging schedule.`;
  }
}

/* ==========================================================================
   ACT VI: INDUSTRIAL BATCH YIELD CONCIERGE
   ========================================================================== */
function updateConciergeSlider(val) {
  const label = document.getElementById('conciergeTonnageVal');
  if (label) label.textContent = `${val} METRIC TONS`;
  calculateConciergeYield();
}

function calculateConciergeYield() {
  const slider = document.getElementById('conciergeSlider');
  if (!slider) return;

  const mt = parseFloat(slider.value) || 100;
  const gradeRadio = document.querySelector('input[name="conciergeGrade"]:checked');
  const isWhole = gradeRadio && gradeRadio.value === 'whole';

  const extractionRate = isWhole ? 0.88 : 0.72;
  const flourMT = mt * extractionRate;
  const branMT = mt * (1 - extractionRate);
  const bags = Math.round((flourMT * 1000) / 50);
  const hours = (mt / 15).toFixed(1);

  const fEl = document.getElementById('flourYieldNum');
  const bEl = document.getElementById('bagsYieldNum');
  const brEl = document.getElementById('branYieldNum');
  const tEl = document.getElementById('turnaroundNum');

  const fFill = document.getElementById('flourYieldFill');
  const bFill = document.getElementById('bagsYieldFill');
  const brFill = document.getElementById('branYieldFill');

  if (fEl) fEl.textContent = flourMT.toFixed(1);
  if (bEl) bEl.textContent = bags.toLocaleString();
  if (brEl) brEl.textContent = branMT.toFixed(1);
  if (tEl) tEl.textContent = hours;

  if (fFill) fFill.style.width = `${Math.round(extractionRate * 100)}%`;
  if (bFill) bFill.style.width = `${Math.round(extractionRate * 100)}%`;
  if (brFill) brFill.style.width = `${Math.round((1 - extractionRate) * 100)}%`;
}

function applyConciergeToInquiry() {
  playAcousticChime('click');
  const slider = document.getElementById('conciergeSlider');
  const mt = slider ? slider.value : '100';
  const commodity = document.querySelector('input[name="conciergeCommodity"]:checked')?.value || 'white_maize';

  goToAct(6);

  const volField = document.getElementById('pVolume');
  const notesField = document.getElementById('pNotes');

  if (volField) volField.value = `${mt} Metric Tons (${commodity.replace('_', ' ').toUpperCase()})`;
  if (notesField) {
    notesField.value = `Industrial milling batch simulation: ${mt} MT of ${commodity.replace('_', ' ')}. Requesting official toll milling contract / bulk supply offer.`;
  }
}

/* ==========================================================================
   ACT VII: 3D HOLOGRAPHIC TILT PRESIDENTIAL CARD
   ========================================================================== */
function handleCardTilt(e) {
  const card = document.getElementById('presidentialCard');
  const wrapper = document.getElementById('cardWrapper');
  if (!card || !wrapper) return;

  const rect = wrapper.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * -12;
  const rotateY = ((x - centerX) / centerX) * 14;

  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

  const shimmer = card.querySelector('.card-shimmer-foil');
  if (shimmer) {
    shimmer.style.transform = `translateX(${((x - centerX) / centerX) * 40}px) translateY(${((y - centerY) / centerY) * 40}px) rotate(25deg)`;
  }
}

function resetCardTilt() {
  const card = document.getElementById('presidentialCard');
  if (card) {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  }
}

/* Haute RFQ Submit */
function handlePrestigeSubmit(e) {
  e.preventDefault();
  playAcousticChime('click');

  const btn = document.getElementById('prestigeSubmitBtn');
  const toast = document.getElementById('prestigeToast');
  const form = document.getElementById('prestigeRfqForm');

  if (btn) {
    btn.innerHTML = '<span>DISPATCHING EXECUTIVE BRIEF...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;
  }

  setTimeout(() => {
    if (btn) {
      btn.innerHTML = '<span>EXECUTIVE INQUIRY DISPATCHED</span> <i class="fa-solid fa-check-circle"></i>';
      btn.style.background = '#155d32';
    }
    if (toast) toast.style.display = 'flex';
    form.reset();
  }, 900);
}

/* ==========================================================================
   AMBIENT GOLDEN DUST SHIMMER PARTICLES CANVAS
   ========================================================================== */
const dustCanvas = document.getElementById('ambientDustCanvas');
const dCtx = dustCanvas ? dustCanvas.getContext('2d') : null;

let dustMotes = [];
const dustCount = 45;

function resizeDustCanvas() {
  if (!dustCanvas) return;
  dustCanvas.width = window.innerWidth;
  dustCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeDustCanvas);
resizeDustCanvas();

class DustMote {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * (dustCanvas ? dustCanvas.width : 1200);
    this.y = Math.random() * (dustCanvas ? dustCanvas.height : 900);
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = -Math.random() * 0.35 - 0.1;
    this.radius = Math.random() * 1.8 + 0.6;
    this.alpha = Math.random() * 0.5 + 0.15;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < 0) this.y = dustCanvas.height;
    if (this.x < 0) this.x = dustCanvas.width;
    if (this.x > dustCanvas.width) this.x = 0;
  }
  draw() {
    if (!dCtx) return;
    dCtx.beginPath();
    dCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    dCtx.fillStyle = `rgba(201, 154, 62, ${this.alpha})`;
    dCtx.shadowBlur = 6;
    dCtx.shadowColor = '#c99a3e';
    dCtx.fill();
    dCtx.shadowBlur = 0;
  }
}

if (dustCanvas && dCtx) {
  for (let i = 0; i < dustCount; i++) {
    dustMotes.push(new DustMote());
  }

  function renderDust() {
    dCtx.clearRect(0, 0, dustCanvas.width, dustCanvas.height);
    for (let i = 0; i < dustMotes.length; i++) {
      dustMotes[i].update();
      dustMotes[i].draw();
    }
    requestAnimationFrame(renderDust);
  }
  renderDust();
}

/* ==========================================================================
   WEB AUDIO API CRYSTAL & HARP ACOUSTIC SYNTHESIZER
   ========================================================================== */
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playAcousticChime(type) {
  if (!audioEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'transition') {
      // Warm crystalline acoustic chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else {
      // Delicate crystal tap
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (err) {}
}

const soundToggleBtn = document.getElementById('soundToggleBtn');
if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    const icon = document.getElementById('soundIcon');
    if (audioEnabled) {
      if (icon) icon.className = 'fa-solid fa-volume-high';
      playAcousticChime('click');
    } else {
      if (icon) icon.className = 'fa-solid fa-volume-xmark';
    }
  });
}

// Initial Boot
calculateConciergeYield();
updateCapsuleDock();
goToAct(0);

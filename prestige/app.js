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

  // Update floating AI context badge based on current page/act
  const aiBadge = document.getElementById('aiBadgeText');
  const actAiHints = [
    'AI Concierge',
    'Ask: Sourcing',
    'Ask: Milling',
    'Ask: Purity',
    'Ask: Flours',
    'Ask: Yields',
    'Ask: Executive'
  ];
  if (aiBadge) {
    aiBadge.textContent = actAiHints[currentAct] || 'AI Concierge';
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

/* ==========================================================================
   MAISON AI CONCIERGE & SOVEREIGN INTELLIGENCE PROTOCOL
   ========================================================================== */

let isAiDrawerOpen = false;
let isCoaModalOpen = false;

function openCoaModal() {
  const modal = document.getElementById('coaModalDialog');
  const overlay = document.getElementById('coaModalOverlay');
  if (!modal || !overlay) return;

  isCoaModalOpen = true;
  modal.classList.add('open');
  overlay.classList.add('open');
  playAcousticChime('transition');
}

function closeCoaModal() {
  const modal = document.getElementById('coaModalDialog');
  const overlay = document.getElementById('coaModalOverlay');
  if (!modal || !overlay) return;

  isCoaModalOpen = false;
  modal.classList.remove('open');
  overlay.classList.remove('open');
  playAcousticChime('click');
}

function toggleAiDrawer(forceOpen) {
  const drawer = document.getElementById('aiConciergeDrawer');
  const overlay = document.getElementById('aiDrawerOverlay');
  if (!drawer || !overlay) return;

  if (typeof forceOpen === 'boolean') {
    isAiDrawerOpen = forceOpen;
  } else {
    isAiDrawerOpen = !isAiDrawerOpen;
  }

  if (isAiDrawerOpen) {
    drawer.classList.add('open');
    overlay.classList.add('open');
    playAcousticChime('transition');
    setTimeout(() => {
      const input = document.getElementById('aiUserInput');
      if (input) input.focus();
    }, 300);
  } else {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    playAcousticChime('click');
  }
}

// Close drawer or COA modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (isCoaModalOpen) closeCoaModal();
    if (isAiDrawerOpen) toggleAiDrawer(false);
  }
});

function askAiPreset(questionText) {
  const input = document.getElementById('aiUserInput');
  if (input) {
    input.value = questionText;
    handleAiSubmit(new Event('submit'));
  }
}

function handleAiSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const input = document.getElementById('aiUserInput');
  if (!input) return;

  const rawQuery = input.value.trim();
  if (!rawQuery) return;

  playAcousticChime('click');

  // Append User Bubble
  appendChatMessage('user', rawQuery);
  input.value = '';

  // Show Typing Indicator
  const indicator = document.getElementById('aiTypingIndicator');
  if (indicator) indicator.style.display = 'flex';
  scrollAiToBottom();

  // Simulate Cognitive Processing Delay
  setTimeout(() => {
    if (indicator) indicator.style.display = 'none';
    const responsePayload = generateAiIntelligenceResponse(rawQuery);
    appendChatMessage('bot', responsePayload.text, responsePayload.actions);
    playAcousticChime('click');
    scrollAiToBottom();
  }, 480);
}

function appendChatMessage(sender, htmlContent, actionButtons = []) {
  const stage = document.getElementById('aiMessagesStage');
  if (!stage) return;

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msgDiv = document.createElement('div');
  msgDiv.className = `ai-msg ai-msg-${sender}`;

  if (sender === 'bot') {
    let actionsHtml = '';
    if (actionButtons && actionButtons.length > 0) {
      actionsHtml = `
        <div class="ai-actions-wrap">
          ${actionButtons.map(btn => {
            if (btn.href) {
              return `<a href="${btn.href}" ${btn.target ? `target="${btn.target}"` : ''} class="ai-action-pill ${btn.className || ''}">${btn.label}</a>`;
            } else if (btn.onClick) {
              return `<button type="button" onclick="${btn.onClick}" class="ai-action-pill ${btn.className || ''}">${btn.label}</button>`;
            }
            return '';
          }).join('')}
        </div>
      `;
    }

    msgDiv.innerHTML = `
      <div class="ai-msg-avatar">
        <img src="assets/logo.png" alt="Nimireaux" />
      </div>
      <div class="ai-msg-content">
        <div class="ai-msg-sender">NIMIREAUX CONCIERGE &bull; MAISON ADVISOR</div>
        <div class="ai-msg-bubble">
          ${htmlContent}
          ${actionsHtml}
        </div>
        <div class="ai-msg-time">${timeStr}</div>
      </div>
    `;
  } else {
    msgDiv.innerHTML = `
      <div class="ai-msg-content">
        <div class="ai-msg-sender">YOU</div>
        <div class="ai-msg-bubble">
          <p>${escapeHtml(htmlContent)}</p>
        </div>
        <div class="ai-msg-time">${timeStr}</div>
      </div>
    `;
  }

  stage.appendChild(msgDiv);
}

function scrollAiToBottom() {
  const stage = document.getElementById('aiMessagesStage');
  if (stage) {
    stage.scrollTop = stage.scrollHeight;
  }
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/* ==========================================================================
   NIMIREAUX DOMAIN KNOWLEDGE GRAPH & REASONING ENGINE
   ========================================================================== */
function generateAiIntelligenceResponse(query) {
  const q = query.toLowerCase();

  // 0. CORPORATE DOSSIER, SPEC SHEETS & CERTIFICATE OF ANALYSIS (PDF)
  if (q.includes('dossier') || q.includes('spec') || q.includes('pdf') || q.includes('brochure') || q.includes('coa') || q.includes('certificate') || q.includes('profile') || q.includes('download') || q.includes('document') || q.includes('catalog')) {
    return {
      text: `
        <p><strong>Official Corporate Profile &amp; Quality Specifications (2026 Dossier):</strong></p>
        <p>You can download our stamped corporate specifications and laboratory Certificate of Analysis (COA) containing verified UNBS Q-Mark and EAS 768 laboratory metrics:</p>
        <ul>
          <li><strong>Document:</strong> Nimireaux Corporate Dossier &amp; Specifications</li>
          <li><strong>Format:</strong> High-Resolution Official PDF (1.4 MB)</li>
          <li><strong>Includes:</strong> Physical/chemical metrics, micronutrient fortification targets, packaging dimensions, and commercial toll milling terms.</li>
        </ul>
      `,
      actions: [
        { label: 'Download Official PDF (1.4 MB)', href: 'assets/Nimireaux_Corporate_Dossier_Specifications.pdf', target: '_blank', className: 'ai-action-pill' },
        { label: 'Preview COA Spec Sheet', onClick: 'openCoaModal(); toggleAiDrawer(false);' }
      ]
    };
  }

  // 1. PRODUCTS & FLOUR GRADES
  if (q.includes('product') || q.includes('flour') || q.includes('grade') || q.includes('posho') || q.includes('super') || q.includes('bran') || q.includes('whole grain') || q.includes('pack')) {
    return {
      text: `
        <p><strong>Nimireaux Uganda Limited</strong> produces four commercial flour classifications calibrated for institutional caterers, commercial bakeries, and retail markets:</p>
        <ul>
          <li><strong>Super Grade 1 Fortified Maize Flour:</strong> Ultra-fine white flour refined with hydro-conditioned endosperm, fortified with Vitamin A, Zinc, and bioavailable Iron. Available in <strong>5kg, 10kg, 25kg, and 50kg</strong> moisture-barrier bags.</li>
          <li><strong>Whole Grain Stone-Style Flour:</strong> High-fiber formulation retaining full germ and aleurone layers for maximum dietary fiber and slow-release glycemic energy.</li>
          <li><strong>Institutional Relief Blend:</strong> Optimized for humanitarian feeding programs and schools, fortified to exceed UNBS / WFP micronutrient guidelines.</li>
          <li><strong>Commercial Maize Bran &amp; Hominy Feed:</strong> High-protein livestock and dairy feed by-product generated from pneumatic separation.</li>
        </ul>
      `,
      actions: [
        { label: 'Explore Reserve Collection →', onClick: 'goToAct(4); toggleAiDrawer(false);' },
        { label: 'Request Flour Price List', href: 'https://wa.me/256744135549?text=Hello%20Nimireaux%2C%20please%20send%20me%20your%20current%20wholesale%20flour%20price%20list.', target: '_blank', className: 'ai-wa-pill' }
      ]
    };
  }

  // 2. TOLL MILLING & CONTRACT PROCESSING
  if (q.includes('toll') || q.includes('milling') || q.includes('cleaning') || q.includes('process') || q.includes('contract') || q.includes('machine') || q.includes('capacity') || q.includes('yield') || q.includes('roller')) {
    return {
      text: `
        <p>Our <strong>Commercial Toll Milling &amp; Grain Processing</strong> infrastructure delivers complete custom processing for grain aggregators, commercial farms, and food relief agencies:</p>
        <ul>
          <li><strong>Pre-Cleaning &amp; Aspiration:</strong> Multi-stage pneumatic destoning, rotary sieves, and magnetic separation removing 99.9% of foreign debris.</li>
          <li><strong>Hydrothermal Conditioning:</strong> Precise automated misting to 14.2% kernel moisture for clean separation of the outer pericarp bran.</li>
          <li><strong>Roller Reduction:</strong> Laser-calibrated roller passes with chilled cast-iron cylinders for uniform micron granulometry.</li>
          <li><strong>Extraction Yield:</strong> Typical milling yield yields approximately <strong>78% to 82% pure white flour</strong> and <strong>18% to 22% high-protein bran</strong>, depending on incoming grain test weight.</li>
        </ul>
      `,
      actions: [
        { label: 'Open Yield Simulator →', onClick: 'goToAct(5); toggleAiDrawer(false);' },
        { label: 'Discuss Toll Contract on WhatsApp', href: 'https://wa.me/256744135549?text=Hello%20Nimireaux%2C%20I%20would%20like%20to%20discuss%20a%20commercial%20toll%20milling%20contract.', target: '_blank', className: 'ai-wa-pill' }
      ]
    };
  }

  // 3. FORTIFICATION & QUALITY SCIENCE
  if (q.includes('fortif') || q.includes('vitamin') || q.includes('zinc') || q.includes('iron') || q.includes('nutrition') || q.includes('health') || q.includes('mineral') || q.includes('unbs') || q.includes('standard')) {
    return {
      text: `
        <p><strong>Science of Purity &amp; Fortification:</strong> Nimireaux flours are fortified under strict laboratory compliance exceeding East African Community (EAS 768) and UNBS standards:</p>
        <ul>
          <li><strong>Vitamin A (Retinyl Palmitate):</strong> Micro-encapsulated for thermal stability during cooking to combat visual impairment and maternal fatigue.</li>
          <li><strong>Iron (Sodium Feredetate / NaFeEDTA):</strong> Highly bioavailable iron designed to reduce childhood anemia and enhance cognitive performance.</li>
          <li><strong>Zinc Oxide:</strong> Bolsters immune function, cellular repair, and physical growth in children.</li>
          <li><strong>Micro-Dosing Accuracy:</strong> Loss-in-weight gravimetric micro-feeders ensure even dispersion of 250 mg premix per kilogram with CV &lt; 3%.</li>
        </ul>
      `,
      actions: [
        { label: 'View Purity & Science Act →', onClick: 'goToAct(3); toggleAiDrawer(false);' }
      ]
    };
  }

  // 4. MINIMUM ORDER QUANTITIES (MOQ), DELIVERY & LOGISTICS
  if (q.includes('moq') || q.includes('minimum') || q.includes('order') || q.includes('deliver') || q.includes('ship') || q.includes('transport') || q.includes('logistics') || q.includes('kenya') || q.includes('congo') || q.includes('sudan') || q.includes('export')) {
    return {
      text: `
        <p><strong>Commercial Minimums &amp; Regional Logistics:</strong></p>
        <ul>
          <li><strong>Wholesale Retail Packs:</strong> Minimum order of <strong>500 kg</strong> (mixed 5kg, 10kg, 25kg, 50kg bags).</li>
          <li><strong>Contract Toll Milling:</strong> Batches accepted from <strong>5 Metric Tons</strong> up to 500+ MT per production run.</li>
          <li><strong>Institutional Bulk Supply:</strong> Direct depot delivery from 10 MT to multi-truck convoy dispatches.</li>
          <li><strong>Regional Distribution:</strong> Direct fleet transport across Uganda (Kampala, Jinja, Masindi, Gulu, Mbale, Mbarara) and cross-border customs-cleared corridors to <strong>Kenya, South Sudan, Rwanda, and the DRC</strong>.</li>
        </ul>
      `,
      actions: [
        { label: 'Submit Quotation Request →', onClick: 'goToAct(6); toggleAiDrawer(false);' },
        { label: 'Call Logistics Desk', href: 'tel:+256744135549' }
      ]
    };
  }

  // 5. CONTACTS, HOTLINES & DIRECTORY
  if (q.includes('contact') || q.includes('phone') || q.includes('call') || q.includes('email') || q.includes('hotline') || q.includes('whatsapp') || q.includes('address') || q.includes('location') || q.includes('where') || q.includes('office')) {
    return {
      text: `
        <p><strong>Official Nimireaux Uganda Executive Channels:</strong></p>
        <ul>
          <li><strong>Commercial Desk (Hotline &amp; WhatsApp):</strong> <a href="tel:+256744135549" class="p-link"><strong>+256 744 135 549</strong></a></li>
          <li><strong>Executive Direct Line:</strong> <a href="tel:+256783688363" class="p-link"><strong>+256 783 688 363</strong></a></li>
          <li><strong>General Information:</strong> <a href="mailto:info@nimireaux.com" class="p-link">info@nimireaux.com</a></li>
          <li><strong>Institutional Sales &amp; RFQs:</strong> <a href="mailto:sales@nimireaux.com" class="p-link">sales@nimireaux.com</a></li>
          <li><strong>Accounts &amp; Billing:</strong> <a href="mailto:accounts@nimireaux.com" class="p-link">accounts@nimireaux.com</a></li>
          <li><strong>Location:</strong> Kampala, Uganda &bull; Sourcing from Masindi, Acholi, and Eastern Highlands.</li>
        </ul>
      `,
      actions: [
        { label: 'Chat on WhatsApp', href: 'https://wa.me/256744135549?text=Hello%20Nimireaux%20Uganda%2C%20I%20am%20inquiring%20about%20commercial%20grain%20services.', target: '_blank', className: 'ai-wa-pill' },
        { label: 'Open Commercial Salon →', onClick: 'goToAct(6); toggleAiDrawer(false);' }
      ]
    };
  }

  // 6. PRICE / QUOTATION
  if (q.includes('price') || q.includes('cost') || q.includes('quote') || q.includes('rate') || q.includes('quotation') || q.includes('rfq') || q.includes('buy')) {
    return {
      text: `
        <p>Our pricing is tiered according to order volume, grain moisture, and contract terms. We issue formal, stamped commercial quotations within <strong>4 business hours</strong>.</p>
        <p>You can simulate yield tonnages using our Yield Concierge or transmit your formal specifications directly through our Request for Quotation protocol.</p>
      `,
      actions: [
        { label: 'Launch RFQ Form →', onClick: 'goToAct(6); toggleAiDrawer(false);' },
        { label: 'Open Yield Calculator →', onClick: 'goToAct(5); toggleAiDrawer(false);' },
        { label: 'Instant WhatsApp Quote', href: 'https://wa.me/256744135549?text=Hello%20Nimireaux%2C%20I%20would%20like%20an%20urgent%20price%20quote%20for%20grain%20milling.', target: '_blank', className: 'ai-wa-pill' }
      ]
    };
  }

  // 7. GREETINGS & INTRODUCTIONS
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('who are you') || q.includes('good morning') || q.includes('good afternoon') || q.includes('help')) {
    return {
      text: `
        <p>Good day. I am the <strong>Nimireaux AI Concierge</strong>, the intelligent digital representative for <strong>Nimireaux Uganda Limited</strong> — East Africa's premier grain processing and commercial milling maison.</p>
        <p>I can provide instant intelligence regarding:</p>
        <ul>
          <li>Our fortified flour formulations and packaging options</li>
          <li>Commercial toll milling parameters, machinery, and yields</li>
          <li>Nutritional compliance and fortification standards</li>
          <li>Minimum order volumes and export shipping logistics</li>
          <li>Direct connection with our executive directors</li>
        </ul>
        <p>What would you like to explore?</p>
      `,
      actions: [
        { label: '🌾 Flour Products', onClick: 'askAiPreset("What are your primary flour products and packaging sizes?")' },
        { label: '⚙️ Toll Milling', onClick: 'askAiPreset("How does your commercial toll milling service work?")' },
        { label: '📞 Executive Contacts', onClick: 'askAiPreset("How do I contact the executive directors directly?")' }
      ]
    };
  }

  // 8. GENERAL INTELLIGENT FALLBACK
  return {
    text: `
      <p>Thank you for your inquiry regarding <strong>Nimireaux Uganda Limited</strong>.</p>
      <p>We are a dedicated commercial grain processing and industrial milling corporation based in Uganda, operating high-efficiency roller mills, computerized cleaning systems, and vitamin fortification lines for regional markets and humanitarian relief programs.</p>
      <p>For custom institutional tenders, special flour blending, or immediate order processing, our commercial directors are available via hotline or WhatsApp.</p>
    `,
    actions: [
      { label: 'Connect on WhatsApp', href: 'https://wa.me/256744135549?text=Hello%20Nimireaux%20Uganda%2C%20I%20have%20a%20special%20procurement%20inquiry.', target: '_blank', className: 'ai-wa-pill' },
      { label: 'Send Formal Email', href: 'mailto:sales@nimireaux.com' },
      { label: 'Open Commercial Salon →', onClick: 'goToAct(6); toggleAiDrawer(false);' }
    ]
  };
}

/* ==========================================================================
   FREE-FLOATING & DRAGGABLE PHYSICS ENGINE FOR AI BUTTON
   ========================================================================== */
function initDraggableAiTrigger() {
  const trigger = document.getElementById('aiFloatingTrigger');
  if (!trigger) return;

  let isDragging = false;
  let hasMoved = false;
  let startX = 0;
  let startY = 0;
  let origLeft = 0;
  let origTop = 0;

  function onPointerDown(clientX, clientY) {
    const rect = trigger.getBoundingClientRect();
    startX = clientX;
    startY = clientY;
    origLeft = rect.left;
    origTop = rect.top;
    hasMoved = false;
    isDragging = true;
  }

  function onPointerMove(clientX, clientY) {
    if (!isDragging) return;
    const dx = clientX - startX;
    const dy = clientY - startY;

    if (!hasMoved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      hasMoved = true;
      trigger.classList.add('dragging');
    }

    if (hasMoved) {
      const rect = trigger.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      let newLeft = origLeft + dx;
      let newTop = origTop + dy;

      // Clamp within viewport
      const pad = 12;
      newLeft = Math.max(pad, Math.min(window.innerWidth - w - pad, newLeft));
      newTop = Math.max(pad, Math.min(window.innerHeight - h - pad, newTop));

      trigger.style.left = `${newLeft}px`;
      trigger.style.top = `${newTop}px`;
      trigger.style.bottom = 'auto';
      trigger.style.right = 'auto';
    }
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    trigger.classList.remove('dragging');

    if (!hasMoved) {
      // Pure click without drag -> Toggle AI Drawer
      toggleAiDrawer(true);
    }
  }

  // Mouse Listeners
  trigger.addEventListener('mousedown', (e) => {
    // Only drag with primary mouse button
    if (e.button !== 0) return;
    e.preventDefault();
    onPointerDown(e.clientX, e.clientY);

    function onMouseMove(moveEvt) {
      onPointerMove(moveEvt.clientX, moveEvt.clientY);
    }

    function onMouseUp() {
      onPointerUp();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  // Touch Listeners
  trigger.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      onPointerDown(t.clientX, t.clientY);
    }
  }, { passive: true });

  trigger.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length > 0) {
      const t = e.touches[0];
      onPointerMove(t.clientX, t.clientY);
      if (hasMoved && e.cancelable) {
        e.preventDefault(); // Prevent unwanted page scroll during drag
      }
    }
  }, { passive: false });

  trigger.addEventListener('touchend', () => {
    onPointerUp();
  });

  // Keep inside viewport on window resize
  window.addEventListener('resize', () => {
    if (!trigger.style.left || trigger.style.left === 'auto') return;
    const rect = trigger.getBoundingClientRect();
    const pad = 12;
    const maxLeft = window.innerWidth - rect.width - pad;
    const maxTop = window.innerHeight - rect.height - pad;
    let curLeft = parseFloat(trigger.style.left);
    let curTop = parseFloat(trigger.style.top);
    if (curLeft > maxLeft) trigger.style.left = `${Math.max(pad, maxLeft)}px`;
    if (curTop > maxTop) trigger.style.top = `${Math.max(pad, maxTop)}px`;
  });
}

// Initial Boot
calculateConciergeYield();
updateCapsuleDock();
initDraggableAiTrigger();
goToAct(0);


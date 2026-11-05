/* ==========================================================================
   NIMIREAUX UGANDA LIMITED • "GRAIN: REVOLUTIONIZED"
   CINEMATIC "MAKE IT LEGENDARY" INTERACTION ENGINE
   ========================================================================== */

let currentChapter = 0;
const totalChapters = 7;
let isAnimating = false;
let soundEnabled = true;

const chapterNames = [
  'REVOLUTIONIZED',
  'SOLID FOUNDATION',
  'PRECISION MILLING',
  'TESTING MATRIX',
  'SUPERFINE PRODUCTS',
  'YIELD ESTIMATOR',
  'COMMERCIAL DESK'
];

/* ==========================================================================
   CHAPTER NAVIGATION ENGINE
   ========================================================================== */
function goToChapter(index) {
  if (index < 0 || index >= totalChapters) return;
  if (index === currentChapter && document.querySelector('.chapter-panel.active')) return;

  isAnimating = true;
  playUiAudio('transition');

  const panels = document.querySelectorAll('.chapter-panel');
  panels.forEach(p => p.classList.remove('active'));

  const targetPanel = document.getElementById(`chapter${index}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  }

  // Synchronize Photographic Background Layer
  const bgSlides = document.querySelectorAll('.chapter-bg-slide');
  bgSlides.forEach(bg => {
    const bgIdx = parseInt(bg.getAttribute('data-bg'));
    if (bgIdx === index) {
      bg.classList.add('active');
    } else {
      bg.classList.remove('active');
    }
  });

  currentChapter = index;
  updateDialProgress();
  updateMenuLinks();

  setTimeout(() => {
    isAnimating = false;
  }, 700);
}

function nextChapter() {
  if (currentChapter < totalChapters - 1) {
    goToChapter(currentChapter + 1);
  }
}

function prevChapter() {
  if (currentChapter > 0) {
    goToChapter(currentChapter - 1);
  }
}

/* ==========================================================================
   CIRCULAR PROGRESS DIAL WIDGET (Matching video indicator)
   ========================================================================== */
function updateDialProgress() {
  const dialFill = document.getElementById('dialFillCircle');
  const dialCurrent = document.getElementById('dialCurrentNum');
  const dialName = document.getElementById('dialChapterName');

  const circumference = 263.89; // 2 * PI * 42
  const progressRatio = (currentChapter + 1) / totalChapters;
  const offset = circumference - (circumference * progressRatio);

  if (dialFill) {
    dialFill.style.strokeDashoffset = offset;
  }
  if (dialCurrent) {
    dialCurrent.textContent = String(currentChapter + 1).padStart(2, '0');
  }
  if (dialName) {
    dialName.textContent = chapterNames[currentChapter];
  }
}

/* ==========================================================================
   MOUSE WHEEL & TRACKPAD SCROLL LISTENER (Debounced Snap)
   ========================================================================== */
let wheelAccumulator = 0;
let wheelCooldown = false;

window.addEventListener('wheel', (e) => {
  if (window.innerWidth <= 1024) return; // Allow natural scroll on tablets/mobile
  e.preventDefault();

  if (wheelCooldown) return;

  wheelAccumulator += e.deltaY;

  if (Math.abs(wheelAccumulator) >= 60) {
    wheelCooldown = true;
    if (wheelAccumulator > 0) {
      nextChapter();
    } else {
      prevChapter();
    }
    wheelAccumulator = 0;
    setTimeout(() => {
      wheelCooldown = false;
    }, 750);
  }
}, { passive: false });

/* Keyboard Arrow Keys */
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
    nextChapter();
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
    prevChapter();
  } else if (e.key === 'Escape') {
    closeMenu();
  }
});

/* Touch Swipe Navigation for Mobile */
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  if (window.innerWidth <= 1024) return;
  const touchEndY = e.changedTouches[0].clientY;
  const diff = touchStartY - touchEndY;
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextChapter();
    else prevChapter();
  }
}, { passive: true });

/* ==========================================================================
   MINIMALIST HUD FULLSCREEN MENU
   ========================================================================== */
const menuToggleBtn = document.getElementById('menuToggleBtn');
const menuCloseBtn = document.getElementById('menuCloseBtn');
const fullscreenMenu = document.getElementById('fullscreenMenu');

function openMenu() {
  playUiAudio('click');
  if (fullscreenMenu) fullscreenMenu.classList.add('open');
}

function closeMenu() {
  playUiAudio('click');
  if (fullscreenMenu) fullscreenMenu.classList.remove('open');
}

if (menuToggleBtn) menuToggleBtn.addEventListener('click', openMenu);
if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);

function selectMenuChapter(index) {
  closeMenu();
  setTimeout(() => {
    goToChapter(index);
  }, 250);
}

function updateMenuLinks() {
  const links = document.querySelectorAll('.menu-link');
  links.forEach(l => {
    const idx = parseInt(l.getAttribute('data-index'));
    if (idx === currentChapter) {
      l.classList.add('active');
    } else {
      l.classList.remove('active');
    }
  });
}

/* ==========================================================================
   CHAPTER 02: FOUNDATION & SOURCING RADAR
   ========================================================================== */
function highlightNode(nodeId) {
  playUiAudio('click');
  const nodes = document.querySelectorAll('.geo-node');
  nodes.forEach(n => n.classList.remove('active'));

  const activeNode = document.querySelector(`.geo-node.gn-${nodeId}`);
  if (activeNode) activeNode.classList.add('active');
}

function toggleFoundationModal() {
  playUiAudio('click');
  highlightNode(1);
}

/* ==========================================================================
   CHAPTER 03: MILLING STAGE SWITCHER & TELEMETRY
   ========================================================================== */
const millingData = [
  {
    title: 'Stage 01: Precision Destoning & Kernel Scouring',
    desc: 'High-frequency vibratory destoners isolate heavy foreign matter, stones, and vitreous debris with 99.9% separation efficiency before grain enters the tempering bins.',
    spec1: '99.9% Purity',
    spec2: '15 MT / Hr',
    spec3: 'Dual Cyclone Filter',
    rpm: '1,420',
    gap: '0.24 mm',
    temp: '38.4 °C'
  },
  {
    title: 'Stage 02: Controlled Hydrothermal Conditioning',
    desc: 'Automated water dosing meters adjust kernel moisture to exact milling equilibrium (14.2%), mellowing endosperm while toughening outer bran for clean separation.',
    spec1: '14.2% Moisture',
    spec2: '12 Hr Rest',
    spec3: 'Ultrasonic Flowmeter',
    rpm: '850',
    gap: '0.35 mm',
    temp: '26.2 °C'
  },
  {
    title: 'Stage 03: Graded Chilled Cast-Iron Corrugation Breaks',
    desc: 'Multi-stage differential rollers slice grain with surgical shearing action rather than pulverizing, releasing pristine white endosperm granules with minimal starch damage.',
    spec1: 'Sub-Micron Shear',
    spec2: '8-Break Array',
    spec3: 'Bühler Corrugations',
    rpm: '1,680',
    gap: '0.18 mm',
    temp: '41.8 °C'
  },
  {
    title: 'Stage 04: Continuous Micro-Fortification & Bagging',
    desc: 'High-precision gravimetric micro-feeders infuse Vitamin A, Zinc, Iron, and Folic Acid according to UNBS standards, blended homogeneously prior to automated packing.',
    spec1: 'UNBS Fortified',
    spec2: 'Gravimetric Feeder',
    spec3: 'Hermetic Bagging',
    rpm: '1,100',
    gap: '0.12 mm',
    temp: '32.1 °C'
  }
];

function switchMillingStage(stageIndex) {
  playUiAudio('click');

  const tabs = document.querySelectorAll('.milling-tab');
  tabs.forEach(t => t.classList.remove('active'));
  if (tabs[stageIndex]) tabs[stageIndex].classList.add('active');

  const data = millingData[stageIndex];
  if (!data) return;

  const titleEl = document.getElementById('stageTitle');
  const descEl = document.getElementById('stageDesc');
  const s1 = document.getElementById('stageSpec1');
  const s2 = document.getElementById('stageSpec2');
  const s3 = document.getElementById('stageSpec3');
  const rpm = document.getElementById('gaugeRpm');
  const gap = document.getElementById('gaugeGap');
  const temp = document.getElementById('gaugeTemp');

  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;
  if (s1) s1.textContent = data.spec1;
  if (s2) s2.textContent = data.spec2;
  if (s3) s3.textContent = data.spec3;
  if (rpm) rpm.textContent = data.rpm;
  if (gap) gap.textContent = data.gap;
  if (temp) temp.textContent = data.temp;
}

/* ==========================================================================
   CHAPTER 04: MATRIX INSPECTION READOUT
   ========================================================================== */
function inspectMatrixTile(batch, grain, aflatoxin, moisture, grade) {
  playUiAudio('click');

  const bEl = document.getElementById('readoutBatch');
  const aEl = document.getElementById('readoutAflatoxin');
  const mEl = document.getElementById('readoutMoisture');
  const gEl = document.getElementById('readoutGrade');

  if (bEl) bEl.innerHTML = `${batch} &bull; ${grain}`;
  if (aEl) aEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${aflatoxin}`;
  if (mEl) mEl.innerHTML = `<i class="fa-solid fa-droplet"></i> ${moisture}`;
  if (gEl) gEl.innerHTML = `<i class="fa-solid fa-award"></i> ${grade}`;
}

/* ==========================================================================
   CHAPTER 05: PRODUCT SELECTION & DYNAMIC NUTRITION FACT SHEET
   ========================================================================== */
const productsData = [
  {
    badge: 'GRADE 1 FORTIFIED',
    title: 'Superfine Posho Flour (Grade 1)',
    sub: 'Micro-fortified with Vitamin A, Zinc, Iron, and Folic Acid.',
    energy: '362 kcal',
    carbs: '78.4 g',
    protein: '8.9 g',
    fiber: '2.1 g',
    vitA: '1.8 mg / kg',
    zinc: '32 mg / kg'
  },
  {
    badge: 'WHOLE GRAIN NUTRITION',
    title: 'Whole Grain Maize Flour (Brown)',
    sub: 'High dietary fiber, bran-retained wholesome cereal nutrition.',
    energy: '348 kcal',
    carbs: '72.1 g',
    protein: '10.2 g',
    fiber: '6.8 g',
    vitA: '1.5 mg / kg',
    zinc: '38 mg / kg'
  },
  {
    badge: 'HIGH GLUTEN INDEX',
    title: 'Baker\'s Special Hard Wheat Blend',
    sub: 'High water absorption and elasticity for commercial industrial bakeries.',
    energy: '370 kcal',
    carbs: '74.5 g',
    protein: '12.8 g',
    fiber: '3.4 g',
    vitA: '1.2 mg / kg',
    zinc: '28 mg / kg'
  },
  {
    badge: 'MULTI-GRAIN ENRICHED',
    title: 'Nutri-Composite Porridge Flour',
    sub: 'Fortified composite blend of maize, finger millet, soya, and sorghum.',
    energy: '385 kcal',
    carbs: '69.0 g',
    protein: '14.6 g',
    fiber: '5.2 g',
    vitA: '2.2 mg / kg',
    zinc: '45 mg / kg'
  }
];

function selectProduct(index) {
  playUiAudio('click');

  const btns = document.querySelectorAll('.p-card-btn');
  btns.forEach(b => b.classList.remove('active'));
  if (btns[index]) btns[index].classList.add('active');

  const p = productsData[index];
  if (!p) return;

  const badgeEl = document.getElementById('prodBadge');
  const titleEl = document.getElementById('prodTitle');
  const subEl = document.getElementById('prodSub');
  const enEl = document.getElementById('ntEnergy');
  const cbEl = document.getElementById('ntCarbs');
  const prEl = document.getElementById('ntProtein');
  const fbEl = document.getElementById('ntFiber');
  const vaEl = document.getElementById('ntVitA');
  const znEl = document.getElementById('ntZinc');

  if (badgeEl) badgeEl.textContent = p.badge;
  if (titleEl) titleEl.textContent = p.title;
  if (subEl) subEl.textContent = p.sub;
  if (enEl) enEl.textContent = p.energy;
  if (cbEl) cbEl.textContent = p.carbs;
  if (prEl) prEl.textContent = p.protein;
  if (fbEl) fbEl.textContent = p.fiber;
  if (vaEl) vaEl.textContent = p.vitA;
  if (znEl) znEl.textContent = p.zinc;
}

function orderSelectedProduct() {
  const activeTitle = document.getElementById('prodTitle')?.textContent || 'Superfine Posho Flour';
  goToChapter(6);
  const notesField = document.getElementById('rfqNotes');
  if (notesField) {
    notesField.value = `Wholesale inquiry regarding ${activeTitle}. Requesting commercial volume pricing and delivery schedule.`;
  }
}

/* ==========================================================================
   CHAPTER 06: INDUSTRIAL BATCH YIELD ESTIMATOR
   ========================================================================== */
function updateTonnageSlider(val) {
  const display = document.getElementById('tonnageDisplay');
  if (display) display.textContent = `${val} MT`;
  recalculateYield();
}

function recalculateYield() {
  const slider = document.getElementById('tonnageSlider');
  if (!slider) return;

  const mt = parseFloat(slider.value) || 50;
  const gradeRadio = document.querySelector('input[name="gradeRadio"]:checked');
  const isWhole = gradeRadio && gradeRadio.value === 'whole';

  const extractionRate = isWhole ? 0.88 : 0.72;
  const flourMT = mt * extractionRate;
  const branMT = mt * (1 - extractionRate);
  const bags50kg = Math.round((flourMT * 1000) / 50);
  const hours = (mt / 15).toFixed(1); // 15 MT/hr plant throughput

  const flourEl = document.getElementById('flourYieldVal');
  const bagsEl = document.getElementById('bagsVal');
  const branEl = document.getElementById('branVal');
  const timeEl = document.getElementById('turnaroundVal');

  const flourBar = document.getElementById('flourYieldBar');
  const bagsBar = document.getElementById('bagsYieldBar');
  const branBar = document.getElementById('branYieldBar');

  if (flourEl) flourEl.textContent = flourMT.toFixed(1);
  if (bagsEl) bagsEl.textContent = bags50kg.toLocaleString();
  if (branEl) branEl.textContent = branMT.toFixed(1);
  if (timeEl) timeEl.textContent = hours;

  if (flourBar) flourBar.style.width = `${Math.round(extractionRate * 100)}%`;
  if (bagsBar) bagsBar.style.width = `${Math.round(extractionRate * 100)}%`;
  if (branBar) branBar.style.width = `${Math.round((1 - extractionRate) * 100)}%`;
}

function applyYieldToQuote() {
  playUiAudio('click');
  const slider = document.getElementById('tonnageSlider');
  const mt = slider ? slider.value : '50';
  const grain = document.querySelector('input[name="grainRadio"]:checked')?.value || 'white_maize';

  goToChapter(6);

  const volField = document.getElementById('rfqVolume');
  const notesField = document.getElementById('rfqNotes');

  if (volField) volField.value = `${mt} Metric Tons (${grain.replace('_', ' ').toUpperCase()})`;
  if (notesField) {
    notesField.value = `Industrial milling batch estimate: ${mt} MT of ${grain.replace('_', ' ')}. Requesting official toll processing or supply contract quotation.`;
  }
}

/* ==========================================================================
   CHAPTER 07: KINETIC OUTRO & RFQ FORM
   ========================================================================== */
function focusRfqForm() {
  const nameInput = document.getElementById('rfqName');
  if (nameInput) nameInput.focus();
}

function handleLegendarySubmit(e) {
  e.preventDefault();
  playUiAudio('click');

  const btn = document.getElementById('rfqSubmitBtn');
  const toast = document.getElementById('rfqSuccessToast');
  const form = document.getElementById('legendaryRfqForm');

  if (btn) {
    btn.innerHTML = '<span class="btn-text"><i class="fa-solid fa-spinner fa-spin"></i> TRANSMITTING INQUIRY...</span>';
    btn.disabled = true;
  }

  setTimeout(() => {
    if (btn) {
      btn.innerHTML = '<span class="btn-text"><i class="fa-solid fa-circle-check"></i> OFFICIAL INQUIRY TRANSMITTED</span>';
      btn.style.background = '#155d32';
    }
    if (toast) toast.style.display = 'flex';
    form.reset();
  }, 900);
}

/* ==========================================================================
   BIOLUMINESCENT PARTICLE CONSTELLATION BACKGROUND (Canvas API)
   ========================================================================== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let particles = [];
const particleCount = 65;

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * (canvas ? canvas.width : 1000);
    this.y = Math.random() * (canvas ? canvas.height : 800);
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45;
    this.radius = Math.random() * 2 + 0.8;
    this.color = Math.random() > 0.3 ? 'rgba(34, 197, 94, ' : 'rgba(212, 163, 75, ';
    this.alpha = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `${this.color}${this.alpha})`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#22c55e';
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

if (canvas && ctx) {
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(34, 197, 94, ${0.18 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(renderParticles);
  }
  renderParticles();
}

/* ==========================================================================
   WEB AUDIO API SOUND SYNTHESIS
   ========================================================================== */
let audioCtx = null;

function initAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playUiAudio(type) {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'transition') {
      // Cinematic low deep sweep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.35);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      // High-tech tactile click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (err) {}
}

const soundToggleBtn = document.getElementById('soundToggleBtn');
if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    const soundIcon = document.getElementById('soundIcon');
    const soundLabel = soundToggleBtn.querySelector('.sound-label');

    if (soundEnabled) {
      if (soundIcon) soundIcon.className = 'fa-solid fa-volume-high';
      if (soundLabel) soundLabel.textContent = 'AUDIO ON';
      playUiAudio('click');
    } else {
      if (soundIcon) soundIcon.className = 'fa-solid fa-volume-xmark';
      if (soundLabel) soundLabel.textContent = 'MUTED';
    }
  });
}

// Initial Telemetry & Chapter Setup
recalculateYield();
updateDialProgress();
goToChapter(0);

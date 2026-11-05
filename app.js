/**
 * NIMIREAUX UGANDA LIMITED — 7-SLIDE PRESENTATION SYSTEM
 * Pure Nutrition. Powering Possibilities.
 */

const SLIDES_COUNT = 7;
let currentSlideIndex = 0;
let isTransitioning = false;
let soundEnabled = true;

// DOM Elements
const deckSlides = document.querySelectorAll('.deck-slide');
const deckBgSlides = document.querySelectorAll('.deck-bg-slide');
const dockNodes = document.querySelectorAll('.dock-node');
const navLinkBtns = document.querySelectorAll('.nav-link-btn');
const dockFillLine = document.getElementById('dockFillLine');
const dockCounter = document.getElementById('dockCounter');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundIcon = document.getElementById('soundIcon');

/* ==========================================================================
   SLIDE TRANSITION ENGINE
   ========================================================================== */
function goToSlide(targetIndex) {
  if (targetIndex < 0 || targetIndex >= SLIDES_COUNT) return;
  if (targetIndex === currentSlideIndex && deckSlides[targetIndex].classList.contains('active')) return;
  if (isTransitioning) return;

  isTransitioning = true;
  playUiSound('slide');

  // Deactivate current slide
  deckSlides.forEach((slide, idx) => {
    if (idx === currentSlideIndex) {
      slide.classList.remove('active');
      slide.classList.add('slide-out-up');
      setTimeout(() => {
        slide.classList.remove('slide-out-up');
      }, 650);
    } else {
      slide.classList.remove('active');
    }
  });

  // Switch Active Background Plane (Each slide has its OWN image)
  deckBgSlides.forEach((bg, idx) => {
    if (idx === targetIndex) {
      bg.classList.add('active');
    } else {
      bg.classList.remove('active');
    }
  });

  // Activate target slide
  currentSlideIndex = targetIndex;
  const targetSlide = deckSlides[currentSlideIndex];
  targetSlide.classList.add('active');
  targetSlide.scrollTop = 0;

  // Update Bottom Horizontal Scrubber Dock (Matching video)
  updateScrubberDock();

  // Update Top Navbar Links
  navLinkBtns.forEach((btn, idx) => {
    if (idx === currentSlideIndex) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  setTimeout(() => {
    isTransitioning = false;
  }, 600);
}

function updateScrubberDock() {
  dockNodes.forEach((node, idx) => {
    if (idx === currentSlideIndex) {
      node.classList.add('active');
    } else {
      node.classList.remove('active');
    }
  });

  if (dockFillLine) {
    const pct = ((currentSlideIndex + 1) / SLIDES_COUNT) * 100;
    dockFillLine.style.width = `${pct}%`;
  }

  if (dockCounter) {
    dockCounter.textContent = `0${currentSlideIndex + 1} / 0${SLIDES_COUNT}`;
  }
}

function nextSlide() {
  if (currentSlideIndex < SLIDES_COUNT - 1) {
    goToSlide(currentSlideIndex + 1);
  } else {
    goToSlide(0); // Loop to start
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    goToSlide(currentSlideIndex - 1);
  }
}

/* ==========================================================================
   INPUT LISTENERS: MOUSE WHEEL, KEYBOARD & TOUCH
   ========================================================================== */
let lastWheelTime = 0;

window.addEventListener('wheel', (e) => {
  const now = Date.now();
  if (now - lastWheelTime < 650) return;

  const activeSlide = deckSlides[currentSlideIndex];
  if (activeSlide) {
    const isScrollable = activeSlide.scrollHeight > activeSlide.clientHeight;
    if (isScrollable) {
      const atTop = activeSlide.scrollTop <= 5;
      const atBottom = activeSlide.scrollTop + activeSlide.clientHeight >= activeSlide.scrollHeight - 5;
      if (e.deltaY > 0 && !atBottom) return; // Allow internal card scroll
      if (e.deltaY < 0 && !atTop) return;
    }
  }

  if (Math.abs(e.deltaY) > 20) {
    lastWheelTime = now;
    if (e.deltaY > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
}, { passive: true });

// Keyboard Arrow Listener
window.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

  if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
    e.preventDefault();
    nextSlide();
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault();
    prevSlide();
  }
});

// Mobile Touch Swiping
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

window.addEventListener('touchend', (e) => {
  const touchEndY = e.changedTouches[0].screenY;
  const deltaY = touchStartY - touchEndY;
  if (Math.abs(deltaY) > 40) {
    if (deltaY > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
}, { passive: true });

/* ==========================================================================
   SLIDE 03: SERVICES TABS
   ========================================================================== */
const SERVICES_DATA = [
  {
    badge: 'Flagship Commercial Line',
    title: 'High-Extraction Commercial Maize Milling',
    desc: 'Continuous multi-break roller milling line degerminates, cleans, and mills Ugandan corn into ultra-soft Grade 1 superfine posho flour, standard Grade 2 meal, and hominy grits.',
    checklist: [
      'Superfine granulation passing 212-micron plansifter screens',
      'Continuous micro-dosing with Vitamin A, Iron, and Zinc',
      'Low fat residue guaranteeing 6+ months dry shelf stability',
      'Packaging in 5kg, 10kg, 25kg, and 50kg poly-woven bags'
    ],
    capacity: '120 Metric Tons / Day',
    turnaround: 'Same-Day to 48 Hours',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1000&q=85'
  },
  {
    badge: 'Bakery & Pastry Grade',
    title: 'Wheat & Specialty Cereal Milling',
    desc: 'Specially engineered roller passes calibrated for high water absorption, high falling numbers, and superior gluten elasticity suited for commercial bread bakeries and biscuit confectioneries.',
    checklist: [
      'High-protein baker’s flour with >12% crude protein',
      'Whole grain graham flour with stone-ground germ oils',
      'Consistent ash content and enzymatic monitoring',
      'Packaged in high-density multi-ply paper and poly sacks'
    ],
    capacity: '80 Metric Tons / Day',
    turnaround: '24–72 Hours Dispatch',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85'
  },
  {
    badge: 'Industrial Partnership',
    title: 'Custom Toll Milling & Contract Grain Processing',
    desc: 'Agribusinesses, cooperatives, and large-scale aggregators can bring raw grain directly to Nimireaux for complete toll processing, optical color sorting, destoning, custom mesh reduction, and private-label packaging.',
    checklist: [
      'Comprehensive intake testing: moisture, dockage, and aflatoxin',
      'Custom extraction percentages (Grade 1 vs Grade 2 vs Whole)',
      'Dedicated silo batching guaranteeing zero grain mingling',
      'Customer-branded or Nimireaux certified packaging'
    ],
    capacity: 'Flexible: 5 MT to 500+ MT Batches',
    turnaround: 'Scheduled Within 48 Hours',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=85'
  },
  {
    badge: 'Agro-Feed Nutrition',
    title: 'High-Protein Maize Bran & Animal Feed By-Products',
    desc: 'Clean, sweet-smelling, and high-energy maize bran, germ meal, and wheat pollard produced during precision degermination. A foundational constituent for dairy feed concentrates, swine, and poultry farming.',
    checklist: [
      '10% – 14% crude protein with optimal rumen digestibility',
      'Moisture-controlled (<12.5%) preventing souring and mold',
      'Available in bulk loose tipper loads or 50kg/70kg bags',
      'Supplying commercial feed mills across East Africa'
    ],
    capacity: '35 Metric Tons / Day Available',
    turnaround: 'Continuous Daily Bulk Dispatch',
    image: 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?auto=format&fit=crop&w=1000&q=85'
  }
];

let activeServiceTab = 0;

function switchServiceTab(index) {
  if (index < 0 || index >= SERVICES_DATA.length) return;
  activeServiceTab = index;
  const s = SERVICES_DATA[activeServiceTab];
  playUiSound('click');

  document.querySelectorAll('.s-tab').forEach((tab, idx) => {
    if (idx === activeServiceTab) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  document.getElementById('solBadge').textContent = s.badge;
  document.getElementById('solTitle').textContent = s.title;
  document.getElementById('solDesc').textContent = s.desc;
  document.getElementById('solCapacity').textContent = s.capacity;
  document.getElementById('solTurnaround').textContent = s.turnaround;
  document.getElementById('solImg').style.backgroundImage = `url('${s.image}')`;

  const listEl = document.getElementById('solList');
  if (listEl) {
    listEl.innerHTML = s.checklist.map(item => `<li><i class="fa-solid fa-circle-check"></i> ${item}</li>`).join('');
  }
}

/* ==========================================================================
   SLIDE 04: PROCESS PIPELINE
   ========================================================================== */
const PIPELINE_STEPS = [
  {
    badge: 'Stage 01 of 05',
    title: 'Raw Grain Intake & Rapid Laboratory Assay',
    desc: 'Every incoming grain consignment undergoes multi-point probe sampling. We analyze moisture percentage, kernel hardness, foreign dockage, and test for aflatoxin (ppb) before unloading into intake hoppers.',
    kpis: [
      { num: '< 13.5%', lbl: 'Moisture Threshold' },
      { num: '< 10 ppb', lbl: 'Aflatoxin Limit' },
      { num: '100%', lbl: 'Sample Traceability' }
    ],
    icon: 'fa-microscope',
    caption: 'Fluorometric & chemical verification active at intake terminal'
  },
  {
    badge: 'Stage 02 of 05',
    title: 'Deep Cleaning, Destoning & Magnetic Traps',
    desc: 'Triple-stage pre-cleaning passing through rotary drum sieves, air aspirators, and specific-gravity destoners to remove stones, soil lumps, magnetic foreign metals, and light chaff.',
    kpis: [
      { num: '99.8%', lbl: 'Foreign Cleanness' },
      { num: '3-Stage', lbl: 'Metal Extraction' },
      { num: '0.0%', lbl: 'Stone Residue' }
    ],
    icon: 'fa-filter',
    caption: 'Dual gravity destoner tables separating heavy foreign matter'
  },
  {
    badge: 'Stage 03 of 05',
    title: 'Controlled Dampening & Moisture Conditioning',
    desc: 'Clean grains are gently dampened with purified water in computerized dampening conveyors and rested in tempering silos for 12–16 hours to toughen the bran shell for clean separation.',
    kpis: [
      { num: '14.0%', lbl: 'Conditioned Moisture' },
      { num: '12-16 hrs', lbl: 'Tempering Silo Rest' },
      { num: 'Optimal', lbl: 'Germ Separation' }
    ],
    icon: 'fa-droplet',
    caption: 'Computerized water metering and tempering resting bins'
  },
  {
    badge: 'Stage 04 of 05',
    title: 'Multi-Break Roller Milling & Plansifters',
    desc: 'Conditioned grain flows into chilled cast-iron corrugated roller mills. The grains are cracked open rather than crushed, releasing pure endosperm while plansifters sift through 212-micron sieves.',
    kpis: [
      { num: '212 µm', lbl: 'Flour Sieve Mesh' },
      { num: 'Multi-Roll', lbl: 'Break & Reduction' },
      { num: '< 5%', lbl: 'Starch Damage Rate' }
    ],
    icon: 'fa-gear',
    caption: 'High-speed roller break stands and oscillating plansifters'
  },
  {
    badge: 'Stage 05 of 05',
    title: 'Nutrient Fortification & Hermetic Bagging',
    desc: 'Pure flour passes through precision volumetric micro-feeders where Vitamin A, Iron, Zinc, and B-Complex are homogeneously blended before continuous check-weighing and heat-sealed packaging.',
    kpis: [
      { num: '100%', lbl: 'UNBS Fortification' },
      { num: 'Auto-Seal', lbl: 'Hermetic Bagging' },
      { num: '6+ Mo', lbl: 'Ambient Shelf Life' }
    ],
    icon: 'fa-boxes-packing',
    caption: 'Automated bag filling, micro-ingredient dosing and stitch sealer'
  }
];

let activeProcessStep = 0;

function setProcessStep(stepIndex) {
  if (stepIndex < 0 || stepIndex >= PIPELINE_STEPS.length) return;
  activeProcessStep = stepIndex;
  const p = PIPELINE_STEPS[activeProcessStep];
  playUiSound('click');

  document.querySelectorAll('.p-scrub-btn').forEach((btn, idx) => {
    if (idx === activeProcessStep) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const pBarFill = document.getElementById('pBarFill');
  if (pBarFill) {
    pBarFill.style.width = `${((activeProcessStep + 1) / PIPELINE_STEPS.length) * 100}%`;
  }

  document.getElementById('pStepBadge').textContent = p.badge;
  document.getElementById('pStepTitle').textContent = p.title;
  document.getElementById('pStepDesc').textContent = p.desc;
  document.getElementById('pKpi1').textContent = p.kpis[0].num;
  document.getElementById('pKpiLbl1').textContent = p.kpis[0].lbl;
  document.getElementById('pKpi2').textContent = p.kpis[1].num;
  document.getElementById('pKpiLbl2').textContent = p.kpis[1].lbl;
  document.getElementById('pKpi3').textContent = p.kpis[2].num;
  document.getElementById('pKpiLbl3').textContent = p.kpis[2].lbl;
  document.getElementById('pStepIcon').innerHTML = `<i class="fa-solid ${p.icon}"></i>`;
  document.getElementById('pStepCaption').textContent = p.caption;
}

function stepProcess(delta) {
  let next = activeProcessStep + delta;
  if (next < 0) next = PIPELINE_STEPS.length - 1;
  if (next >= PIPELINE_STEPS.length) next = 0;
  setProcessStep(next);
}

/* ==========================================================================
   SLIDE 05: PRODUCTS & NUTRITION FACTS
   ========================================================================== */
const PRODUCTS_DATA = {
  posho: {
    name: 'Nimireaux Superfine Fortified Maize Flour',
    calories: '365 kcal',
    kj: '1,530 kJ',
    carbs: '74.2g',
    carbsPct: 74,
    protein: '8.8g',
    proteinPct: 44,
    fiber: '3.8g',
    fiberPct: 38,
    vitA: '2.5 mg/kg',
    iron: '40 mg/kg',
    zinc: '35 mg/kg',
    folate: '1.2 mg/kg'
  },
  'whole-maize': {
    name: 'Nimireaux Harvest Whole Grain Flour',
    calories: '350 kcal',
    kj: '1,465 kJ',
    carbs: '68.5g',
    carbsPct: 68,
    protein: '10.2g',
    proteinPct: 51,
    fiber: '9.4g',
    fiberPct: 85,
    vitA: '2.0 mg/kg',
    iron: '45 mg/kg',
    zinc: '38 mg/kg',
    folate: '1.5 mg/kg'
  },
  'wheat-bakers': {
    name: 'Nimireaux Bakers Special Wheat Flour',
    calories: '370 kcal',
    kj: '1,550 kJ',
    carbs: '72.0g',
    carbsPct: 72,
    protein: '12.5g',
    proteinPct: 62,
    fiber: '2.8g',
    fiberPct: 28,
    vitA: '2.2 mg/kg',
    iron: '42 mg/kg',
    zinc: '32 mg/kg',
    folate: '1.8 mg/kg'
  },
  'composite-porridge': {
    name: 'Nimireaux Nutri-Porridge Composite Blend',
    calories: '385 kcal',
    kj: '1,610 kJ',
    carbs: '65.0g',
    carbsPct: 65,
    protein: '14.2g',
    proteinPct: 71,
    fiber: '7.8g',
    fiberPct: 78,
    vitA: '3.5 mg/kg',
    iron: '50 mg/kg',
    zinc: '42 mg/kg',
    folate: '2.2 mg/kg'
  },
  'maize-bran': {
    name: 'Nimireaux High-Energy Maize Bran & Pollard',
    calories: '280 kcal',
    kj: '1,170 kJ',
    carbs: '48.0g',
    carbsPct: 48,
    protein: '13.5g',
    proteinPct: 68,
    fiber: '16.5g',
    fiberPct: 98,
    vitA: '1.0 mg/kg',
    iron: '60 mg/kg',
    zinc: '55 mg/kg',
    folate: '0.8 mg/kg'
  }
};

let currentProductKey = 'posho';

function selectProduct(prodKey) {
  const p = PRODUCTS_DATA[prodKey];
  if (!p) return;
  currentProductKey = prodKey;
  playUiSound('click');

  document.querySelectorAll('.prod-tile').forEach(tile => {
    if (tile.getAttribute('data-prod') === prodKey) {
      tile.classList.add('active');
    } else {
      tile.classList.remove('active');
    }
  });

  document.getElementById('nutriProductName').textContent = p.name;
  document.getElementById('nutriCalories').textContent = p.calories;
  document.getElementById('nutriKJ').textContent = p.kj;
  document.getElementById('nutriCarbs').textContent = p.carbs;
  document.getElementById('barCarbs').style.width = `${p.carbsPct}%`;
  document.getElementById('nutriProtein').textContent = p.protein;
  document.getElementById('barProtein').style.width = `${p.proteinPct}%`;
  document.getElementById('nutriFiber').textContent = p.fiber;
  document.getElementById('barFiber').style.width = `${p.fiberPct}%`;
  document.getElementById('nutriVitA').textContent = p.vitA;
  document.getElementById('nutriIron').textContent = p.iron;
  document.getElementById('nutriZinc').textContent = p.zinc;
  document.getElementById('nutriFolate').textContent = p.folate;
}

function requestProductQuote() {
  const p = PRODUCTS_DATA[currentProductKey];
  goToSlide(6); // Jump to contact slide
  const notes = document.getElementById('clientNotes');
  if (notes && p) {
    notes.value = `Sample & wholesale inquiry for: ${p.name}. Please provide delivery schedule and pricing.`;
  }
}

/* ==========================================================================
   SLIDE 06: YIELD ESTIMATOR
   ========================================================================== */
const calcBatchInput = document.getElementById('calcBatchInput');
const calcBatchDisplay = document.getElementById('calcBatchDisplay');
const resFlourKg = document.getElementById('resFlourKg');
const resFlourBags = document.getElementById('resFlourBags');
const resBranKg = document.getElementById('resBranKg');
const resScreeningsKg = document.getElementById('resScreeningsKg');
const resTurnaround = document.getElementById('resTurnaround');

const EXTRACTION_FACTORS = {
  grade1: { flourRate: 0.68, branRate: 0.29, wasteRate: 0.03, hoursPerMT: 0.9 },
  grade2: { flourRate: 0.78, branRate: 0.19, wasteRate: 0.03, hoursPerMT: 0.8 },
  wholegrain: { flourRate: 0.94, branRate: 0.04, wasteRate: 0.02, hoursPerMT: 0.65 }
};

function calculateMillingYields() {
  if (!calcBatchInput) return;
  const mt = parseFloat(calcBatchInput.value) || 15;
  const rawKg = mt * 1000;

  const gradeRadio = document.querySelector('input[name="gradeType"]:checked');
  const grade = gradeRadio ? gradeRadio.value : 'grade1';
  const factors = EXTRACTION_FACTORS[grade] || EXTRACTION_FACTORS.grade1;

  const flourTotalKg = Math.round(rawKg * factors.flourRate);
  const branTotalKg = Math.round(rawKg * factors.branRate);
  const screeningsKg = Math.round(rawKg * factors.wasteRate);
  const bagsCount = Math.round(flourTotalKg / 25);
  const turnaroundHours = Math.max(3, Math.round(mt * factors.hoursPerMT));

  calcBatchDisplay.textContent = `${mt} Metric Tons (${mt * 1000} kg)`;
  resFlourKg.textContent = `${flourTotalKg.toLocaleString()} kg`;
  resFlourBags.textContent = `Equivalent to ~${bagsCount.toLocaleString()} Bags (25kg each)`;
  resBranKg.textContent = `${branTotalKg.toLocaleString()} kg`;
  resScreeningsKg.textContent = `${screeningsKg.toLocaleString()} kg`;
  resTurnaround.textContent = `Turnaround Time: ~${turnaroundHours} Hours`;
}

if (calcBatchInput) {
  calcBatchInput.addEventListener('input', calculateMillingYields);
}

document.querySelectorAll('input[name="grainType"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.g-choice').forEach(el => el.classList.remove('active'));
    radio.closest('.g-choice').classList.add('active');
    playUiSound('click');
    calculateMillingYields();
  });
});

document.querySelectorAll('input[name="gradeType"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.gr-choice').forEach(el => el.classList.remove('active'));
    radio.closest('.gr-choice').classList.add('active');
    playUiSound('click');
    calculateMillingYields();
  });
});

function applyCalcToQuote() {
  const mt = calcBatchInput.value;
  const gradeRadio = document.querySelector('input[name="gradeType"]:checked');
  const grainRadio = document.querySelector('input[name="grainType"]:checked');
  const gradeText = gradeRadio ? gradeRadio.value : 'grade1';
  const grainText = grainRadio ? grainRadio.value : 'white maize';

  goToSlide(6); // Jump to contact slide
  const volumeInput = document.getElementById('estimatedVolume');
  const notes = document.getElementById('clientNotes');
  if (volumeInput) {
    volumeInput.value = `${mt} MT (${grainText.toUpperCase()})`;
  }
  if (notes) {
    notes.value = `Industrial milling batch estimate: ${mt} MT of ${grainText} with ${gradeText} extraction. Requesting official quotation and schedule.`;
  }
}

/* ==========================================================================
   SLIDE 07: RFQ FORM
   ========================================================================== */
function handleFormSubmit(e) {
  e.preventDefault();
  playUiSound('click');

  const submitBtn = document.getElementById('submitRfqBtn');
  const successToast = document.getElementById('formSuccessToast');
  const form = document.getElementById('rfqForm');

  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting Inquiry...';
    submitBtn.disabled = true;
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.innerHTML = '<span>Official Inquiry Dispatched!</span> <i class="fa-solid fa-circle-check"></i>';
      submitBtn.style.background = '#155d32';
    }
    if (successToast) {
      successToast.style.display = 'flex';
      successToast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    form.reset();
  }, 900);
}

/* ==========================================================================
   AMBIENT GRAIN CANVAS PARTICLES
   ========================================================================== */
const canvas = document.getElementById('ambientCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 30;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class GrainParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.size = Math.random() * 2.2 + 1;
      this.speedY = Math.random() * 0.4 + 0.15;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.alpha = Math.random() * 0.35 + 0.15;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 163, 75, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new GrainParticle());
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();
}

/* ==========================================================================
   WEB AUDIO API SOUND EFFECTS
   ========================================================================== */
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
}

function playUiSound(type = 'click') {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx?.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'slide') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(950, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    }
  } catch (err) {}
}

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      soundIcon.className = 'fa-solid fa-volume-high';
      playUiSound('click');
    } else {
      soundIcon.className = 'fa-solid fa-volume-xmark';
    }
  });
}

function switchCardView(mode) {
  playUiSound('click');
  const digitalView = document.getElementById('digitalCardView');
  const originalView = document.getElementById('originalCardView');
  const btnDigital = document.getElementById('btnInteractiveCard');
  const btnOriginal = document.getElementById('btnOriginalCard');

  if (mode === 'original') {
    if (digitalView) digitalView.style.display = 'none';
    if (originalView) originalView.style.display = 'block';
    if (btnDigital) btnDigital.classList.remove('active');
    if (btnOriginal) btnOriginal.classList.add('active');
  } else {
    if (digitalView) digitalView.style.display = 'block';
    if (originalView) originalView.style.display = 'none';
    if (btnDigital) btnDigital.classList.add('active');
    if (btnOriginal) btnOriginal.classList.remove('active');
  }
}

// Initial Run
calculateMillingYields();
updateScrubberDock();
goToSlide(0);

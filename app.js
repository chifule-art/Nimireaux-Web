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
let isMobileNavOpen = false;

function toggleMobileMenu(forceState) {
  const drawer = document.getElementById('mobileNavDrawer');
  const icon = document.getElementById('mobileMenuIcon');
  if (!drawer) return;

  if (typeof forceState === 'boolean') {
    isMobileNavOpen = forceState;
  } else {
    isMobileNavOpen = !isMobileNavOpen;
  }

  if (isMobileNavOpen) {
    drawer.classList.add('active');
    document.body.classList.add('mobile-nav-active');
    if (icon) icon.className = 'fa-solid fa-xmark';
  } else {
    drawer.classList.remove('active');
    document.body.classList.remove('mobile-nav-active');
    if (icon) icon.className = 'fa-solid fa-bars';
  }
}

function goToActMobile(index) {
  toggleMobileMenu(false);
  goToAct(index);
}

function goToAct(index) {
  if (index < 0 || index >= totalActs) return;
  if (index === currentAct && document.querySelector('.editorial-act.active') && window.innerWidth > 1024) return;

  isActTransitioning = true;
  playAcousticChime('transition');

  // Switch Editorial Acts
  const acts = document.querySelectorAll('.editorial-act');
  acts.forEach(a => a.classList.remove('active'));

  const targetAct = document.getElementById(`act${index}`);
  if (targetAct) {
    targetAct.classList.add('active');
    if (window.innerWidth <= 1024) {
      targetAct.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

  // Switch Mobile Nav Buttons
  const mndBtns = document.querySelectorAll('.mnd-act-btn');
  mndBtns.forEach(btn => {
    const bIdx = parseInt(btn.getAttribute('data-act'));
    if (bIdx === index) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
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

  // If the wheel event is inside the AI drawer, message stage, or any open modal dialog:
  // ALLOW native container scrolling and DO NOT navigate acts!
  const isInsideScrollable = e.target.closest(
    '#aiConciergeDrawer, .ai-messages-stage, #marketBoardDialog, .mb-table-wrapper, #logisticsModalDialog, #coaModalDialog, .corridor-body'
  );

  if (isInsideScrollable) {
    return; // Allow native scroll inside the drawer/modal
  }

  // If any modal or the AI drawer is open, block full-page background act navigation
  if (isAiDrawerOpen || isMarketBoardOpen || isLogisticsModalOpen || isCoaModalOpen) {
    e.preventDefault();
    return;
  }

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
  const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;
  const isInsideOverlay = !!e.target.closest('#aiConciergeDrawer, #marketBoardDialog, #logisticsModalDialog, #coaModalDialog');

  if (isInput || isInsideOverlay || isAiDrawerOpen || isMarketBoardOpen || isLogisticsModalOpen || isCoaModalOpen) {
    return; // Allow typing & arrow key navigation inside drawer/modals
  }

  if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
    nextAct();
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
    prevAct();
  }
});

/* Touch Swipe Navigation */
let touchStartY = 0;
let touchStartedInScrollable = false;

window.addEventListener('touchstart', (e) => {
  if (!e.touches || e.touches.length === 0) return;
  touchStartY = e.touches[0].clientY;
  touchStartedInScrollable = !!e.target.closest(
    '#aiConciergeDrawer, .ai-messages-stage, #marketBoardDialog, .mb-table-wrapper, #logisticsModalDialog, #coaModalDialog, .corridor-body'
  );
}, { passive: true });

window.addEventListener('touchend', (e) => {
  if (window.innerWidth <= 1024) return;
  if (touchStartedInScrollable || isAiDrawerOpen || isMarketBoardOpen || isLogisticsModalOpen || isCoaModalOpen) {
    return;
  }
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
   ACT VI: INDUSTRIAL BATCH YIELD CONCIERGE & COMMODITY MATRIX
   ========================================================================== */
const CONCIERGE_COMMODITY_PROFILES = {
  white_maize: {
    name: 'White Dent Maize',
    icon: 'fa-solid fa-seedling',
    spec: 'Refined endosperm • UNBS US 2:2017 • 13.0% max moisture',
    tag: 'EXTRACTION: 72%',
    rateGrade1: 0.72,
    rateWhole: 0.88,
    millingSpeedMTPerHour: 15.0,
    grade1Label: 'Grade 1 Superfine (72% Flour • 28% Feed Bran)',
    wholeLabel: 'Whole Extraction (88% Flour • 12% Byproduct)',
    flourDescription: 'Superfine Posho Flour (Pure White, high starch, low oil)',
    branDescription: 'Nutritious White Maize Bran (UNBS compliant animal feed)',
    insight: 'Uganda & Great Lakes benchmark grain. High endosperm purity delivers pristine white posho with maximum cooking swelling index and smooth texture.'
  },
  yellow_maize: {
    name: 'Yellow Maize',
    icon: 'fa-solid fa-sun',
    spec: 'Beta-Carotene Rich • UNBS US 2:2017 • 12.8% max moisture',
    tag: 'EXTRACTION: 69%',
    rateGrade1: 0.69,
    rateWhole: 0.86,
    millingSpeedMTPerHour: 14.5,
    grade1Label: 'Grade 1 Golden Flour (69% Flour • 31% Golden Bran)',
    wholeLabel: 'Whole Golden Meal (86% Flour • 14% Byproduct)',
    flourDescription: 'Fortified Golden Maize Flour (Carotenoid-dense, high protein)',
    branDescription: 'High-Energy Golden Bran & Grits (High fat/protein for livestock)',
    insight: 'Carotenoid-rich grain prized for high-energy poultry & livestock feed formulations, institutional catering, and fortified golden porridge.'
  },
  hard_wheat: {
    name: 'Hard Wheat',
    icon: 'fa-solid fa-wheat-awn',
    spec: 'High-Gluten Milling Grade • Wet Gluten 28–32% • 12.0% moisture',
    tag: 'EXTRACTION: 75%',
    rateGrade1: 0.75,
    rateWhole: 0.92,
    millingSpeedMTPerHour: 12.5,
    grade1Label: 'Refined Baker’s Atta (75% Flour • 25% Wheat Pollard/Bran)',
    wholeLabel: '100% Whole Wheat Atta (92% Flour • 8% Coarse Bran)',
    flourDescription: 'Premium Baker’s Flour (High gluten elasticity for commercial baking)',
    branDescription: 'Wheat Pollard & Fine Bran (High fiber ruminant feed)',
    insight: 'High-protein grain milled through precision roller mills for bakery elasticity, chapati softness, and industrial bread production.'
  },
  composite: {
    name: 'Composite Grain',
    icon: 'fa-solid fa-layer-group',
    spec: 'Precision Blend (Millet, Sorghum, Soya & Maize) • 11.5% moisture',
    tag: 'EXTRACTION: 78%',
    rateGrade1: 0.78,
    rateWhole: 0.90,
    millingSpeedMTPerHour: 11.0,
    grade1Label: 'Fortified Blend Flour (78% Flour • 22% Super Bran)',
    wholeLabel: 'Whole Grain Porridge Meal (90% Flour • 10% Husk)',
    flourDescription: 'Multi-Nutrient Porridge Flour (High calcium, iron, protein & zinc)',
    branDescription: 'Multi-Grain Mineral Bran (Concentrated mineral dairy boost)',
    insight: 'Multi-cereal formulation engineered for hospital clinical nutrition, early-childhood porridge, humanitarian relief, and high-energy wellness.'
  }
};

function selectConciergeCommodity(key) {
  playAcousticChime('click');
  const targetInput = document.querySelector(`input[name="conciergeCommodity"][value="${key}"]`);
  if (targetInput) targetInput.checked = true;

  const commodityInputs = document.querySelectorAll('input[name="conciergeCommodity"]');
  commodityInputs.forEach(input => {
    const isTarget = input.value === key;
    const parentPill = input.closest('.cc-pill');
    if (parentPill) {
      parentPill.classList.toggle('active', isTarget);
      const icon = parentPill.querySelector('.pill-icon');
      if (icon) {
        icon.className = isTarget ? 'fa-solid fa-circle-dot pill-icon' : 'fa-regular fa-circle pill-icon';
      }
    }
  });

  // Adapt Extraction Labels to the selected grain
  const profile = CONCIERGE_COMMODITY_PROFILES[key] || CONCIERGE_COMMODITY_PROFILES.white_maize;
  const grade1Label = document.getElementById('labelGrade1');
  const wholeLabel = document.getElementById('labelGradeWhole');
  if (grade1Label) grade1Label.textContent = profile.grade1Label;
  if (wholeLabel) wholeLabel.textContent = profile.wholeLabel;

  calculateConciergeYield();
}

function selectConciergeGrade(key) {
  playAcousticChime('click');
  const targetInput = document.querySelector(`input[name="conciergeGrade"][value="${key}"]`);
  if (targetInput) targetInput.checked = true;

  const gradeInputs = document.querySelectorAll('input[name="conciergeGrade"]');
  gradeInputs.forEach(input => {
    const isTarget = input.value === key;
    const parentPill = input.closest('.cc-pill');
    if (parentPill) {
      parentPill.classList.toggle('active', isTarget);
      const icon = parentPill.querySelector('.pill-icon');
      if (icon) {
        icon.className = isTarget ? 'fa-solid fa-circle-dot pill-icon' : 'fa-regular fa-circle pill-icon';
      }
    }
  });

  calculateConciergeYield();
}

function updateConciergeSlider(val) {
  const label = document.getElementById('conciergeTonnageVal');
  if (label) label.textContent = `${val} METRIC TONS`;
  calculateConciergeYield();
}

function calculateConciergeYield() {
  const slider = document.getElementById('conciergeSlider');
  if (!slider) return;

  const mt = parseFloat(slider.value) || 100;
  const commodityRadio = document.querySelector('input[name="conciergeCommodity"]:checked');
  const commKey = commodityRadio ? commodityRadio.value : 'white_maize';
  const profile = CONCIERGE_COMMODITY_PROFILES[commKey] || CONCIERGE_COMMODITY_PROFILES.white_maize;

  const gradeRadio = document.querySelector('input[name="conciergeGrade"]:checked');
  const isWhole = gradeRadio && gradeRadio.value === 'whole';

  const extractionRate = isWhole ? profile.rateWhole : profile.rateGrade1;
  const flourMT = mt * extractionRate;
  const branMT = mt * (1 - extractionRate);
  const bags = Math.round((flourMT * 1000) / 50);
  const hours = (mt / profile.millingSpeedMTPerHour).toFixed(1);

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

  const flourPct = Math.round(extractionRate * 100);
  const branPct = Math.round((1 - extractionRate) * 100);

  if (fFill) fFill.style.width = `${flourPct}%`;
  if (bFill) bFill.style.width = `${flourPct}%`;
  if (brFill) brFill.style.width = `${branPct}%`;

  // Update Telemetry Commodity Banner
  const nameEl = document.getElementById('conciergeCommodityName');
  const specEl = document.getElementById('conciergeCommoditySpec');
  const tagEl = document.getElementById('conciergeCommodityTag');
  const iconEl = document.getElementById('conciergeCommodityIcon');
  const badgeEl = document.getElementById('conciergeMillingRateBadge');
  const insightEl = document.getElementById('conciergeInsightText');

  if (nameEl) nameEl.textContent = profile.name;
  if (specEl) specEl.textContent = profile.spec;
  if (tagEl) tagEl.textContent = `EXTRACTION: ${flourPct}%`;
  if (iconEl) iconEl.className = profile.icon;
  if (badgeEl) badgeEl.textContent = `ATELIER CAPACITY: ${profile.millingSpeedMTPerHour.toFixed(1)} MT/HR`;
  if (insightEl) insightEl.textContent = profile.insight;

  // Visual pulse feedback on recalculation
  const portfolio = document.querySelector('.concierge-telemetry-portfolio');
  if (portfolio) {
    portfolio.classList.remove('telemetry-calc-pulse');
    void portfolio.offsetWidth;
    portfolio.classList.add('telemetry-calc-pulse');
  }
}

function applyConciergeToInquiry() {
  playAcousticChime('click');
  const slider = document.getElementById('conciergeSlider');
  const mt = slider ? slider.value : '100';
  const commodityRadio = document.querySelector('input[name="conciergeCommodity"]:checked');
  const commKey = commodityRadio ? commodityRadio.value : 'white_maize';
  const profile = CONCIERGE_COMMODITY_PROFILES[commKey] || CONCIERGE_COMMODITY_PROFILES.white_maize;
  const gradeRadio = document.querySelector('input[name="conciergeGrade"]:checked');
  const isWhole = gradeRadio && gradeRadio.value === 'whole';
  const gradeText = isWhole ? profile.wholeLabel : profile.grade1Label;
  const flourVal = document.getElementById('flourYieldNum')?.textContent || '72.0';

  goToAct(6);

  const volField = document.getElementById('pVolume');
  const notesField = document.getElementById('pNotes');

  if (volField) volField.value = `${mt} Metric Tons (${profile.name.toUpperCase()})`;
  if (notesField) {
    notesField.value = `Industrial milling batch simulation: ${mt} MT of ${profile.name} (${gradeText}). Estimated flour output: ${flourVal} MT. Requesting official toll milling contract / bulk supply offer.`;
  }
}

function sendBatchToWhatsApp() {
  playAcousticChime('click');
  const slider = document.getElementById('conciergeSlider');
  const mt = slider ? slider.value : '100';
  const commodityRadio = document.querySelector('input[name="conciergeCommodity"]:checked');
  const commKey = commodityRadio ? commodityRadio.value : 'white_maize';
  const profile = CONCIERGE_COMMODITY_PROFILES[commKey] || CONCIERGE_COMMODITY_PROFILES.white_maize;
  const gradeRadio = document.querySelector('input[name="conciergeGrade"]:checked');
  const isWhole = gradeRadio && gradeRadio.value === 'whole';
  const gradeText = isWhole ? profile.wholeLabel : profile.grade1Label;

  const flourVal = document.getElementById('flourYieldNum')?.textContent || '72.0';
  const bagsVal = document.getElementById('bagsYieldNum')?.textContent || '1,440';
  const branVal = document.getElementById('branYieldNum')?.textContent || '28.0';
  const hoursVal = document.getElementById('turnaroundNum')?.textContent || '6.7';

  const msg = `Hello Nimireaux Uganda Limited, I have simulated a commercial milling batch on your website:\n\n` +
    `🌾 Raw Commodity: ${profile.name}\n` +
    `⚖️ Intake Batch: ${mt} Metric Tons\n` +
    `✨ Milling Profile: ${gradeText}\n` +
    `📦 Net Flour Output: ${flourVal} MT (${bagsVal} x 50kg Bags)\n` +
    `🐄 Byproduct Animal Bran: ${branVal} MT\n` +
    `⏱️ Production Schedule: ~${hoursVal} Hours\n\n` +
    `Please provide an official proforma quotation / toll contract pricing for this batch.`;

  const waUrl = `https://wa.me/256744135549?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
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
   EAST AFRICA GRAIN COMMODITY EXCHANGE & LIVE MARKET BOARD
   ========================================================================== */
let isMarketBoardOpen = false;
let activeMarketHubKey = 'kampala';

const GRAIN_MARKET_DATA = {
  currency: 'UGX', // 'UGX' or 'USD'
  fxRateUGXtoUSD: 3780,
  lastUpdated: 'Today • 08:30 EAT (Opening Bell)',
  hubs: {
    kampala: {
      name: 'Kampala Central Grain Terminal',
      location: 'Uganda • Central Hub',
      type: 'Buffer Reserves & Wholesale Distribution',
      sentiment: 'Bullish (+1.4%)',
      volumeTodayMT: '4,850 MT',
      commodities: [
        {
          id: 'white_maize_flour',
          name: 'Grade 1 Superfine Maize Flour',
          standard: 'UNBS US 2:2017 Fortified',
          form: '50kg Hermetic Bags & Bulk',
          priceUGX: 1850000,
          changePct: '+1.4%',
          trend: 'up',
          moisture: '12.8%',
          aflatoxin: '< 5 ppb',
          moq: '10 MT',
          leadTime: 'Immediate (Ex-Store)'
        },
        {
          id: 'yellow_maize_flour',
          name: 'Fortified Golden Maize Flour',
          standard: 'Carotenoid / UNBS Standard',
          form: '50kg Bags',
          priceUGX: 1780000,
          changePct: '+0.9%',
          trend: 'up',
          moisture: '12.8%',
          aflatoxin: '< 5 ppb',
          moq: '10 MT',
          leadTime: 'Immediate'
        },
        {
          id: 'composite_porridge',
          name: 'Fortified Multi-Grain Blend',
          standard: 'WFP / WHO Nutrient Standard',
          form: '25kg & 50kg Bags',
          priceUGX: 2450000,
          changePct: '+2.0%',
          trend: 'up',
          moisture: '11.5%',
          aflatoxin: '< 4 ppb',
          moq: '15 MT',
          leadTime: '24–48 Hours'
        },
        {
          id: 'animal_feed_bran',
          name: 'Nutritious Animal Feed Bran',
          standard: 'High Protein / UNBS Dairy Grade',
          form: '50kg Poly Bags',
          priceUGX: 620000,
          changePct: '-0.5%',
          trend: 'down',
          moisture: '12.5%',
          aflatoxin: '< 8 ppb',
          moq: '20 MT',
          leadTime: 'Immediate'
        },
        {
          id: 'corn_grits',
          name: 'Degermed Brewer’s Corn Grits',
          standard: 'Fat Content < 1.0% Beverage Spec',
          form: 'Bulk 1-Ton Totes & 50kg',
          priceUGX: 2150000,
          changePct: '0.0%',
          trend: 'neutral',
          moisture: '12.0%',
          aflatoxin: '< 4 ppb',
          moq: '30 MT',
          leadTime: '48 Hours'
        },
        {
          id: 'hard_wheat_atta',
          name: 'Premium Baker’s Hard Wheat Atta',
          standard: 'Wet Gluten 28–32%',
          form: '50kg Poly Bags',
          priceUGX: 2750000,
          changePct: '+0.6%',
          trend: 'up',
          moisture: '12.0%',
          aflatoxin: '< 4 ppb',
          moq: '10 MT',
          leadTime: '24 Hours'
        }
      ]
    },
    jinja: {
      name: 'Jinja / Iganga Atelier Gate',
      location: 'Eastern Uganda • Processing Epicenter',
      type: 'Direct Factory Gate (EXW Mill)',
      sentiment: 'Active (+1.8%)',
      volumeTodayMT: '6,200 MT',
      commodities: [
        {
          id: 'white_maize_flour',
          name: 'Grade 1 Superfine Maize Flour',
          standard: 'UNBS US 2:2017 Fortified',
          form: 'Ex-Factory Palletized',
          priceUGX: 1790000,
          changePct: '+1.6%',
          trend: 'up',
          moisture: '12.8%',
          aflatoxin: '< 5 ppb',
          moq: '20 MT',
          leadTime: 'Immediate (Mill Silos)'
        },
        {
          id: 'yellow_maize_flour',
          name: 'Fortified Golden Maize Flour',
          standard: 'Carotenoid / UNBS Standard',
          form: 'Ex-Factory Palletized',
          priceUGX: 1720000,
          changePct: '+1.2%',
          trend: 'up',
          moisture: '12.8%',
          aflatoxin: '< 5 ppb',
          moq: '20 MT',
          leadTime: 'Immediate'
        },
        {
          id: 'composite_porridge',
          name: 'Fortified Multi-Grain Blend',
          standard: 'WFP / WHO Nutrient Standard',
          form: 'Palletized 50kg Bags',
          priceUGX: 2380000,
          changePct: '+2.1%',
          trend: 'up',
          moisture: '11.5%',
          aflatoxin: '< 4 ppb',
          moq: '15 MT',
          leadTime: '24 Hours'
        },
        {
          id: 'animal_feed_bran',
          name: 'Nutritious Animal Feed Bran',
          standard: 'Direct Roll Pellet/Meal Bran',
          form: '50kg Bulk Bags',
          priceUGX: 580000,
          changePct: '-0.8%',
          trend: 'down',
          moisture: '12.5%',
          aflatoxin: '< 8 ppb',
          moq: '25 MT',
          leadTime: 'Immediate'
        },
        {
          id: 'corn_grits',
          name: 'Degermed Brewer’s Corn Grits',
          standard: 'Beverage Grade Optical Sorted',
          form: 'Bulk 1-Ton Totes',
          priceUGX: 2080000,
          changePct: '+0.5%',
          trend: 'up',
          moisture: '12.0%',
          aflatoxin: '< 4 ppb',
          moq: '30 MT',
          leadTime: '24 Hours'
        },
        {
          id: 'hard_wheat_atta',
          name: 'Premium Baker’s Hard Wheat Atta',
          standard: 'Wet Gluten 28–32%',
          form: '50kg Bags',
          priceUGX: 2680000,
          changePct: '+0.4%',
          trend: 'up',
          moisture: '12.0%',
          aflatoxin: '< 4 ppb',
          moq: '15 MT',
          leadTime: 'Immediate'
        }
      ]
    },
    busia: {
      name: 'Busia & Malaba Cross-Border Hub',
      location: 'Uganda / Kenya OSBP Border',
      type: 'Northern Corridor Export Clearing',
      sentiment: 'High Liquidity (+2.2%)',
      volumeTodayMT: '8,400 MT',
      commodities: [
        {
          id: 'white_maize_flour',
          name: 'Grade 1 Superfine Maize Flour',
          standard: 'UNBS / KEBS Harmonized EAC',
          form: 'Cross-Border Cleared Truckload',
          priceUGX: 1980000,
          changePct: '+2.2%',
          trend: 'up',
          moisture: '12.5%',
          aflatoxin: '< 5 ppb',
          moq: '30 MT (Semi-Trailer)',
          leadTime: 'Pre-Cleared at OSBP'
        },
        {
          id: 'yellow_maize_flour',
          name: 'Fortified Golden Maize Flour',
          standard: 'EAC COMESA Certified',
          form: 'Semi-Trailer Rations',
          priceUGX: 1910000,
          changePct: '+1.5%',
          trend: 'up',
          moisture: '12.5%',
          aflatoxin: '< 5 ppb',
          moq: '30 MT',
          leadTime: 'Pre-Cleared'
        },
        {
          id: 'composite_porridge',
          name: 'Fortified Multi-Grain Blend',
          standard: 'Institutional School Rations',
          form: 'Shrink-Wrapped Pallets',
          priceUGX: 2580000,
          changePct: '+1.9%',
          trend: 'up',
          moisture: '11.5%',
          aflatoxin: '< 4 ppb',
          moq: '30 MT',
          leadTime: '24 Hours'
        },
        {
          id: 'animal_feed_bran',
          name: 'Nutritious Animal Feed Bran',
          standard: 'Kenya Feed Millers Spec',
          form: 'Export Bulk Stowed',
          priceUGX: 690000,
          changePct: '+0.5%',
          trend: 'up',
          moisture: '12.5%',
          aflatoxin: '< 8 ppb',
          moq: '30 MT',
          leadTime: 'Immediate'
        },
        {
          id: 'corn_grits',
          name: 'Degermed Brewer’s Corn Grits',
          standard: 'Nairobi Brewery Grade',
          form: 'Bulk 1-Ton Totes',
          priceUGX: 2280000,
          changePct: '+0.8%',
          trend: 'up',
          moisture: '12.0%',
          aflatoxin: '< 4 ppb',
          moq: '60 MT (Convoy)',
          leadTime: '48 Hours'
        },
        {
          id: 'hard_wheat_atta',
          name: 'Premium Baker’s Hard Wheat Atta',
          standard: 'Baker’s Premium Atta',
          form: '50kg Bags',
          priceUGX: 2890000,
          changePct: '+1.1%',
          trend: 'up',
          moisture: '12.0%',
          aflatoxin: '< 4 ppb',
          moq: '30 MT',
          leadTime: '24 Hours'
        }
      ]
    },
    elegu: {
      name: 'Elegu / Nimule Humanitarian Gate',
      location: 'Uganda / South Sudan Border',
      type: 'Juba Relief & Commercial Dispatch',
      sentiment: 'Steady (+1.5%)',
      volumeTodayMT: '3,900 MT',
      commodities: [
        {
          id: 'white_maize_flour',
          name: 'Grade 1 Superfine Maize Flour',
          standard: 'WFP / UN Relief Specification',
          form: 'Heavy-Duty Hermetic 50kg Bags',
          priceUGX: 2050000,
          changePct: '+1.7%',
          trend: 'up',
          moisture: '12.0%',
          aflatoxin: '< 4 ppb',
          moq: '30 MT (Relief Convoy)',
          leadTime: 'Pre-Manifested'
        },
        {
          id: 'composite_porridge',
          name: 'Fortified Multi-Grain Blend',
          standard: 'Emergency Nutrition Clinical Spec',
          form: 'Palletized 25kg Heavy Duty',
          priceUGX: 2650000,
          changePct: '+2.4%',
          trend: 'up',
          moisture: '11.0%',
          aflatoxin: '< 4 ppb',
          moq: '30 MT',
          leadTime: '24 Hours'
        },
        {
          id: 'yellow_maize_flour',
          name: 'Fortified Golden Maize Flour',
          standard: 'Relief & Commercial Grade',
          form: '50kg Hermetic Bags',
          priceUGX: 1980000,
          changePct: '+1.1%',
          trend: 'up',
          moisture: '12.0%',
          aflatoxin: '< 5 ppb',
          moq: '30 MT',
          leadTime: 'Immediate'
        },
        {
          id: 'animal_feed_bran',
          name: 'Nutritious Animal Feed Bran',
          standard: 'Commercial Pastoral Rations',
          form: '50kg Poly Bags',
          priceUGX: 720000,
          changePct: '+0.2%',
          trend: 'up',
          moisture: '12.0%',
          aflatoxin: '< 8 ppb',
          moq: '30 MT',
          leadTime: 'Immediate'
        }
      ]
    }
  }
};

function formatMarketPrice(ugxAmount, perBag = false) {
  const isUSD = GRAIN_MARKET_DATA.currency === 'USD';
  if (perBag) {
    const bagUGX = ugxAmount / 20; // 50kg bag is 1/20th of a MT (1000kg)
    if (isUSD) {
      const bagUSD = bagUGX / GRAIN_MARKET_DATA.fxRateUGXtoUSD;
      return `$${bagUSD.toFixed(2)}`;
    } else {
      return `UGX ${Math.round(bagUGX).toLocaleString()}`;
    }
  } else {
    if (isUSD) {
      const mtUSD = ugxAmount / GRAIN_MARKET_DATA.fxRateUGXtoUSD;
      return `$${mtUSD.toFixed(2)}`;
    } else {
      return `UGX ${Math.round(ugxAmount).toLocaleString()}`;
    }
  }
}

function setMarketCurrency(curr) {
  if (GRAIN_MARKET_DATA.currency === curr) return;
  GRAIN_MARKET_DATA.currency = curr;
  playAcousticChime('click');

  // Update Ribbon buttons
  const rUGX = document.getElementById('btnCurrUGX');
  const rUSD = document.getElementById('btnCurrUSD');
  if (rUGX && rUSD) {
    rUGX.classList.toggle('active', curr === 'UGX');
    rUSD.classList.toggle('active', curr === 'USD');
  }

  // Update Modal buttons
  const mUGX = document.getElementById('mbModalCurrUGX');
  const mUSD = document.getElementById('mbModalCurrUSD');
  if (mUGX && mUSD) {
    mUGX.classList.toggle('active', curr === 'UGX');
    mUSD.classList.toggle('active', curr === 'USD');
  }

  renderTickerRibbon();
  if (isMarketBoardOpen) {
    renderMarketBoard();
  }
}

function renderTickerRibbon() {
  const track = document.getElementById('gtrMarqueeTrack');
  if (!track) return;

  const items = [
    { hub: 'Kampala', name: 'Grade 1 Superfine Maize', ugx: 1850000, change: '+1.4%', trend: 'up' },
    { hub: 'Jinja Gate', name: 'Grade 1 Posho (Ex-Mill)', ugx: 1790000, change: '+1.6%', trend: 'up' },
    { hub: 'Busia Border', name: 'Superfine (Kenya Export)', ugx: 1980000, change: '+2.2%', trend: 'up' },
    { hub: 'Kampala', name: 'Animal Feed Bran (Pellet)', ugx: 620000, change: '-0.5%', trend: 'down' },
    { hub: 'Jinja Gate', name: 'Fortified Multi-Grain Blend', ugx: 2380000, change: '+2.1%', trend: 'up' },
    { hub: 'Elegu Gate', name: 'WFP Fortified Rations', ugx: 2050000, change: '+1.7%', trend: 'up' },
    { hub: 'Jinja Gate', name: 'Brewer’s Degermed Grits', ugx: 2080000, change: '+0.5%', trend: 'up' },
    { hub: 'Kampala', name: 'Baker’s Hard Wheat Atta', ugx: 2750000, change: '+0.6%', trend: 'up' }
  ];

  const html = items.map(it => `
    <div class="gtr-item" onclick="openMarketBoardModal()">
      <span class="gtr-item-hub">[${it.hub}]</span>
      <span class="gtr-item-name">${it.name}</span>
      <span class="gtr-item-price">${formatMarketPrice(it.ugx)}</span>
      <span class="gtr-item-trend ${it.trend}">${it.change}</span>
    </div>
  `).join('');

  track.innerHTML = html + html;
}

function openMarketBoardModal(hubKey) {
  const modal = document.getElementById('marketBoardDialog');
  const overlay = document.getElementById('marketBoardOverlay');
  if (!modal || !overlay) return;

  if (hubKey && GRAIN_MARKET_DATA.hubs[hubKey]) {
    activeMarketHubKey = hubKey;
  }

  isMarketBoardOpen = true;
  modal.classList.add('active');
  overlay.classList.add('active');
  playAcousticChime('transition');
  renderMarketBoard();
}

function closeMarketBoardModal() {
  const modal = document.getElementById('marketBoardDialog');
  const overlay = document.getElementById('marketBoardOverlay');
  if (!modal || !overlay) return;

  isMarketBoardOpen = false;
  modal.classList.remove('active');
  overlay.classList.remove('active');
  playAcousticChime('click');
}

function switchMarketHub(hubKey) {
  if (!GRAIN_MARKET_DATA.hubs[hubKey]) return;
  activeMarketHubKey = hubKey;
  playAcousticChime('click');

  const tabs = document.querySelectorAll('.mb-hub-tab');
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.hub === hubKey);
  });

  renderMarketBoard();
}

function renderMarketBoard() {
  const hub = GRAIN_MARKET_DATA.hubs[activeMarketHubKey] || GRAIN_MARKET_DATA.hubs.kampala;

  // 1. Render Hub Telemetry Strip
  const telemetryEl = document.getElementById('marketHubTelemetry');
  if (telemetryEl) {
    telemetryEl.innerHTML = `
      <div class="mb-stat-cell">
        <span class="mb-stat-kicker"><i class="fa-solid fa-location-dot"></i> ACTIVE TERMINAL HUB</span>
        <span class="mb-stat-val accent">${hub.name}</span>
      </div>
      <div class="mb-stat-cell">
        <span class="mb-stat-kicker"><i class="fa-solid fa-arrows-split-up-and-left"></i> HUB FUNCTION &amp; ROLE</span>
        <span class="mb-stat-val">${hub.type}</span>
      </div>
      <div class="mb-stat-cell">
        <span class="mb-stat-kicker"><i class="fa-solid fa-chart-line"></i> 24H LIQUIDITY &amp; SENTIMENT</span>
        <span class="mb-stat-val ${hub.sentiment.includes('+') ? 'accent' : ''}">${hub.sentiment}</span>
      </div>
      <div class="mb-stat-cell">
        <span class="mb-stat-kicker"><i class="fa-solid fa-scale-balanced"></i> TODAY'S CLEARED VOLUME</span>
        <span class="mb-stat-val">${hub.volumeTodayMT}</span>
      </div>
    `;
  }

  // 2. Render Commodity Rows Table
  const tbody = document.getElementById('marketTableBody');
  if (tbody) {
    tbody.innerHTML = hub.commodities.map(c => {
      const priceMT = formatMarketPrice(c.priceUGX);
      const priceBag = formatMarketPrice(c.priceUGX, true);
      const trendIcon = c.trend === 'up' ? '<i class="fa-solid fa-arrow-trend-up"></i>' : (c.trend === 'down' ? '<i class="fa-solid fa-arrow-trend-down"></i>' : '<i class="fa-solid fa-minus"></i>');

      return `
        <tr>
          <td>
            <div class="comm-cell">
              <span class="comm-name">${c.name}</span>
              <span class="comm-standard"><i class="fa-solid fa-certificate"></i> ${c.standard}</span>
            </div>
          </td>
          <td>
            <span style="color: var(--p-text-silver); font-size: 0.76rem;">${c.form}</span>
          </td>
          <td>
            <span class="price-mt-val">${priceMT} / MT</span>
          </td>
          <td>
            <span class="price-bag-val">${priceBag}</span>
          </td>
          <td>
            <span class="trend-badge ${c.trend}">${trendIcon} ${c.changePct}</span>
          </td>
          <td>
            <span class="purity-tag"><i class="fa-solid fa-shield-check"></i> ${c.moisture} &bull; ${c.aflatoxin}</span>
          </td>
          <td>
            <span class="moq-tag">${c.moq}</span>
          </td>
          <td style="text-align: right;">
            <div class="table-actions-cell">
              <button type="button" class="btn-table-wa" onclick="orderCommoditySpot('${activeMarketHubKey}', '${c.id}')" title="Request Instant Spot Lock via WhatsApp">
                <i class="fa-brands fa-whatsapp"></i>
                <span>LOCK IN</span>
              </button>
              <button type="button" class="btn-table-salon" onclick="applyMarketToSalon('${activeMarketHubKey}', '${c.id}')" title="Transfer to Institutional Salon RFP">
                <i class="fa-solid fa-file-signature"></i>
                <span>TENDER</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }
}

function orderCommoditySpot(hubKey, commodityId) {
  playAcousticChime('click');
  const hub = GRAIN_MARKET_DATA.hubs[hubKey] || GRAIN_MARKET_DATA.hubs.kampala;
  const item = hub.commodities.find(c => c.id === commodityId) || hub.commodities[0];
  const priceFormatted = `${formatMarketPrice(item.priceUGX)} / MT`;
  const bagFormatted = formatMarketPrice(item.priceUGX, true);

  const msg = `Hello Nimireaux Commercial Trading Desk, I am requesting an official spot rate contract from your Market Board:\n\n` +
    `🌾 *SPOT COMMODITY INQUIRY*\n` +
    `• Commodity: ${item.name}\n` +
    `• Terminal Hub: ${hub.name}\n` +
    `• Indicative Spot Rate: ${priceFormatted} (${bagFormatted} / 50kg Bag)\n` +
    `• Certified Standard: ${item.standard} (Moisture: ${item.moisture}, Aflatoxin: ${item.aflatoxin})\n` +
    `• Minimum Order Quantity (MOQ): ${item.moq}\n` +
    `• Packaging: ${item.form}\n\n` +
    `Please confirm warehouse intake slot, dispatch timeline, and official proforma invoice.`;

  const waUrl = `https://wa.me/256744135549?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

function applyMarketToSalon(hubKey, commodityId) {
  playAcousticChime('click');
  closeMarketBoardModal();
  goToAct(6);

  const hub = GRAIN_MARKET_DATA.hubs[hubKey || activeMarketHubKey] || GRAIN_MARKET_DATA.hubs.kampala;
  const item = (commodityId && hub.commodities.find(c => c.id === commodityId)) || hub.commodities[0];
  const priceFormatted = `${formatMarketPrice(item.priceUGX)} / MT`;

  const volField = document.getElementById('pVolume');
  const notesField = document.getElementById('pNotes');

  if (volField) volField.value = `${item.moq} Spot Order (${item.name})`;
  if (notesField) {
    notesField.value = `Official Spot Market Board Tender inquiry: ${item.name} at ${hub.name}. Quoted indicative rate: ${priceFormatted}. Requesting institutional contract pricing, batch COA, and scheduled dispatch terms.`;
  }
}

function orderSelectedMarketOnWhatsApp() {
  const hub = GRAIN_MARKET_DATA.hubs[activeMarketHubKey] || GRAIN_MARKET_DATA.hubs.kampala;
  const item = hub.commodities[0];
  orderCommoditySpot(activeMarketHubKey, item.id);
}

/* ==========================================================================
   MAISON AI CONCIERGE & SOVEREIGN INTELLIGENCE PROTOCOL
   ========================================================================== */

/* ==========================================================================
   DIGITAL QUALITY LAB & AFLATOXIN ASSAY INSPECTOR DATABASE
   ========================================================================== */
let isAiDrawerOpen = false;
let isCoaModalOpen = false;
let isLogisticsModalOpen = false;
let currentLabBatchId = 'NMR-2026-UG88';

const LAB_BATCH_DATABASE = {
  'NMR-2026-UG88': {
    batchNumber: 'NMR-2026-UG88',
    commodity: 'Superfine Fortified Maize Meal (Grade 1 Royal)',
    standard: 'UNBS US 2:2017 / EAS 768 Fortified Standard',
    millingFacility: 'Kampala Central Milling Atelier — Mill Line A',
    siloOrigin: 'Masindi & Bunyoro Agricultural Sourcing Nexus',
    manufactureDate: '01 Nov 2026',
    expiryDate: '01 May 2027',
    samplingDates: 'Sampled: 02 Nov 2026 • Exp: 01 May 2027',
    aflatoxinTotal: '0.0 ppb',
    aflatoxinSub: 'Undetectable (< 0.5 ppb)',
    aflatoxinMargin: '-100% Safety Margin',
    aflatoxinFillPct: 4,
    moisture: '12.4%',
    moistureFillPct: 92,
    moistureStatus: 'Dry Storage Stable',
    granulometry: '98.6%',
    vitA: '2.2 mg/kg',
    iron: '48.0 mg/kg',
    zinc: '42.5 mg/kg',
    verifyHash: 'SHA256: 8f9b4e72a10c0e5a8f42b3d1... [VERIFIED]',
    parameters: [
      { name: 'Moisture Content', result: '12.4% ± 0.3%', limit: 'Max 13.5%', method: 'ISO 712 / NIR Spectrometry', isGood: true },
      { name: 'Total Aflatoxins (B1+B2+G1+G2)', result: '0.0 ppb (Undetectable)', limit: 'Max 10.0 ppb', method: 'HPLC Immunoaffinity / Fluorometry', isGood: true },
      { name: 'Aflatoxin B1', result: '< 0.5 ppb', limit: 'Max 5.0 ppb', method: 'Enzyme-Linked Immunoassay (ELISA)', isGood: true },
      { name: 'Crude Protein (N × 6.25)', result: '9.20% (Dry Basis)', limit: 'Min 8.0%', method: 'Kjeldahl Combustion Method', isGood: true },
      { name: 'Crude Fat', result: '1.35%', limit: 'Max 2.0%', method: 'Soxhlet Solvent Extraction', isGood: true },
      { name: 'Total Ash', result: '0.48%', limit: 'Max 0.70%', method: '550 °C Muffle Furnace', isGood: true },
      { name: 'Vitamin A (Retinyl Palmitate)', result: '2.2 ± 0.3 mg/kg', limit: 'Min 1.5 mg/kg', method: 'HPLC Spectrophotometry', isGold: true },
      { name: 'Iron (NaFeEDTA)', result: '48.0 ± 5.0 mg/kg', limit: 'Min 40.0 mg/kg', method: 'Atomic Absorption Spectrophotometry', isGold: true },
      { name: 'Zinc (Zinc Oxide)', result: '42.5 ± 4.0 mg/kg', limit: 'Min 35.0 mg/kg', method: 'Flame Photometry (AOAC 999.11)', isGold: true },
      { name: 'Granulometry (< 120 μm)', result: '98.6% Passes Silk Screen', limit: 'Min 95.0%', method: 'Rotap Mechanical Sieve Analysis', isGood: true },
      { name: 'Optical Foreign Matter', result: '0.00% (Zero Impurity)', limit: 'Max 0.20%', method: 'Bühler Sortex Optical Inspection', isGood: true }
    ]
  },
  'NMR-2026-M04': {
    batchNumber: 'NMR-2026-M04',
    commodity: 'Grade 1 Superfine White Posho Flour',
    standard: 'UNBS US 2:2017 / Triple Fortified',
    millingFacility: 'Kampala Central Milling Atelier — Mill Line A',
    siloOrigin: 'Masindi Outgrower Basin (Silo Intake #04)',
    manufactureDate: '02 Nov 2026',
    expiryDate: '02 May 2027',
    samplingDates: 'Sampled: 03 Nov 2026 • Exp: 02 May 2027',
    aflatoxinTotal: '1.8 ppb',
    aflatoxinSub: 'Certified Safe (< 2.0 ppb)',
    aflatoxinMargin: '-82% Safety Margin',
    aflatoxinFillPct: 18,
    moisture: '12.5%',
    moistureFillPct: 93,
    moistureStatus: 'Low Moisture Stable',
    granulometry: '98.8%',
    vitA: '2.4 mg/kg',
    iron: '48.5 mg/kg',
    zinc: '42.0 mg/kg',
    verifyHash: 'SHA256: 4e7a2b9011ff83d6a9c148e2... [VERIFIED]',
    parameters: [
      { name: 'Moisture Content', result: '12.5% ± 0.3%', limit: 'Max 13.5%', method: 'ISO 712 / NIR Spectrometry', isGood: true },
      { name: 'Total Aflatoxins (B1+B2+G1+G2)', result: '1.8 ppb', limit: 'Max 10.0 ppb', method: 'HPLC Immunoaffinity / Fluorometry', isGood: true },
      { name: 'Aflatoxin B1', result: '< 0.5 ppb', limit: 'Max 5.0 ppb', method: 'Enzyme-Linked Immunoassay (ELISA)', isGood: true },
      { name: 'Crude Protein (N × 6.25)', result: '9.35% (Dry Basis)', limit: 'Min 8.0%', method: 'Kjeldahl Combustion Method', isGood: true },
      { name: 'Crude Fat', result: '1.28%', limit: 'Max 2.0%', method: 'Soxhlet Solvent Extraction', isGood: true },
      { name: 'Total Ash', result: '0.46%', limit: 'Max 0.70%', method: '550 °C Muffle Furnace', isGood: true },
      { name: 'Vitamin A (Retinyl Palmitate)', result: '2.4 ± 0.2 mg/kg', limit: 'Min 1.5 mg/kg', method: 'HPLC Spectrophotometry', isGold: true },
      { name: 'Iron (NaFeEDTA)', result: '48.5 ± 3.0 mg/kg', limit: 'Min 40.0 mg/kg', method: 'Atomic Absorption Spectrophotometry', isGold: true },
      { name: 'Zinc (Zinc Oxide)', result: '42.0 ± 2.5 mg/kg', limit: 'Min 35.0 mg/kg', method: 'Flame Photometry (AOAC 999.11)', isGold: true },
      { name: 'Granulometry (< 120 μm)', result: '98.8% Passes Silk Screen', limit: 'Min 95.0%', method: 'Rotap Mechanical Sieve Analysis', isGood: true },
      { name: 'Optical Foreign Matter', result: '0.00% (Zero Impurity)', limit: 'Max 0.20%', method: 'Bühler Sortex Optical Inspection', isGood: true }
    ]
  },
  'NMR-2026-Y18': {
    batchNumber: 'NMR-2026-Y18',
    commodity: 'Fortified Golden Yellow Maize Flour',
    standard: 'UNBS US 2:2017 / Carotenoid Enriched',
    millingFacility: 'Jinja Processing Epicenter — Mill Line B',
    siloOrigin: 'Eastern Uganda Outgrower Basin (Silo Intake #09)',
    manufactureDate: '04 Nov 2026',
    expiryDate: '04 May 2027',
    samplingDates: 'Sampled: 05 Nov 2026 • Exp: 04 May 2027',
    aflatoxinTotal: '2.4 ppb',
    aflatoxinSub: 'Certified Safe (< 3.0 ppb)',
    aflatoxinMargin: '-76% Safety Margin',
    aflatoxinFillPct: 24,
    moisture: '12.6%',
    moistureFillPct: 93,
    moistureStatus: 'Controlled Moisture',
    granulometry: '97.6%',
    vitA: '2.6 mg/kg',
    iron: '46.0 mg/kg',
    zinc: '40.5 mg/kg',
    verifyHash: 'SHA256: 7b2190cd14aa350e981fc072... [VERIFIED]',
    parameters: [
      { name: 'Moisture Content', result: '12.6% ± 0.3%', limit: 'Max 13.5%', method: 'ISO 712 / NIR Spectrometry', isGood: true },
      { name: 'Total Aflatoxins (B1+B2+G1+G2)', result: '2.4 ppb', limit: 'Max 10.0 ppb', method: 'HPLC Immunoaffinity / Fluorometry', isGood: true },
      { name: 'Aflatoxin B1', result: '< 0.6 ppb', limit: 'Max 5.0 ppb', method: 'Enzyme-Linked Immunoassay (ELISA)', isGood: true },
      { name: 'Crude Protein (N × 6.25)', result: '9.80% (Dry Basis)', limit: 'Min 8.0%', method: 'Kjeldahl Combustion Method', isGood: true },
      { name: 'Crude Fat', result: '1.85%', limit: 'Max 2.0%', method: 'Soxhlet Solvent Extraction', isGood: true },
      { name: 'Total Ash', result: '0.52%', limit: 'Max 0.70%', method: '550 °C Muffle Furnace', isGood: true },
      { name: 'Vitamin A (Retinyl Palmitate)', result: '2.6 ± 0.3 mg/kg', limit: 'Min 1.5 mg/kg', method: 'HPLC Spectrophotometry', isGold: true },
      { name: 'Iron (NaFeEDTA)', result: '46.0 ± 3.0 mg/kg', limit: 'Min 40.0 mg/kg', method: 'Atomic Absorption Spectrophotometry', isGold: true },
      { name: 'Zinc (Zinc Oxide)', result: '40.5 ± 2.5 mg/kg', limit: 'Min 35.0 mg/kg', method: 'Flame Photometry (AOAC 999.11)', isGold: true },
      { name: 'Granulometry (< 140 μm)', result: '97.6% Passes Silk Screen', limit: 'Min 95.0%', method: 'Rotap Mechanical Sieve Analysis', isGood: true },
      { name: 'Optical Foreign Matter', result: '0.00% (Zero Impurity)', limit: 'Max 0.20%', method: 'Bühler Sortex Optical Inspection', isGood: true }
    ]
  },
  'NMR-2026-W08': {
    batchNumber: 'NMR-2026-W08',
    commodity: 'Premium Baker’s Hard Wheat Atta',
    standard: 'EAS 51 / High-Gluten Industrial Bakery Standard',
    millingFacility: 'Kampala Roller Mill Atelier — Roller Stage 5',
    siloOrigin: 'Eastern Highlands Cultivars (Silo Intake #02)',
    manufactureDate: '28 Oct 2026',
    expiryDate: '28 Apr 2027',
    samplingDates: 'Sampled: 29 Oct 2026 • Exp: 28 Apr 2027',
    aflatoxinTotal: '0.8 ppb',
    aflatoxinSub: 'Certified Safe (< 1.0 ppb)',
    aflatoxinMargin: '-92% Safety Margin',
    aflatoxinFillPct: 8,
    moisture: '11.9%',
    moistureFillPct: 88,
    moistureStatus: 'Low Moisture Atta',
    granulometry: '99.2%',
    vitA: '2.0 mg/kg',
    iron: '52.0 mg/kg',
    zinc: '38.0 mg/kg',
    verifyHash: 'SHA256: 3c5188f407b1e289aa936d54... [VERIFIED]',
    parameters: [
      { name: 'Moisture Content', result: '11.9% ± 0.3%', limit: 'Max 12.5%', method: 'ISO 712 / NIR Spectrometry', isGood: true },
      { name: 'Total Aflatoxins (B1+B2+G1+G2)', result: '0.8 ppb', limit: 'Max 10.0 ppb', method: 'HPLC Immunoaffinity / Fluorometry', isGood: true },
      { name: 'Aflatoxin B1', result: '< 0.2 ppb', limit: 'Max 5.0 ppb', method: 'Enzyme-Linked Immunoassay (ELISA)', isGood: true },
      { name: 'Wet Gluten Index', result: '30.5% (High Elasticity)', limit: 'Min 28.0%', method: 'Glutomatic AOAC 38-12', isGold: true },
      { name: 'Crude Protein (N × 5.7)', result: '12.60% (Dry Basis)', limit: 'Min 11.5%', method: 'Kjeldahl Combustion Method', isGood: true },
      { name: 'Total Ash', result: '0.58%', limit: 'Max 0.65%', method: '550 °C Muffle Furnace', isGood: true },
      { name: 'Iron (NaFeEDTA)', result: '52.0 ± 4.0 mg/kg', limit: 'Min 40.0 mg/kg', method: 'Atomic Absorption Spectrophotometry', isGold: true },
      { name: 'Zinc (Zinc Oxide)', result: '38.0 ± 2.0 mg/kg', limit: 'Min 35.0 mg/kg', method: 'Flame Photometry (AOAC 999.11)', isGold: true },
      { name: 'Granulometry (< 120 μm)', result: '99.2% Passes Silk Screen', limit: 'Min 95.0%', method: 'Rotap Mechanical Sieve Analysis', isGood: true },
      { name: 'Optical Foreign Matter', result: '0.00% (Zero Impurity)', limit: 'Max 0.15%', method: 'Bühler Sortex Optical Inspection', isGood: true }
    ]
  },
  'NMR-2026-C12': {
    batchNumber: 'NMR-2026-C12',
    commodity: 'Fortified Multi-Grain Blend (Millet, Sorghum, Soya & Maize)',
    standard: 'WFP / WHO Supplementary Food Specification',
    millingFacility: 'Kampala Precision Blend Atelier — Line C',
    siloOrigin: 'Acholi & Bunyoro Basin Multi-Cereal Reserves',
    manufactureDate: '05 Nov 2026',
    expiryDate: '05 Nov 2027',
    samplingDates: 'Sampled: 05 Nov 2026 • Exp: 05 Nov 2027',
    aflatoxinTotal: '1.2 ppb',
    aflatoxinSub: 'Certified Safe (< 2.0 ppb)',
    aflatoxinMargin: '-88% Safety Margin',
    aflatoxinFillPct: 12,
    moisture: '11.2%',
    moistureFillPct: 84,
    moistureStatus: 'Hermetic Pack Stable',
    granulometry: '96.5%',
    vitA: '3.0 mg/kg',
    iron: '58.0 mg/kg',
    zinc: '46.0 mg/kg',
    verifyHash: 'SHA256: 91b002cf771d99ea5c822e11... [VERIFIED]',
    parameters: [
      { name: 'Moisture Content', result: '11.2% ± 0.3%', limit: 'Max 12.0%', method: 'ISO 712 / NIR Spectrometry', isGood: true },
      { name: 'Total Aflatoxins (B1+B2+G1+G2)', result: '1.2 ppb', limit: 'Max 10.0 ppb', method: 'HPLC Immunoaffinity / Fluorometry', isGood: true },
      { name: 'Aflatoxin B1', result: '< 0.3 ppb', limit: 'Max 5.0 ppb', method: 'Enzyme-Linked Immunoassay (ELISA)', isGood: true },
      { name: 'Crude Protein (N × 6.25)', result: '14.20% (Dry Basis)', limit: 'Min 12.0%', method: 'Kjeldahl Combustion Method', isGood: true },
      { name: 'Crude Fat', result: '3.10%', limit: 'Max 4.0%', method: 'Soxhlet Solvent Extraction', isGood: true },
      { name: 'Total Ash', result: '0.95%', limit: 'Max 1.20%', method: '550 °C Muffle Furnace', isGood: true },
      { name: 'Vitamin A (Retinyl Palmitate)', result: '3.0 ± 0.3 mg/kg', limit: 'Min 2.0 mg/kg', method: 'HPLC Spectrophotometry', isGold: true },
      { name: 'Iron (NaFeEDTA)', result: '58.0 ± 4.0 mg/kg', limit: 'Min 45.0 mg/kg', method: 'Atomic Absorption Spectrophotometry', isGold: true },
      { name: 'Zinc (Zinc Oxide)', result: '46.0 ± 3.0 mg/kg', limit: 'Min 40.0 mg/kg', method: 'Flame Photometry (AOAC 999.11)', isGold: true },
      { name: 'Granulometry (< 150 μm)', result: '96.5% Passes Screen', limit: 'Min 95.0%', method: 'Rotap Mechanical Sieve Analysis', isGood: true },
      { name: 'Optical Foreign Matter', result: '0.00% (Zero Impurity)', limit: 'Max 0.20%', method: 'Bühler Sortex Optical Inspection', isGood: true }
    ]
  }
};

function openCoaModal(batchId) {
  const modal = document.getElementById('coaModalDialog');
  const overlay = document.getElementById('coaModalOverlay');
  if (!modal || !overlay) return;

  isCoaModalOpen = true;
  modal.classList.add('open');
  overlay.classList.add('open');
  playAcousticChime('transition');

  const targetId = (batchId && LAB_BATCH_DATABASE[batchId]) ? batchId : currentLabBatchId;
  inspectLabBatch(targetId);
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

function inspectLabBatch(batchId) {
  const batch = LAB_BATCH_DATABASE[batchId] || LAB_BATCH_DATABASE['NMR-2026-UG88'];
  currentLabBatchId = batch.batchNumber;
  playAcousticChime('click');

  // Update chip active classes
  const chips = document.querySelectorAll('.cls-chip');
  chips.forEach(c => {
    c.classList.toggle('active', c.dataset.batch === currentLabBatchId);
  });

  // Update Ribbon
  const badgeEl = document.getElementById('coaActiveBatchBadge');
  if (badgeEl) badgeEl.innerHTML = `<i class="fa-solid fa-check-double"></i> LOT #${batch.batchNumber}`;

  // Update KPI Grid
  const aflVal = document.getElementById('coaAflatoxinVal');
  const aflSub = document.getElementById('coaAflatoxinSub');
  const aflFill = document.getElementById('coaAflatoxinFill');
  const aflMargin = document.getElementById('coaAflatoxinMargin');

  const moistVal = document.getElementById('coaMoistureVal');
  const moistFill = document.getElementById('coaMoistureFill');
  const moistStatus = document.getElementById('coaMoistureStatus');

  const granVal = document.getElementById('coaGranuloVal');
  const vitAVal = document.getElementById('coaVitAVal');
  const ironVal = document.getElementById('coaIronVal');
  const zincVal = document.getElementById('coaZincVal');

  if (aflVal) aflVal.textContent = batch.aflatoxinTotal;
  if (aflSub) aflSub.textContent = batch.aflatoxinSub;
  if (aflFill) aflFill.style.width = `${batch.aflatoxinFillPct}%`;
  if (aflMargin) aflMargin.textContent = batch.aflatoxinMargin;

  if (moistVal) moistVal.textContent = batch.moisture;
  if (moistFill) moistFill.style.width = `${batch.moistureFillPct}%`;
  if (moistStatus) moistStatus.textContent = batch.moistureStatus;

  if (granVal) granVal.textContent = batch.granulometry;
  if (vitAVal) vitAVal.textContent = batch.vitA;
  if (ironVal) ironVal.textContent = batch.iron;
  if (zincVal) zincVal.textContent = batch.zinc;

  // Update Metadata Strip
  const nameEl = document.getElementById('coaCommodityName');
  const facEl = document.getElementById('coaMillingFacility');
  const siloEl = document.getElementById('coaSiloOrigin');
  const datesEl = document.getElementById('coaSamplingDates');
  const hashEl = document.getElementById('coaVerifyHash');

  if (nameEl) nameEl.textContent = batch.commodity;
  if (facEl) facEl.textContent = batch.millingFacility;
  if (siloEl) siloEl.textContent = batch.siloOrigin;
  if (datesEl) datesEl.textContent = batch.samplingDates;
  if (hashEl) hashEl.textContent = batch.verifyHash;

  // Update Parameters Table
  const tbody = document.getElementById('coaTableBody');
  if (tbody) {
    tbody.innerHTML = batch.parameters.map(p => {
      let valClass = p.isGood ? 'coa-val-good' : (p.isGold ? 'coa-val-gold' : '');
      return `
        <tr>
          <td><strong>${p.name}</strong></td>
          <td><span class="${valClass}">${p.result}</span></td>
          <td>${p.limit}</td>
          <td>${p.method}</td>
        </tr>
      `;
    }).join('');
  }
}

function printOfficialCoa() {
  playAcousticChime('click');
  window.print();
}

function inquireBatchWhatsApp() {
  playAcousticChime('click');
  const batch = LAB_BATCH_DATABASE[currentLabBatchId] || LAB_BATCH_DATABASE['NMR-2026-UG88'];
  const msg = `Hello Nimireaux Quality Assurance Desk, I have inspected certified Batch #${batch.batchNumber} on your website Digital Lab Inspector:\n\n` +
    `🔬 *CERTIFIED BATCH INQUIRY*\n` +
    `• Product: ${batch.commodity}\n` +
    `• Lot Number: #${batch.batchNumber}\n` +
    `• HPLC Aflatoxin Total: ${batch.aflatoxinTotal} (${batch.aflatoxinMargin})\n` +
    `• Certified Moisture: ${batch.moisture}\n` +
    `• Fortification Standard: ${batch.standard}\n` +
    `• Production Atelier: ${batch.millingFacility}\n\n` +
    `Please confirm bulk tonnage availability, current ex-mill wholesale pricing, and scheduled dispatch slot for this verified lot.`;

  const waUrl = `https://wa.me/256744135549?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/* ==========================================================================
   EAST AFRICA REGIONAL TRADE & LOGISTICS CORRIDORS ENGINE
   ========================================================================== */
const logisticsCorridorsData = [
  {
    monogram: 'CORRIDOR 01 • NATIONAL GRAIN GRID',
    title: 'Uganda Domestic Strategic Sourcing & Distribution Grid',
    status: 'ACTIVE DAILY DISPATCH • KAMPALA FLEET HQ',
    hubs: 'Kampala • Jinja • Masindi • Gulu • Mbarara • Mbale',
    transit: 'Same-Day to 24 Hours Delivery',
    capacity: '10 MT Rigid to 32 MT Semi-Trailers',
    route: 'Central routing radiates from our Kampala milling ateliers, connecting directly with grain aggregation terminals in the Masindi & Bunyoro maize corridors, northern supply lines in Gulu, and eastern industrial markets in Jinja and Mbale.',
    protocol: 'Tamper-evident, hermetic UV-barrier liners prevent moisture absorption in transit. Every outbound truck carries certified lot analysis testing verifying ≤12.5% moisture and 0.0 ppb aflatoxin compliance.',
    waypoints: ['Kampala Central Mill', 'Certified Weighbridge & Seal', 'Regional Highway Fleet', 'Direct Client Depot']
  },
  {
    monogram: 'CORRIDOR 02 • EASTERN COMMERCIAL ARTERY',
    title: 'Uganda - Kenya Cross-Border Trade Corridor',
    status: 'ACTIVE DAILY CONVOYS • CUSTOMS PRE-CLEARED',
    hubs: 'Malaba & Busia Gateways → Kisumu • Eldoret • Nairobi',
    transit: '24 to 48 Hours to Kisumu / Nairobi',
    capacity: '30 - 32 Metric Ton Sealed Semi-Trailers',
    route: 'Direct transit along the Northern Corridor from Kampala through Tororo to the Malaba and Busia one-stop border posts (OSBP), supplying Kenya’s major millers, animal feed manufacturers, and food relief distribution centers in Kisumu, Eldoret, and Nairobi.',
    protocol: 'EAC Single Customs Territory (SCT) pre-clearance with digital COMESA certificates of origin, phytosanitary certificates, and bilateral UNBS/KEBS conformity documentation.',
    waypoints: ['Kampala Atelier', 'Tororo Weighbridge', 'Malaba / Busia OSBP', 'Kenyan Distribution Depot']
  },
  {
    monogram: 'CORRIDOR 03 • HUMANITARIAN & COMMERCIAL CORRIDOR',
    title: 'Uganda - South Sudan Northern Trade Artery',
    status: 'ACTIVE WEEKLY CONVOYS • RELIEF FAST-TRACK',
    hubs: 'Elegu / Nimule Gateway → Juba • Torit • Greater Equatoria',
    transit: '36 to 60 Hours to Juba Terminals',
    capacity: '28 - 32 Metric Ton Heavy Fleet Dispatches',
    route: 'Originating from northern aggregation buffer depots in Gulu and central Kampala facilities, moving along the paved Gulu-Nimule corridor into Juba for commercial wholesalers and humanitarian emergency food rations.',
    protocol: 'Fortified super-grade posho packaging in heavy-duty woven polypropylene bags with moisture-barrier inner liners for rugged long-distance transport. Complete humanitarian tender traceability.',
    waypoints: ['Northern Grain Hub (Gulu)', 'Elegu / Nimule Border', 'Customs Fast-Track', 'Juba Central Depots']
  },
  {
    monogram: 'CORRIDOR 04 • SOUTHERN HIGHLANDS ARTERY',
    title: 'Uganda - Rwanda Southern Trade Corridor',
    status: 'ACTIVE REGULAR DISPATCH • CERTIFIED CONFORMITY',
    hubs: 'Katuna / Gatuna Gateway → Kigali Logistics Park • Musanze',
    transit: '24 to 36 Hours to Kigali',
    capacity: '25 - 30 Metric Ton Sealed Fleet',
    route: 'Southbound distribution through Masaka and Mbarara, crossing the Katuna / Gatuna One Stop Border Post directly into Kigali for commercial bakeries, wholesale distribution, and specialized institutions.',
    protocol: 'Rwanda Standards Board (RSB) and UNBS mutual recognition conformity. Strict aflatoxin screening with zero-tolerance certification accompanying each manifest.',
    waypoints: ['Mbarara Transit Station', 'Katuna / Gatuna OSBP', 'Kigali Bonded Terminal', 'End Consumer Logistics']
  },
  {
    monogram: 'CORRIDOR 05 • GREAT LAKES WESTERN ARTERY',
    title: 'Uganda - Democratic Republic of Congo (DRC) Corridor',
    status: 'ACTIVE SCHEDULED DISPATCH • SECURED CONVOYS',
    hubs: 'Mpondwe & Bunagana Gateways → Goma • Beni • Butembo',
    transit: '48 to 72 Hours to Eastern DRC Hubs',
    capacity: '20 - 30 Metric Ton Heavy Transport Fleet',
    route: 'Western routing through Kasese and Fort Portal to the Mpondwe border gateway serving North Kivu (Beni, Butembo), and south through Kisoro to Bunagana serving Goma.',
    protocol: 'Export customs compliance, French-labelled product documentation upon request, sealed cargo tracking, and direct delivery to cross-border trading partners.',
    waypoints: ['Western Transit Depot', 'Mpondwe / Bunagana Border', 'Cross-Border Clearance', 'Goma / Beni Depots']
  }
];

function openLogisticsModal() {
  const modal = document.getElementById('logisticsModalDialog');
  const overlay = document.getElementById('logisticsModalOverlay');
  if (!modal || !overlay) return;

  isLogisticsModalOpen = true;
  modal.classList.add('open');
  overlay.classList.add('open');
  playAcousticChime('transition');
  switchCorridor(0);
}

function closeLogisticsModal() {
  const modal = document.getElementById('logisticsModalDialog');
  const overlay = document.getElementById('logisticsModalOverlay');
  if (!modal || !overlay) return;

  isLogisticsModalOpen = false;
  modal.classList.remove('open');
  overlay.classList.remove('open');
  playAcousticChime('click');
}

function switchCorridor(index) {
  playAcousticChime('click');
  const tabs = document.querySelectorAll('.corridor-tab');
  tabs.forEach((t, i) => {
    if (i === index) t.classList.add('active');
    else t.classList.remove('active');
  });

  const c = logisticsCorridorsData[index];
  if (!c) return;

  const mEl = document.getElementById('corridorMonogram');
  const tEl = document.getElementById('corridorTitle');
  const sEl = document.getElementById('corridorStatus');
  const hEl = document.getElementById('corridorHubs');
  const trEl = document.getElementById('corridorTransit');
  const capEl = document.getElementById('corridorCapacity');
  const rEl = document.getElementById('corridorRouteDesc');
  const pEl = document.getElementById('corridorProtocolDesc');
  const wEl = document.getElementById('corridorWaypoints');

  if (mEl) mEl.textContent = c.monogram;
  if (tEl) tEl.textContent = c.title;
  if (sEl) sEl.textContent = c.status;
  if (hEl) hEl.textContent = c.hubs;
  if (trEl) trEl.textContent = c.transit;
  if (capEl) capEl.textContent = c.capacity;
  if (rEl) rEl.textContent = c.route;
  if (pEl) pEl.textContent = c.protocol;

  if (wEl && c.waypoints) {
    wEl.innerHTML = c.waypoints.map((step, idx) => {
      const isFinal = idx === c.waypoints.length - 1;
      const stepHtml = `<div class="c-step ${isFinal ? 'final' : ''}"><span class="cs-dot"></span><span>${step}</span></div>`;
      if (!isFinal) {
        return stepHtml + `<div class="c-step-line"></div>`;
      }
      return stepHtml;
    }).join('');
  }
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
    document.body.classList.add('ai-drawer-active');
    playAcousticChime('transition');
    setTimeout(() => {
      const input = document.getElementById('aiUserInput');
      if (input) input.focus();
    }, 300);
  } else {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('ai-drawer-active');
    playAcousticChime('click');
  }
}

// Ensure wheel events inside the AI drawer never bubble or trigger full-page act navigation
const aiDrawerEl = document.getElementById('aiConciergeDrawer');
if (aiDrawerEl) {
  aiDrawerEl.addEventListener('wheel', (e) => {
    e.stopPropagation();
  }, { passive: true });
}

const aiStageEl = document.getElementById('aiMessagesStage');
if (aiStageEl) {
  aiStageEl.addEventListener('wheel', (e) => {
    e.stopPropagation();
  }, { passive: true });
}

// Close drawer or modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (isMarketBoardOpen) closeMarketBoardModal();
    if (isLogisticsModalOpen) closeLogisticsModal();
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
          <li><strong>Location:</strong> PLOT 1957, Kitukutwe, Kira Division, Uganda &bull; Sourcing from Masindi, Acholi, and Eastern Highlands.</li>
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

/* ==========================================================================
   MOBILE INTERSECTION OBSERVER FOR NATURAL SCROLL TRACKING
   ========================================================================== */
function initMobileScrollObserver() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    if (window.innerWidth > 1024 || isActTransitioning) return;

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const actIndex = parseInt(entry.target.getAttribute('data-act-index'));
        if (!isNaN(actIndex) && actIndex !== currentAct) {
          currentAct = actIndex;
          
          // Sync background scenic photo
          const scenes = document.querySelectorAll('.scenic-slide');
          scenes.forEach(s => {
            const sIdx = parseInt(s.getAttribute('data-scene'));
            if (sIdx === actIndex) s.classList.add('active');
            else s.classList.remove('active');
          });

          // Sync tabs & mobile nav
          const tabs = document.querySelectorAll('.act-tab');
          tabs.forEach(t => {
            const tIdx = parseInt(t.getAttribute('data-act'));
            if (tIdx === actIndex) t.classList.add('active');
            else t.classList.remove('active');
          });

          const mndBtns = document.querySelectorAll('.mnd-act-btn');
          mndBtns.forEach(btn => {
            const bIdx = parseInt(btn.getAttribute('data-act'));
            if (bIdx === actIndex) btn.classList.add('active');
            else btn.classList.remove('active');
          });

          updateCapsuleDock();
        }
      }
    });
  }, {
    root: null,
    rootMargin: '-20% 0px -40% 0px',
    threshold: 0.1
  });

  document.querySelectorAll('.editorial-act').forEach(act => {
    observer.observe(act);
  });
}

// Initial Boot
calculateConciergeYield();
renderTickerRibbon();
updateCapsuleDock();
initDraggableAiTrigger();
initMobileScrollObserver();
goToAct(0);


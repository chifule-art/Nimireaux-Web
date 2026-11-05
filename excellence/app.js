/* ==========================================================================
   NIMIREAUX UGANDA LIMITED • EXCELLENCE EDITION
   FLUID VERTICAL SCROLL INTERACTION & TELEMETRY ENGINE
   ========================================================================== */

let soundActive = true;
let audioContext = null;

/* ==========================================================================
   SCROLL PROGRESS BAR & NAVBAR STATE
   ========================================================================== */
const progressBar = document.getElementById('scrollProgressBar');
const navbar = document.getElementById('exNavbar');
const backToTopBtn = document.getElementById('backToTopBtn');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (progressBar) {
    progressBar.style.width = `${scrollPercent}%`;
  }

  // Sticky Navbar Glass Effect
  if (navbar) {
    if (scrollTop > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Back to Top Button Visibility
  if (backToTopBtn) {
    if (scrollTop > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
}, { passive: true });

/* ==========================================================================
   INTERSECTION OBSERVER (Scroll Fade-Up Animations)
   ========================================================================== */
const animateElements = document.querySelectorAll('.animate-on-scroll');
if ('IntersectionObserver' in window) {
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  animateElements.forEach(el => scrollObserver.observe(el));
} else {
  animateElements.forEach(el => el.classList.add('in-view'));
}

/* ==========================================================================
   PRODUCT NUTRITION SHEET SWITCHER
   ========================================================================== */
const productsDirectory = [
  {
    grade: 'GRADE 1 • UNBS CERTIFIED',
    title: 'Superfine Posho Flour (Grade 1)',
    desc: 'Precision-extracted pure white maize flour enriched with Vitamin A, Zinc, Iron, and Folate.',
    energy: '362 kcal (1,514 kJ)',
    carbs: '78.4 g',
    protein: '8.9 g',
    fiber: '2.1 g',
    vitA: '1.8 mg / kg',
    zinc: '32.0 mg / kg'
  },
  {
    grade: 'WHOLE GRAIN • HIGH FIBER',
    title: 'Whole Grain Maize Flour (Brown)',
    desc: 'Slow-milled to retain the natural aleurone and nutritious germ layers, delivering high complex fiber.',
    energy: '348 kcal (1,455 kJ)',
    carbs: '72.1 g',
    protein: '10.2 g',
    fiber: '6.8 g',
    vitA: '1.5 mg / kg',
    zinc: '38.0 mg / kg'
  },
  {
    grade: 'HIGH GLUTEN INDEX',
    title: 'Baker\'s Special Hard Wheat Flour',
    desc: 'Milled from high-altitude hard wheat cultivars, engineered for commercial ovens and pastry elasticity.',
    energy: '370 kcal (1,548 kJ)',
    carbs: '74.5 g',
    protein: '12.8 g',
    fiber: '3.4 g',
    vitA: '1.2 mg / kg',
    zinc: '28.0 mg / kg'
  },
  {
    grade: 'MULTI-GRAIN ENRICHED',
    title: 'Nutri-Composite Porridge Flour',
    desc: 'Synergistic roasted formulation of white maize, finger millet, red sorghum, and soya for peak childhood vitality.',
    energy: '385 kcal (1,610 kJ)',
    carbs: '69.0 g',
    protein: '14.6 g',
    fiber: '5.2 g',
    vitA: '2.2 mg / kg',
    zinc: '45.0 mg / kg'
  }
];

function switchProductSpec(index) {
  playUiChime();

  const cards = document.querySelectorAll('.product-pick-card');
  cards.forEach(c => c.classList.remove('active'));
  if (cards[index]) cards[index].classList.add('active');

  const p = productsDirectory[index];
  if (!p) return;

  const gEl = document.getElementById('labelGrade');
  const tEl = document.getElementById('labelTitle');
  const dEl = document.getElementById('labelDesc');
  const eEl = document.getElementById('valEnergy');
  const cEl = document.getElementById('valCarbs');
  const prEl = document.getElementById('valProtein');
  const fEl = document.getElementById('valFiber');
  const vaEl = document.getElementById('valVitA');
  const zEl = document.getElementById('valZinc');

  if (gEl) gEl.textContent = p.grade;
  if (tEl) tEl.textContent = p.title;
  if (dEl) dEl.textContent = p.desc;
  if (eEl) eEl.textContent = p.energy;
  if (cEl) cEl.textContent = p.carbs;
  if (prEl) prEl.textContent = p.protein;
  if (fEl) fEl.textContent = p.fiber;
  if (vaEl) vaEl.textContent = p.vitA;
  if (zEl) zEl.textContent = p.zinc;
}

function orderProductFromLabel() {
  const currentTitle = document.getElementById('labelTitle')?.textContent || 'Superfine Posho Flour';
  const notesArea = document.getElementById('rfqProjectNotes');
  if (notesArea) {
    notesArea.value = `Wholesale inquiry regarding ${currentTitle}. Requesting commercial volume pricing (MOQ), bag denominations, and delivery schedule.`;
  }
}

/* ==========================================================================
   REAL-TIME INDUSTRIAL BATCH YIELD CALCULATOR
   ========================================================================== */
function updateLiveSlider(val) {
  const display = document.getElementById('calcTonnageDisplay');
  if (display) display.textContent = `${val} METRIC TONS`;
  runLiveCalculation();
}

function runLiveCalculation() {
  const slider = document.getElementById('calcSlider');
  if (!slider) return;

  const mt = parseFloat(slider.value) || 100;
  const gradeRadio = document.querySelector('input[name="calcGrade"]:checked');
  const isWhole = gradeRadio && gradeRadio.value === 'whole';

  const extractionRate = isWhole ? 0.88 : 0.72;
  const flourMT = mt * extractionRate;
  const branMT = mt * (1 - extractionRate);
  const bags = Math.round((flourMT * 1000) / 50);
  const hours = (mt / 15).toFixed(1); // 15 MT/hr throughput

  const fNum = document.getElementById('resFlourNum');
  const bNum = document.getElementById('resBagsNum');
  const brNum = document.getElementById('resBranNum');
  const tNum = document.getElementById('resTimeNum');

  const fBar = document.getElementById('resFlourBar');
  const bBar = document.getElementById('resBagsBar');
  const brBar = document.getElementById('resBranBar');

  if (fNum) fNum.textContent = flourMT.toFixed(1);
  if (bNum) bNum.textContent = bags.toLocaleString();
  if (brNum) brNum.textContent = branMT.toFixed(1);
  if (tNum) tNum.textContent = hours;

  if (fBar) fBar.style.width = `${Math.round(extractionRate * 100)}%`;
  if (bBar) bBar.style.width = `${Math.round(extractionRate * 100)}%`;
  if (brBar) brBar.style.width = `${Math.round((1 - extractionRate) * 100)}%`;
}

function transferYieldToRfq() {
  playUiChime();
  const slider = document.getElementById('calcSlider');
  const mt = slider ? slider.value : '100';
  const grain = document.querySelector('input[name="calcGrain"]:checked')?.value || 'white_maize';

  const volField = document.getElementById('rfqBatchVolume');
  const notesField = document.getElementById('rfqProjectNotes');

  if (volField) volField.value = `${mt} Metric Tons (${grain.replace('_', ' ').toUpperCase()})`;
  if (notesField) {
    notesField.value = `Industrial milling batch estimate: ${mt} MT of ${grain.replace('_', ' ')}. Requesting official toll processing or bulk flour supply quotation.`;
  }

  // Smooth scroll to RFQ form
  const rfqAnchor = document.getElementById('rfq');
  if (rfqAnchor) {
    rfqAnchor.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ==========================================================================
   OFFICIAL RFQ FORM SUBMISSION
   ========================================================================== */
function handleExcellenceSubmit(e) {
  e.preventDefault();
  playUiChime();

  const btn = document.getElementById('rfqSubmitBtn');
  const toast = document.getElementById('rfqFeedbackToast');
  const form = document.getElementById('officialRfqForm');

  if (btn) {
    btn.innerHTML = '<span>Transmitting Official Inquiry...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;
  }

  setTimeout(() => {
    if (btn) {
      btn.innerHTML = '<span>Inquiry Transmitted Successfully</span> <i class="fa-solid fa-circle-check"></i>';
      btn.style.background = '#155d32';
    }
    if (toast) {
      toast.style.display = 'flex';
      toast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    form.reset();
  }, 850);
}

/* ==========================================================================
   AMBIENT FLOATING GOLDEN PARTICLES (Hero Canvas)
   ========================================================================== */
const heroCanvas = document.getElementById('heroParticles');
const hCtx = heroCanvas ? heroCanvas.getContext('2d') : null;

let heroMotes = [];
const moteCount = 50;

function setupHeroCanvas() {
  if (!heroCanvas) return;
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroCanvas.width = heroSection.clientWidth;
    heroCanvas.height = heroSection.clientHeight;
  }
}

window.addEventListener('resize', setupHeroCanvas);
setupHeroCanvas();

class HeroMote {
  constructor() {
    this.init();
  }
  init() {
    this.x = Math.random() * (heroCanvas ? heroCanvas.width : 1200);
    this.y = Math.random() * (heroCanvas ? heroCanvas.height : 800);
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -Math.random() * 0.45 - 0.15;
    this.radius = Math.random() * 2 + 0.8;
    this.alpha = Math.random() * 0.55 + 0.2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < 0) this.y = heroCanvas.height;
    if (this.x < 0) this.x = heroCanvas.width;
    if (this.x > heroCanvas.width) this.x = 0;
  }
  draw() {
    if (!hCtx) return;
    hCtx.beginPath();
    hCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    hCtx.fillStyle = `rgba(223, 177, 91, ${this.alpha})`;
    hCtx.shadowBlur = 8;
    hCtx.shadowColor = '#dfb15b';
    hCtx.fill();
    hCtx.shadowBlur = 0;
  }
}

if (heroCanvas && hCtx) {
  for (let i = 0; i < moteCount; i++) {
    heroMotes.push(new HeroMote());
  }

  function loopHeroParticles() {
    hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    for (let i = 0; i < heroMotes.length; i++) {
      heroMotes[i].update();
      heroMotes[i].draw();
    }
    requestAnimationFrame(loopHeroParticles);
  }
  loopHeroParticles();
}

/* ==========================================================================
   WEB AUDIO ACOUSTIC FEEDBACK
   ========================================================================== */
function initAudio() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) audioContext = new AudioCtx();
  }
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

function playUiChime() {
  if (!soundActive) return;
  try {
    initAudio();
    if (!audioContext) return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(784, now); // G5
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.08); // C6
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.start(now);
    osc.stop(now + 0.12);
  } catch (err) {}
}

const soundBtn = document.getElementById('soundBtn');
if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    soundActive = !soundActive;
    const icon = document.getElementById('soundIcon');
    if (soundActive) {
      if (icon) icon.className = 'fa-solid fa-volume-high';
      playUiChime();
    } else {
      if (icon) icon.className = 'fa-solid fa-volume-xmark';
    }
  });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
if (mobileMenuBtn && navMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = navMenu.style.display === 'flex';
    navMenu.style.display = isOpen ? 'none' : 'flex';
    if (!isOpen) {
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '100%';
      navMenu.style.left = '0';
      navMenu.style.width = '100%';
      navMenu.style.background = '#ffffff';
      navMenu.style.padding = '20px';
      navMenu.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    }
  });
}

// Initial Boot
runLiveCalculation();

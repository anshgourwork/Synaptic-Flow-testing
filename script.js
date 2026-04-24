/* ============================================================
   SYNAPTIC FLOW — JavaScript
   Scroll Reveals, Nav Behavior, Mobile Menu
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Scroll Reveal with Intersection Observer ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // --- Navbar: scroll detection + light-to-dark transition ---
  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');

  function updateNav() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    if (heroBottom <= 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // --- Mobile Navigation Toggle ---
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Smooth scroll for anchor links (Native) ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Navigation active section detection & Theme Switcher (Desktop + Mobile) ---
  const sections = ['hero', 'overview', 'about', 'logo-cloud', 'testimonials', 'services', 'approach', 'solutions'];
  const darkSections = ['overview', 'logo-cloud', 'services', 'solutions'];
  const navLinkEls = document.querySelectorAll('.nav-link');
  const navGlassIndicator = document.getElementById('navGlassIndicator');
  let currentActiveLink = null;
  let isHovering = false;

  function moveIndicatorTo(linkEl) {
    if (!linkEl || !navGlassIndicator || window.innerWidth <= 768) return;
    const navLinksContainer = document.getElementById('navLinks');
    const containerRect = navLinksContainer.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();
    const left = linkRect.left - containerRect.left;
    const width = linkRect.width;

    navGlassIndicator.style.left = left + 'px';
    navGlassIndicator.style.width = width + 'px';
    navGlassIndicator.classList.add('active');
  }

  function updateActiveSection() {
    if (isHovering) return;

    const scrollY = window.scrollY + 100;
    let activeSection = 'hero';

    for (const id of sections) {
      const section = document.getElementById(id);
      if (section) {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
          activeSection = id;
          break;
        }
      }
    }

    // Update Nav Theme (Desktop + Mobile)
    if (darkSections.includes(activeSection)) {
      nav.classList.add('nav-over-dark');
      nav.classList.remove('nav-over-light');
    } else {
      nav.classList.add('nav-over-light');
      nav.classList.remove('nav-over-dark');
    }

    // Update active link styling
    navLinkEls.forEach((link) => {
      const linkSection = link.dataset.section;
      let isActive = (linkSection === activeSection);
      
      // Grouping sub-sections to their parent nav links
      if (activeSection === 'overview' && linkSection === 'hero') isActive = true;
      if (activeSection === 'logo-cloud' && linkSection === 'about') isActive = true;

      if (isActive) {
        link.classList.add('glass-active');
        currentActiveLink = link;
      } else {
        link.classList.remove('glass-active');
      }
    });

    // Move indicator to active section
    if (currentActiveLink && window.innerWidth > 768) {
      moveIndicatorTo(currentActiveLink);
    }
  }

  // Liquid Glass Nav Indicator Hover logic (Desktop Only)
  if (window.innerWidth > 768) {
    const navLinksContainer = document.getElementById('navLinks');
    navLinkEls.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        isHovering = true;
        moveIndicatorTo(link);
      });
    });

    navLinksContainer.addEventListener('mouseleave', () => {
      isHovering = false;
      if (currentActiveLink) {
        moveIndicatorTo(currentActiveLink);
      } else {
        if (navGlassIndicator) navGlassIndicator.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
  // Initial position
  setTimeout(() => {
    updateActiveSection();
  }, 100);

  // --- Dynamic year in copyright ---
  const yearEl = document.querySelector('.footer-copy');
  if (yearEl) {
    const year = new Date().getFullYear();
    yearEl.textContent = yearEl.textContent.replace('2026', year);
  }

  // --- Subheading Text & Scramble ---
  const RANDOM_CHARS = "_!X$0-+*#";
  function getRandomChar(prevChar) {
    let char;
    do { char = RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)]; }
    while (char === prevChar);
    return char;
  }

  function initSpecialText(elementId, text, speed = 25, delay = 0.8) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let animationStep = 0;
    let currentPhase = 'phase1';
    let intervalId = null;

    const runPhase1 = () => {
      const maxSteps = text.length * 2;
      const currentLength = Math.min(animationStep + 1, text.length);
      let chars = "";
      for (let i = 0; i < currentLength; i++) {
        if (text[i] === "\n") {
          chars += "\n";
        } else {
          chars += getRandomChar(chars[i - 1]);
        }
      }
      for (let i = currentLength; i < text.length; i++) {
        chars += (text[i] === "\n") ? "\n" : "\u00A0"; 
      }
      el.textContent = chars;
      if (animationStep < maxSteps - 1) {
        animationStep++;
      } else {
        currentPhase = 'phase2';
        animationStep = 0;
      }
    };

    const runPhase2 = () => {
      const revealedCount = Math.floor(animationStep / 2);
      let chars = "";
      for (let i = 0; i < revealedCount && i < text.length; i++) {
        chars += text[i];
      }
      if (revealedCount < text.length) {
        if (text[revealedCount] === "\n") {
          chars += "\n";
        } else {
          chars += (animationStep % 2 === 0) ? "_" : getRandomChar();
        }
      }
      for (let i = chars.length; i < text.length; i++) {
        if (text[i] === "\n") {
          chars += "\n";
        } else {
          chars += getRandomChar();
        }
      }
      el.textContent = chars;
      if (animationStep < text.length * 2 - 1) {
        animationStep++;
      } else {
        el.textContent = text;
        clearInterval(intervalId);
        el.classList.add('reveal-done', 'shiny-text');
      }
    };

    const startAnimation = () => {
      intervalId = setInterval(() => {
        if (currentPhase === 'phase1') runPhase1();
        else runPhase2();
      }, speed);
    };

    setTimeout(startAnimation, delay * 1000);
  }

  const subheadingText = "Intelligence that runs your business\nbehind the scenes";
  const el = document.getElementById('specialTextSubheading');
  if (el) el.textContent = subheadingText;

  // --- CTA Button Sticky Behavior (Desktop Only) ---
  const floatingCta = document.getElementById('floatingCtaBar');
  function updateCtaPosition() {
    if (!floatingCta || !hero || window.innerWidth < 1025) return;
    const heroHeight = hero.offsetHeight;
    const scrollY = window.scrollY;
    
    // Switch to fixed position when scrolled ~40% of hero
    if (scrollY > heroHeight * 0.4) {
      floatingCta.classList.add('fixed');
    } else {
      floatingCta.classList.remove('fixed');
    }
  }
  window.addEventListener('scroll', updateCtaPosition, { passive: true });
  updateCtaPosition();

  // --- LightPillar Effect Implementation (Vanilla Adaptation) ---
  class LightPillarEffect {
    constructor(options = {}) {
      this.container = document.getElementById(options.containerId || 'lightPillarContainer');
      if (!this.container || window.innerWidth < 1025) return;

      this.topColor = options.topColor || '#d6d3e1';
      this.bottomColor = options.bottomColor || '#000000';
      this.intensity = options.intensity || 1.2;
      this.rotationSpeed = options.rotationSpeed || 0.4;
      this.interactive = options.interactive || false;
      this.glowAmount = options.glowAmount || 0.005;
      this.pillarWidth = options.pillarWidth || 2.8;
      this.pillarHeight = options.pillarHeight || 0.4;
      this.noiseIntensity = options.noiseIntensity || 0.5;
      this.pillarRotation = options.pillarRotation || 0;
      this.quality = options.quality || 'high';

      this.init();
    }

    init() {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;

      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      let effectiveQuality = isMobile ? 'low' : this.quality;

      const qualitySettings = {
        low: { iterations: 24, waveIterations: 1, pixelRatio: 0.5, precision: 'mediump', stepMultiplier: 1.5 },
        medium: { iterations: 40, waveIterations: 2, pixelRatio: 0.65, precision: 'mediump', stepMultiplier: 1.2 },
        high: {
          iterations: 80,
          waveIterations: 4,
          pixelRatio: Math.min(window.devicePixelRatio, 2),
          precision: 'highp',
          stepMultiplier: 1.0
        }
      };

      const settings = qualitySettings[effectiveQuality] || qualitySettings.medium;

      try {
        this.renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: true,
          powerPreference: effectiveQuality === 'high' ? 'high-performance' : 'low-power',
          precision: settings.precision,
          stencil: false,
          depth: false
        });
      } catch (e) { return; }

      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(settings.pixelRatio);
      this.container.appendChild(this.renderer.domElement);

      const parseColor = hex => {
        const color = new THREE.Color(hex);
        return new THREE.Vector3(color.r, color.g, color.b);
      };

      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `;

      const fragmentShader = `
        precision ${settings.precision} float;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        uniform vec3 uTopColor;
        uniform vec3 uBottomColor;
        uniform float uIntensity;
        uniform bool uInteractive;
        uniform float uGlowAmount;
        uniform float uPillarWidth;
        uniform float uPillarHeight;
        uniform float uNoiseIntensity;
        uniform float uRotCos;
        uniform float uRotSin;
        uniform float uPillarRotCos;
        uniform float uPillarRotSin;
        uniform float uWaveSin;
        uniform float uWaveCos;
        varying vec2 vUv;

        const float STEP_MULT = ${settings.stepMultiplier.toFixed(1)};
        const int MAX_ITER = ${settings.iterations};
        const int WAVE_ITER = ${settings.waveIterations};

        void main() {
          vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
          uv = vec2(uPillarRotCos * uv.x - uPillarRotSin * uv.y, uPillarRotSin * uv.x + uPillarRotCos * uv.y);
          vec3 ro = vec3(0.0, 0.0, -10.0);
          vec3 rd = normalize(vec3(uv, 1.0));
          float rotC = uRotCos;
          float rotS = uRotSin;
          vec3 col = vec3(0.0);
          float t = 0.1;
          for(int i = 0; i < MAX_ITER; i++) {
            vec3 p = ro + rd * t;
            p.xz = vec2(rotC * p.x - rotS * p.z, rotS * p.x + rotC * p.z);
            vec3 q = p;
            q.y = p.y * uPillarHeight + uTime;
            float freq = 1.0;
            float amp = 1.0;
            for(int j = 0; j < WAVE_ITER; j++) {
              q.xz = vec2(uWaveCos * q.x - uWaveSin * q.z, uWaveSin * q.x + uWaveCos * q.z);
              q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
              freq *= 2.0;
              amp *= 0.5;
            }
            float d = length(cos(q.xz)) - 0.2;
            float bound = length(p.xz) - uPillarWidth;
            float k = 4.0;
            float h = max(k - abs(d - bound), 0.0);
            d = max(d, bound) + h * h * 0.0625 / k;
            d = abs(d) * 0.17 + 0.03; // Slightly tighter than before, but not harsh
            float grad = clamp((p.y + 15.0) / 30.0, 0.0, 1.0);
            grad = pow(grad, 2.0); 
            col += mix(uBottomColor, uTopColor, grad) / d;
            t += d * STEP_MULT;
            if(t > 50.0) break;
          }
          float widthNorm = uPillarWidth / 3.0;
          col = tanh(col * uGlowAmount / widthNorm);
          col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;
          gl_FragColor = vec4(col * uIntensity, 1.0);
        }
      `;

      const pillarRotRad = (this.pillarRotation * Math.PI) / 180;
      this.material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(width, height) },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uTopColor: { value: parseColor(this.topColor) },
          uBottomColor: { value: parseColor(this.bottomColor) },
          uIntensity: { value: this.intensity },
          uInteractive: { value: this.interactive },
          uGlowAmount: { value: this.glowAmount },
          uPillarWidth: { value: this.pillarWidth },
          uPillarHeight: { value: this.pillarHeight },
          uNoiseIntensity: { value: this.noiseIntensity },
          uRotCos: { value: 1.0 },
          uRotSin: { value: 0.0 },
          uPillarRotCos: { value: Math.cos(pillarRotRad) },
          uPillarRotSin: { value: Math.sin(pillarRotRad) },
          uWaveSin: { value: Math.sin(0.4) },
          uWaveCos: { value: Math.cos(0.4) }
        },
        transparent: true,
        depthWrite: false,
        depthTest: false
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, this.material);
      this.scene.add(mesh);

      this.time = 0;
      this.lastTime = performance.now();
      this.animate();

      window.addEventListener('resize', () => {
        if (!this.container) return;
        const newWidth = this.container.clientWidth;
        const newHeight = this.container.clientHeight;
        this.renderer.setSize(newWidth, newHeight);
        this.material.uniforms.uResolution.value.set(newWidth, newHeight);
      });
    }

    animate() {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;

      this.time += 0.01 * this.rotationSpeed;
      this.material.uniforms.uTime.value = this.time;
      this.material.uniforms.uRotCos.value = Math.cos(this.time * 0.3);
      this.material.uniforms.uRotSin.value = Math.sin(this.time * 0.3);
      
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame((t) => this.animate(t));
    }
  }

  // Initialize the Pillar Background
  new LightPillarEffect({
    topColor: '#d6d3e1',
    bottomColor: '#000000',
    intensity: 1.25,     
    rotationSpeed: 0.45, 
    pillarWidth: 3.0,    
    pillarRotation: 45,
    glowAmount: 0.004    
  });
});

/* ============================================================
   SCROLL-STACK ENGINE — Vanilla JS (Standard Scroll Version)
   Keeps the stacking effect but uses native browser scrolling behavior.
   ============================================================ */
(function initScrollStack() {
  if (window.innerWidth < 1025) return;

  const wrapper = document.getElementById('scrollStackWrapper');
  if (!wrapper) return;

  const CONFIG = {
    itemDistance: 100,
    itemScale: 0.03,
    itemStackDistance: 30,
    stackPosition: 0.20,
    scaleEndPosition: 0.10,
    baseScale: 0.85
  };

  const cards = Array.from(wrapper.querySelectorAll('.scroll-stack-card'));
  const endEl = wrapper.querySelector('.scroll-stack-end');
  if (!cards.length || !endEl) return;

  function getAbsoluteOffset(el) {
    let top = 0;
    while (el) {
      top += el.offsetTop || 0;
      el = el.offsetParent;
    }
    return top;
  }

  let cardData = [];
  let endTopInitial = 0;

  function calculatePositions() {
    cardData = cards.map((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = CONFIG.itemDistance + 'px';
      card.style.willChange = 'transform';
      card.style.transformOrigin = 'top center';
      return {
        el: card,
        initialTop: getAbsoluteOffset(card)
      };
    });
    endTopInitial = getAbsoluteOffset(endEl);
  }

  calculatePositions();

  const lastTransforms = new Map();

  function updateCardTransforms() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const vh = window.innerHeight;
    const stackPosPx = CONFIG.stackPosition * vh;
    const scaleEndPx = CONFIG.scaleEndPosition * vh;
    const endTop = endTopInitial;

    cardData.forEach((data, i) => {
      const cardTop = data.initialTop;
      const triggerStart = cardTop - stackPosPx - CONFIG.itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPx;
      const pinStart = triggerStart;
      const pinEnd = endTop - vh / 1.5;

      let scaleProgress = 0;
      if (scrollTop > triggerStart) {
        scaleProgress = Math.min(1, (scrollTop - triggerStart) / (triggerEnd - triggerStart || 1));
      }
      
      const targetScale = CONFIG.baseScale + i * CONFIG.itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);

      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPosPx + CONFIG.itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPosPx + CONFIG.itemStackDistance * i;
      }

      const transformStr = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;

      if (lastTransforms.get(i) !== transformStr) {
        data.el.style.transform = transformStr;
        lastTransforms.set(i, transformStr);
      }
    });
  }

  // Use passive scroll listener for native performance
  window.addEventListener('scroll', updateCardTransforms, { passive: true });

  // Recalculate on resize
  window.addEventListener('resize', () => {
    cards.forEach(c => c.style.transform = ''); // Reset for measurement
    calculatePositions();
    updateCardTransforms();
  });

  // Initial update
  updateCardTransforms();
})();

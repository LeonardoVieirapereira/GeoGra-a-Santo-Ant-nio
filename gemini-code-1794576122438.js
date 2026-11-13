/* GeoGraça — navegação, microinterações e motor atmosférico realista persistente */
(() => {
  'use strict';

  const ready = (fn) =>
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', fn, { once: true })
      : fn();

  ready(() => {
    /* 1. Menu mobile responsivo */
    const nav = document.querySelector('nav');
    const links = nav?.querySelector('.nav-links');
    const logo = nav?.querySelector('.logo');
    if (nav && links && logo && !nav.querySelector('.mobile-menu-toggle')) {
      const toggle = document.createElement('button');
      toggle.className = 'mobile-menu-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu de navegação');
      toggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i><span>Menu</span>';
      logo.insertAdjacentElement('afterend', toggle);

      const closeMenu = () => {
        links.classList.remove('mobile-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu de navegação');
        toggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i><span>Menu</span>';
      };

      toggle.addEventListener('click', () => {
        const open = !links.classList.contains('mobile-open');
        links.classList.toggle('mobile-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
        toggle.innerHTML = open
          ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i><span>Fechar</span>'
          : '<i class="fa-solid fa-bars" aria-hidden="true"></i><span>Menu</span>';
      });

      links.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
      window.addEventListener('resize', () => {
        if (window.innerWidth > 760) closeMenu();
      });
    }

    /* 2. Menu de três pontinhos no cabeçalho */
    const weatherToggle = document.getElementById('weatherToggleBtn') || document.getElementById('weatherToggle');
    const weatherDropdown = weatherToggle?.closest('.weather-dropdown');
    const weatherMenuEl = document.getElementById('weatherMenu') || weatherDropdown?.querySelector('.weather-menu');
    if (weatherToggle) {
      weatherToggle.setAttribute('aria-label', 'Abrir personalização visual');
      weatherToggle.setAttribute('aria-expanded', 'false');
      weatherToggle.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const isOpen = !!weatherMenuEl && !weatherMenuEl.classList.contains('show');
        weatherMenuEl?.classList.toggle('show', isOpen);
        weatherToggle.setAttribute('aria-expanded', String(isOpen));
      });
      weatherMenuEl?.addEventListener('click', (event) => event.stopPropagation());
      document.addEventListener('click', () => {
        weatherMenuEl?.classList.remove('show');
        weatherToggle.setAttribute('aria-expanded', 'false');
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          weatherMenuEl?.classList.remove('show');
          weatherToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* 3. Barra de progresso de leitura e botão voltar ao topo */
    const progress = document.createElement('div');
    progress.className = 'gg-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    const top = document.createElement('button');
    top.className = 'gg-top';
    top.type = 'button';
    top.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
    top.setAttribute('aria-label', 'Voltar ao topo');
    document.body.appendChild(top);

    top.addEventListener('click', () =>
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
    );

    let ticking = false;
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + '%';
      top.classList.toggle('visible', window.scrollY > 420);
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateScroll);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateScroll();

    /* 4. Revelação suave de cartões ao rolar */
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const candidates = document.querySelectorAll(
        '.section-title, .infra-grid > *, .geo-grid > *, .menu-grid > *, .dist-grid > *'
      );
      const observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('gg-in-view');
              observer.unobserve(entry.target);
            }
          }),
        { threshold: 0.1 }
      );
      const style = document.createElement('style');
      style.textContent =
        '.section-title,.infra-grid>*,.geo-grid>*,.menu-grid>*,.dist-grid>*{opacity:0;transform:translateY(12px);transition:opacity .5s ease,transform .5s ease}.gg-in-view{opacity:1!important;transform:translateY(0)!important}@media(prefers-reduced-motion:reduce){.section-title,.infra-grid>*,.geo-grid>*,.menu-grid>*,.dist-grid>*{opacity:1;transform:none}}';
      document.head.appendChild(style);
      candidates.forEach((el) => observer.observe(el));
    }

    document.querySelectorAll('a[target="_blank"]').forEach((a) => {
      const rel = new Set((a.rel || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      a.rel = [...rel].join(' ');
    });

    /* ==========================================================================
       5. SISTEMA DE TEMAS NATURAIS REALISTAS (CANVAS + ILUMINAÇÃO)
       ========================================================================== */
    const themes = {
      default: {
        label: 'Original',
        emoji: '🌿',
        primary: '#1a261d',
        accent: '#b8860b',
        bg: '#f8f7f2',
        effect: 'none',
        desc: 'Visual natural original',
      },
      sunny: {
        label: 'Ensolarado',
        emoji: '☀️',
        primary: '#754405',
        accent: '#e59a16',
        bg: '#fff9e8',
        effect: 'sun',
        desc: 'Raios solares e pólen na luz',
      },
      rain: {
        label: 'Chuva',
        emoji: '🌧️',
        primary: '#0e2e47',
        accent: '#2b82bd',
        bg: '#e7f1f8',
        effect: 'rain',
        desc: 'Chuva com vento e respingos',
      },
      storm: {
        label: 'Tempestade',
        emoji: '⛈️',
        primary: '#9ec5ff',
        accent: '#6ea8fe',
        bg: '#0d1524',
        effect: 'storm',
        desc: 'Relâmpagos reais e temporal',
      },
      sunset: {
        label: 'Pôr do sol',
        emoji: '🌅',
        primary: '#7a291c',
        accent: '#e0683e',
        bg: '#fff1e6',
        effect: 'sunset',
        desc: 'Luz dourada de fim de tarde',
      },
      snow: {
        label: 'Neve',
        emoji: '❄️',
        primary: '#124469',
        accent: '#3b9cd6',
        bg: '#eef7fc',
        effect: 'snow',
        desc: 'Flocos cristalinos e brisa fria',
      },
      aurora: {
        label: 'Aurora boreal',
        emoji: '🌌',
        primary: '#8cfce0',
        accent: '#28d7b2',
        bg: '#071c2b',
        effect: 'aurora',
        desc: 'Cortinas polares e céu estrelado',
      },
      volcano: {
        label: 'Vulcão',
        emoji: '🌋',
        primary: '#ff9d73',
        accent: '#f05b35',
        bg: '#1c1215',
        effect: 'volcano',
        desc: 'Fumaça, lava e brasas vivas',
      },
      wind: {
        label: 'Vento',
        emoji: '🌬️',
        primary: '#134f3c',
        accent: '#379e79',
        bg: '#eaf7f1',
        effect: 'leaves',
        desc: 'Rajadas de ar e folhas girando',
      },
      heat: {
        label: 'Calor solar',
        emoji: '🏜️',
        primary: '#7d4908',
        accent: '#d98b1c',
        bg: '#fdf3da',
        effect: 'heat',
        desc: 'Ondas de calor e poeira dourada',
      },
    };

    const intensities = {
      low: { label: 'Suave', factor: 0.55 },
      normal: { label: 'Realista', factor: 1.0 },
      high: { label: 'Intenso', factor: 1.45 },
    };

    const storageKey = 'geograca-nature-theme-v1';
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {};
    } catch (_) {
      saved = {};
    }

    let current = themes[saved.theme] ? saved.theme : 'default';
    let customColor = /^#[0-9a-f]{6}$/i.test(saved.customColor || '') ? saved.customColor : '';
    let currentIntensity = intensities[saved.intensity] ? saved.intensity : 'normal';

    document.getElementById('weather-overlay')?.remove();
    const skyBackdrop = document.createElement('div');
    skyBackdrop.className = 'gg-sky-backdrop';
    skyBackdrop.setAttribute('aria-hidden', 'true');
    document.body.prepend(skyBackdrop);

    const screenVignette = document.createElement('div');
    screenVignette.className = 'gg-screen-vignette';
    screenVignette.setAttribute('aria-hidden', 'true');
    document.body.appendChild(screenVignette);

    const canvas = document.createElement('canvas');
    canvas.id = 'ggAtmosphereCanvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const sim = {
      effect: 'none',
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: 1,
      particles: [],
      splashes: [],
      stars: [],
      gusts: [],
      lightning: null,
      nextLightningAt: 0,
      fadeAlpha: 0,
      pointer: { x: -9999, y: -9999, active: false },
      rafId: null,
      lastTime: performance.now(),
    };

    const resizeCanvas = () => {
      sim.width = window.innerWidth;
      sim.height = window.innerHeight;
      sim.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(sim.width * sim.dpr);
      canvas.height = Math.floor(sim.height * sim.dpr);
      ctx.setTransform(sim.dpr, 0, 0, sim.dpr, 0, 0);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    window.addEventListener(
      'pointermove',
      (e) => {
        sim.pointer.x = e.clientX;
        sim.pointer.y = e.clientY;
        sim.pointer.active = true;
      },
      { passive: true }
    );
    window.addEventListener('pointerleave', () => {
      sim.pointer.active = false;
    });

    const rand = (min, max) => min + Math.random() * (max - min);

    const buildScene = (effect) => {
      sim.effect = effect;
      sim.particles = [];
      sim.splashes = [];
      sim.stars = [];
      sim.gusts = [];
      sim.lightning = null;
      sim.fadeAlpha = 0;

      if (effect === 'none') {
        ctx.clearRect(0, 0, sim.width, sim.height);
        return;
      }

      const isMobile = sim.width < 680;
      const mult = (intensities[currentIntensity]?.factor || 1) * (isMobile ? 0.62 : 1);

      if (effect === 'rain' || effect === 'storm') {
        const isStorm = effect === 'storm';
        const count = Math.round((isStorm ? 150 : 95) * mult);
        for (let i = 0; i < count; i++) {
          const z = rand(0.3, 1.0);
          sim.particles.push({
            x: rand(-100, sim.width + 100),
            y: rand(-sim.height, sim.height),
            z,
            len: (isStorm ? 18 : 13) + z * (isStorm ? 22 : 15),
            speed: (isStorm ? 13 : 9) + z * (isStorm ? 11 : 8),
            wind: (isStorm ? -3.4 : -1.5) * z,
            alpha: 0.14 + z * (isStorm ? 0.34 : 0.28),
          });
        }
        if (isStorm) {
          sim.nextLightningAt = performance.now() + rand(1800, 4800);
        }
      } else if (effect === 'snow') {
        const count = Math.round(90 * mult);
        for (let i = 0; i < count; i++) {
          const z = rand(0.25, 1.0);
          sim.particles.push({
            x: rand(0, sim.width),
            y: rand(-sim.height, sim.height),
            z,
            r: 1.2 + z * 3.4,
            speedY: 0.55 + z * 1.55,
            driftFreq: rand(0.6, 1.8),
            driftAmp: 0.4 + z * 1.1,
            phase: rand(0, Math.PI * 2),
            rot: rand(0, Math.PI * 2),
            rotSpeed: rand(-0.02, 0.02),
            alpha: 0.35 + z * 0.55,
            crystal: z > 0.62 && Math.random() > 0.45,
          });
        }
      } else if (effect === 'sun' || effect === 'sunset') {
        const count = Math.round(48 * mult);
        for (let i = 0; i < count; i++) {
          sim.particles.push({
            x: rand(0, sim.width),
            y: rand(0, sim.height),
            r: rand(1.1, 3.2),
            vx: rand(-0.22, 0.28),
            vy: rand(-0.28, -0.05),
            phase: rand(0, Math.PI * 2),
            alpha: rand(0.2, 0.65),
          });
        }
      } else if (effect === 'aurora') {
        const starCount = Math.round(110 * mult);
        for (let i = 0; i < starCount; i++) {
          sim.stars.push({
            x: rand(0, sim.width),
            y: rand(0, sim.height * 0.65),
            r: rand(0.6, 1.9),
            phase: rand(0, Math.PI * 2),
          });
        }
      } else if (effect === 'volcano') {
        const emberCount = Math.round(68 * mult);
        for (let i = 0; i < emberCount; i++) {
          sim.particles.push({
            kind: 'ember',
            x: rand(sim.width * 0.1, sim.width * 0.9),
            y: rand(sim.height * 0.45, sim.height + 40),
            r: rand(1.2, 3.4),
            vy: rand(-2.4, -0.75),
            vx: rand(-0.4, 0.4),
            phase: rand(0, Math.PI * 2),
          });
        }
        const smokeCount = Math.round(16 * mult);
        for (let i = 0; i < smokeCount; i++) {
          sim.particles.push({
            kind: 'smoke',
            x: sim.width * 0.5 + rand(-90, 90),
            y: sim.height * 0.72 + rand(-30, 40),
            r: rand(35, 95),
            vy: rand(-0.55, -0.22),
            vx: rand(-0.35, 0.35),
            alpha: rand(0.06, 0.16),
          });
        }
      } else if (effect === 'leaves') {
        const leafPalette = ['#4b9e6e', '#6ab87e', '#8cc678', '#c9963b', '#3b7f5a'];
        const count = Math.round(28 * mult);
        for (let i = 0; i < count; i++) {
          const z = rand(0.4, 1.0);
          sim.particles.push({
            x: rand(-80, sim.width + 80),
            y: rand(-sim.height, sim.height),
            z,
            size: 6 + z * 8,
            vx: (1.4 + z * 2.2) * (Math.random() > 0.15 ? 1 : -0.6),
            vy: 0.7 + z * 1.3,
            rot: rand(0, Math.PI * 2),
            rotSpeed: rand(-0.045, 0.045),
            flipPhase: rand(0, Math.PI * 2),
            flipSpeed: rand(0.03, 0.08),
            swayPhase: rand(0, Math.PI * 2),
            color: leafPalette[Math.floor(Math.random() * leafPalette.length)],
            alpha: 0.55 + z * 0.38,
          });
        }
        for (let i = 0; i < 4; i++) {
          sim.gusts.push({
            x: rand(-sim.width, 0),
            y: rand(sim.height * 0.12, sim.height * 0.85),
            len: rand(180, 340),
            speed: rand(4.5, 8.5),
            amp: rand(12, 26),
            phase: rand(0, Math.PI * 2),
            alpha: rand(0.08, 0.18),
          });
        }
      } else if (effect === 'heat') {
        const count = Math.round(42 * mult);
        for (let i = 0; i < count; i++) {
          sim.particles.push({
            x: rand(0, sim.width),
            y: rand(0, sim.height),
            r: rand(1.0, 2.6),
            vx: rand(0.15, 0.65),
            vy: rand(-0.45, -0.12),
            phase: rand(0, Math.PI * 2),
            alpha: rand(0.18, 0.48),
          });
        }
      }
    };

    const spawnLightning = (now) => {
      const startX = rand(sim.width * 0.15, sim.width * 0.85);
      const endY = rand(sim.height * 0.45, sim.height * 0.82);
      const buildBolt = (x1, y1, x2, y2, displace, depth) => {
        const pts = [{ x: x1, y: y1 }];
        const subdivide = (ax, ay, bx, by, disp) => {
          if (disp < 4) {
            pts.push({ x: bx, y: by });
            return;
          }
          const mx = (ax + bx) * 0.5 + rand(-disp, disp);
          const my = (ay + by) * 0.5 + rand(-disp * 0.3, disp * 0.3);
          subdivide(ax, ay, mx, my, disp * 0.52);
          subdivide(mx, my, bx, by, disp * 0.52);
        };
        subdivide(x1, y1, x2, y2, displace);
        const branches = [];
        if (depth === 0) {
          for (let i = 3; i < pts.length - 3; i += 4) {
            if (Math.random() > 0.45) {
              const bEndX = pts[i].x + rand(-110, 110);
              const bEndY = pts[i].y + rand(60, 150);
              branches.push(buildBolt(pts[i].x, pts[i].y, bEndX, bEndY, 24, 1));
            }
          }
        }
        return { pts, branches };
      };

      sim.lightning = {
        bolt: buildBolt(startX, 0, startX + rand(-90, 90), endY, 68, 0),
        born: now,
        duration: 340,
      };
      sim.nextLightningAt = now + rand(4200, 9500);

      document.body.classList.add('gg-lightning-strike');
      window.setTimeout(() => document.body.classList.remove('gg-lightning-strike'), 140);
      window.setTimeout(() => {
        if (sim.effect === 'storm') {
          document.body.classList.add('gg-lightning-strike');
          window.setTimeout(() => document.body.classList.remove('gg-lightning-strike'), 90);
        }
      }, 210);
    };

    const drawBolt = (boltObj, alpha, lineWidth) => {
      const { pts, branches } = boltObj;
      if (pts.length < 2) return;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = `rgba(130, 195, 255, ${alpha * 0.45})`;
      ctx.lineWidth = lineWidth * 4.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = `rgba(245, 250, 255, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      ctx.restore();

      branches.forEach((b) => drawBolt(b, alpha * 0.65, lineWidth * 0.55));
    };

    const drawCrystalSnowflake = (x, y, r, rot, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -r);
        ctx.moveTo(0, -r * 0.55);
        ctx.lineTo(-r * 0.28, -r * 0.78);
        ctx.moveTo(0, -r * 0.55);
        ctx.lineTo(r * 0.28, -r * 0.78);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawLeaf = (p) => {
      const flipScale = Math.max(0.22, Math.abs(Math.cos(p.flipPhase)));
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, flipScale);
      ctx.globalAlpha = p.alpha;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(-p.size, 0);
      ctx.quadraticCurveTo(0, -p.size * 0.75, p.size, 0);
      ctx.quadraticCurveTo(0, p.size * 0.75, -p.size, 0);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.28)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-p.size * 0.85, 0);
      ctx.lineTo(p.size * 0.8, 0);
      ctx.stroke();
      ctx.restore();
    };

    const renderAtmosphere = (now) => {
      const dt = Math.min(40, now - sim.lastTime) / 16.67;
      sim.lastTime = now;
      const t = now * 0.001;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      ctx.clearRect(0, 0, sim.width, sim.height);

      if (sim.effect === 'none') {
        sim.rafId = null;
        return;
      }

      sim.fadeAlpha = Math.min(1, sim.fadeAlpha + 0.035 * dt);
      ctx.save();
      ctx.globalAlpha = sim.fadeAlpha;

      if (sim.effect === 'sun' || sim.effect === 'sunset') {
        const isSunset = sim.effect === 'sunset';
        const sunX = isSunset ? sim.width * 0.5 : sim.width * 0.88;
        const sunY = isSunset ? sim.height * 0.78 : sim.height * 0.08;
        const maxR = Math.max(sim.width, sim.height) * 0.95;

        const halo = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, maxR * 0.65);
        if (isSunset) {
          halo.addColorStop(0, 'rgba(255, 224, 150, 0.34)');
          halo.addColorStop(0.35, 'rgba(255, 132, 66, 0.14)');
          halo.addColorStop(1, 'rgba(255, 100, 40, 0)');
        } else {
          halo.addColorStop(0, 'rgba(255, 248, 200, 0.38)');
          halo.addColorStop(0.35, 'rgba(255, 212, 95, 0.14)');
          halo.addColorStop(1, 'rgba(255, 200, 70, 0)');
        }
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, sim.width, sim.height);

        const rayCount = 7;
        for (let i = 0; i < rayCount; i++) {
          const baseAngle = isSunset
            ? -Math.PI * 0.85 + (i / (rayCount - 1)) * Math.PI * 0.7
            : Math.PI * 0.55 + (i / (rayCount - 1)) * Math.PI * 0.42;
          const sway = reduceMotion ? 0 : Math.sin(t * 0.25 + i * 1.3) * 0.04;
          const a1 = baseAngle + sway - 0.035;
          const a2 = baseAngle + sway + 0.035;

          const rayGrad = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, maxR);
          rayGrad.addColorStop(0, isSunset ? 'rgba(255, 210, 135, 0.13)' : 'rgba(255, 245, 190, 0.15)');
          rayGrad.addColorStop(1, 'rgba(255, 240, 180, 0)');

          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(sunX, sunY);
          ctx.lineTo(sunX + Math.cos(a1) * maxR, sunY + Math.sin(a1) * maxR);
          ctx.lineTo(sunX + Math.cos(a2) * maxR, sunY + Math.sin(a2) * maxR);
          ctx.closePath();
          ctx.fill();
        }

        sim.particles.forEach((p) => {
          if (!reduceMotion) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.y < -10) p.y = sim.height + 10;
            if (p.x < -10) p.x = sim.width + 10;
            if (p.x > sim.width + 10) p.x = -10;
          }
          const shimmer = 0.5 + 0.5 * Math.sin(t * 2.2 + p.phase);
          ctx.fillStyle = isSunset
            ? `rgba(255, 214, 150, ${p.alpha * shimmer})`
            : `rgba(255, 246, 185, ${p.alpha * shimmer})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      if (sim.effect === 'rain' || sim.effect === 'storm') {
        const isStorm = sim.effect === 'storm';
        ctx.lineCap = 'round';

        sim.particles.forEach((d) => {
          if (!reduceMotion) {
            d.x += d.wind * dt;
            d.y += d.speed * dt;
            if (d.y > sim.height) {
              if (d.z > 0.65 && Math.random() > 0.55 && sim.splashes.length < 45) {
                sim.splashes.push({
                  x: d.x,
                  y: sim.height - rand(2, 10),
                  r: 1,
                  maxR: 5 + d.z * 7,
                  alpha: 0.45,
                });
              }
              d.y = rand(-40, -5);
              d.x = rand(-60, sim.width + 80);
            }
          }

          const grad = ctx.createLinearGradient(d.x, d.y, d.x - d.wind * 1.4, d.y - d.len);
          grad.addColorStop(
            0,
            isStorm ? `rgba(186, 224, 255, ${d.alpha})` : `rgba(82, 155, 208, ${d.alpha})`
          );
          grad.addColorStop(1, 'rgba(186, 224, 255, 0)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.7 + d.z * 0.95;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - d.wind * 1.4, d.y - d.len);
          ctx.stroke();
        });

        for (let i = sim.splashes.length - 1; i >= 0; i--) {
          const s = sim.splashes[i];
          if (!reduceMotion) {
            s.r += 0.45 * dt;
            s.alpha -= 0.024 * dt;
          }
          if (s.alpha <= 0 || s.r >= s.maxR) {
            sim.splashes.splice(i, 1);
            continue;
          }
          ctx.strokeStyle = isStorm
            ? `rgba(195, 232, 255, ${s.alpha})`
            : `rgba(92, 165, 215, ${s.alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(s.x, s.y, s.r, s.r * 0.32, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (isStorm && !reduceMotion) {
          if (!sim.lightning && now >= sim.nextLightningAt) {
            spawnLightning(now);
          }
          if (sim.lightning) {
            const elapsed = now - sim.lightning.born;
            if (elapsed < sim.lightning.duration) {
              const p = elapsed / sim.lightning.duration;
              const flicker = p < 0.25 ? 1 : p < 0.42 ? 0.25 : p < 0.62 ? 0.85 : 1 - p;
              ctx.fillStyle = `rgba(190, 222, 255, ${0.14 * flicker})`;
              ctx.fillRect(0, 0, sim.width, sim.height);
              drawBolt(sim.lightning.bolt, flicker, 2.2);
            } else {
              sim.lightning = null;
            }
          }
        }
      }

      if (sim.effect === 'snow') {
        sim.particles.forEach((f) => {
          if (!reduceMotion) {
            f.phase += 0.02 * f.driftFreq * dt;
            f.rot += f.rotSpeed * dt;
            f.x += Math.sin(f.phase) * f.driftAmp * dt;
            f.y += f.speedY * dt;

            if (sim.pointer.active) {
              const dx = f.x - sim.pointer.x;
              const dy = f.y - sim.pointer.y;
              const dist = Math.hypot(dx, dy);
              if (dist < 110 && dist > 1) {
                f.x += (dx / dist) * 1.4 * f.z * dt;
              }
            }

            if (f.y > sim.height + 12) {
              f.y = -12;
              f.x = rand(0, sim.width);
            }
            if (f.x < -15) f.x = sim.width + 15;
            if (f.x > sim.width + 15) f.x = -15;
          }

          if (f.crystal) {
            drawCrystalSnowflake(f.x, f.y, f.r * 1.45, f.rot, f.alpha);
          } else {
            const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 1.6);
            g.addColorStop(0, `rgba(255, 255, 255, ${f.alpha})`);
            g.addColorStop(0.6, `rgba(235, 248, 255, ${f.alpha * 0.55})`);
            g.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r * 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      if (sim.effect === 'aurora') {
        sim.stars.forEach((s) => {
          const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 2 + s.phase));
          ctx.fillStyle = `rgba(232, 248, 255, ${twinkle * 0.75})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const curtains = [
          { yBase: sim.height * 0.26, amp: 38, freq: 0.0045, speed: 0.55, c1: 'rgba(18, 255, 178, 0.22)', c2: 'rgba(65, 145, 255, 0.08)' },
          { yBase: sim.height * 0.34, amp: 46, freq: 0.0035, speed: -0.42, c1: 'rgba(42, 224, 212, 0.18)', c2: 'rgba(158, 78, 255, 0.11)' },
          { yBase: sim.height * 0.2, amp: 28, freq: 0.006, speed: 0.32, c1: 'rgba(92, 255, 165, 0.15)', c2: 'rgba(120, 95, 255, 0.07)' },
        ];

        curtains.forEach((c, idx) => {
          const phase = reduceMotion ? idx : t * c.speed + idx * 2.1;
          const grad = ctx.createLinearGradient(0, c.yBase - 140, 0, c.yBase + 130);
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(0.35, c.c2);
          grad.addColorStop(0.75, c.c1);
          grad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          for (let x = 0; x <= sim.width + 24; x += 24) {
            const wave =
              Math.sin(x * c.freq + phase) * c.amp +
              Math.cos(x * c.freq * 1.8 - phase * 0.7) * (c.amp * 0.45);
            ctx.lineTo(x, c.yBase + wave);
          }
          ctx.lineTo(sim.width, 0);
          ctx.closePath();
          ctx.fill();
        });
        ctx.restore();
      }

      if (sim.effect === 'volcano') {
        sim.particles.forEach((p) => {
          if (p.kind === 'smoke') {
            if (!reduceMotion) {
              p.y += p.vy * dt;
              p.x += p.vx * dt + Math.sin(t + p.y * 0.01) * 0.25;
              p.r += 0.14 * dt;
              if (p.y + p.r < 0) {
                p.y = sim.height * 0.75;
                p.x = sim.width * 0.5 + rand(-90, 90);
                p.r = rand(32, 65);
              }
            }
            const g = ctx.createRadialGradient(p.x, p.y, p.r * 0.1, p.x, p.y, p.r);
            g.addColorStop(0, `rgba(65, 52, 54, ${p.alpha})`);
            g.addColorStop(1, 'rgba(40, 30, 32, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
          } else {
            if (!reduceMotion) {
              p.phase += 0.05 * dt;
              p.y += p.vy * dt;
              p.x += (p.vx + Math.sin(p.phase) * 0.65) * dt;
              if (p.y < -15) {
                p.y = sim.height + rand(5, 30);
                p.x = rand(sim.width * 0.12, sim.width * 0.88);
              }
            }
            const glow = 0.65 + 0.35 * Math.sin(t * 6 + p.phase);
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.2);
            g.addColorStop(0, `rgba(255, 240, 165, ${glow})`);
            g.addColorStop(0.4, `rgba(255, 102, 28, ${glow * 0.8})`);
            g.addColorStop(1, 'rgba(255, 60, 10, 0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      if (sim.effect === 'leaves') {
        sim.gusts.forEach((g) => {
          if (!reduceMotion) {
            g.x += g.speed * dt;
            if (g.x - g.len > sim.width) {
              g.x = -g.len - rand(40, 220);
              g.y = rand(sim.height * 0.12, sim.height * 0.85);
            }
          }
          const grad = ctx.createLinearGradient(g.x - g.len, g.y, g.x, g.y);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(0.5, `rgba(255, 255, 255, ${g.alpha})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          for (let sx = 0; sx <= g.len; sx += 16) {
            const px = g.x - g.len + sx;
            const py = g.y + Math.sin(px * 0.015 + g.phase) * g.amp;
            if (sx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        });

        sim.particles.forEach((leaf) => {
          if (!reduceMotion) {
            leaf.swayPhase += 0.03 * dt;
            leaf.flipPhase += leaf.flipSpeed * dt;
            leaf.rot += leaf.rotSpeed * dt;
            leaf.x += (leaf.vx + Math.sin(leaf.swayPhase) * 0.8) * dt;
            leaf.y += (leaf.vy + Math.cos(leaf.swayPhase * 1.3) * 0.45) * dt;

            if (sim.pointer.active) {
              const dx = leaf.x - sim.pointer.x;
              const dy = leaf.y - sim.pointer.y;
              const dist = Math.hypot(dx, dy);
              if (dist < 130 && dist > 1) {
                leaf.x += (dx / dist) * 2.2 * dt;
                leaf.y += (dy / dist) * 1.4 * dt;
                leaf.rot += 0.06 * dt;
              }
            }

            if (leaf.x > sim.width + 40) leaf.x = -35;
            if (leaf.x < -45) leaf.x = sim.width + 35;
            if (leaf.y > sim.height + 30) {
              leaf.y = -25;
              leaf.x = rand(-40, sim.width);
            }
          }
          drawLeaf(leaf);
        });
      }

      if (sim.effect === 'heat') {
        const hazeGrad = ctx.createLinearGradient(0, sim.height * 0.65, 0, sim.height);
        const pulse = reduceMotion ? 0.14 : 0.11 + 0.05 * Math.sin(t * 2.4);
        hazeGrad.addColorStop(0, 'rgba(255, 185, 65, 0)');
        hazeGrad.addColorStop(1, `rgba(245, 148, 34, ${pulse})`);
        ctx.fillStyle = hazeGrad;
        ctx.fillRect(0, sim.height * 0.65, sim.width, sim.height * 0.35);

        sim.particles.forEach((p) => {
          if (!reduceMotion) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.y < -10) p.y = sim.height + 10;
            if (p.x > sim.width + 10) p.x = -10;
          }
          const shimmer = 0.45 + 0.55 * Math.sin(t * 2.5 + p.phase);
          ctx.fillStyle = `rgba(218, 140, 26, ${p.alpha * shimmer})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.restore();
      sim.rafId = window.requestAnimationFrame(renderAtmosphere);
    };

    const startLoop = () => {
      if (!sim.rafId && sim.effect !== 'none') {
        sim.lastTime = performance.now();
        sim.rafId = window.requestAnimationFrame(renderAtmosphere);
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && sim.rafId) {
        window.cancelAnimationFrame(sim.rafId);
        sim.rafId = null;
      } else if (!document.hidden && sim.effect !== 'none') {
        startLoop();
      }
    });

    /* 6. Painel de personalização visual */
    const launcher = document.createElement('button');
    launcher.className = 'gg-theme-launcher';
    launcher.type = 'button';
    launcher.innerHTML = '<span aria-hidden="true">🎨</span><span>Cor e animações</span>';
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-controls', 'ggThemePanel');

    const panel = document.createElement('section');
    panel.className = 'gg-theme-panel';
    panel.id = 'ggThemePanel';
    panel.setAttribute('aria-label', 'Personalizar tema e animação');
    panel.innerHTML = `
      <h2>🌎 Personalizar o site</h2>
      <p>Escolha um fenômeno atmosférico ou uma cor de destaque. A iluminação e os efeitos acompanham todas as páginas.</p>
      <div class="gg-theme-options" role="group" aria-label="Temas naturais"></div>
      <div class="gg-intensity-row">
        <span class="gg-intensity-label">✨ Intensidade atmosférica</span>
        <div class="gg-intensity-group" role="group" aria-label="Intensidade dos efeitos">
          <button type="button" class="gg-intensity-btn" data-intensity="low" aria-pressed="false">Suave</button>
          <button type="button" class="gg-intensity-btn" data-intensity="normal" aria-pressed="true">Realista</button>
          <button type="button" class="gg-intensity-btn" data-intensity="high" aria-pressed="false">Intenso</button>
        </div>
      </div>
      <label class="gg-theme-color-row" for="ggCustomColor">
        <span>🎨 Cor personalizada</span>
        <input id="ggCustomColor" type="color" value="#b8860b" aria-label="Escolher uma cor personalizada">
      </label>
      <p id="ggThemeStatus" aria-live="polite">Tema aplicado automaticamente.</p>
      <div class="gg-theme-actions">
        <button type="button" class="gg-theme-reset">Restaurar original</button>
        <button type="button" class="gg-theme-close">Fechar</button>
      </div>
    `;

    const weatherMenu = document.querySelector('.weather-menu');
    if (weatherMenu) {
      weatherMenu.appendChild(launcher);
    } else {
      document.body.appendChild(launcher);
    }
    document.body.appendChild(panel);

    const options = panel.querySelector('.gg-theme-options');
    Object.entries(themes).forEach(([key, t]) => {
      if (key === 'default') return;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'gg-theme-option';
      b.dataset.theme = key;
      b.innerHTML = `${t.emoji} ${t.label}<small>${t.desc}</small>`;
      b.setAttribute('aria-pressed', 'false');
      options.appendChild(b);
    });

    const colorInput = panel.querySelector('#ggCustomColor');
    if (customColor) colorInput.value = customColor;

    const hexRgb = (hex) => {
      const h = hex.replace('#', '');
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    };
    const shade = (hex, amount) =>
      '#' +
      hexRgb(hex)
        .map((v) => Math.max(0, Math.min(255, Math.round(v * (1 - amount)))).toString(16).padStart(2, '0'))
        .join('');

    const apply = (key, custom = '', intensity = currentIntensity) => {
      const t = themes[key] || themes.default;
      current = key;
      customColor = custom;
      currentIntensity = intensities[intensity] ? intensity : 'normal';

      const accent = custom || t.accent;
      const primary = custom ? shade(custom, 0.58) : t.primary;
      const [r, g, b] = hexRgb(accent);
      const root = document.documentElement;

      document.body.classList.add('gg-theme-shifting');
      window.setTimeout(() => document.body.classList.remove('gg-theme-shifting'), 900);

      root.style.setProperty('--primary', primary);
      root.style.setProperty('--primary-light', shade(primary, -0.1));
      root.style.setProperty('--accent', accent);
      root.style.setProperty('--accent-dark', accent);
      root.style.setProperty('--bg-light', t.bg);
      root.style.setProperty('--text-dark', primary);
      root.style.setProperty('--card-border', `rgba(${r},${g},${b},.34)`);
      root.style.setProperty('--gg-event-accent', accent);
      root.style.setProperty('--gg-event-primary', primary);
      root.style.setProperty('--gg-event-glow', `rgba(${r},${g},${b},.26)`);

      document.body.dataset.ggTheme = key;
      document.body.classList.remove('gg-lightning-strike');

      document
        .querySelectorAll('.container,.info-card,.stat-card,.geo-card,.infra-card,.menu-card,.gallery-card,.dist-card')
        .forEach((el) => {
          if (custom) el.style.borderColor = `rgba(${r},${g},${b},.42)`;
          else el.style.removeProperty('border-color');
        });

      document.querySelectorAll('.gg-volcano-scene,.gg-water-rise').forEach((el) => el.remove());
      if (t.effect === 'volcano') {
        const scene = document.createElement('div');
        scene.className = 'gg-volcano-scene';
        scene.setAttribute('aria-hidden', 'true');
        scene.innerHTML = '<div class="gg-volcano-mountain"></div><div class="gg-lava"></div>';
        document.body.appendChild(scene);
      } else if (t.effect === 'storm') {
        const water = document.createElement('div');
        water.className = 'gg-water-rise';
        water.setAttribute('aria-hidden', 'true');
        document.body.appendChild(water);
      }

      buildScene(t.effect);
      if (t.effect !== 'none') startLoop();

      options.querySelectorAll('button').forEach((btn) =>
        btn.setAttribute('aria-pressed', String(btn.dataset.theme === key))
      );
      panel.querySelectorAll('.gg-intensity-btn').forEach((btn) =>
        btn.setAttribute('aria-pressed', String(btn.dataset.intensity === currentIntensity))
      );

      panel.querySelector('#ggThemeStatus').textContent = `${t.emoji} ${t.label} (${intensities[currentIntensity].label})${
        custom ? ' com cor personalizada' : ''
      } aplicado.`;

      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ theme: key, customColor: custom, intensity: currentIntensity })
        );
      } catch (_) {}
    };

    launcher.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = !panel.classList.contains('open');
      panel.classList.toggle('open', open);
      launcher.setAttribute('aria-expanded', String(open));
    });
    panel.addEventListener('click', (e) => e.stopPropagation());
    panel.querySelector('.gg-theme-close').addEventListener('click', () => {
      panel.classList.remove('open');
      launcher.setAttribute('aria-expanded', 'false');
    });
    panel.querySelector('.gg-theme-reset').addEventListener('click', () => {
      colorInput.value = themes.default.accent;
      apply('default', '', 'normal');
    });
    options.addEventListener('click', (e) => {
      const b = e.target.closest('[data-theme]');
      if (b) {
        colorInput.value = themes[b.dataset.theme].accent;
        apply(b.dataset.theme, '', currentIntensity);
      }
    });
    panel.querySelectorAll('.gg-intensity-btn').forEach((btn) =>
      btn.addEventListener('click', () => apply(current, customColor, btn.dataset.intensity))
    );
    colorInput.addEventListener('input', () => apply(current, colorInput.value, currentIntensity));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        panel.classList.remove('open');
        launcher.setAttribute('aria-expanded', 'false');
      }
    });

    apply(current, customColor, currentIntensity);

    /* 7. Janela modal "Saiba mais" nos cartões informativos */
    const detailTargets = [...document.querySelectorAll('.gg-info-grid article,.gg-timeline article,.gg-fact')];
    if (detailTargets.length) {
      const modal = document.createElement('div');
      modal.className = 'gg-detail-modal';
      modal.id = 'ggDetailModal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'ggDetailTitle');
      modal.innerHTML =
        '<div class="gg-detail-backdrop" data-close-detail></div><section class="gg-detail-box"><button class="gg-detail-close" type="button" aria-label="Fechar">×</button><span class="gg-eyebrow">GEOGRAÇA • SAIBA MAIS</span><h2 id="ggDetailTitle"></h2><div id="ggDetailBody"></div></section>';
      document.body.appendChild(modal);

      const close = () => {
        modal.classList.remove('open');
        document.body.classList.remove('gg-modal-open');
      };
      modal.querySelectorAll('[data-close-detail],.gg-detail-close').forEach((b) => b.addEventListener('click', close));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });

      detailTargets.forEach((card) => {
        if (card.querySelector('.gg-saiba-mais')) return;
        const title =
          card.querySelector('h3,strong')?.textContent?.trim() ||
          card.querySelector('span')?.textContent?.trim() ||
          'Informação';
        const original =
          [...card.querySelectorAll('p')]
            .map((p) => p.innerText.trim())
            .filter(Boolean)
            .join('\n\n') || card.innerText.trim();

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gg-saiba-mais';
        btn.innerHTML = 'Saiba mais <span aria-hidden="true">↗</span>';
        btn.addEventListener('click', () => {
          modal.querySelector('#ggDetailTitle').textContent = title;
          const body = modal.querySelector('#ggDetailBody');
          body.replaceChildren();
          const p = document.createElement('p');
          p.textContent = original;
          body.appendChild(p);
          const note = document.createElement('p');
          note.className = 'gg-detail-note';
          note.textContent =
            'Para aprofundar, consulte as fontes oficiais indicadas ao final desta seção (IBGE, Prefeitura Municipal e IPARDES).';
          body.appendChild(note);
          modal.classList.add('open');
          document.body.classList.add('gg-modal-open');
          modal.querySelector('.gg-detail-close').focus();
        });
        card.appendChild(btn);
      });
    }
  });
})();

/* Controles da paisagem interativa da página Geografia */
document.addEventListener('DOMContentLoaded', () => {
  const copy = {
    clima:
      'O clima subtropical úmido (Cfa) influencia o regime de chuvas, a agricultura regional, a recarga dos mananciais e o conforto térmico ao longo das quatro estações.',
    relevo:
      'O relevo de planalto ondulado, associado aos solos férteis de Terra Roxa, condiciona o traçado das estradas, a drenagem natural e a ocupação agrícola e urbana.',
    agua:
      'Os rios Jacaré e das Cinzas e os ribeirões Bonito, Boi Pintado e Aldeia formam a rede hídrica local, protegida pela preservação das nascentes e matas ciliares.',
    uso:
      'O mosaico rural reúne lavouras, pastagens, propriedades familiares e remanescentes do bioma Mata Atlântica, onde práticas de conservação do solo evitam erosão.',
    cidade:
      'A sede urbana concentra moradia, comércio, serviços públicos e mobilidade, conectando os bairros e as comunidades rurais às rodovias do Norte Pioneiro.',
  };

  document.querySelectorAll('[data-landscape]').forEach((b) =>
    b.addEventListener('click', () => {
      document.querySelectorAll('[data-landscape]').forEach((x) => x.classList.toggle('active', x === b));
      const cap = document.querySelector('.gg-landscape-caption');
      if (cap) cap.textContent = copy[b.dataset.landscape] || copy.clima;
      const scene = document.querySelector('.gg-landscape-scene');
      if (scene) {
        scene.dataset.focus = b.dataset.landscape;
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          scene.classList.remove('gg-landscape-pulse');
          void scene.offsetWidth;
          scene.classList.add('gg-landscape-pulse');
        }
      }
    })
  );
});
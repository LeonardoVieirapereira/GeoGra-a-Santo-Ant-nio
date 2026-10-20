/* GeoGraça — navegação, acessibilidade e microinterações */
(() => {
  'use strict';
  const ready = (fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, {once:true}) : fn();
  ready(() => {
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
        toggle.innerHTML = open ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i><span>Fechar</span>' : '<i class="fa-solid fa-bars" aria-hidden="true"></i><span>Menu</span>';
      });
      links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
      window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });
    }
    // The pages already implement their own weather-theme handlers; leave those
    // listeners intact to avoid double-toggling the dropdown.
    const weatherToggle = document.getElementById('weatherToggleBtn') || document.getElementById('weatherToggle');
    if (weatherToggle) weatherToggle.setAttribute('aria-label', 'Opções de clima visual');
    // Reading progress indicator and back-to-top control.
    const progress = document.createElement('div'); progress.className = 'gg-progress'; progress.setAttribute('aria-hidden','true'); document.body.appendChild(progress);
    const top = document.createElement('button'); top.className = 'gg-top'; top.type = 'button'; top.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>'; top.setAttribute('aria-label','Voltar ao topo'); document.body.appendChild(top);
    top.addEventListener('click', () => window.scrollTo({top:0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}));
    let ticking = false;
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + '%';
      top.classList.toggle('visible', window.scrollY > 420); ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { window.requestAnimationFrame(updateScroll); ticking = true; } }, {passive:true}); updateScroll();
    // Animate content as it enters the viewport, only when motion is allowed.
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const candidates = document.querySelectorAll('.section-title, .stats-grid > *, .infra-grid > *, .geo-grid > *, .menu-grid > *, .timeline-item');
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('gg-in-view'); observer.unobserve(entry.target); }
      }), {threshold:0.12});
      const style = document.createElement('style'); style.textContent = '.section-title,.stats-grid>*,.infra-grid>*,.geo-grid>*,.menu-grid>*,.timeline-item{opacity:0;transform:translateY(12px);transition:opacity .55s ease,transform .55s ease}.gg-in-view{opacity:1!important;transform:translateY(0)!important}@media(prefers-reduced-motion:reduce){.section-title,.stats-grid>*,.infra-grid>*,.geo-grid>*,.menu-grid>*,.timeline-item{opacity:1;transform:none}}'; document.head.appendChild(style);
      candidates.forEach(el => observer.observe(el));
    }
    // Personalizador de eventos naturais: tema, cor, animação e preferência persistente.
    const eventThemes = {
      default: {label:'Tema original', color:'#b8860b', effect:'none'},
      sol: {label:'Sol / céu limpo', color:'#f59e0b', effect:'sun'},
      chuva: {label:'Chuva', color:'#38bdf8', effect:'rain'},
      tempestade: {label:'Tempestade', color:'#8b5cf6', effect:'lightning'},
      neve: {label:'Neve', color:'#a5f3fc', effect:'snow'},
      seca: {label:'Seca / calor', color:'#f97316', effect:'dust'},
      floresta: {label:'Floresta / folhas', color:'#22c55e', effect:'leaves'},
      aurora: {label:'Aurora boreal', color:'#2dd4bf', effect:'aurora'},
      estrelas: {label:'Céu estrelado', color:'#c4b5fd', effect:'stars'},
      oceano: {label:'Oceano', color:'#0ea5e9', effect:'bubbles'},
      vulcao: {label:'Vulcão / lava', color:'#ef4444', effect:'embers'},
      vento: {label:'Vento', color:'#94a3b8', effect:'wind'}
    };
    const storageKey = 'geograca-event-theme-v1';
    let savedTheme = null;
    try { savedTheme = JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch (_) {}
    const themeButton = document.createElement('button');
    themeButton.type = 'button'; themeButton.id = 'gg-event-theme-button';
    themeButton.innerHTML = '<span aria-hidden="true">🌦️</span><span>Personalizar tema</span>';
    themeButton.setAttribute('aria-expanded','false'); themeButton.setAttribute('aria-controls','gg-event-theme-panel');
    const panel = document.createElement('section'); panel.id = 'gg-event-theme-panel'; panel.hidden = true;
    panel.setAttribute('aria-label','Personalizar tema de evento natural');
    panel.innerHTML = `
      <div class="gg-theme-panel-head"><div><strong>Clima & natureza</strong><small>Personalize o visual em todas as páginas</small></div><button type="button" class="gg-theme-close" aria-label="Fechar painel">×</button></div>
      <label for="gg-event-preset">Evento natural</label>
      <select id="gg-event-preset">
        <option value="default">Tema original</option><option value="sol">☀️ Sol / céu limpo</option><option value="chuva">🌧️ Chuva</option><option value="tempestade">⛈️ Tempestade</option><option value="neve">❄️ Neve</option><option value="seca">🌵 Seca / calor</option><option value="floresta">🍃 Floresta / folhas</option><option value="aurora">🌌 Aurora boreal</option><option value="estrelas">✨ Céu estrelado</option><option value="oceano">🌊 Oceano</option><option value="vulcao">🌋 Vulcão / lava</option><option value="vento">💨 Vento</option><option value="custom">✏️ Evento personalizado</option>
      </select>
      <div class="gg-theme-custom-fields" id="gg-event-custom-fields" hidden><label for="gg-event-name">Nome do evento</label><input id="gg-event-name" maxlength="40" placeholder="Ex.: Eclipse solar"><label for="gg-event-effect">Animação</label><select id="gg-event-effect"><option value="stars">Estrelas / partículas</option><option value="rain">Chuva</option><option value="snow">Neve</option><option value="leaves">Folhas ao vento</option><option value="sun">Brilho solar</option><option value="lightning">Raios</option><option value="dust">Poeira / areia</option><option value="bubbles">Bolhas</option><option value="embers">Brasas</option><option value="wind">Linhas de vento</option><option value="aurora">Aurora luminosa</option><option value="none">Sem partículas</option></select></div>
      <label for="gg-event-color">Cor principal do tema</label><div class="gg-theme-color-row"><input id="gg-event-color" type="color" value="#b8860b"><span id="gg-event-color-value">#B8860B</span></div>
      <div class="gg-theme-actions"><button type="button" id="gg-event-apply">Aplicar e salvar</button><button type="button" id="gg-event-reset">Restaurar padrão</button></div>
      <p class="gg-theme-note" id="gg-event-status" role="status">A escolha será lembrada neste navegador e usada nas outras páginas do GeoGraça.</p>`;
    document.body.append(themeButton, panel);
    const overlay = document.createElement('div'); overlay.id = 'gg-event-particles'; overlay.setAttribute('aria-hidden','true'); document.body.appendChild(overlay);
    const preset = panel.querySelector('#gg-event-preset'), colorInput = panel.querySelector('#gg-event-color');
    const customFields = panel.querySelector('#gg-event-custom-fields');
    const effectInput = panel.querySelector('#gg-event-effect');
    const nameInput = panel.querySelector('#gg-event-name');
    const colorValue = panel.querySelector('#gg-event-color-value');
    const status = panel.querySelector('#gg-event-status');
    const togglePanel = (open) => { panel.hidden = !open; themeButton.setAttribute('aria-expanded',String(open)); };
    themeButton.addEventListener('click', () => togglePanel(panel.hidden));
    panel.querySelector('.gg-theme-close').addEventListener('click', () => togglePanel(false));
    preset.addEventListener('change', () => {
      customFields.hidden = preset.value !== 'custom';
      if (eventThemes[preset.value]) { colorInput.value = eventThemes[preset.value].color; colorValue.textContent = colorInput.value.toUpperCase(); }
    });
    colorInput.addEventListener('input', () => colorValue.textContent = colorInput.value.toUpperCase());
    const hexRgb = hex => { const h=hex.replace('#',''); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; };
    function applyTheme(config, persist=true) {
      const color = /^#[0-9a-f]{6}$/i.test(config.color || '') ? config.color : '#b8860b';
      const rgb = hexRgb(color); const luminance = (rgb[0]*299+rgb[1]*587+rgb[2]*114)/1000;
      const dark = luminance < 145;
      document.body.classList.add('gg-event-theme-active');
      document.body.style.setProperty('--gg-event-color', color);
      document.body.style.setProperty('--primary', color);
      document.body.style.setProperty('--accent-dark', color);
      document.body.style.setProperty('--gg-event-tint', `rgba(${rgb.join(',')},.13)`);
      document.body.style.setProperty('--gg-event-card', dark ? `rgba(${Math.min(255,rgb[0]+42)},${Math.min(255,rgb[1]+42)},${Math.min(255,rgb[2]+42)},.12)` : `rgba(${rgb.join(',')},.07)`);
      document.body.dataset.ggEventName = config.name || config.label || 'Evento natural';
      document.body.dataset.ggEventEffect = config.effect || 'none';
      document.querySelectorAll('nav, .container, .banner-header, .hero-banner').forEach(el => el.classList.add('gg-theme-transition'));
      themeButton.querySelector('span:last-child').textContent = config.name || config.label || 'Personalizar tema';
      themeButton.style.setProperty('--gg-event-color', color);
      renderParticles(config.effect || 'none', color);
      if (persist) {
        try { localStorage.setItem(storageKey, JSON.stringify({...config, color})); status.textContent = `Salvo: ${config.name || config.label || 'Tema personalizado'}. A animação será mantida ao abrir outras páginas neste navegador.`; }
        catch (_) { status.textContent = 'Tema aplicado, mas o navegador bloqueou o salvamento local.'; }
      }
    }
    function renderParticles(effect, color) {
      overlay.replaceChildren(); overlay.dataset.effect = effect;
      if (effect === 'none' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const count = Math.min(65, Math.max(20, Math.round(window.innerWidth / 18)));
      const symbols = {rain:'│',snow:'❄',leaves:'🍃',sun:'✦',lightning:'ϟ',dust:'·',stars:'✦',bubbles:'○',embers:'•',wind:'〰',aurora:'✧'};
      for (let i=0; i<count; i++) {
        const p = document.createElement('span'); p.className = `gg-particle gg-particle-${effect}`; p.textContent = symbols[effect] || '✦';
        p.style.left = `${Math.random()*100}%`; p.style.animationDelay = `${Math.random()*-18}s`;
        p.style.animationDuration = `${(effect==='lightning'?2.8:effect==='aurora'?9:6)+Math.random()*9}s`;
        p.style.setProperty('--particle-color', color); p.style.setProperty('--particle-drift', `${Math.round(Math.random()*160-80)}px`);
        p.style.fontSize = `${8+Math.random()*13}px`; p.style.opacity = `${.25+Math.random()*.65}`; overlay.appendChild(p);
      }
    }
    panel.querySelector('#gg-event-apply').addEventListener('click', () => {
      const key = preset.value; const base = eventThemes[key] || eventThemes.default;
      const config = key === 'custom'
        ? {key:'custom', name:nameInput.value.trim() || 'Evento personalizado', label:nameInput.value.trim() || 'Evento personalizado', color:colorInput.value, effect:effectInput.value}
        : {key, name:base.label, label:base.label, color:colorInput.value, effect:base.effect};
      applyTheme(config, true);
    });
    panel.querySelector('#gg-event-reset').addEventListener('click', () => {
      preset.value='default'; colorInput.value='#b8860b'; colorValue.textContent='#B8860B'; customFields.hidden=true; nameInput.value='';
      const config={key:'default',name:'Tema original',label:'Tema original',color:'#b8860b',effect:'none'};
      applyTheme(config,true); status.textContent='Tema original restaurado e salvo.';
    });
    if (savedTheme && savedTheme.color) {
      preset.value = eventThemes[savedTheme.key] ? savedTheme.key : 'custom';
      colorInput.value = savedTheme.color; colorValue.textContent = savedTheme.color.toUpperCase();
      if (preset.value === 'custom') { customFields.hidden = false; nameInput.value = savedTheme.name || ''; effectInput.value = savedTheme.effect || 'stars'; }
      applyTheme(savedTheme, false);
      status.textContent = `Tema carregado: ${savedTheme.name || savedTheme.label || 'Personalizado'}.`;
    }
    window.addEventListener('storage', event => {
      if (event.key === storageKey && event.newValue) { try { applyTheme(JSON.parse(event.newValue), false); } catch (_) {} }
    });
    // Keep broken external links from opening a blank tab on this site.
    document.querySelectorAll('a[target="_blank"]').forEach(a => { const rel = new Set((a.rel || '').split(/\s+/).filter(Boolean)); rel.add('noopener'); rel.add('noreferrer'); a.rel = [...rel].join(' '); });
  });
})();

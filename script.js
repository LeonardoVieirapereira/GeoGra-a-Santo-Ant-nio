/* GeoGraça — navegação, microinterações e temas naturais persistentes */
(() => {
  'use strict';
  const ready = (fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, {once:true}) : fn();
  ready(() => {
    const nav = document.querySelector('nav');
    const links = nav?.querySelector('.nav-links');
    const logo = nav?.querySelector('.logo');
    if (nav && links && logo && !nav.querySelector('.mobile-menu-toggle')) {
      const toggle = document.createElement('button');
      toggle.className = 'mobile-menu-toggle'; toggle.type = 'button'; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menu de navegação');
      toggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i><span>Menu</span>'; logo.insertAdjacentElement('afterend', toggle);
      const closeMenu = () => { links.classList.remove('mobile-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menu de navegação'); toggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i><span>Menu</span>'; };
      toggle.addEventListener('click', () => { const open = !links.classList.contains('mobile-open'); links.classList.toggle('mobile-open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação'); toggle.innerHTML = open ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i><span>Fechar</span>' : '<i class="fa-solid fa-bars" aria-hidden="true"></i><span>Menu</span>'; });
      links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu)); window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });
    }
    const weatherToggle = document.getElementById('weatherToggleBtn') || document.getElementById('weatherToggle'); if (weatherToggle) weatherToggle.setAttribute('aria-label', 'Opções de clima visual');
    const progress = document.createElement('div'); progress.className = 'gg-progress'; progress.setAttribute('aria-hidden','true'); document.body.appendChild(progress);
    const top = document.createElement('button'); top.className = 'gg-top'; top.type = 'button'; top.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>'; top.setAttribute('aria-label','Voltar ao topo'); document.body.appendChild(top);
    top.addEventListener('click', () => window.scrollTo({top:0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}));
    let ticking = false; const updateScroll = () => { const max = document.documentElement.scrollHeight - window.innerHeight; progress.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + '%'; top.classList.toggle('visible', window.scrollY > 420); ticking = false; };
    window.addEventListener('scroll', () => { if (!ticking) { window.requestAnimationFrame(updateScroll); ticking = true; } }, {passive:true}); updateScroll();
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) { const candidates = document.querySelectorAll('.section-title, .stats-grid > *, .infra-grid > *, .geo-grid > *, .menu-grid > *, .timeline-item'); const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('gg-in-view'); observer.unobserve(entry.target); } }), {threshold:0.12}); const style = document.createElement('style'); style.textContent = '.section-title,.stats-grid>*,.infra-grid>*,.geo-grid>*,.menu-grid>*,.timeline-item{opacity:0;transform:translateY(12px);transition:opacity .55s ease,transform .55s ease}.gg-in-view{opacity:1!important;transform:translateY(0)!important}@media(prefers-reduced-motion:reduce){.section-title,.stats-grid>*,.infra-grid>*,.geo-grid>*,.menu-grid>*,.timeline-item{opacity:1;transform:none}}'; document.head.appendChild(style); candidates.forEach(el => observer.observe(el)); }
    document.querySelectorAll('a[target="_blank"]').forEach(a => { const rel = new Set((a.rel || '').split(/\s+/).filter(Boolean)); rel.add('noopener'); rel.add('noreferrer'); a.rel = [...rel].join(' '); });

    // Temas inspirados em fenômenos naturais. A escolha e o efeito ficam salvos neste navegador
    // e são aplicados automaticamente em todas as páginas do site.
    const themes = {
      default:{label:'Original',emoji:'🌿',primary:'#1a261d',accent:'#b8860b',bg:'#f8f7f2',effect:'none',desc:'Visual natural original'},
      rain:{label:'Chuva',emoji:'🌧️',primary:'#183047',accent:'#4b9bd6',bg:'#eef5fa',effect:'rain',desc:'Gotas de chuva em movimento'},
      storm:{label:'Tempestade',emoji:'⛈️',primary:'#20243d',accent:'#8c9eff',bg:'#f0f0fa',effect:'lightning',desc:'Clarões suaves de relâmpago'},
      sunset:{label:'Pôr do sol',emoji:'🌅',primary:'#7b3425',accent:'#f08a4b',bg:'#fff3e7',effect:'sunset',desc:'Brilho quente de fim de tarde'},
      snow:{label:'Neve',emoji:'❄️',primary:'#23445e',accent:'#79c7e8',bg:'#f0f9ff',effect:'snow',desc:'Flocos caindo pela tela'},
      aurora:{label:'Aurora boreal',emoji:'🌌',primary:'#143b3c',accent:'#2abf9e',bg:'#effaf7',effect:'aurora',desc:'Ondas luminosas coloridas'},
      volcano:{label:'Vulcão',emoji:'🌋',primary:'#421c1b',accent:'#f05b35',bg:'#fff1eb',effect:'embers',desc:'Brasas brilhantes flutuando'},
      wind:{label:'Vento',emoji:'🌬️',primary:'#294c43',accent:'#72bda3',bg:'#f0faf5',effect:'leaves',desc:'Folhas levadas pelo vento'},
      heat:{label:'Calor solar',emoji:'☀️',primary:'#6d4817',accent:'#e5a323',bg:'#fff9e8',effect:'heat',desc:'Ondulação luminosa de calor'}
    };
    const storageKey = 'geograca-nature-theme-v1';
    let saved = {}; try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch (_) { saved = {}; }
    let current = themes[saved.theme] ? saved.theme : 'default';
    let customColor = /^#[0-9a-f]{6}$/i.test(saved.customColor || '') ? saved.customColor : '';
    const launcher = document.createElement('button'); launcher.className='gg-theme-launcher'; launcher.type='button'; launcher.innerHTML='<span aria-hidden="true">🎨</span><span>Personalizar tema natural</span>'; launcher.setAttribute('aria-expanded','false'); launcher.setAttribute('aria-controls','ggThemePanel');
    const panel = document.createElement('section'); panel.className='gg-theme-panel'; panel.id='ggThemePanel'; panel.setAttribute('aria-label','Personalizar tema e animação');
    panel.innerHTML='<h2>🌎 Personalizar o ambiente</h2><p>Escolha um fenômeno natural. A cor e a animação ficam salvas neste navegador e continuam nas outras páginas.</p><div class="gg-theme-options" role="group" aria-label="Temas naturais"></div><label class="gg-theme-color-row" for="ggCustomColor"><span>🎨 Cor personalizada</span><input id="ggCustomColor" type="color" value="#b8860b" aria-label="Escolher uma cor personalizada"></label><p id="ggThemeStatus" aria-live="polite">Tema aplicado automaticamente.</p><div class="gg-theme-actions"><button type="button" class="gg-theme-reset">Restaurar original</button><button type="button" class="gg-theme-close">Fechar</button></div>';
    const weatherMenu = document.querySelector('.weather-menu');
    if (weatherMenu) {
      weatherMenu.appendChild(launcher);
    } else {
      // Fallback acessível caso uma página não tenha o menu de três pontos.
      document.body.appendChild(launcher);
    }
    document.body.appendChild(panel);
    const options = panel.querySelector('.gg-theme-options');
    Object.entries(themes).forEach(([key,t]) => { if(key==='default') return; const b=document.createElement('button'); b.type='button'; b.className='gg-theme-option'; b.dataset.theme=key; b.innerHTML=`${t.emoji} ${t.label}<small>${t.desc}</small>`; b.setAttribute('aria-pressed','false'); options.appendChild(b); });
    const colorInput=panel.querySelector('#ggCustomColor'); if(customColor) colorInput.value=customColor;
    const hexRgb = hex => { const h=hex.replace('#',''); return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; };
    const shade = (hex,amount) => '#'+hexRgb(hex).map(v=>Math.max(0,Math.min(255,Math.round(v*(1-amount)))).toString(16).padStart(2,'0')).join('');
    const apply = (key, custom='') => {
      const t=themes[key]||themes.default; current=key; customColor=custom;
      const accent=custom || t.accent; const primary=custom ? shade(custom,.62) : t.primary;
      const [r,g,b]=hexRgb(accent); const root=document.documentElement;
      root.style.setProperty('--primary',primary); root.style.setProperty('--primary-light',shade(primary,-.10)); root.style.setProperty('--accent',accent); root.style.setProperty('--accent-dark',accent); root.style.setProperty('--bg-light',t.bg); root.style.setProperty('--text-dark',primary); root.style.setProperty('--card-border',`rgba(${r},${g},${b},.32)`); root.style.setProperty('--gg-event-accent',accent); root.style.setProperty('--gg-event-primary',primary); root.style.setProperty('--gg-event-glow',`rgba(${r},${g},${b},.24)`);
      document.body.style.setProperty('--gg-theme-page-tint',t.bg);
      // Atualiza os elementos de fundo mais comuns sem sobrescrever imagens ou mapas.
      document.querySelectorAll('.container,.info-card,.stat-card,.geo-card,.infra-card,.menu-card,.gallery-card,.timeline-item').forEach(el=>{ if(!el.dataset.ggOriginalBg) el.dataset.ggOriginalBg=el.style.backgroundColor||''; if(custom) el.style.borderColor=`rgba(${r},${g},${b},.38)`; else el.style.removeProperty('border-color'); });
      createEffect(t.effect);
      options.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===key)));
      panel.querySelector('#ggThemeStatus').textContent=`${t.emoji} ${t.label}${custom?' com cor personalizada':''} aplicado. Preferência salva neste navegador.`;
      try { localStorage.setItem(storageKey,JSON.stringify({theme:key,customColor:custom})); } catch (_) {}
    };
    function createEffect(effect){
      document.querySelector('.gg-nature-fx')?.remove(); if(effect==='none') return;
      const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const lowMotion=reduceMotion || window.innerWidth < 480; 
      const layer=document.createElement('div'); layer.className=`gg-nature-fx gg-fx-${effect}`; layer.setAttribute('aria-hidden','true');
      const symbols={snow:['❄','✧','❅'],embers:['✦','•','✧'],leaves:['🍃','🍂','✧'],aurora:['✧','·','✦'],sunset:['✧','·'],heat:['·','✦'],lightning:['·'],rain:['']};
      const count=lowMotion?(effect==='rain'?10:effect==='snow'?8:4):(effect==='rain'?24:effect==='snow'?18:effect==='embers'?12:effect==='leaves'?10:effect==='lightning'||effect==='aurora'||effect==='sunset'||effect==='heat'?5:8);
      for(let i=0;i<count;i++){const p=document.createElement('span');p.className='gg-particle';p.textContent=(symbols[effect]||['✧'])[Math.floor(Math.random()*(symbols[effect]||['✧']).length)];p.style.setProperty('--x',`${Math.random()*100}%`);p.style.setProperty('--size',effect==='rain'?`${8+Math.random()*15}px`:`${9+Math.random()*16}px`);p.style.setProperty('--duration',`${effect==='rain'?1.2+Math.random()*1.8:effect==='snow'?10+Math.random()*9:14+Math.random()*12}s`);p.style.setProperty('--delay',`${-Math.random()*20}s`);p.style.setProperty('--opacity',`${.18+Math.random()*.42}`);p.style.setProperty('--anim',effect==='rain'?'ggRainFall':effect==='snow'?'ggFall':'ggFloat');layer.appendChild(p);}
      document.body.appendChild(layer);
    }
    launcher.addEventListener('click',()=>{const open=!panel.classList.contains('open');panel.classList.toggle('open',open);launcher.setAttribute('aria-expanded',String(open));});
    panel.querySelector('.gg-theme-close').addEventListener('click',()=>{panel.classList.remove('open');launcher.setAttribute('aria-expanded','false');});
    panel.querySelector('.gg-theme-reset').addEventListener('click',()=>{colorInput.value=themes.default.accent;apply('default','');});
    options.addEventListener('click',e=>{const b=e.target.closest('[data-theme]');if(b){colorInput.value=themes[b.dataset.theme].accent;apply(b.dataset.theme,'');}});
    colorInput.addEventListener('input',()=>apply(current,colorInput.value));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){panel.classList.remove('open');launcher.setAttribute('aria-expanded','false');}});
    // Reaplica a preferência salva em cada página do site.
    apply(current,customColor);
  });
})();

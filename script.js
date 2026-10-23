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
      sunny:{label:'Ensolarado',emoji:'☀️',primary:'#65420b',accent:'#f5b82e',bg:'#fff9e8',effect:'sun',desc:'Sol brilhando no alto da página'},
      rain:{label:'Chuva',emoji:'🌧️',primary:'#183047',accent:'#4b9bd6',bg:'#eef5fa',effect:'rain',desc:'Gotas de chuva em movimento'},
      storm:{label:'Tempestade',emoji:'⛈️',primary:'#20243d',accent:'#8c9eff',bg:'#f0f0fa',effect:'storm',desc:'Chuva contínua e água subindo lentamente'},
      sunset:{label:'Pôr do sol',emoji:'🌅',primary:'#7b3425',accent:'#f08a4b',bg:'#fff3e7',effect:'sunset',desc:'Brilho quente de fim de tarde'},
      snow:{label:'Neve',emoji:'❄️',primary:'#23445e',accent:'#79c7e8',bg:'#f0f9ff',effect:'snow',desc:'Flocos caindo pela tela'},
      aurora:{label:'Aurora boreal',emoji:'🌌',primary:'#143b3c',accent:'#2abf9e',bg:'#effaf7',effect:'aurora',desc:'Ondas luminosas coloridas'},
      volcano:{label:'Vulcão',emoji:'🌋',primary:'#421c1b',accent:'#f05b35',bg:'#fff1eb',effect:'volcano',desc:'Erupção, fumaça e brilho de lava'},
      wind:{label:'Vento',emoji:'🌬️',primary:'#294c43',accent:'#72bda3',bg:'#f0faf5',effect:'leaves',desc:'Folhas levadas pelo vento'},
      heat:{label:'Calor solar',emoji:'☀️',primary:'#6d4817',accent:'#e5a323',bg:'#fff9e8',effect:'heat',desc:'Ondulação luminosa de calor'}
    };
    const storageKey = 'geograca-nature-theme-v1';
    let saved = {}; try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch (_) { saved = {}; }
    let current = themes[saved.theme] ? saved.theme : 'default';
    let customColor = /^#[0-9a-f]{6}$/i.test(saved.customColor || '') ? saved.customColor : '';
    const launcher = document.createElement('button'); launcher.className='gg-theme-launcher'; launcher.type='button'; launcher.innerHTML='<span aria-hidden="true">🎨</span><span>Cor e animações</span>'; launcher.setAttribute('aria-expanded','false'); launcher.setAttribute('aria-controls','ggThemePanel');
    const panel = document.createElement('section'); panel.className='gg-theme-panel'; panel.id='ggThemePanel'; panel.setAttribute('aria-label','Personalizar tema e animação');
    panel.innerHTML='<h2>🌎 Personalizar o site</h2><p>Mude a cor de destaque ou escolha um fenômeno natural. A preferência fica salva e acompanha todas as páginas.</p><div class="gg-theme-options" role="group" aria-label="Temas naturais"></div><label class="gg-theme-color-row" for="ggCustomColor"><span>🎨 Cor personalizada</span><input id="ggCustomColor" type="color" value="#b8860b" aria-label="Escolher uma cor personalizada"></label><p id="ggThemeStatus" aria-live="polite">Tema aplicado automaticamente.</p><div class="gg-theme-actions"><button type="button" class="gg-theme-reset">Restaurar original</button><button type="button" class="gg-theme-close">Fechar</button></div>';
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
      document.body.dataset.ggTheme=key;
      document.body.classList.toggle('gg-rain-active',key==='rain'||key==='storm');
      // Atualiza os elementos de fundo mais comuns sem sobrescrever imagens ou mapas.
      document.querySelectorAll('.container,.info-card,.stat-card,.geo-card,.infra-card,.menu-card,.gallery-card,.timeline-item').forEach(el=>{ if(!el.dataset.ggOriginalBg) el.dataset.ggOriginalBg=el.style.backgroundColor||''; if(custom) el.style.borderColor=`rgba(${r},${g},${b},.38)`; else el.style.removeProperty('border-color'); });
      createEffect(t.effect);
      options.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.theme===key)));
      panel.querySelector('#ggThemeStatus').textContent=`${t.emoji} ${t.label}${custom?' com cor personalizada':''} aplicado. Preferência salva neste navegador.`;
      try { localStorage.setItem(storageKey,JSON.stringify({theme:key,customColor:custom})); } catch (_) {}
    };
    function createEffect(effect){
      document.querySelector('.gg-nature-fx')?.remove();
      document.querySelectorAll('.gg-sun-disc,.gg-volcano-scene,.gg-water-rise,.gg-storm-flash').forEach(el=>el.remove());
      if(effect==='none') return;
      if(effect==='sun'){const sun=document.createElement('div');sun.className='gg-sun-disc';sun.setAttribute('aria-hidden','true');document.body.appendChild(sun);return;}
      if(effect==='volcano'){const scene=document.createElement('div');scene.className='gg-volcano-scene';scene.setAttribute('aria-hidden','true');scene.innerHTML='<div class="gg-volcano-smoke"></div><div class="gg-volcano-mountain"></div><div class="gg-lava"></div>';document.body.appendChild(scene);}
      const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const lowMotion=reduceMotion || window.innerWidth < 480;
      if(effect==='storm'){
        const water=document.createElement('div');water.className='gg-water-rise';water.setAttribute('aria-hidden','true');document.body.appendChild(water);
        const flash=document.createElement('div');flash.className='gg-storm-flash';flash.setAttribute('aria-hidden','true');document.body.appendChild(flash);
      }
      const visualEffect=effect==='storm'?'rain':effect;
      const layer=document.createElement('div'); layer.className=`gg-nature-fx gg-fx-${visualEffect}`; layer.setAttribute('aria-hidden','true');
      const symbols={snow:['❄','✧','❅'],embers:['✦','•','✧'],volcano:['✦','•','✧'],leaves:['🍃','🍂','🍁'],aurora:['✧','·','✦'],sunset:['✧','·'],heat:['·','✦'],lightning:['·'],rain:[''],storm:['']};
      const count=lowMotion?(visualEffect==='rain'?5:visualEffect==='snow'?5:visualEffect==='aurora'?0:2):(visualEffect==='rain'?10:visualEffect==='snow'?10:visualEffect==='embers'||visualEffect==='volcano'?7:visualEffect==='leaves'?6:visualEffect==='aurora'||visualEffect==='sunset'||visualEffect==='heat'?0:4);
      for(let i=0;i<count;i++){
        const p=document.createElement('span');p.className='gg-particle';p.textContent=(symbols[visualEffect]||['✧'])[Math.floor(Math.random()*(symbols[visualEffect]||['✧']).length)];
        p.style.setProperty('--x',`${Math.random()*100}%`);p.style.setProperty('--size',visualEffect==='rain'?`${10+Math.random()*9}px`:`${9+Math.random()*16}px`);
        p.style.setProperty('--duration',`${visualEffect==='rain'?0.8+Math.random()*0.8:visualEffect==='snow'?10+Math.random()*9:14+Math.random()*12}s`);p.style.setProperty('--delay',`${-Math.random()*8}s`);p.style.setProperty('--opacity',`${.25+Math.random()*.45}`);
        p.style.setProperty('--anim',visualEffect==='rain'?'ggRainFall':visualEffect==='snow'?'ggFall':visualEffect==='leaves'?'ggLeafFall':visualEffect==='volcano'?'ggEmberRise':'ggFloat');layer.appendChild(p);
      }
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


    // Microinterações dos fenômenos: gotas e neve respondem visualmente ao conteúdo.
    document.addEventListener('pointerover', e => {
      const target=e.target.closest('a,button,h1,h2,h3,p,.gg-info-grid article,.gg-fact,.menu-card');
      if(!target || !document.body.classList.contains('gg-rain-active')) return;
      target.classList.remove('gg-rain-hit'); void target.offsetWidth; target.classList.add('gg-rain-hit');
      window.setTimeout(()=>target.classList.remove('gg-rain-hit'),650);
    }, {passive:true});
    // Envolve cartões informativos com um botão Saiba mais e uma janela acessível.
    const detailTargets=[...document.querySelectorAll('.gg-info-grid article,.gg-timeline article,.gg-fact')];
    if(detailTargets.length){
      const modal=document.createElement('div'); modal.className='gg-detail-modal'; modal.id='ggDetailModal'; modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); modal.setAttribute('aria-labelledby','ggDetailTitle');
      modal.innerHTML='<div class="gg-detail-backdrop" data-close-detail></div><section class="gg-detail-box"><button class="gg-detail-close" type="button" aria-label="Fechar">×</button><span class="gg-eyebrow">GEOGRAÇA • SAIBA MAIS</span><h2 id="ggDetailTitle"></h2><div id="ggDetailBody"></div></section>'; document.body.appendChild(modal);
      const close=()=>{modal.classList.remove('open');document.body.classList.remove('gg-modal-open')}; modal.querySelectorAll('[data-close-detail],.gg-detail-close').forEach(b=>b.addEventListener('click',close)); document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
      detailTargets.forEach(card=>{ if(card.querySelector('.gg-saiba-mais')) return; const title=card.querySelector('h3,strong')?.textContent?.trim() || card.querySelector('span')?.textContent?.trim() || 'Informação'; const original=[...card.querySelectorAll('p')].map(p=>p.innerText.trim()).filter(Boolean).join('\n\n') || card.innerText.trim(); const btn=document.createElement('button'); btn.type='button';btn.className='gg-saiba-mais';btn.innerHTML='Saiba mais <span aria-hidden="true">↗</span>';btn.addEventListener('click',()=>{modal.querySelector('#ggDetailTitle').textContent=title;const body=modal.querySelector('#ggDetailBody');body.replaceChildren();const p=document.createElement('p');p.textContent=original;body.appendChild(p);const note=document.createElement('p');note.className='gg-detail-note';note.textContent='Para aprofundar, consulte as fontes oficiais indicadas nesta página. Datas e indicadores podem ter anos de referência diferentes.';body.appendChild(note);modal.classList.add('open');document.body.classList.add('gg-modal-open');modal.querySelector('.gg-detail-close').focus()});card.appendChild(btn); });
    }

  });
})();

// Controles da paisagem interativa da página Geografia.
document.addEventListener('DOMContentLoaded',()=>{const copy={clima:'O clima influencia a vegetação, a agricultura, a disponibilidade de água e o cotidiano da população.',relevo:'As formas do terreno condicionam caminhos, drenagem, ocupação urbana e práticas agrícolas; a leitura do relevo deve ser apoiada por cartas topográficas.',agua:'Ribeirões, nascentes e áreas de drenagem são essenciais para ecossistemas e atividades humanas. A vegetação ciliar ajuda a proteger as margens e reduzir sedimentos.',uso:'Lavouras, pastagens, áreas construídas e remanescentes vegetais formam um mosaico. Manejo do solo e conservação da água ajudam a reduzir erosão.',cidade:'A área urbana concentra moradia, comércio e serviços. Calçadas, arborização, drenagem e transporte conectam a população aos equipamentos públicos.'};document.querySelectorAll('[data-landscape]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-landscape]').forEach(x=>x.classList.toggle('active',x===b));const cap=document.querySelector('.gg-landscape-caption');if(cap)cap.textContent=copy[b.dataset.landscape]||copy.clima;const scene=document.querySelector('.gg-landscape-scene');if(scene){scene.dataset.focus=b.dataset.landscape;scene.animate([{filter:'brightness(.8)'},{filter:'brightness(1)'}],{duration:500})}}));});

/* GeoGraça — Motor Interativo: Navegação, Saiba Mais Aprofundado e Temas Atmosféricos */
(() => {
  /* ========================================================================
     1. MENU MOBILE, BARRA DE PROGRESSO E BOTÃO TOPO
     ======================================================================== */
  const nav = document.querySelector('nav');
  const navLinks = nav?.querySelector('.nav-links');

  if (nav && navLinks && !nav.querySelector('.mobile-menu-toggle')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'mobile-menu-toggle';
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Abrir menu de navegação');
    toggleBtn.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i> Menu';

    toggleBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('mobile-open');
      toggleBtn.setAttribute('aria-expanded', String(open));
      toggleBtn.innerHTML = open
        ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i> Fechar'
        : '<i class="fa-solid fa-bars" aria-hidden="true"></i> Menu';
    });

    nav.insertBefore(toggleBtn, navLinks);
  }

  const progressBar = document.createElement('div');
  progressBar.className = 'gg-progress';
  document.body.appendChild(progressBar);

  const topBtn = document.createElement('button');
  topBtn.type = 'button';
  topBtn.className = 'gg-top';
  topBtn.setAttribute('aria-label', 'Voltar ao topo da página');
  topBtn.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(topBtn);

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    progressBar.style.width = pct + '%';
    topBtn.classList.toggle('visible', scrollTop > 280);
    if (currentTheme === 'snow') {
      scheduleSnowRectRefresh();
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ========================================================================
     2. BASE DE CONHECIMENTO DO "SAIBA MAIS" (TODAS AS PÁGINAS)
     ======================================================================== */
  const SAIBA_MAIS_DB = [
    /* --- HISTÓRIA --- */
    {
      match: ['primeiros núcleos', 'caminhos', 'povoamento', 'origem', 'fundação'],
      category: 'História • Origens e Povoamento',
      body: 'Antes da colonização moderna, o território do atual Norte Pioneiro paranaense integrava áreas de circulação e ocupação de povos indígenas das famílias linguísticas Jê (Kaingang) e Tupi-Guarani, que utilizavam os vales dos rios Paranapanema, das Cinzas e Jacaré. No século XIX, a abertura de picadas e rotas tropeiras ligando São Paulo (Sorocaba e Itapetininga) ao sul do Brasil impulsionou a chegada de famílias pioneiras vindas principalmente de Minas Gerais e do interior paulista, que formaram o primeiro povoado próximo ao Morro do Bim e aos ribeirões Boi Pintado e Aldeia.',
      highlights: [
        'Presença originária dos povos Kaingang e Guarani nos vales da bacia do Paranapanema.',
        'Fixação dos primeiros moradores e posseiros mineiros e paulistas na segunda metade do século XIX.',
        'Núcleo inicial estruturado ao redor da capela dedicada a Santo Antônio e dos cursos d’água locais.',
      ],
      source: 'IBGE Cidades (Histórico Municipal), Museu Histórico e Arquivo Público do Paraná.',
    },
    {
      match: ['emancipação', '1914', 'município', 'vila', 'freguesia'],
      category: 'História • Emancipação Política',
      body: 'O rápido crescimento demográfico e agrícola levou o povoado a ser elevado à categoria de distrito policial e judiciário vinculado a Jacarezinho no início do século XX. A autonomia político-administrativa foi conquistada por meio da Lei Estadual nº 1.424, sancionada em 31 de março de 1914, criando o município de Santo Antônio da Platina. A instalação oficial ocorreu em 20 de agosto de 1914, data celebrada anualmente como aniversário da cidade.',
      highlights: [
        'Lei Estadual nº 1.424 de 1914 oficializou a criação do município.',
        'Instalação político-administrativa celebrada em 20 de agosto de 1914.',
        'O nome une a devoção católica ao padroeiro Santo Antônio à referência geográfica da região da Platina.',
      ],
      source: 'Assembleia Legislativa do Paraná, IBGE e Prefeitura Municipal de Santo Antônio da Platina.',
    },
    {
      match: ['café', 'cafeicultura', 'ouro verde', 'imigra'],
      category: 'História • Ciclo do Café e Imigração',
      body: 'A partir da década de 1920 e com grande intensidade entre 1940 e 1960, a fertilidade excepcional da Terra Roxa transformou Santo Antônio da Platina em um polo da cafeicultura no Norte Pioneiro. A expansão das lavouras cafeeiras atraiu milhares de trabalhadores e famílias de Minas Gerais, São Paulo e do Nordeste, além de imigrantes italianos, espanhóis, portugueses e japoneses, dinamizando o comércio urbano, bancos, armazéns e a abertura de estradas.',
      highlights: [
        'A Terra Roxa estruturada favoreceu o cultivo intensivo de café de alta produtividade.',
        'Forte fluxo migratório interno (mineiros e paulistas) e internacional (italianos, japoneses, espanhóis e portugueses).',
        'Urbanização acelerada com surgimento de bairros, escolas, clubes sociais e casas comerciais.',
      ],
      source: 'IPARDES, Secretaria de Estado da Cultura do Paraná e acervos historiográficos regionais.',
    },
    {
      match: ['diversificação', 'geada', 'transformação', 'modernização', 'agroindústria', 'ferroviária'],
      category: 'História • Expansão Ferroviária e Transformação',
      body: 'A chegada dos trilhos ferroviários e o posterior ciclo de diversificação produtiva consolidaram Santo Antônio da Platina como eixo comercial do Norte Pioneiro. Pequenas e médias propriedades incorporaram culturas anuais mecanizadas (soja, milho e trigo), pecuária leiteira e de corte, além da integração agroindustrial e do fortalecimento do setor terciário.',
      highlights: [
        'Integração ferroviária pela Estação da Platina impulsionou o escoamento agrícola e o comércio.',
        'Diversificação agrícola com culturas mecanizadas, avicultura e bovinocultura de leite.',
        'Crescimento do setor de serviços, educação e comércio polarizador no Norte Pioneiro.',
      ],
      source: 'IPARDES (Caderno Estatístico Municipal) e IBGE.',
    },
    {
      match: ['patrimônio', 'igreja', 'matriz', 'cultura', 'identidade', 'festas', 'efapi', 'arquitetura'],
      category: 'História & Cultura • Patrimônio e Identidade',
      body: 'A identidade cultural platinense é marcada pela religiosidade, pelas tradições sertanejas e tropeiras e pelos eventos comunitários. No coração da cidade, a Igreja Matriz Santo Antônio (Marco Zero) simboliza a formação histórica do município, enquanto eventos tradicionais como a Expo-EFAPI, festas juninas e celebrações religiosas mantêm viva a memória rural e urbana da comunidade.',
      highlights: [
        'Igreja Matriz Santo Antônio como principal referência arquitetônica e simbólica do centro histórico.',
        'Tradições culinárias e musicais herdadas da cultura caipira, mineira, paulista e de imigrantes.',
        'Eventos agropecuários e culturais que movimentam o turismo regional e a economia local.',
      ],
      source: 'Prefeitura Municipal de Santo Antônio da Platina e Secretaria Municipal de Cultura.',
    },

    /* --- GEOGRAFIA --- */
    {
      match: ['extensão territorial', '720', 'área territorial', 'território'],
      category: 'Geografia • Dimensão Territorial',
      body: 'Com 720,385 km² de extensão territorial oficial (IBGE), Santo Antônio da Platina ocupa posição central no Norte Pioneiro do Paraná. Seu território abrange a sede urbana, distritos administrativos — como Monte Real e Conselheiro Zacarias — e dezenas de bairros e comunidades rurais interligados por estradas vicinais e rodovias.',
      highlights: [
        'Área oficial de 720,385 km² conforme a malha territorial digital do IBGE.',
        'Limita-se com municípios vizinhos como Jacarezinho, Barra do Jacaré, Andirá, Bandeirantes, Abatiá, Ribeirão do Pinhal, Jundiaí do Sul, Guapirama e Joaquim Távora.',
        'Organização espacial equilibrada entre a mancha urbana compacta e extensa zona rural produtiva.',
      ],
      source: 'IBGE — Malha Territorial e Mapa Municipal de Santo Antônio da Platina.',
    },
    {
      match: ['relevo', 'terra roxa', 'solo', 'morro do bim', 'planalto'],
      category: 'Geografia Física • Relevo e Geologia',
      body: 'Geologicamente, o município assenta-se sobre os derrames de lavas basálticas da Formação Serra Geral (Bacia do Paraná), pertencentes ao Terceiro Planalto Paranaense. O relevo apresenta colinas suaves a onduladas com altitudes entre 450 m nos vales fluviais e mais de 800 m nos pontos elevados, destacando-se o Morro do Bim como cartão-postal natural. O intemperismo do basalto originou solos profundos e ricos em óxidos de ferro: a célebre Terra Roxa (Nitossolos e Latossolos Vermelhos).',
      highlights: [
        'Pertence ao Terceiro Planalto Paranaense, caracterizado por espigões e vertentes onduladas.',
        'O Morro do Bim é o principal marco geomorfológico e mirante natural da paisagem local.',
        'Terra Roxa estruturada de alta fertilidade química e física, ideal para a agricultura.',
      ],
      source: 'Mineropar / IAT-PR (Mapa Geológico do Paraná) e Embrapa Solos.',
    },
    {
      match: ['clima', 'subtropical', 'cfa', 'temperatura', 'chuvas'],
      category: 'Geografia Física • Climatologia',
      body: 'Segundo a classificação climática de Köppen-Geiger, Santo Antônio da Platina possui clima Subtropical Úmido Mesotérmico (Cfa). As chuvas são bem distribuídas ao longo do ano, porém com concentração maior entre outubro e março (primavera-verão), período em que atuam sistemas convectivos e a Zona de Convergência do Atlântico Sul. No inverno (junho a agosto), as frentes frias reduzem as temperaturas e podem provocar geadas ocasionais nos fundos de vale.',
      highlights: [
        'Temperatura média anual próxima de 21 °C, com verões quentes e invernos brandos.',
        'Precipitação média anual entre 1.300 mm e 1.500 mm, essencial para a recarga dos aquíferos e lavouras.',
        'Transição climática típica do norte do Paraná, sem estação seca prolongada.',
      ],
      source: 'SIMEPAR — Sistema de Tecnologia e Monitoramento Ambiental do Paraná e IAPAR/IDR-Paraná.',
    },
    {
      match: ['bioma', 'mata atlântica', 'vegetação', 'floresta'],
      category: 'Geografia Ambiental • Bioma e Biodiversidade',
      body: 'O município está integralmente inserido no domínio do Bioma Mata Atlântica, especificamente na fitofisionomia da Floresta Estacional Semidecidual — na qual parte das árvores perde suas folhas durante o período mais frio e menos chuvoso do ano. Hoje, a vegetação nativa persiste em reservas legais, topos de morros (como no entorno do Morro do Bim) e nas matas ciliares que protegem os cursos d’água.',
      highlights: [
        'Fitofisionomia de Floresta Estacional Semidecidual com espécies como peroba-rosa, ipê, figueira e cedro.',
        'As matas ciliares funcionam como corredores ecológicos para aves, pequenos mamíferos e polinizadores.',
        'A recuperação de Áreas de Preservação Permanente (APPs) é vital para evitar o assoreamento dos ribeirões.',
      ],
      source: 'Instituto Água e Terra (IAT-PR) e Fundação SOS Mata Atlântica / INPE.',
    },
    {
      match: ['bacias', 'cursos d’água', 'hidrografia', 'jacaré', 'cinzas', 'ribeirão'],
      category: 'Geografia Física • Recursos Hídricos',
      body: 'A hidrografia municipal integra a Região Hidrográfica do Paraná, dentro da Bacia Hidrográfica do Rio das Cinzas (afluente do Rio Paranapanema). O território é drenado pelos rios Jacaré e das Cinzas e por importantes afluentes locais, como os ribeirões Bonito, Boi Pintado, Aldeia e Vermelho, que sustentam o abastecimento público e a irrigação rural.',
      highlights: [
        'Inserção na Bacia do Rio das Cinzas / Sub-bacia do Paranapanema.',
        'O Ribeirão Boi Pintado e o Ribeirão Aldeia atravessam diretamente a área urbana e seu entorno.',
        'Captação e tratamento de água operados pela Sanepar com monitoramento de qualidade hídrica.',
      ],
      source: 'Instituto Água e Terra (IAT-PR), ANA e Infosanbas.',
    },
    {
      match: ['uso e conservação', 'conservação do solo', 'erosão', 'curvas de nível', 'rural'],
      category: 'Geografia Agrária • Conservação do Solo',
      body: 'Por possuir relevo ondulado e chuvas concentradas no verão, o manejo conservacionista do solo é fundamental em Santo Antônio da Platina. Produtores rurais adotam o Sistema de Plantio Direto (manutenção da palhada sobre o solo), terraços em nível, rotação de culturas e proteção de nascentes, reduzindo drasticamente a perda de solo fértil por erosão.',
      highlights: [
        'Uso amplo do Plantio Direto na palha para manter a umidade e a matéria orgânica da Terra Roxa.',
        'Construção de terraços agrícolas e curvas de nível para conter o escoamento superficial da água.',
        'Integração lavoura-pecuária-floresta em propriedades de pequeno e médio porte.',
      ],
      source: 'IDR-Paraná (Instituto de Desenvolvimento Rural do Paraná) e Embrapa.',
    },
    {
      match: ['organização urbana', 'malha urbana', 'cidade', 'bairros'],
      category: 'Geografia Urbana • Estrutura da Cidade',
      body: 'A estrutura urbana de Santo Antônio da Platina desenvolveu-se de forma radiocêntrica a partir do núcleo histórico central (entorno da Igreja Matriz e Praça Frei Cristóvão), expandindo-se por bairros residenciais planejados e loteamentos que acompanharam os eixos viários da BR-153 e da PR-439.',
      highlights: [
        'Centro comercial e administrativo consolidado com forte oferta de bancos, clínicas e lojas.',
        'Expansão urbana orientada pelos corredores rodoviários e pela topografia dos espigões.',
        'Presença de distritos industriais e áreas de serviços logísticos às margens da BR-153.',
      ],
      source: 'Plano Diretor Municipal de Santo Antônio da Platina e IBGE (Censo Demográfico).',
    },
    {
      match: ['articulação regional', 'norte pioneiro', 'polarização'],
      category: 'Geografia Regional • Rede Urbana',
      body: 'No contexto da rede urbana paranaense, Santo Antônio da Platina atua como centro sub-regional do Norte Pioneiro, dividindo funções de polarização com Jacarezinho. Diariamente, moradores de municípios vizinhos deslocam-se para a cidade em busca de atendimento hospitalar especializado, comércio diversificado, serviços bancários e ensino.',
      highlights: [
        'Polo de comércio, serviços e saúde para mais de 20 municípios do Norte Pioneiro.',
        'Conexão direta com o eixo Londrina–Ourinhos (SP) e com a capital Curitiba.',
        'Intenso fluxo pendular diário de estudantes, trabalhadores e consumidores.',
      ],
      source: 'IBGE — Regiões de Influência das Cidades (REGIC) e IPARDES.',
    },

    /* --- INDICADORES --- */
    {
      match: ['população', 'demografia', 'habitantes', 'censo'],
      category: 'Indicadores • Demografia',
      body: 'Conforme o Censo Demográfico de 2022 do IBGE, Santo Antônio da Platina contabilizou 44.369 habitantes, figurando entre os municípios mais populosos do Norte Pioneiro paranaense, com densidade demográfica de 61,50 hab./km².',
      highlights: [
        'População censitária de 44.369 moradores (Censo 2022 — IBGE).',
        'Densidade demográfica de 61,50 hab./km².',
        'Forte concentração na sede urbana combinada a comunidades rurais produtivas.',
      ],
      source: 'IBGE — Censo Demográfico 2022 e Estimativas Populacionais.',
    },
    {
      match: ['idhm', 'desenvolvimento humano', 'qualidade de vida', 'longevidade'],
      category: 'Indicadores • Desenvolvimento Humano',
      body: 'O Índice de Desenvolvimento Humano Municipal (IDHM) de Santo Antônio da Platina é de 0,718 (faixa de Alto Desenvolvimento Humano), posicionando o município acima da média de grande parte das cidades do interior brasileiro ao combinar longevidade, educação e renda.',
      highlights: [
        'IDHM Global: 0,718 (Alto Desenvolvimento Humano — Atlas Brasil/PNUD).',
        'Infraestrutura regional de saúde e saneamento impulsionam o indicador de longevidade.',
        'Evolução consistente no acesso à escolarização básica e técnica.',
      ],
      source: 'Atlas do Desenvolvimento Humano no Brasil (PNUD / IPEA / FJP).',
    },
    {
      match: ['economia', 'pib', 'agropecuária', 'serviços', 'comércio', 'estrutura produtiva'],
      category: 'Indicadores • Economia e PIB',
      body: 'Com PIB per capita de R$ 41.422,70 (ano-base 2023, IBGE), a economia platinense caracteriza-se pelo equilíbrio entre um setor de serviços e comércio altamente dinâmico, uma agropecuária moderna e agroindústrias voltadas ao processamento de alimentos e insumos.',
      highlights: [
        'Comércio varejista e atacadista com forte atração de consumidores de toda a microrregião.',
        'Produção agrícola diversificada: soja, milho, cana-de-açúcar, café especial, leite e avicultura.',
        'Ambiente favorável ao empreendedorismo com milhares de empresas ativas.',
      ],
      source: 'IBGE — Produto Interno Bruto dos Municípios e IPARDES.',
    },
    {
      match: ['educação', 'ensino', 'escolas', 'ideb', 'universidade', 'escolarização'],
      category: 'Indicadores • Educação',
      body: 'O sistema educacional municipal e estadual atende desde a educação infantil até o ensino médio, técnico e superior. A taxa de escolarização de crianças e jovens de 6 a 14 anos alcança 99,04% (IBGE), apoiada por escolas municipais, colégios estaduais tradicionais, campus do IFPR e instituições de ensino superior.',
      highlights: [
        'Taxa de escolarização de 99,04% na faixa de 6 a 14 anos (IBGE).',
        'Oferta de cursos técnicos (IFPR) e superiores que qualificam jovens talentos na região.',
        'Programas municipais de transporte escolar rural, merenda e formação docente.',
      ],
      source: 'INEP / MEC (Censo Escolar e IDEB) e Secretaria Municipal de Educação.',
    },
    {
      match: ['saúde', 'hospital', 'regional de saúde', 'sus'],
      category: 'Indicadores • Saúde Pública',
      body: 'Santo Antônio da Platina sedia o Hospital Regional do Norte Pioneiro, unidade estratégica do SUS que atende casos de média e alta complexidade para mais de 20 municípios da região, além de contar com Unidades Básicas de Saúde (UBS), pronto atendimento e clínicas especializadas.',
      highlights: [
        'Hospital Regional do Norte Pioneiro como referência hospitalar microrregional.',
        'Rede de Atenção Primária distribuída pelos bairros urbanos e distritos rurais.',
        'Cobertura vacinal e acompanhamento materno-infantil estruturados pela rede municipal.',
      ],
      source: 'Secretaria de Estado da Saúde do Paraná (SESA-PR) e DATASUS.',
    },

    /* --- INFRAESTRUTURA --- */
    {
      match: ['rodoviária', 'br-153', 'logística', 'transporte', 'estradas', 'malha viária', 'mobilidade'],
      category: 'Infraestrutura • Mobilidade e Logística',
      body: 'A localização às margens da rodovia federal BR-153 (Transbrasiliana) e das rodovias estaduais regionais confere a Santo Antônio da Platina um papel logístico privilegiado, conectando o interior paulista ao centro-sul do Paraná e aos corredores de exportação.',
      highlights: [
        'BR-153 conecta o município diretamente ao estado de São Paulo (Ourinhos) e ao sul do país.',
        'Conservação de vias urbanas e estradas vicinais garante escoamento agrícola e transporte escolar.',
        'Terminal rodoviário intermunicipal e interestadual com linhas diárias para capitais e polos regionais.',
      ],
      source: 'DER-PR (Departamento de Estradas de Rodagem) e DNIT.',
    },
    {
      match: ['saneamento', 'abastecimento', 'água', 'esgoto', 'sanepar', 'resíduos'],
      category: 'Infraestrutura • Saneamento Básico',
      body: 'Os serviços de abastecimento de água tratada e esgotamento sanitário na área urbana são operados pela Companhia de Saneamento do Paraná (Sanepar), complementados pela coleta regular de resíduos sólidos e drenagem pluvial.',
      highlights: [
        'Ampla cobertura de água potável tratada na sede urbana.',
        'Coleta e tratamento de esgoto sanitário contribuindo para a proteção dos ribeirões urbanos.',
        'Coleta regular de resíduos sólidos urbanos e limpeza de galerias pluviais.',
      ],
      source: 'SNIS (Sistema Nacional de Informações sobre Saneamento) e Sanepar.',
    },
    {
      match: ['energia', 'telecomunicações', 'internet', 'copel'],
      category: 'Infraestrutura • Energia e Conectividade',
      body: 'O fornecimento de energia elétrica e redes de fibra óptica e telefonia móvel dá suporte contínuo ao comércio, às escolas, às unidades de saúde e às propriedades rurais mecanizadas e agroindústrias.',
      highlights: [
        'Rede elétrica estável com suporte a irrigação, resfriadores de leite e indústrias.',
        'Expansão de internet por fibra óptica nos bairros e conectividade no campo.',
        'Crescente adoção de energia solar fotovoltaica em residências, comércios e propriedades rurais.',
      ],
      source: 'Copel, ANEEL e Anatel.',
    },

    /* --- LOCALIZAÇÃO --- */
    {
      match: ['coordenadas', 'posição geográfica', 'latitude', 'longitude', 'cartografia'],
      category: 'Localização • Cartografia e Coordenadas',
      body: 'A sede municipal de Santo Antônio da Platina situa-se nas coordenadas geográficas 23° 17\' 42" de latitude Sul e 50° 04\' 37" de longitude Oeste (−23,29°, −50,07°), inserida na Mesorregião Geográfica do Norte Pioneiro Paranaense.',
      highlights: [
        'Latitude: 23° 17\' 42" S | Longitude: 50° 04\' 37" O.',
        'Mapas oficiais do IBGE delimitam perímetro urbano, hidrografia e divisas intermunicipais.',
        'Integrante estratégica da Mesorregião do Norte Pioneiro Paranaense.',
      ],
      source: 'IBGE — Base Cartográfica Contínua do Brasil.',
    },
    {
      match: ['distâncias', 'curitiba', 'londrina', 'são paulo', 'ourinhos', 'acessos'],
      category: 'Localização • Distâncias Estratégicas',
      body: 'A posição geográfica de Santo Antônio da Platina facilita o acesso rápido a centros regionais e capitais do Sul e Sudeste do Brasil, tornando o município um ponto estratégico de convergência comercial e de serviços.',
      highlights: [
        'Jacarezinho: ~28 km | Ourinhos (SP): ~75 km.',
        'Londrina: ~140 km | Curitiba (Capital): ~362 km.',
        'Conexão direta pela BR-153 e rodovias estaduais integradas.',
      ],
      source: 'DER-PR e Departamento Nacional de Infraestrutura de Transportes (DNIT).',
    },
  ];

  function findSaibaMaisContent(titleText, summaryText) {
    const normalized = (titleText + ' ' + summaryText).toLowerCase();
    for (const item of SAIBA_MAIS_DB) {
      if (item.match.some((kw) => normalized.includes(kw))) {
        return item;
      }
    }

    const pageTitle = document.title.split('—')[0].trim() || 'GeoGraça';
    return {
      category: `${pageTitle} • Estudo Detalhado`,
      body: `${summaryText} Em Santo Antônio da Platina, esse aspecto articula diretamente as condições naturais do Norte Pioneiro paranaense com a organização histórica, social e econômica da comunidade local, contribuindo para o desenvolvimento sustentável do município.`,
      highlights: [
        'Tema integrado à realidade geográfica e histórica de Santo Antônio da Platina — PR.',
        'Dados contextualizados a partir de levantamentos oficiais do IBGE, IPARDES e órgãos estaduais.',
        'Use o menu superior ou as demais seções do portal para relacionar este tema ao território.',
      ],
      source: 'IBGE Cidades, IPARDES e Prefeitura Municipal de Santo Antônio da Platina.',
    };
  }

  function initSaibaMais() {
    const targets = document.querySelectorAll(
      '.gg-info-grid article, .gg-timeline article, .gg-extra-grid article'
    );
    if (!targets.length) return;

    let modal = document.getElementById('ggDetailModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'ggDetailModal';
      modal.className = 'gg-detail-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'ggDetailTitle');
      modal.innerHTML = `
        <div class="gg-detail-backdrop" data-close-modal="true"></div>
        <div class="gg-detail-box">
          <button type="button" class="gg-detail-close" aria-label="Fechar janela de leitura" data-close-modal="true">&times;</button>
          <span id="ggDetailKicker" class="gg-detail-kicker">GEOGRAÇA • SAIBA MAIS</span>
          <h2 id="ggDetailTitle"></h2>
          <p id="ggDetailBody"></p>
          <div class="gg-detail-highlights">
            <h3><i class="fa-solid fa-star" aria-hidden="true"></i> Destaques e Contexto</h3>
            <ul id="ggDetailList"></ul>
          </div>
          <div class="gg-detail-footer">
            <p id="ggDetailSource" class="gg-detail-note"></p>
            <button type="button" class="gg-detail-done" data-close-modal="true">Concluir leitura</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const kickerEl = modal.querySelector('#ggDetailKicker');
    const titleEl = modal.querySelector('#ggDetailTitle');
    const bodyEl = modal.querySelector('#ggDetailBody');
    const listEl = modal.querySelector('#ggDetailList');
    const sourceEl = modal.querySelector('#ggDetailSource');
    let lastTrigger = null;

    function closeModal() {
      modal.classList.remove('open');
      document.body.classList.remove('gg-modal-open');
      if (lastTrigger) lastTrigger.focus();
    }

    function openModal(headingText, summaryText, triggerBtn) {
      lastTrigger = triggerBtn;
      const cleanTitle = headingText.replace(/^[^\p{L}\p{N}]+/u, '').trim();
      const info = findSaibaMaisContent(cleanTitle, summaryText);

      kickerEl.textContent = info.category;
      titleEl.textContent = cleanTitle;
      bodyEl.textContent = info.body;

      listEl.innerHTML = '';
      info.highlights.forEach((point) => {
        const li = document.createElement('li');
        li.textContent = point;
        listEl.appendChild(li);
      });

      sourceEl.innerHTML = `<strong>Fontes e referências:</strong> ${info.source}`;

      modal.classList.add('open');
      document.body.classList.add('gg-modal-open');
      modal.querySelector('.gg-detail-box').scrollTop = 0;
      modal.querySelector('.gg-detail-close').focus();
    }

    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-close-modal="true"]')) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    targets.forEach((article) => {
      if (article.querySelector('.gg-saiba-mais')) return;
      const h3 = article.querySelector('h3');
      const p = article.querySelector('p');
      if (!h3 || !p) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gg-saiba-mais';
      btn.innerHTML = '<i class="fa-solid fa-book-open" aria-hidden="true"></i> Saiba mais';
      btn.addEventListener('click', () => openModal(h3.textContent, p.textContent, btn));
      article.appendChild(btn);
    });
  }

  initSaibaMais();

  /* ========================================================================
     3. NEVE ACUMULANDO EM CIMA DAS LETRAS
     ======================================================================== */
  const SNOW_HEADING_SELECTOR =
    'nav .logo, .main-header h1, .banner-header h1, .hero-banner h2, .section-title, .gg-section-head h2';

  let snowCharItems = [];
  let snowAccumTimer = null;
  let snowRectTimer = null;

  function getCharSnowTopOffset(ch) {
    if (/[ÁÉÍÓÚÃÕÂÊÔÀÜÇ]/u.test(ch)) return '0.02em';
    if (/[A-Z0-9&—\-]/u.test(ch)) return '0.12em';
    if (/[bdfhijkltáéíóúãõâêôàü]/u.test(ch)) return '0.10em';
    return '0.26em';
  }

  function wrapTextNodesWithSnowChars(node, outList) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      if (!text || !text.trim()) return;

      const frag = document.createDocumentFragment();
      const tokens = text.split(/(\s+)/);

      for (const token of tokens) {
        if (!token) continue;
        if (/^\s+$/.test(token)) {
          frag.appendChild(document.createTextNode(token));
        } else {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'gg-snow-word';

          for (const ch of Array.from(token)) {
            const charSpan = document.createElement('span');
            charSpan.className = 'gg-snow-char';
            charSpan.textContent = ch;

            const scaleX = (0.9 + Math.random() * 0.24).toFixed(2);
            const skew = (Math.random() * 8 - 4).toFixed(1) + 'deg';
            const r1 = 46 + Math.floor(Math.random() * 20);
            const r2 = 44 + Math.floor(Math.random() * 22);
            charSpan.style.setProperty('--snow-top', getCharSnowTopOffset(ch));
            charSpan.style.setProperty('--snow-scale-x', scaleX);
            charSpan.style.setProperty('--snow-skew', skew);
            charSpan.style.setProperty(
              '--snow-radius',
              `${r1}% ${r2}% 35% 40% / 84% 80% 34% 36%`
            );

            wordSpan.appendChild(charSpan);
            outList.push({
              el: charSpan,
              fill: 0,
              rect: null,
            });
          }
          frag.appendChild(wordSpan);
        }
      }

      node.parentNode.replaceChild(frag, node);
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'I' || node.classList.contains('gg-snow-char')) return;
      const children = Array.from(node.childNodes);
      for (const child of children) {
        wrapTextNodesWithSnowChars(child, outList);
      }
    }
  }

  function refreshSnowCharRects() {
    for (const item of snowCharItems) {
      const r = item.el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.bottom >= -40 && r.top <= H + 40) {
        item.rect = r;
      } else {
        item.rect = null;
      }
    }
  }

  function scheduleSnowRectRefresh() {
    if (snowRectTimer) return;
    snowRectTimer = setTimeout(() => {
      snowRectTimer = null;
      if (currentTheme === 'snow') refreshSnowCharRects();
    }, 120);
  }

  function getMaxSnowFill() {
    if (currentIntensity === 'low') return 0.58;
    if (currentIntensity === 'high') return 1.0;
    return 0.85;
  }

  function initLetterSnow() {
    clearLetterSnow();
    const headings = document.querySelectorAll(SNOW_HEADING_SELECTOR);
    headings.forEach((el) => {
      if (!el.dataset.ggOrigHtml) {
        el.dataset.ggOrigHtml = el.innerHTML;
      }
      if (!el.getAttribute('aria-label')) {
        el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
      }
      wrapTextNodesWithSnowChars(el, snowCharItems);
    });

    refreshSnowCharRects();

    // Acúmulo progressivo natural para que a neve comece a surgir em cima de todas as letras
    snowAccumTimer = setInterval(() => {
      if (currentTheme !== 'snow' || !snowCharItems.length) return;
      const maxFill = getMaxSnowFill();
      const baseStep = currentIntensity === 'low' ? 0.028 : currentIntensity === 'high' ? 0.065 : 0.045;

      for (const item of snowCharItems) {
        if (item.fill < maxFill) {
          const jitter = 0.4 + Math.random() * 1.2;
          item.fill = Math.min(maxFill, item.fill + baseStep * jitter);
          item.el.style.setProperty('--snow-fill', item.fill.toFixed(3));
        }
      }
    }, 650);
  }

  function clearLetterSnow() {
    if (snowAccumTimer) {
      clearInterval(snowAccumTimer);
      snowAccumTimer = null;
    }
    snowCharItems = [];
    document.querySelectorAll(SNOW_HEADING_SELECTOR).forEach((el) => {
      if (el.dataset.ggOrigHtml) {
        el.innerHTML = el.dataset.ggOrigHtml;
        delete el.dataset.ggOrigHtml;
        el.removeAttribute('aria-label');
      }
    });
  }

  /* ========================================================================
     4. MOTOR ATMOSFÉRICO REALISTA E PERSONALIZAÇÃO DE TEMAS
     ======================================================================== */
  const THEMES = [
    { id: 'default', name: 'Original', desc: 'Clássico claro', accent: '#b8860b', primary: '#1a261d' },
    { id: 'sunny', name: 'Ensolarado', desc: 'Raios dourados', accent: '#d98a14', primary: '#694310' },
    { id: 'rain', name: 'Chuva', desc: 'Gotas e reflexão', accent: '#2c82b8', primary: '#10293d' },
    { id: 'storm', name: 'Tempestade', desc: 'Raios e água subindo', accent: '#6ea8ff', primary: '#0b1222' },
    { id: 'sunset', name: 'Pôr do sol', desc: 'Crepúsculo quente', accent: '#e06236', primary: '#542126' },
    { id: 'snow', name: 'Neve', desc: 'Flocos nas letras', accent: '#4a9ec9', primary: '#16364d' },
    { id: 'aurora', name: 'Aurora boreal', desc: 'Véus polares', accent: '#2ad6ad', primary: '#06232b' },
    { id: 'volcano', name: 'Vulcão', desc: 'Erupção, brasas e lava', accent: '#f26430', primary: '#2b1114' },
    { id: 'wind', name: 'Vento', desc: 'Folhas ao vento', accent: '#369977', primary: '#163b31' },
    { id: 'heat', name: 'Calor solar', desc: 'Brilho intenso', accent: '#d48217', primary: '#5e3c10' },
  ];

  const STORAGE_THEME = 'gg_theme_id';
  const STORAGE_INTENSITY = 'gg_theme_intensity';
  const STORAGE_COLOR = 'gg_theme_custom_color';

  let currentTheme = localStorage.getItem(STORAGE_THEME) || 'default';
  let currentIntensity = localStorage.getItem(STORAGE_INTENSITY) || 'medium';
  let customColor = localStorage.getItem(STORAGE_COLOR) || '';

  const skyBackdrop = document.createElement('div');
  skyBackdrop.className = 'gg-sky-backdrop';
  document.body.prepend(skyBackdrop);

  const canvas = document.createElement('canvas');
  canvas.id = 'ggAtmosphereCanvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const vignette = document.createElement('div');
  vignette.className = 'gg-screen-vignette';
  document.body.appendChild(vignette);

  let extraSceneEl = null;

  function buildVolcanoMarkup() {
    return `
      <div class="gg-volcano-glow"></div>
      <div class="gg-volcano-plume">
        <span></span><span></span><span></span><span></span>
      </div>
      <svg class="gg-volcano-svg" viewBox="0 0 1440 640" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="ggVolcanoRockMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#170d11" />
            <stop offset="48%" stop-color="#2c1718" />
            <stop offset="100%" stop-color="#0f070a" />
          </linearGradient>
          <linearGradient id="ggVolcanoRockShade" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3c1e1b" stop-opacity="0.7" />
            <stop offset="100%" stop-color="#0d0609" stop-opacity="0.95" />
          </linearGradient>
          <radialGradient id="ggCraterMagma" cx="50%" cy="55%" r="55%">
            <stop offset="0%" stop-color="#fff8bf" />
            <stop offset="38%" stop-color="#ff8c24" />
            <stop offset="78%" stop-color="#d42b08" />
            <stop offset="100%" stop-color="#4a0b04" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="ggLavaRiverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fff099" />
            <stop offset="35%" stop-color="#ff7a1c" />
            <stop offset="80%" stop-color="#d92b0b" />
            <stop offset="100%" stop-color="#7a1106" />
          </linearGradient>
          <filter id="ggMagmaGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Cadeias vulcânicas distantes (profundidade atmosférica) -->
        <polygon points="-40,640 160,395 310,455 495,335 680,470 910,360 1120,445 1295,350 1480,640" fill="#170d11" opacity="0.72" />
        <polygon points="0,640 230,450 420,490 610,415 840,485 1060,420 1260,475 1440,420 1440,640" fill="#12090c" opacity="0.88" />

        <!-- Brilho da boca da cratera -->
        <ellipse cx="720" cy="188" rx="115" ry="42" fill="url(#ggCraterMagma)" filter="url(#ggMagmaGlow)" />

        <!-- Cone principal do estratovulcão -->
        <polygon points="150,640 345,485 475,385 605,248 666,184 696,196 722,182 752,195 778,183 842,256 975,392 1115,495 1295,640" fill="url(#ggVolcanoRockMain)" />

        <!-- Facetas rochosas sombreadas para relevo 3D -->
        <polygon points="722,182 778,183 842,256 975,392 1115,495 1295,640 860,640 795,435 745,285" fill="url(#ggVolcanoRockShade)" />
        <polygon points="605,248 666,184 695,295 620,465 510,640 345,485 475,385" fill="#231215" opacity="0.75" />

        <!-- Borda incandescente da cratera -->
        <path d="M666,185 Q695,204 722,184 Q750,203 778,184" fill="none" stroke="#ff9f38" stroke-width="5" stroke-linecap="round" filter="url(#ggMagmaGlow)" />

        <!-- Rios de lava escorrendo pelas encostas -->
        <path class="gg-lava-flow-path" d="M686,193 C674,242 642,282 628,332 C614,380 572,425 548,492 C532,538 498,588 474,638" fill="none" stroke="url(#ggLavaRiverGrad)" stroke-width="6.5" stroke-linecap="round" filter="url(#ggMagmaGlow)" />
        <path class="gg-lava-flow-path delay" d="M744,193 C758,244 794,288 812,342 C828,392 874,442 904,508 C924,552 956,594 982,638" fill="none" stroke="url(#ggLavaRiverGrad)" stroke-width="7" stroke-linecap="round" filter="url(#ggMagmaGlow)" />
        <path class="gg-lava-flow-path" d="M718,194 C716,255 704,310 712,374 C720,434 696,502 688,572 L682,638" fill="none" stroke="url(#ggLavaRiverGrad)" stroke-width="5" stroke-linecap="round" filter="url(#ggMagmaGlow)" />

        <!-- Fissuras secundárias de magma -->
        <path class="gg-lava-flow-path delay" d="M628,332 C595,358 564,388 536,428" fill="none" stroke="#ff661a" stroke-width="3" stroke-linecap="round" opacity="0.85" />
        <path class="gg-lava-flow-path" d="M812,342 C846,368 882,398 914,442" fill="none" stroke="#ff661a" stroke-width="3.2" stroke-linecap="round" opacity="0.85" />
      </svg>
      <div class="gg-lava"></div>
    `;
  }

  function buildWaterRiseMarkup() {
    return `
      <div class="gg-water-swell">
        <svg class="gg-water-wave gg-water-wave-back" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,22 C180,6 360,36 540,20 C720,4 900,34 1080,18 C1260,4 1350,28 1440,22 L1440,40 L0,40 Z" fill="rgba(18, 86, 138, 0.72)" />
        </svg>
        <svg class="gg-water-wave gg-water-wave-front" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,18 C160,34 320,4 480,20 C640,36 800,6 960,22 C1120,36 1280,8 1440,18 L1440,40 L0,40 Z" fill="rgba(38, 128, 184, 0.56)" />
          <path d="M0,18 C160,34 320,4 480,20 C640,36 800,6 960,22 C1120,36 1280,8 1440,18" fill="none" stroke="rgba(195, 240, 255, 0.82)" stroke-width="2.6" />
        </svg>
        <div class="gg-water-body"></div>
      </div>
    `;
  }

  function applyTheme(themeId, intensity = currentIntensity, colorOverride = customColor) {
    const valid = THEMES.find((t) => t.id === themeId) || THEMES[0];
    currentTheme = valid.id;
    currentIntensity = intensity;
    customColor = colorOverride;

    document.body.classList.add('gg-theme-shifting');
    document.body.dataset.ggTheme = currentTheme;
    document.body.classList.remove('gg-intensity-low', 'gg-intensity-medium', 'gg-intensity-high');
    document.body.classList.add(`gg-intensity-${currentIntensity}`);

    const accent = colorOverride || valid.accent;
    document.documentElement.style.setProperty('--gg-event-accent', accent);
    document.documentElement.style.setProperty('--gg-event-primary', valid.primary);
    document.documentElement.style.setProperty('--gg-event-glow', accent + '44');

    localStorage.setItem(STORAGE_THEME, currentTheme);
    localStorage.setItem(STORAGE_INTENSITY, currentIntensity);
    if (colorOverride) localStorage.setItem(STORAGE_COLOR, colorOverride);
    else localStorage.removeItem(STORAGE_COLOR);

    if (extraSceneEl) {
      extraSceneEl.remove();
      extraSceneEl = null;
    }

    if (currentTheme === 'volcano') {
      extraSceneEl = document.createElement('div');
      extraSceneEl.className = 'gg-volcano-scene';
      extraSceneEl.innerHTML = buildVolcanoMarkup();
      document.body.appendChild(extraSceneEl);
    } else if (currentTheme === 'storm' || currentTheme === 'rain') {
      extraSceneEl = document.createElement('div');
      extraSceneEl.className = `gg-water-rise ${currentTheme === 'storm' ? 'gg-water-storm' : 'gg-water-rain'}`;
      extraSceneEl.innerHTML = buildWaterRiseMarkup();
      document.body.appendChild(extraSceneEl);
    }

    if (currentTheme === 'snow') {
      initLetterSnow();
    } else {
      clearLetterSnow();
    }

    rebuildParticles();
    setTimeout(() => document.body.classList.remove('gg-theme-shifting'), 900);
  }

  // Menu dropdown e painel de personalização
  const weatherBtn = document.getElementById('weatherToggleBtn');
  const weatherMenu = document.getElementById('weatherMenu');

  if (weatherBtn && weatherMenu) {
    const launcher = document.createElement('button');
    launcher.type = 'button';
    launcher.className = 'gg-theme-launcher';
    launcher.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Abrir painel de temas';
    weatherMenu.appendChild(launcher);

    const panel = document.createElement('aside');
    panel.className = 'gg-theme-panel';
    panel.setAttribute('aria-label', 'Personalização visual do site');
    panel.innerHTML = `
      <h2>Personalização visual</h2>
      <p>Escolha um fenômeno natural e a intensidade dos efeitos atmosféricos.</p>
      <div class="gg-theme-options"></div>
      <div class="gg-intensity-row">
        <span class="gg-intensity-label">Intensidade do efeito</span>
        <div class="gg-intensity-group">
          <button type="button" class="gg-intensity-btn" data-int="low">Suave</button>
          <button type="button" class="gg-intensity-btn" data-int="medium">Média</button>
          <button type="button" class="gg-intensity-btn" data-int="high">Intensa</button>
        </div>
      </div>
      <div class="gg-theme-color-row">
        <label for="ggAccentPicker">Cor de destaque</label>
        <input type="color" id="ggAccentPicker" value="#b8860b">
      </div>
      <div class="gg-theme-actions">
        <button type="button" id="ggResetTheme">Restaurar padrão</button>
        <button type="button" class="gg-theme-close" id="ggCloseThemePanel">Fechar</button>
      </div>
    `;
    document.body.appendChild(panel);

    const optionsWrap = panel.querySelector('.gg-theme-options');
    const colorInput = panel.querySelector('#ggAccentPicker');

    function syncPanelUI() {
      optionsWrap.querySelectorAll('.gg-theme-option').forEach((btn) => {
        btn.setAttribute('aria-pressed', String(btn.dataset.themeId === currentTheme));
      });
      panel.querySelectorAll('.gg-intensity-btn').forEach((btn) => {
        btn.setAttribute('aria-pressed', String(btn.dataset.int === currentIntensity));
      });
      const activeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0];
      colorInput.value = customColor || activeObj.accent;
    }

    THEMES.forEach((t) => {
      const opt = document.createElement('button');
      opt.type = 'button';
      opt.className = 'gg-theme-option';
      opt.dataset.themeId = t.id;
      opt.innerHTML = `${t.name}<small>${t.desc}</small>`;
      opt.addEventListener('click', () => {
        applyTheme(t.id, currentIntensity, customColor);
        syncPanelUI();
      });
      optionsWrap.appendChild(opt);
    });

    panel.querySelectorAll('.gg-intensity-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyTheme(currentTheme, btn.dataset.int, customColor);
        syncPanelUI();
      });
    });

    colorInput.addEventListener('input', (e) => {
      applyTheme(currentTheme, currentIntensity, e.target.value);
    });

    panel.querySelector('#ggResetTheme').addEventListener('click', () => {
      applyTheme('default', 'medium', '');
      syncPanelUI();
    });

    panel.querySelector('#ggCloseThemePanel').addEventListener('click', () => {
      panel.classList.remove('open');
    });

    weatherBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const shown = weatherMenu.classList.toggle('show');
      weatherBtn.setAttribute('aria-expanded', String(shown));
    });

    launcher.addEventListener('click', () => {
      weatherMenu.classList.remove('show');
      weatherBtn.setAttribute('aria-expanded', 'false');
      syncPanelUI();
      panel.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!weatherMenu.contains(e.target) && e.target !== weatherBtn) {
        weatherMenu.classList.remove('show');
        weatherBtn.setAttribute('aria-expanded', 'false');
      }
      if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== launcher) {
        panel.classList.remove('open');
      }
    });

    syncPanelUI();
  }

  /* ========================================================================
     5. RENDERIZAÇÃO DAS PARTÍCULAS NO CANVAS (CHUVA + RESPINGOS, NEVE, VULCÃO)
     ======================================================================== */
  let particles = [];
  let waterSplashes = [];
  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    if (currentTheme === 'snow') {
      refreshSnowCharRects();
    }
  });

  function getCountMultiplier() {
    if (currentIntensity === 'low') return 0.5;
    if (currentIntensity === 'high') return 1.75;
    return 1;
  }

  function getCraterOrigin() {
    const svgH = Math.min(Math.max(340, H * 0.6), 660);
    return {
      x: W * 0.5,
      y: H - svgH * 0.7,
    };
  }

  function spawnVolcanoParticle(fromCrater = false) {
    if (fromCrater) {
      const origin = getCraterOrigin();
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.95;
      const ejectSpeed = 3.2 + Math.random() * 5.2;
      return {
        kind: 'ejecta',
        x: origin.x + (Math.random() - 0.5) * 46,
        y: origin.y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * ejectSpeed,
        vy: Math.sin(angle) * ejectSpeed,
        gravity: 0.065 + Math.random() * 0.04,
        r: 1.6 + Math.random() * 2.6,
        life: 1,
        decay: 0.008 + Math.random() * 0.009,
        phase: Math.random() * Math.PI * 2,
      };
    }

    return {
      kind: 'ember',
      x: Math.random() * W,
      y: H + Math.random() * 120,
      r: 1.3 + Math.random() * 2.5,
      speed: 1.1 + Math.random() * 2.2,
      phase: Math.random() * Math.PI * 2,
    };
  }

  function rebuildParticles() {
    particles = [];
    waterSplashes = [];
    const mult = getCountMultiplier();

    if (currentTheme === 'rain' || currentTheme === 'storm') {
      const count = Math.floor((currentTheme === 'storm' ? 150 : 95) * mult);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          len: 12 + Math.random() * 18,
          speed: 11 + Math.random() * 9,
          drift: currentTheme === 'storm' ? -2.8 : -1.2,
          alpha: 0.25 + Math.random() * 0.45,
        });
      }
    } else if (currentTheme === 'snow') {
      const count = Math.floor(95 * mult);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 1.6 + Math.random() * 3.2,
          speed: 0.9 + Math.random() * 1.6,
          phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (currentTheme === 'volcano') {
      const emberCount = Math.floor(55 * mult);
      const ejectaCount = Math.floor(38 * mult);
      for (let i = 0; i < emberCount; i++) {
        particles.push(spawnVolcanoParticle(false));
      }
      for (let i = 0; i < ejectaCount; i++) {
        const p = spawnVolcanoParticle(true);
        p.life = Math.random();
        particles.push(p);
      }
    } else if (currentTheme === 'wind') {
      const count = Math.floor(34 * mult);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          size: 5 + Math.random() * 6,
          speed: 2.5 + Math.random() * 3.5,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.08,
        });
      }
    } else if (currentTheme === 'sunny' || currentTheme === 'heat' || currentTheme === 'sunset') {
      const count = Math.floor(28 * mult);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 1 + Math.random() * 2.4,
          vy: -0.25 - Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  let lightningTimer = 0;
  let tick = 0;

  function renderAtmosphere() {
    requestAnimationFrame(renderAtmosphere);
    tick += 0.016;
    ctx.clearRect(0, 0, W, H);

    if (currentTheme === 'default') return;

    if (currentTheme === 'aurora') {
      const grad = ctx.createLinearGradient(0, 0, W, H * 0.45);
      grad.addColorStop(0, 'rgba(38, 235, 185, 0.14)');
      grad.addColorStop(0.5, 'rgba(84, 152, 255, 0.12)');
      grad.addColorStop(1, 'rgba(155, 92, 246, 0.08)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let x = 0; x <= W; x += 40) {
        const y = H * 0.22 + Math.sin(x * 0.004 + tick * 0.9) * 45 + Math.cos(x * 0.009 - tick * 0.5) * 25;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, 0);
      ctx.closePath();
      ctx.fill();
      return;
    }

    if (currentTheme === 'rain' || currentTheme === 'storm') {
      const waterSurfaceY = extraSceneEl ? extraSceneEl.getBoundingClientRect().top + 16 : H + 50;

      ctx.strokeStyle = currentTheme === 'storm' ? 'rgba(185, 215, 255, 0.44)' : 'rgba(210, 236, 255, 0.5)';
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      for (const p of particles) {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.drift, p.y + p.len);
        p.x += p.drift;
        p.y += p.speed;

        // Respingos quando a gota atinge a superfície da água subindo
        if (p.y >= waterSurfaceY && waterSurfaceY < H - 4) {
          if (waterSplashes.length < 48 && Math.random() < 0.35) {
            waterSplashes.push({
              x: p.x,
              y: waterSurfaceY + (Math.random() * 6 - 3),
              rx: 2,
              alpha: 0.72,
            });
          }
          p.y = -20;
          p.x = Math.random() * W;
        } else if (p.y > H) {
          p.y = -20;
          p.x = Math.random() * W;
        }
        if (p.x < 0) p.x = W;
      }
      ctx.stroke();

      // Desenha anéis e gotículas de respingo sobre a água
      for (let i = waterSplashes.length - 1; i >= 0; i--) {
        const s = waterSplashes[i];
        ctx.strokeStyle = `rgba(212, 244, 255, ${s.alpha.toFixed(2)})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.rx, s.rx * 0.32, 0, 0, Math.PI * 2);
        ctx.stroke();

        s.rx += 0.85;
        s.alpha -= 0.045;
        if (s.alpha <= 0) {
          waterSplashes.splice(i, 1);
        }
      }

      if (currentTheme === 'storm') {
        lightningTimer -= 0.016;
        if (lightningTimer <= 0 && Math.random() < 0.008) {
          lightningTimer = 0.22;
          document.body.classList.add('gg-lightning-strike');
          setTimeout(() => document.body.classList.remove('gg-lightning-strike'), 140);
        }
      }
      return;
    }

    if (currentTheme === 'snow') {
      const maxFill = getMaxSnowFill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.beginPath();
      for (const p of particles) {
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        p.y += p.speed;
        p.x += Math.sin(tick + p.phase) * 0.65;

        // Detecta floco tocando o topo de alguma letra para acumular neve
        if (snowCharItems.length && Math.random() < 0.28) {
          for (let i = 0; i < snowCharItems.length; i++) {
            const item = snowCharItems[i];
            const r = item.rect;
            if (!r) continue;
            if (p.x >= r.left - 2 && p.x <= r.right + 2 && Math.abs(p.y - (r.top + r.height * 0.22)) < 4) {
              if (item.fill < maxFill) {
                item.fill = Math.min(maxFill, item.fill + 0.18);
                item.el.style.setProperty('--snow-fill', item.fill.toFixed(3));
              }
              p.y = -10;
              p.x = Math.random() * W;
              break;
            }
          }
        }

        if (p.y > H) {
          p.y = -10;
          p.x = Math.random() * W;
        }
      }
      ctx.fill();
      return;
    }

    if (currentTheme === 'volcano') {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.kind === 'ejecta') {
          const alpha = Math.max(0, p.life);
          ctx.fillStyle = `rgba(255, ${140 + Math.floor(alpha * 100)}, 45, ${alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * (0.6 + alpha * 0.5), 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.life -= p.decay;

          if (p.life <= 0 || p.y > H) {
            particles[i] = spawnVolcanoParticle(true);
          }
        } else {
          ctx.fillStyle = `rgba(255, ${110 + Math.floor(Math.sin(tick + p.phase) * 50)}, 40, 0.78)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
          p.y -= p.speed;
          p.x += Math.sin(tick * 1.5 + p.phase) * 0.85;
          if (p.y < -15) {
            p.y = H + 20;
            p.x = Math.random() * W;
          }
        }
      }
      return;
    }

    if (currentTheme === 'wind') {
      ctx.fillStyle = 'rgba(72, 152, 114, 0.45)';
      for (const p of particles) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        p.x += p.speed;
        p.y += Math.sin(tick * 2 + p.x * 0.01) * 0.9;
        p.rot += p.vRot;
        if (p.x > W + 20) {
          p.x = -20;
          p.y = Math.random() * H;
        }
      }
      return;
    }

    for (const p of particles) {
      const alpha = 0.25 + Math.sin(tick * 2 + p.phase) * 0.18;
      ctx.fillStyle = `rgba(255, 224, 130, ${Math.max(0.05, alpha)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y += p.vy;
      if (p.y < -10) {
        p.y = H + 10;
        p.x = Math.random() * W;
      }
    }
  }

  applyTheme(currentTheme, currentIntensity, customColor);
  renderAtmosphere();
})();

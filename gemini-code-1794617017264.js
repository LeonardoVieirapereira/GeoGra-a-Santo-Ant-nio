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

  // Barra de leitura e botão voltar ao topo
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
      body: 'Antes da colonização moderna, o território do atual Norte Pioneiro paranaense integrava áreas de circulação e ocupação de povos indígenas das famílias linguísticas Jê (Kaingang) e Tupi-Guarani, que utilizavam os vales dos rios Paranapanema, das Cinzas e Jacaré. No século XIX, o abertura de picadas e rotas tropeiras ligando São Paulo (Sorocaba e Itapetininga) ao sul do Brasil impulsionou a chegada de famílias pioneiras vindas principalmente de Minas Gerais e do interior paulista, que formaram o primeiro povoado próximo ao Morro do Bim e aos ribeirões Boi Pintado e Aldeia.',
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
      body: 'O rápido crescimento demográfico e agrícola levou o povoado a ser elevado à categoria de distrito policial e judiciário vinculado a Jacarezinho no início do século XX. A autonomia político-administrativa foi conquistada por meio da Lei Estadual nº 1.422, sancionada em 28 de março de 1914, criando o município de Santo Antônio da Platina. A instalação oficial ocorreu em 20 de agosto de 1914, data celebrada anualmente como aniversário da cidade.',
      highlights: [
        'Lei Estadual nº 1.422, de 28 de março de 1914, oficializou a criação do município.',
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
      match: ['diversificação', 'geada', 'transformação', 'modernização', 'agroindústria'],
      category: 'História • Diversificação Econômica',
      body: 'Após a histórica Geada Negra de julho de 1975 — que atingiu severamente os cafezais paranaenses —, o município passou por uma profunda reestruturação agrária e econômica. Pequenas e médias propriedades incorporaram culturas anuais mecanizadas (soja, milho e trigo), pecuária leiteira e de corte, além da integração agroindustrial e do fortalecimento do setor terciário (comércio e serviços) como principal motor do PIB local.',
      highlights: [
        'Transição da monocultura cafeeira para a policultura mecanizada após 1975.',
        'Consolidação da avicultura, bovinocultura de leite e cadeias agroindustriais.',
        'Crescimento do setor de serviços, educação e comércio polarizador no Norte Pioneiro.',
      ],
      source: 'IPARDES (Caderno Estatístico Municipal) e IBGE.',
    },
    {
      match: ['patrimônio', 'igreja', 'matriz', 'cultura', 'identidade', 'festas', 'efapi'],
      category: 'História & Cultura • Patrimônio e Identidade',
      body: 'A identidade cultural platinense é marcada pela religiosidade, pelas tradições sertanejas e tropeiras e pelos eventos comunitários. No coração da cidade, a Igreja Matriz Santo Antônio (Marco Zero) simboliza a formação histórica do município, enquanto eventos tradicionais como a EFAPI (Exposição Feira Agropecuária e Industrial), festas juninas e celebrações religiosas mantêm viva a memória rural e urbana da comunidade.',
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
        'Limita-se com 9 municípios: Jacarezinho, Barra do Jacaré, Andirá, Bandeirantes, Abatiá, Ribeirão do Pinhal, Jundiaí do Sul, Guapirama e Joaquim Távora.',
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
        'Temperatura média anual próxima de 21 °C, com verões quentes (médias acima de 25 °C) e invernos amenos.',
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
      body: 'Conforme os levantamentos censitários e estimativas do IBGE, Santo Antônio da Platina conta com cerca de 44,5 mil habitantes, figurando entre os municípios mais populosos do Norte Pioneiro paranaense. Mais de 88% da população reside na área urbana, refletindo a consolidação dos serviços e da agroindústria.',
      highlights: [
        'Densidade demográfica superior a 61 hab./km².',
        'Taxa de urbanização próxima a 90%, acompanhando a tendência estadual.',
        'Envelhecimento gradual da pirâmide etária e aumento da expectativa de vida.',
      ],
      source: 'IBGE — Censo Demográfico e Estimativas Populacionais.',
    },
    {
      match: ['idhm', 'desenvolvimento humano', 'qualidade de vida', 'longevidade'],
      category: 'Indicadores • Desenvolvimento Humano',
      body: 'O Índice de Desenvolvimento Humano Municipal (IDHM) de Santo Antônio da Platina é de 0,745 (faixa de Alto Desenvolvimento Humano), posicionando o município acima da média de grande parte das cidades do interior brasileiro. O componente Longevidade lidera o índice, seguido por Renda e Educação.',
      highlights: [
        'IDHM Global: 0,745 (Alto Desenvolvimento Humano — Atlas Brasil/PNUD).',
        'IDHM Longevidade: 0,835, impulsionado pela rede regional de atenção à saúde.',
        'IDHM Renda (0,729) e Educação (0,679) com evolução contínua nas últimas décadas.',
      ],
      source: 'Atlas do Desenvolvimento Humano no Brasil (PNUD / IPEA / FJP).',
    },
    {
      match: ['economia', 'pib', 'agropecuária', 'serviços', 'comércio'],
      category: 'Indicadores • Economia e PIB',
      body: 'A economia platinense caracteriza-se pelo equilíbrio entre um setor de serviços e comércio altamente dinâmico, uma agropecuária moderna e agroindústrias voltadas ao processamento de alimentos e insumos. O Valor Adicionado Bruto mostra liderança do setor terciário (mais de 60% do PIB), seguido pela indústria e pela agropecuária.',
      highlights: [
        'Comércio varejista e atacadista com forte atração de consumidores de toda a microrregião.',
        'Produção agrícola diversificada: soja, milho, cana-de-açúcar, café especial, leite e avicultura.',
        'Ambiente favorável ao empreendedorismo com milhares de micro e pequenas empresas ativas.',
      ],
      source: 'IBGE — Produto Interno Bruto dos Municípios e IPARDES.',
    },
    {
      match: ['educação', 'ensino', 'escolas', 'ideb', 'universidade'],
      category: 'Indicadores • Educação',
      body: 'O sistema educacional municipal e estadual atende desde a educação infantil até o ensino médio, técnico e superior. A taxa de escolarização de crianças e jovens de 6 a 14 anos ultrapassa 98%, apoiada por escolas municipais bem estruturadas, colégios estaduais tradicionais, ensino técnico profissionalizante e instituições de ensino superior.',
      highlights: [
        'Universalização do acesso ao Ensino Fundamental (taxa acima de 98% entre 6 e 14 anos).',
        'Oferta de cursos técnicos e superiores que fixam jovens talentos na região.',
        'Programas municipais de transporte escolar rural, merenda e formação docente.',
      ],
      source: 'INEP / MEC (Censo Escolar e IDEB) e Secretaria Municipal de Educação.',
    },
    {
      match: ['saúde', 'hospital', 'regional de saúde', 'sus'],
      category: 'Indicadores • Saúde Pública',
      body: 'Santo Antônio da Platina sedia o Hospital Regional do Norte Pioneiro, unidade estratégica do SUS que atende casos de média e alta complexidade para os 22 municípios vinculados à 19ª Regional de Saúde do Paraná, além de contar com Unidades Básicas de Saúde (UBS), pronto atendimento e clínicas especializadas.',
      highlights: [
        'Hospital Regional do Norte Pioneiro como referência hospitalar microrregional.',
        'Rede de Atenção Primária distribuída pelos bairros urbanos e distritos rurais.',
        'Cobertura vacinal e acompanhamento materno-infantil estruturados pela rede municipal.',
      ],
      source: 'Secretaria de Estado da Saúde do Paraná (SESA-PR) e DATASUS.',
    },

    /* --- INFRAESTRUTURA --- */
    {
      match: ['rodoviária', 'br-153', 'logística', 'transporte', 'estradas'],
      category: 'Infraestrutura • Mobilidade e Logística',
      body: 'A localização no entroncamento da rodovia federal BR-153 (Transbrasiliana) com as rodovias estaduais PR-439 e PR-092 confere a Santo Antônio da Platina um papel logístico privilegiado. Por esses corredores circulam cargas agrícolas e industriais rumo ao Porto de Paranaguá, ao interior de São Paulo e ao Centro-Oeste.',
      highlights: [
        'BR-153 conecta o município diretamente ao estado de São Paulo (Ourinhos) e ao centro-sul do Paraná.',
        'PR-439 e PR-092 articulam a ligação rápida com Ribeirão do Pinhal, Joaquim Távora e Wenceslau Braz.',
        'Terminal rodoviário intermunicipal e interestadual com linhas diárias para capitais e polos regionais.',
      ],
      source: 'DER-PR (Departamento de Estradas de Rodagem) e DNIT.',
    },
    {
      match: ['saneamento', 'abastecimento', 'água', 'esgoto', 'sanepar'],
      category: 'Infraestrutura • Saneamento Básico',
      body: 'Os serviços de abastecimento de água tratada e esgotamento sanitário na área urbana são operados pela Companhia de Saneamento do Paraná (Sanepar). O município apresenta elevados índices de atendimento com água potável encanada e expansão contínua da rede coletora e das estações de tratamento de esgoto.',
      highlights: [
        'Cobertura quase universal de água tratada na sede urbana.',
        'Coleta e tratamento de esgoto sanitário contribuindo para a despoluição dos ribeirões urbanos.',
        'Coleta regular de resíduos sólidos urbanos e programas de reciclagem.',
      ],
      source: 'SNIS (Sistema Nacional de Informações sobre Saneamento) e Sanepar.',
    },
    {
      match: ['energia', 'telecomunicações', 'internet', 'copel'],
      category: 'Infraestrutura • Energia e Conectividade',
      body: 'O fornecimento de energia elétrica é realizado pela Copel, com subestações e redes trifásicas que atendem tanto o perímetro urbano quanto as propriedades rurais mecanizadas e agroindústrias. Na área de telecomunicações, o município dispõe de redes de fibra óptica de alta velocidade e cobertura móvel 4G/5G.',
      highlights: [
        'Rede elétrica estável com suporte a irrigação, resfriadores de leite e indústrias.',
        'Expansão de internet por fibra óptica nos bairros e conectividade no campo.',
        'Crescente adoção de energia solar fotovoltaica em residências, comércios e propriedades rurais.',
      ],
      source: 'Copel, ANEEL e Anatel.',
    },

    /* --- LOCALIZAÇÃO --- */
    {
      match: ['coordenadas', 'posição geográfica', 'latitude', 'longitude'],
      category: 'Localização • Cartografia e Coordenadas',
      body: 'A sede municipal de Santo Antônio da Platina situa-se nas coordenadas geográficas 23°26\'42" de latitude Sul e 50°04\'37" de longitude Oeste, a uma altitude média de 489 metros acima do nível do mar, no fuso horário oficial de Brasília (UTC-3).',
      highlights: [
        'Latitude: 23°26\'42" S | Longitude: 50°04\'37" O (próximo ao Trópico de Capricórnio).',
        'Altitude média da sede urbana: ~489 m (chegando a mais de 800 m nos pontos mais altos do relevo).',
        'Integrante da Mesorregião Geográfica do Norte Pioneiro Paranaense.',
      ],
      source: 'IBGE — Base Cartográfica Contínua do Brasil.',
    },
    {
      match: ['distâncias', 'curitiba', 'londrina', 'são paulo', 'ourinhos'],
      category: 'Localização • Distâncias Estratégicas',
      body: 'A posição geográfica de Santo Antônio da Platina facilita o acesso rápido a grandes centros consumidores, aeroportos e portos do Sul e Sudeste do Brasil, tornando o município um ponto estratégico de parada, distribuição e negócios.',
      highlights: [
        'Jacarezinho: ~25 km | Ourinhos (SP): ~50 km.',
        'Londrina: ~145 km | Maringá: ~245 km.',
        'Curitiba (Capital): ~370 km | São Paulo (SP): ~420 km.',
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

    // Fallback inteligente caso algum novo card seja criado no futuro
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

    // Cria o modal único no final do body
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
     3. MOTOR ATMOSFÉRICO REALISTA E PERSONALIZAÇÃO DE TEMAS
     ======================================================================== */
  const THEMES = [
    { id: 'default', name: 'Original', desc: 'Clássico claro', accent: '#b8860b', primary: '#1a261d' },
    { id: 'sunny', name: 'Ensolarado', desc: 'Raios dourados', accent: '#d98a14', primary: '#694310' },
    { id: 'rain', name: 'Chuva', desc: 'Gotas e reflexão', accent: '#2c82b8', primary: '#10293d' },
    { id: 'storm', name: 'Tempestade', desc: 'Raios e céu noturno', accent: '#6ea8ff', primary: '#0b1222' },
    { id: 'sunset', name: 'Pôr do sol', desc: 'Crepúsculo quente', accent: '#e06236', primary: '#542126' },
    { id: 'snow', name: 'Neve', desc: 'Flocos cristalinos', accent: '#4a9ec9', primary: '#16364d' },
    { id: 'aurora', name: 'Aurora boreal', desc: 'Véus polares', accent: '#2ad6ad', primary: '#06232b' },
    { id: 'volcano', name: 'Vulcão', desc: 'Brasas e lava', accent: '#f26430', primary: '#2b1114' },
    { id: 'wind', name: 'Vento', desc: 'Folhas ao vento', accent: '#369977', primary: '#163b31' },
    { id: 'heat', name: 'Calor solar', desc: 'Brilho intenso', accent: '#d48217', primary: '#5e3c10' },
  ];

  const STORAGE_THEME = 'gg_theme_id';
  const STORAGE_INTENSITY = 'gg_theme_intensity';
  const STORAGE_COLOR = 'gg_theme_custom_color';

  let currentTheme = localStorage.getItem(STORAGE_THEME) || 'default';
  let currentIntensity = localStorage.getItem(STORAGE_INTENSITY) || 'medium';
  let customColor = localStorage.getItem(STORAGE_COLOR) || '';

  // Elementos visuais de fundo e partículas
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

  function applyTheme(themeId, intensity = currentIntensity, colorOverride = customColor) {
    const valid = THEMES.find((t) => t.id === themeId) || THEMES[0];
    currentTheme = valid.id;
    currentIntensity = intensity;
    customColor = colorOverride;

    document.body.classList.add('gg-theme-shifting');
    document.body.dataset.ggTheme = currentTheme;

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
      extraSceneEl.innerHTML = '<div class="gg-volcano-mountain"></div><div class="gg-lava"></div>';
      document.body.appendChild(extraSceneEl);
    } else if (currentTheme === 'rain') {
      extraSceneEl = document.createElement('div');
      extraSceneEl.className = 'gg-water-rise';
      document.body.appendChild(extraSceneEl);
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
     4. RENDERIZAÇÃO DAS PARTÍCULAS NO CANVAS
     ======================================================================== */
  let particles = [];
  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  function getCountMultiplier() {
    if (currentIntensity === 'low') return 0.45;
    if (currentIntensity === 'high') return 1.75;
    return 1;
  }

  function rebuildParticles() {
    particles = [];
    const mult = getCountMultiplier();

    if (currentTheme === 'rain' || currentTheme === 'storm') {
      const count = Math.floor((currentTheme === 'storm' ? 140 : 95) * mult);
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
      const count = Math.floor(85 * mult);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 1.5 + Math.random() * 3.2,
          speed: 0.8 + Math.random() * 1.6,
          phase: Math.random() * Math.PI * 2,
        });
      }
    } else if (currentTheme === 'volcano') {
      const count = Math.floor(65 * mult);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: H + Math.random() * 120,
          r: 1.4 + Math.random() * 2.8,
          speed: 1.2 + Math.random() * 2.4,
          phase: Math.random() * Math.PI * 2,
        });
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
      ctx.strokeStyle = currentTheme === 'storm' ? 'rgba(185, 215, 255, 0.42)' : 'rgba(210, 236, 255, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (const p of particles) {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.drift, p.y + p.len);
        p.x += p.drift;
        p.y += p.speed;
        if (p.y > H) {
          p.y = -20;
          p.x = Math.random() * W;
        }
        if (p.x < 0) p.x = W;
      }
      ctx.stroke();

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
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      for (const p of particles) {
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        p.y += p.speed;
        p.x += Math.sin(tick + p.phase) * 0.6;
        if (p.y > H) {
          p.y = -10;
          p.x = Math.random() * W;
        }
      }
      ctx.fill();
      return;
    }

    if (currentTheme === 'volcano') {
      for (const p of particles) {
        ctx.fillStyle = `rgba(255, ${110 + Math.floor(Math.sin(tick + p.phase) * 50)}, 40, 0.78)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.y -= p.speed;
        p.x += Math.sin(tick * 1.5 + p.phase) * 0.8;
        if (p.y < -15) {
          p.y = H + 20;
          p.x = Math.random() * W;
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

    // Partículas luminosas suaves para ensolarado, pôr do sol e calor
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
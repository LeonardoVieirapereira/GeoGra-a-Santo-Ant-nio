import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('ggMaquete3D');
const pinsLayer = document.getElementById('ggMaquetePins');
const captionEl = document.getElementById('ggMaqueteCaption');
const buttons = document.querySelectorAll('[data-maquete]');
const btnReset = document.getElementById('ggCamReset');
const btnRotate = document.getElementById('ggCamRotate');

if (container) {
  const captions = {
    geral:
      'Vista panorâmica da maquete de Santo Antônio da Platina: observe o corte geológico com Terra Roxa e basalto, o Morro do Bim, a drenagem natural, as áreas rurais e a sede urbana.',
    clima:
      'O clima subtropical úmido (Cfa) regula o regime de chuvas, a recarga dos ribeirões, a agricultura regional e o conforto térmico ao longo das quatro estações.',
    relevo:
      'O relevo de planalto ondulado — com destaque para o Morro do Bim — apoia-se sobre solos férteis de Terra Roxa derivados da decomposição do basalto.',
    agua:
      'Os rios Jacaré e das Cinzas e os ribeirões Bonito, Boi Pintado e Aldeia formam a rede de drenagem, protegida pela mata ciliar nas margens.',
    uso:
      'O espaço rural combina lavouras em curvas de nível, pastagens e fragmentos de Mata Atlântica, onde a cobertura vegetal evita a erosão do solo.',
    cidade:
      'A sede urbana concentra moradia, comércio, serviços públicos e marcos históricos como a Igreja Matriz Santo Antônio, articulada pela rodovia BR-153.',
  };

  /* 1. Cena, Câmera e Renderizador */
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    38,
    container.clientWidth / Math.max(container.clientHeight, 1),
    0.1,
    120
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  container.prepend(renderer.domElement);

  /* 2. Controles de Órbita (mouse e toque) */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.maxPolarAngle = Math.PI * 0.47;
  controls.minPolarAngle = Math.PI * 0.12;
  controls.minDistance = 9;
  controls.maxDistance = 30;
  controls.target.set(0, 0.35, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.55;

  /* 3. Iluminação Solar e Atmosférica */
  const hemiLight = new THREE.HemisphereLight(0xdff3ff, 0x4a3525, 0.95);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfff4d6, 1.85);
  sunLight.position.set(11, 16, 9);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.camera.near = 2;
  sunLight.shadow.camera.far = 42;
  const d = 11;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  sunLight.shadow.bias = -0.0008;
  scene.add(sunLight);

  const rimLight = new THREE.DirectionalLight(0x7cc6fe, 0.45);
  rimLight.position.set(-12, 8, -10);
  scene.add(rimLight);

  /* Adapta a luz da maquete 3D ao tema atmosférico escolhido no site */
  const lightPresets = {
    default: { sun: 0xfff4d6, intensity: 1.85, hemi: 0xdff3ff },
    sunny: { sun: 0xfff0b8, intensity: 2.15, hemi: 0xe8f7ff },
    rain: { sun: 0xb7d4ea, intensity: 1.25, hemi: 0x9eb8cc },
    storm: { sun: 0x89aef0, intensity: 1.0, hemi: 0x5c759e },
    sunset: { sun: 0xff9a52, intensity: 1.95, hemi: 0xffcfa3 },
    snow: { sun: 0xe3f4ff, intensity: 1.65, hemi: 0xd9efff },
    aurora: { sun: 0x7dfce0, intensity: 1.15, hemi: 0x4bb8a8 },
    volcano: { sun: 0xff7b47, intensity: 1.55, hemi: 0xb55d45 },
    wind: { sun: 0xe8fff5, intensity: 1.8, hemi: 0xcff2e4 },
    heat: { sun: 0xffd269, intensity: 2.1, hemi: 0xffe7ad },
  };

  function syncThemeLighting() {
    const theme = document.body.dataset.ggTheme || 'default';
    const p = lightPresets[theme] || lightPresets.default;
    sunLight.color.setHex(p.sun);
    sunLight.intensity = p.intensity;
    hemiLight.color.setHex(p.hemi);
  }
  syncThemeLighting();

  const themeObserver = new MutationObserver(syncThemeLighting);
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-gg-theme'] });

  /* 4. Funções Matemáticas do Relevo e do Rio */
  const SIZE = 16;
  const HALF = SIZE / 2;

  function getRiverCenterX(z) {
    return -0.6 + Math.sin(z * 0.36) * 1.65 - z * 0.18;
  }

  function getTerrainHeight(x, z) {
    let h =
      0.55 +
      Math.sin(x * 0.35 + 0.5) * 0.25 +
      Math.cos(z * 0.32) * 0.22 +
      Math.sin((x + z) * 0.25) * 0.15;

    // Morro do Bim
    const dxBim = x + 3.8;
    const dzBim = z + 3.2;
    const distBim = Math.sqrt(dxBim * dxBim + dzBim * dzBim);
    h += 2.65 * Math.exp(-(distBim * distBim) / 8.5);

    // Colina secundária
    const dxHill = x - 4.2;
    const dzHill = z + 4.4;
    const distHill = Math.sqrt(dxHill * dxHill + dzHill * dzHill);
    h += 1.35 * Math.exp(-(distHill * distHill) / 10.0);

    // Platô urbano
    const dxCity = x - 3.6;
    const dzCity = z - 3.2;
    const distCity = Math.sqrt(dxCity * dxCity + dzCity * dzCity);
    const cityFlatten = Math.exp(-(distCity * distCity) / 14.0);
    h = h * (1 - cityFlatten * 0.65) + 0.48 * (cityFlatten * 0.65);

    // Vale escavado pelo rio
    const riverX = getRiverCenterX(z);
    const distRiver = Math.abs(x - riverX);
    const valleyCarve = 0.88 * Math.exp(-(distRiver * distRiver) / 1.45);
    h -= valleyCarve;

    return Math.max(-0.25, h);
  }

  /* 5. Construção do Bloco Geológico 3D (Topo + 4 Cortes Laterais) */
  const SEG = 76;
  const Y_BOTTOM = -2.1;
  const positions = [];
  const colors = [];

  const cTerraRoxa = new THREE.Color(0x7c3121);
  const cSafraVerde = new THREE.Color(0x5c8f3d);
  const cSafraClaro = new THREE.Color(0x7cb342);
  const cSafraOuro = new THREE.Color(0xc9a338);
  const cMata = new THREE.Color(0x2d5e36);
  const cCidade = new THREE.Color(0x8c9296);
  const cLeitoRio = new THREE.Color(0x3a545e);

  function getTopColor(x, z, y) {
    const riverX = getRiverCenterX(z);
    const distRiver = Math.abs(x - riverX);

    if (distRiver < 0.72) return cLeitoRio;
    if (distRiver < 1.35) return cMata;

    if (x > 1.2 && z > 0.6 && x < 7.2 && z < 7.0) {
      return cCidade;
    }

    if (y > 1.35) return cMata;

    const band = Math.sin(z * 1.55 + Math.sin(x * 0.45) * 1.4);
    if (band > 0.58) return cTerraRoxa;
    if (band > 0.05) return cSafraVerde;
    if (band > -0.55) return cSafraClaro;
    return cSafraOuro;
  }

  function pushTri(p1, p2, p3, c1, c2, c3) {
    positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
    colors.push(c1.r, c1.g, c1.b, c2.r, c2.g, c2.b, c3.r, c3.g, c3.b);
  }

  const grid = [];
  for (let j = 0; j <= SEG; j++) {
    const row = [];
    const z = -HALF + (j / SEG) * SIZE;
    for (let i = 0; i <= SEG; i++) {
      const x = -HALF + (i / SEG) * SIZE;
      const y = getTerrainHeight(x, z);
      row.push({ pos: new THREE.Vector3(x, y, z), col: getTopColor(x, z, y) });
    }
    grid.push(row);
  }

  for (let j = 0; j < SEG; j++) {
    for (let i = 0; i < SEG; i++) {
      const a = grid[j][i];
      const b = grid[j][i + 1];
      const c = grid[j + 1][i];
      const dPt = grid[j + 1][i + 1];
      pushTri(a.pos, c.pos, b.pos, a.col, c.col, b.col);
      pushTri(b.pos, c.pos, dPt.pos, b.col, c.col, dPt.col);
    }
  }

  // Cortes geológicos laterais (Terra Roxa -> Saprólito -> Basalto)
  const cStrata1 = new THREE.Color(0x7d3020);
  const cStrata2 = new THREE.Color(0x4e3b34);
  const cStrata3 = new THREE.Color(0x272b33);

  function addSideWall(edgePoints, flip) {
    for (let i = 0; i < edgePoints.length - 1; i++) {
      const p0 = edgePoints[i];
      const p1 = edgePoints[i + 1];

      const y1_0 = p0.y - 0.42;
      const y1_1 = p1.y - 0.42;
      const y2_0 = -1.15;
      const y2_1 = -1.15;

      const levels = [
        [p0, p1, new THREE.Vector3(p0.x, y1_0, p0.z), new THREE.Vector3(p1.x, y1_1, p1.z), cStrata1],
        [
          new THREE.Vector3(p0.x, y1_0, p0.z),
          new THREE.Vector3(p1.x, y1_1, p1.z),
          new THREE.Vector3(p0.x, y2_0, p0.z),
          new THREE.Vector3(p1.x, y2_1, p1.z),
          cStrata2,
        ],
        [
          new THREE.Vector3(p0.x, y2_0, p0.z),
          new THREE.Vector3(p1.x, y2_1, p1.z),
          new THREE.Vector3(p0.x, Y_BOTTOM, p0.z),
          new THREE.Vector3(p1.x, Y_BOTTOM, p1.z),
          cStrata3,
        ],
      ];

      levels.forEach(([t0, t1, b0, b1, col]) => {
        if (!flip) {
          pushTri(t0, b0, t1, col, col, col);
          pushTri(t1, b0, b1, col, col, col);
        } else {
          pushTri(t0, t1, b0, col, col, col);
          pushTri(t1, b1, b0, col, col, col);
        }
      });
    }
  }

  addSideWall(grid[SEG].map((v) => v.pos), false);
  addSideWall(grid[0].map((v) => v.pos), true);
  addSideWall(grid.map((r) => r[SEG].pos), true);
  addSideWall(grid.map((r) => r[0].pos), false);

  const terrainGeo = new THREE.BufferGeometry();
  terrainGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  terrainGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.86,
    metalness: 0.04,
  });
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.receiveShadow = true;
  terrainMesh.castShadow = true;
  scene.add(terrainMesh);

  // Pedestal da maquete
  const baseGeo = new THREE.BoxGeometry(SIZE + 0.45, 0.36, SIZE + 0.45);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x0d1722,
    roughness: 0.45,
    metalness: 0.35,
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = Y_BOTTOM - 0.18;
  baseMesh.receiveShadow = true;
  scene.add(baseMesh);

  const trimGeo = new THREE.BoxGeometry(SIZE + 0.52, 0.06, SIZE + 0.52);
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0xe0bd55,
    roughness: 0.3,
    metalness: 0.75,
  });
  const trimMesh = new THREE.Mesh(trimGeo, trimMat);
  trimMesh.position.y = Y_BOTTOM - 0.02;
  scene.add(trimMesh);

  /* 6. Rio Sinuoso Animado */
  const riverSegs = 64;
  const riverPos = [];
  const riverWidth = 0.62;
  for (let j = 0; j <= riverSegs; j++) {
    const z = -HALF + (j / riverSegs) * SIZE;
    const cx = getRiverCenterX(z);
    const cy = getTerrainHeight(cx, z) + 0.14;
    riverPos.push(cx - riverWidth, cy, z, cx + riverWidth, cy, z);
  }
  const riverIndices = [];
  for (let j = 0; j < riverSegs; j++) {
    const r0 = j * 2;
    const r1 = (j + 1) * 2;
    riverIndices.push(r0, r1, r0 + 1, r0 + 1, r1, r1 + 1);
  }
  const riverGeo = new THREE.BufferGeometry();
  riverGeo.setAttribute('position', new THREE.Float32BufferAttribute(riverPos, 3));
  riverGeo.setIndex(riverIndices);
  riverGeo.computeVertexNormals();

  const riverMat = new THREE.MeshStandardMaterial({
    color: 0x26a6df,
    emissive: 0x0b3954,
    emissiveIntensity: 0.25,
    roughness: 0.14,
    metalness: 0.15,
    transparent: true,
    opacity: 0.92,
  });
  const riverMesh = new THREE.Mesh(riverGeo, riverMat);
  riverMesh.receiveShadow = true;
  scene.add(riverMesh);

  /* 7. Vegetação Nativa (Mata Atlântica & Mata Ciliar) */
  const treesGroup = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c3c24, roughness: 0.9 });
  const crownMats = [
    new THREE.MeshStandardMaterial({ color: 0x2a6635, roughness: 0.8 }),
    new THREE.MeshStandardMaterial({ color: 0x3b7d43, roughness: 0.8 }),
    new THREE.MeshStandardMaterial({ color: 0x1f4f2b, roughness: 0.85 }),
  ];

  function createTree(x, z, scale = 1) {
    const y = getTerrainHeight(x, z);
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.04 * scale, 0.06 * scale, 0.28 * scale, 6), trunkMat);
    trunk.position.y = 0.14 * scale;
    trunk.castShadow = true;

    const crown = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.24 * scale, 1),
      crownMats[Math.floor(Math.random() * crownMats.length)]
    );
    crown.position.y = 0.36 * scale;
    crown.castShadow = true;
    crown.receiveShadow = true;

    tree.add(trunk, crown);
    tree.position.set(x, y - 0.02, z);
    treesGroup.add(tree);
  }

  const treeCoords = [
    [-4.6, -4.1, 1.2], [-3.1, -4.5, 1.1], [-5.2, -2.5, 1.3], [-2.5, -2.6, 1.0],
    [-4.2, -1.6, 1.15], [-3.6, -3.5, 1.25], [3.5, -4.8, 1.1], [4.9, -3.9, 1.2],
    [-1.4, -5.8, 0.95], [0.5, -4.2, 0.9], [-1.7, -1.8, 1.0], [0.3, 0.4, 0.95],
    [-2.1, 2.2, 1.05], [-0.4, 3.6, 0.95], [-2.9, 5.1, 1.1], [-6.1, 1.4, 1.15],
    [-5.4, 4.6, 1.0], [5.8, -1.2, 1.05],
  ];
  treeCoords.forEach(([x, z, s]) => createTree(x, z, s));
  scene.add(treesGroup);

  /* 8. Sede Urbana de Santo Antônio da Platina + Igreja Matriz + BR-153 */
  const cityGroup = new THREE.Group();

  const roadMat = new THREE.MeshStandardMaterial({ color: 0x2b3036, roughness: 0.85 });
  const roadPts = [];
  for (let i = 0; i <= 32; i++) {
    const t = i / 32;
    const x = -7.6 + t * 15.2;
    const z = 4.6 - Math.sin(t * Math.PI) * 1.1;
    const riverX = getRiverCenterX(z);
    const groundY = getTerrainHeight(x, z);
    const bridgeBoost = Math.abs(x - riverX) < 1.15 ? 0.24 : 0.03;
    roadPts.push(new THREE.Vector3(x, groundY + bridgeBoost, z));
  }
  const roadCurve = new THREE.CatmullRomCurve3(roadPts);
  const roadGeo = new THREE.TubeGeometry(roadCurve, 48, 0.16, 6, false);
  roadGeo.scale(1, 0.25, 1);
  const roadMesh = new THREE.Mesh(roadGeo, roadMat);
  roadMesh.receiveShadow = true;
  cityGroup.add(roadMesh);

  const wallPalette = [0xf2eadc, 0xe6d7be, 0xd8cfc2, 0xede5d8];
  const roofPalette = [0xb55338, 0x8f4736, 0x5c6873, 0xc76b48];

  const buildings = [
    [2.3, 2.1, 0.48, 0.55, 0.42],
    [3.1, 1.8, 0.55, 0.82, 0.5],
    [4.8, 2.0, 0.52, 0.7, 0.48],
    [5.6, 2.7, 0.46, 0.45, 0.44],
    [2.4, 3.2, 0.5, 0.62, 0.45],
    [5.1, 3.6, 0.54, 0.76, 0.46],
    [3.2, 4.9, 0.46, 0.42, 0.42],
    [4.4, 5.1, 0.52, 0.52, 0.44],
    [5.9, 4.6, 0.48, 0.38, 0.42],
    [2.1, 5.4, 0.44, 0.36, 0.4],
  ];

  buildings.forEach(([bx, bz, w, h, dBox], idx) => {
    const by = getTerrainHeight(bx, bz);
    const bGroup = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, dBox),
      new THREE.MeshStandardMaterial({ color: wallPalette[idx % wallPalette.length], roughness: 0.75 })
    );
    body.position.y = h / 2;
    body.castShadow = true;
    body.receiveShadow = true;

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(Math.max(w, dBox) * 0.74, 0.22, 4),
      new THREE.MeshStandardMaterial({ color: roofPalette[idx % roofPalette.length], roughness: 0.7 })
    );
    roof.rotation.y = Math.PI / 4;
    roof.position.y = h + 0.11;
    roof.castShadow = true;

    bGroup.add(body, roof);
    bGroup.position.set(bx, by - 0.02, bz);
    cityGroup.add(bGroup);
  });

  // Igreja Matriz Santo Antônio (Marco Zero)
  const churchX = 3.9;
  const churchZ = 3.1;
  const churchY = getTerrainHeight(churchX, churchZ);
  const church = new THREE.Group();

  const churchMat = new THREE.MeshStandardMaterial({ color: 0xf7efe1, roughness: 0.6 });
  const churchRoofMat = new THREE.MeshStandardMaterial({ color: 0xa8432e, roughness: 0.65 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xe0bd55, metalness: 0.8, roughness: 0.25 });

  const nave = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.75, 1.05), churchMat);
  nave.position.y = 0.375;
  nave.castShadow = true;

  const naveRoof = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.47, 1.06, 3), churchRoofMat);
  naveRoof.rotation.z = Math.PI / 2;
  naveRoof.rotation.y = Math.PI / 2;
  naveRoof.position.y = 0.88;
  naveRoof.castShadow = true;

  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.34, 1.38, 0.34), churchMat);
  tower.position.set(0, 0.69, 0.44);
  tower.castShadow = true;

  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.45, 4), churchRoofMat);
  spire.rotation.y = Math.PI / 4;
  spire.position.set(0, 1.6, 0.44);
  spire.castShadow = true;

  const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.18, 0.03), goldMat);
  crossV.position.set(0, 1.88, 0.44);
  const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.03, 0.03), goldMat);
  crossH.position.set(0, 1.91, 0.44);

  church.add(nave, naveRoof, tower, spire, crossV, crossH);
  church.position.set(churchX, churchY - 0.02, churchZ);
  cityGroup.add(church);
  scene.add(cityGroup);

  /* 9. Atmosfera: Nuvens 3D Volumétricas */
  const cloudsGroup = new THREE.Group();
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.92,
    transparent: true,
    opacity: 0.92,
  });

  const clouds = [];
  function createCloud(x, y, z, scale = 1) {
    const g = new THREE.Group();
    const puffs = [
      [0, 0, 0, 0.65],
      [0.52, -0.06, 0.08, 0.5],
      [-0.5, -0.08, -0.05, 0.48],
      [0.2, 0.22, -0.08, 0.45],
    ];
    puffs.forEach(([px, py, pz, r]) => {
      const m = new THREE.Mesh(new THREE.DodecahedronGeometry(r * scale, 1), cloudMat);
      m.position.set(px * scale, py * scale, pz * scale);
      m.castShadow = true;
      g.add(m);
    });
    g.position.set(x, y, z);
    cloudsGroup.add(g);
    clouds.push({ mesh: g, speed: 0.18 + Math.random() * 0.12 });
  }

  createCloud(-3.2, 4.9, -2.5, 1.05);
  createCloud(2.8, 5.3, -3.4, 0.9);
  createCloud(0.8, 4.7, 2.6, 0.85);
  scene.add(cloudsGroup);

  /* 10. Marcadores 3D Flutuantes Interativos */
  const pinConfigs = [
    { key: 'clima', label: 'Atmosfera e clima', pos: new THREE.Vector3(-2.6, 5.1, -2.4) },
    { key: 'relevo', label: 'Morro do Bim & Terra Roxa', pos: new THREE.Vector3(-3.8, 3.6, -3.2) },
    { key: 'agua', label: 'Rede de drenagem', pos: new THREE.Vector3(-0.7, 0.95, 0.2) },
    { key: 'uso', label: 'Áreas rurais e Mata Atlântica', pos: new THREE.Vector3(-4.5, 1.35, 3.2) },
    { key: 'cidade', label: 'Área urbana & Matriz', pos: new THREE.Vector3(3.9, 2.35, 3.1) },
  ];

  const pinElements = pinConfigs.map((cfg) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gg-3d-pin';
    btn.textContent = cfg.label;
    btn.addEventListener('click', () => focusLayer(cfg.key));
    pinsLayer?.appendChild(btn);
    return { ...cfg, el: btn };
  });

  /* 11. Posições de Câmera por Camada */
  const cameraPresets = {
    geral: { pos: new THREE.Vector3(12.2, 9.8, 13.5), target: new THREE.Vector3(0, 0.35, 0) },
    clima: { pos: new THREE.Vector3(8.5, 8.2, 11.5), target: new THREE.Vector3(-0.8, 3.2, -1.2) },
    relevo: { pos: new THREE.Vector3(-10.5, 5.8, 8.8), target: new THREE.Vector3(-3.6, 1.2, -2.8) },
    agua: { pos: new THREE.Vector3(4.2, 6.2, 10.2), target: new THREE.Vector3(-0.8, 0.3, 0.4) },
    uso: { pos: new THREE.Vector3(-9.8, 6.4, 9.8), target: new THREE.Vector3(-3.8, 0.6, 2.6) },
    cidade: { pos: new THREE.Vector3(9.6, 5.6, 9.6), target: new THREE.Vector3(3.8, 0.9, 3.1) },
  };

  camera.position.copy(cameraPresets.geral.pos);
  controls.target.copy(cameraPresets.geral.target);

  let animCam = null;

  function focusLayer(key) {
    const preset = cameraPresets[key] || cameraPresets.geral;
    animCam = {
      fromPos: camera.position.clone(),
      toPos: preset.pos.clone(),
      fromTarget: controls.target.clone(),
      toTarget: preset.target.clone(),
      progress: 0,
    };

    buttons.forEach((b) => b.classList.toggle('active', b.dataset.maquete === key));
    pinElements.forEach((p) => p.el.classList.toggle('active', p.key === key));

    if (captionEl) {
      captionEl.textContent = captions[key] || captions.geral;
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => focusLayer(btn.dataset.maquete));
  });

  btnReset?.addEventListener('click', () => focusLayer('geral'));

  btnRotate?.addEventListener('click', () => {
    controls.autoRotate = !controls.autoRotate;
    btnRotate.classList.toggle('active', controls.autoRotate);
    btnRotate.setAttribute('aria-pressed', String(controls.autoRotate));
  });

  controls.addEventListener('start', () => {
    animCam = null;
  });

  /* 12. Loop de Animação e Projeção dos Pins */
  const clock = new THREE.Clock();
  const tempVec = new THREE.Vector3();

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.getElapsedTime();

    clouds.forEach((c) => {
      c.mesh.position.x += c.speed * dt;
      if (c.mesh.position.x > HALF - 1.2) c.mesh.position.x = -HALF + 1.2;
    });

    riverMat.emissiveIntensity = 0.22 + Math.sin(elapsed * 2.2) * 0.08;

    if (animCam) {
      animCam.progress = Math.min(1, animCam.progress + dt * 1.65);
      const ease = 1 - Math.pow(1 - animCam.progress, 3);
      camera.position.lerpVectors(animCam.fromPos, animCam.toPos, ease);
      controls.target.lerpVectors(animCam.fromTarget, animCam.toTarget, ease);
      if (animCam.progress >= 1) animCam = null;
    }

    controls.update();
    renderer.render(scene, camera);

    const w = container.clientWidth;
    const h = container.clientHeight;
    pinElements.forEach((pin) => {
      tempVec.copy(pin.pos).project(camera);
      const visible =
        tempVec.z < 1 &&
        tempVec.x >= -0.92 &&
        tempVec.x <= 0.92 &&
        tempVec.y >= -0.92 &&
        tempVec.y <= 0.92;
      pin.el.style.opacity = visible ? '1' : '0';
      pin.el.style.pointerEvents = visible ? 'auto' : 'none';
      if (visible) {
        const sx = (tempVec.x * 0.5 + 0.5) * w;
        const sy = (-tempVec.y * 0.5 + 0.5) * h;
        pin.el.style.transform = `translate(-50%, -50%) translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px)`;
      }
    });
  }

  animate();

  /* 13. Responsividade ao redimensionar */
  const resizeObserver = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = Math.max(container.clientHeight, 1);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(container);
}
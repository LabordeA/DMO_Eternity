/* Datos núcleo: stats, servidores, crecimiento por nivel, atributos/elementos, familias.
   Fórmula base (emulador DigitalWorldOnline StatusManager, validada contra ~490 tablas de dmowiki):
     HP/AT/DE = tamaño × base + L(tipo, nivel) × M(etapa)
     DS       = base + L × M            (sin tamaño)
     CT       = tamaño × base + L       (sin M)
     EV, HT, AS = base (no cambian con nivel ni tamaño)
   base = stat oficial a Lv1 y 100% de tamaño. */
window.DMO = window.DMO || {};

DMO.servers = [
  { key: 'GDMO', label: 'GDMO (Global · GameKing)', maxLevel: 180, note: 'Cap 170→180 el 21/01/2026' },
  { key: 'KDMO', label: 'KDMO (Corea · Move)', maxLevel: 180, note: 'Cap ≥180 (estimado). Recibe contenido antes.' },
  { key: 'LADMO', label: 'LADMO (Latinoamérica · GameKing)', maxLevel: 180, note: 'Mismos datos que GDMO con demora de parches (estimado).' },
];

// Definición de stats del planner
DMO.statDefs = {
  HP: { label: 'HP', desc: 'Vida máxima' },
  DS: { label: 'DS', desc: 'Digi-Soul (maná)' },
  AT: { label: 'AT', desc: 'Ataque' },
  DE: { label: 'DE', desc: 'Defensa' },
  CT: { label: 'CT', pct: true, desc: 'Probabilidad de crítico (mostrada). El contenido late-game pide ~200-250%' },
  EV: { label: 'EV', pct: true, desc: 'Evasión' },
  HT: { label: 'HT', desc: 'Precisión (contra EV enemiga)' },
  AS: { label: 'AS', unit: 's', desc: 'Segundos por ataque normal (menos es mejor)', lowerBetter: true },
  BL: { label: 'BL', pct: true, desc: 'Bloqueo (mitad de daño)' },
  CD: { label: 'Daño Crít.', pct: true, desc: 'Daño crítico extra (base 100%)' },
  SK: { label: 'Daño Skill', desc: 'Daño de skill plano' },
  SKP: { label: 'Skill %', pct: true, desc: 'Daño de skill %' },
  ATT: { label: 'Atributo %', pct: true, desc: 'Daño de atributo (sólo con ventaja)' },
  FD: { label: 'Daño Final %', pct: true, desc: 'Daño final' },
  NDMG: { label: 'Daño Normal %', pct: true, desc: 'Daño de ataque normal %' },
  ASP: { label: 'Vel. Ataque %', pct: true, desc: 'Reducción del intervalo de ataque' },
  MS: { label: 'Vel. Mov. %', pct: true, desc: 'Velocidad de movimiento' },
  EXP: { label: 'EXP %', pct: true, desc: 'Experiencia extra' },
};
// Orden en el panel principal
DMO.mainStats = ['HP', 'DS', 'AT', 'DE', 'CT', 'EV', 'HT', 'AS', 'BL', 'CD', 'SKP', 'SK', 'ATT', 'FD'];
DMO.baseKeys = ['HP', 'DS', 'AT', 'DE', 'CT', 'EV', 'HT', 'AS'];

DMO.attackerTypes = {
  SA: 'Short Attacker (melee)',
  QA: 'Quick Attacker (rápido / crítico)',
  NA: 'Near Attacker (rango / caster)',
  DE: 'Defender (tanque)',
};

// CT y HT necesarios por dungeon según el nivel del digimon (tabla de la comunidad).
// est = valor estimado por la comunidad (todavía no confirmado). null = sin dato para ese nivel.
DMO.dungeonReqs = [
  { name: 'FDGH', lv170: { ct: 280, ht: 10000 }, lv160: { ct: 305, ht: 11400 } },
  { name: 'Colo Hard', lv170: { ct: 308, ht: 12600 }, lv160: { ct: 334, ht: 14400 } },
  { name: 'RBH', lv170: { ct: 316, ht: 11900 }, lv160: { ct: 342, ht: 13600 } },
  { name: 'SDG', lv170: { ct: 322, ht: 12600 }, lv160: { ct: 349, ht: 14400 } },
  { name: 'MDG', lv170: { ct: 375, ht: 16800 }, lv160: { ct: 410, ht: 18900 } },
  { name: 'Gulus Easy', lv170: { ct: 352, ht: 17600 }, lv160: { ct: 374, ht: 19800 } },
  { name: 'Gulus', lv170: { ct: 485, ht: 25600 }, lv160: { ct: 533, ht: 28500 } },
  { name: 'Armage', est: true, lv170: { ct: 550, ht: 27000 }, lv160: { ct: 560, ht: 28000 } },
  { name: 'KDGN', est: true, lv170: { ct: 550, ht: 27000 }, lv160: { ct: 560, ht: 28000 } },
  { name: 'EOS', est: true, lv170: { ct: 600, ht: 30000 }, lv160: { ct: 610, ht: 31000 } },
  { name: 'Belial', note: 'araña', lv170: { ct: 640, ht: 27000 }, lv160: null },
];

// Rangos (grado) que muestra el juego para Mega en adelante, de menor a mayor
DMO.ranks = ['N', 'A', 'A+', 'S', 'S+', 'SS', 'SS+', 'SSS', 'SSS+', 'U'];
DMO.rankIndex = (r) => DMO.ranks.indexOf(r);

DMO.stageMultipliers = {
  'Rookie': 1.0, 'Champion': 1.5, 'Ultimate': 1.85, 'Armor': 1.85, 'H-Hybrid': 1.85, 'B-Hybrid': 1.85, 'Z-Hybrid': 1.85,
  'Mega': 2.0, 'Side Mega': 2.0, 'Burst Mode': 2.5, 'Variant': 2.5, 'Jogress': 3.0, 'In-Training': 1.0,
};

// L(tipo, nivel) = [HP, DS, AT, DE, CT] ganado por nivel ANTES del multiplicador de etapa.
// 120/130/140/170 derivados de la wiki (mediana); 180 extrapolado; <120 interpolado desde Lv1 = 0 (estimado).
DMO.levelGrowth = {
  SA: { 1: [0, 0, 0, 0, 0], 120: [456.76, 408.65, 56.53, 13.3, 11.85], 130: [492.0, 440.67, 60.27, 14.59, 12.83], 140: [527.0, 472.0, 64.8, 15.7, 13.81], 170: [631.0, 562.0, 79.84, 18.8, 16.66], 180: [665.67, 592.0, 84.85, 19.83, 17.61] },
  QA: { 1: [0, 0, 0, 0, 0], 120: [432.0, 378.0, 57.62, 12.54, 12.7], 130: [464.67, 406.67, 62.4, 13.8, 13.75], 140: [497.0, 436.0, 66.73, 14.6, 14.8], 170: [587.0, 526.0, 81.75, 17.8, 17.8], 180: [617.0, 556.0, 86.76, 18.87, 18.8] },
  DE: { 1: [0, 0, 0, 0, 0], 120: [660.54, 383.78, 50.53, 14.49, 8.47], 130: [710.81, 420.0, 53.41, 15.57, 9.17], 140: [761.0, 450.0, 57.6, 17.73, 9.87], 170: [911.0, 546.0, 69.75, 19.78, 11.97], 180: [961.0, 578.0, 73.8, 20.46, 12.67] },
  NA: { 1: [0, 0, 0, 0, 0], 120: [446.49, 438.92, 57.51, 15.24, 12.2], 140: [514.6, 495.0, 65.9, 17.6, 14.1], 170: [620.0, 600.0, 77.76, 21.87, 17.1], 180: [655.13, 635.0, 81.71, 23.29, 18.1] },
};
DMO.levelGrowthEstimated = (lv) => lv < 120 || lv > 170 || ![120, 130, 140, 170].includes(lv);

// Atributos: quién le gana a quién
DMO.attributes = ['Vaccine', 'Data', 'Virus', 'Unknown', 'None'];
DMO.attrStrong = {
  Vaccine: ['Virus', 'None'],
  Data: ['Vaccine', 'None'],
  Virus: ['Data', 'None'],
  Unknown: ['Vaccine', 'Data', 'Virus', 'None'],
  None: [],
};
// Elementos: [fuerte contra, débil contra]
DMO.elements = ['Fire', 'Water', 'Ice', 'Wind', 'Wood', 'Land', 'Light', 'Pitch Black', 'Thunder', 'Steel', 'Neutral'];
DMO.elemLabels = { Fire: 'Fuego', Water: 'Agua', Ice: 'Hielo', Wind: 'Viento', Wood: 'Madera', Land: 'Tierra', Light: 'Luz', 'Pitch Black': 'Oscuridad', Thunder: 'Trueno', Steel: 'Acero', Neutral: 'Neutral' };
DMO.elemChart = {
  Fire: ['Ice', 'Water'], Water: ['Fire', 'Ice'], Ice: ['Water', 'Fire'],
  Wind: ['Wood', 'Land'], Wood: ['Land', 'Wind'], Land: ['Wind', 'Wood'],
  Light: ['Pitch Black', 'Steel'], 'Pitch Black': ['Thunder', 'Light'], Thunder: ['Steel', 'Pitch Black'], Steel: ['Light', 'Thunder'],
  Neutral: [null, null],
};

DMO.families = {
  DR: "Dragon's Roar", NSp: 'Nature Spirits', ME: 'Metal Empire', WG: 'Wind Guardians', UK: 'Unknown',
  DS: 'Deep Savers', DA: 'Dark Area', JT: 'Jungle Troopers', NSo: 'Nightmare Soldiers', VB: 'Virus Busters',
  TBD: 'TBD (familia nueva 2025-26)',
};

DMO.sizeInfo = [
  '3/5 fases: 80-100%', '4/5: 101-125%', '5/5: 118-130%', 'Partner inicial: 100% fijo',
  'Growth Fruit: 125%', 'Trascendencia (6/6): máx 140% y desbloquea clon de HP',
  'Fruit of Yggdrasil: 125-140% · Fruit of Homeostasis: 128-140%',
];

DMO.sources = [
  ['dmowiki.com (Seal Master, DigiClone, Clothing, Deck System, Titles, Tamers, páginas de digimon) vía Wayback Machine', 'https://web.archive.org/web/2025/https://dmowiki.com/Main_Page'],
  ['dmokb.info (mirror de dmowiki)', 'https://dmokb.info/systems/seal-master'],
  ['Notas oficiales GameKing / Move Games (GDMO)', 'https://dmo.gameking.com/News/EventView.aspx?idx=687'],
  ['GameKing: Abbadomon (14.01.2026)', 'https://dmo.gameking.com/News/EventView.aspx?idx=810'],
  ['GameKing: Goddramon / Holydramon (23.09.2025)', 'https://dmo.gameking.com/News/EventView.aspx?idx=782'],
  ['GameKing: Abbadomon Core (25.02.2026)', 'https://dmo.gameking.com/News/PatchNoteView.aspx?idx=4110'],
  ['GameKing: Omegamon X Extreme (17.03.2026)', 'https://dmo.gameking.com/News/PatchNoteView.aspx?idx=4121'],
  ['GameKing: Advanced Costume (25.03.2026)', 'https://dmo.gameking.com/News/PatchNoteView.aspx?idx=4126'],
  ['GameKing: Quantumon (20.05.2026)', 'https://dmo.gameking.com/News/PatchNoteView.aspx?idx=4148'],
  ['GameKing: Costumes nuevos (01.07.2026)', 'https://dmo.gameking.com/News/PatchNoteView.aspx?idx=4164'],
  ['GameKing: Apollomon (15.07.2026)', 'https://dmo.gameking.com/News/PatchNoteView.aspx?idx=4171'],
  ['GameKing: Santuario de Barbamon + Keyring of Greed (26.08.2026)', 'https://dmo.gameking.com/News/PatchNoteView.aspx?idx=4191'],
  ['GameKing: Apollomon Whispered (16.09.2026)', 'https://dmo.gameking.com/News/PatchNoteView.aspx?idx=4199'],
  ['GameKing: Santuario de Belphemon + Sloth Bracelet (22.09.2026)', 'https://dmo.gameking.com/News/PatchNoteView.aspx?idx=4202'],
  ['Emulador DigitalWorldOnline (fórmulas)', 'https://github.com/joaomartins12/DigitalWorldOnline'],
  ['rod9000/Stats-calculator-dmo (multiplicadores, clones)', 'https://github.com/rod9000/Stats-calculator-dmo'],
  ['jyj9655/dmo-upgrade-helper (KDMO clones/accesorios)', 'https://github.com/jyj9655/dmo-upgrade-helper'],
  ['1zagi/DMO-seal-optimizer', 'https://github.com/1zagi/DMO-seal-optimizer'],
  ['urxios/seals-calculator (LA/NA/KDMO)', 'https://github.com/urxios/seals-calculator'],
  ['JJong97/dmo-seal-calculator (KDMO)', 'https://github.com/JJong97/dmo-seal-calculator'],
  ['danielgsvieira/dmo-digimon-ranking (stats base 2020-22)', 'https://github.com/danielgsvieira/dmo-digimon-ranking'],
  ['Steam: discusiones DMO (clones, accesorios)', 'https://steamcommunity.com/app/537180/discussions/'],
];

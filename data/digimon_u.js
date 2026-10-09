/* Digimons rango U agregados (no estaban en el dataset principal 2024-25).
   Fuente: dmowiki (snapshots Wayback 2026) + notas oficiales GameKing.
   Mismo formato que digimon.js. b = base Lv1 @100% [HP,DS,AT,DE,CT,EV,HT,AS]. */
window.DMO = window.DMO || {};
DMO.digimon = DMO.digimon || [];
DMO.digimon.push(
  { n: 'Omegamon - Merciful Mode', f: 'Jogress', m: 3, a: 'Vaccine', e: 'Light', fam: ['WG', 'VB', 'ME'], t: 'SA', r: 'U',
    b: [19071, 6132, 8889, 497, 15.79, 54.12, 520, 2.5], w: { lv: 170, sz: 140, s: [28592, 7818, 12684, 752, 38.76, 54.12, 520, 2.5] },
    line: ['WarGreymon', 'MetalGarurumon', 'Omegamon', 'Omegamon - Merciful Mode'], from: 'MetalGarurumon + WarGreymon', u: 'Omegamon_-_Merciful_Mode' },
  { n: 'Gallantmon (Crimson Mode) (Awaken)', f: 'Burst Mode', m: 2.5, a: 'Virus', e: 'Light', fam: ['ME', 'VB', 'WG'], t: 'SA', r: 'U',
    b: [18833, 6206, 8188, 452, 16.02, 53.73, 535, 2.7], w: { lv: 170, sz: 140, s: [27943, 7611, 11663, 679, 39.08, 53.73, 535, 2.7] },
    line: ['Guilmon', 'Growlmon', 'WarGrowlmon', 'Gallantmon', 'Gallantmon (Crimson Mode)', 'Gallantmon (Crimson Mode) (Awaken)'], from: 'Gallantmon (Crimson Mode)', u: 'Gallantmon_(Crimson_Mode)_(Awaken)' },
  { n: 'Imperialdramon Paladin Mode (Awaken)', f: 'Jogress', m: 3, a: 'Vaccine', e: 'Light', fam: ['VB', 'DS', 'WG'], t: 'SA', r: 'U',
    b: [18901, 6106, 9065, 472, 15.92, 54.11, 490, 2.4], w: { lv: 170, sz: 140, s: [28354, 7792, 12931, 717, 38.94, 54.11, 490, 2.4] },
    line: ['Imperialdramon (Fighter Mode)', 'Imperialdramon (Paladin Mode)', 'Imperialdramon Paladin Mode (Awaken)'], from: 'Imperialdramon (Fighter Mode) (Awaken)', u: 'Imperialdramon_Paladin_Mode_(Awaken)' },
  { n: 'ZeedMillenniummon (Awaken)', f: 'Jogress', m: 3, a: 'Virus', e: 'Pitch Black', fam: ['DA'], t: 'DE', r: 'U',
    b: [20007, 6006, 8865, 614, 17.51, 43.95, 500, 2.5], w: { lv: 170, sz: 140, s: [30742, 7646, 12621, 919, 36.48, 43.95, 500, 2.5] },
    line: ['ZeedMillenniummon', 'ZeedMillenniummon (Awaken)'], from: 'ZeedMillenniummon', u: 'ZeedMillenniummon_(Awaken)' },
  { n: 'Susanoomon (Extreme)', f: 'Jogress', m: 3, a: 'Vaccine', e: 'Thunder', fam: ['DS', 'NSp', 'VB'], t: 'SA', r: 'U',
    b: [18547, 6031, 8311, 493, 15.88, 50.21, 420, 2.5], w: { lv: 170, sz: 140, s: [27859, 7717, 11875, 746, 38.89, 50.21, 420, 2.5] },
    line: ['KaiserGreymon', 'MagnaGarurumon', 'Susanoomon', 'Susanoomon (Awaken)', 'Susanoomon (Extreme)'], from: 'Susanoomon (Awaken)', u: 'Susanoomon_(Extreme)' },
  // Shoutmon X7 Superior Mode: KDMO 20/03/2024, GDMO 16/04/2024. dmowiki: base HP/DS/AT + valores @140% Lv170.
  // DE y CT base derivados con la fórmula (Defender, M=3): HP/DS/AT reproducen la wiki exacto.
  { n: 'Shoutmon X7 Superior Mode', f: 'Jogress', m: 3, a: 'Data', e: 'Steel', fam: ['NSp'], t: 'DE', r: 'U',
    b: [21207, 5934, 9065, 624, 17.51, 42.95, 480, 2.3], w: { lv: 170, sz: 140, s: [32422, 7574, 12901, 933, 36.48, 42.95, 480, 2.3] },
    line: ['Shoutmon', 'Shoutmon X2', 'Shoutmon X3', 'Shoutmon X4', 'Shoutmon X5', 'Shoutmon X7', 'Shoutmon X7 Superior Mode'], from: 'Shoutmon X7', u: 'Shoutmon_X7_Superior_Mode',
    note: 'Familia asumida igual a Shoutmon X7 (Nature Spirits): no confirmada.' },
  // Omegamon X Extreme = "(Extreme) Omegamon(Resistance)". Nota oficial 17.3.2026: HP/DS/DE/AT base.
  // dmowiki: HP 27817, DS 7636, CT 39.16%, EV 54.13, HT 600, AS 2.5 @140% Lv170 → cierran con crecimiento Short Attacker (M=3).
  { n: 'Omegamon X Extreme', f: 'Jogress X', m: 3, a: 'Vaccine', e: 'Light', fam: ['ME', 'VB', 'NSp'], t: 'SA', r: 'U',
    b: [18511, 5941, 8789, 412, 16.07, 54.13, 600, 2.5], w: { lv: 170, sz: 140, s: [27817, 7636, null, null, 39.16, 54.13, 600, 2.5] },
    line: ['WarGreymon', 'MetalGarurumon', 'WarGreymon X', 'MetalGarurumon X', 'Omegamon X', 'Omegamon X Extreme'], from: 'Omegamon X', u: 'Omegamon_X_Extreme' },
  // Quantumon: nota oficial 20.5.2026 (sólo HP/DS/DE/AT). CT/EV/HT/AS y tipo de atacante no publicados → estimados (promedio Mega U).
  { n: 'Quantumon', f: 'Mega', m: 2, a: 'Data', e: 'Water', fam: ['DS', 'UK', 'TBD'], t: null, r: 'U', est: 1, partial: 1,
    b: [18772, 6877, 8991, 399, 15.9, 54.11, 500, 2.2],
    note: 'HP/DS/AT/DE oficiales (patch 20.5.2026). CT/EV/HT/AS estimados: corregilos con "Editar stats base a mano".' },
  // Goddramon / Holydramon: nota oficial 23.09.2025 (HP/DS/DE/AT) + dmowiki (CT base, HT, EV, AS, tipo).
  // La wiki pone DE base 588 en Goddramon, pero el oficial 488 es el que reproduce su DE 721 @140% Lv170.
  { n: 'Goddramon', f: 'Mega', m: 2, a: 'Vaccine', e: 'Fire', fam: ['DR', 'WG', 'VB'], t: 'SA', r: 'U',
    b: [18551, 4951, 7895, 488, 15.01, 54.73, 470, 2.5], w: { lv: 170, sz: 140, s: [27229, 6075, 11213, 721, 37.67, 54.73, 470, 2.5] },
    line: ['Patamon', 'Angemon', 'MagnaAngemon', 'Goddramon'], from: 'MagnaAngemon', u: 'Goddramon' },
  { n: 'Holydramon', f: 'Mega', m: 2, a: 'Vaccine', e: 'Wind', fam: ['DR', 'WG', 'NSp'], t: 'SA', r: 'U',
    b: [18001, 6001, 7001, 321, 14.76, 50.21, 470, 2.2],
    line: ['Salamon', 'Gatomon', 'Angewomon', 'Magnadramon', 'Holydramon'], from: 'Angewomon', u: 'Holydramon_(Awaken)',
    note: 'HP/DS/AT/DE de la nota oficial 23.09.2025. CT/EV/HT/AS de la página "Holydramon (Awaken)" de la wiki.' },
  // Abbadomon (Mega) y Abbadomon Core (Burst Mode): mismos stats base oficiales (14.01.2026 y 25.02.2026).
  // Core: HT 580, EV 51.44, AS 2.2, CT 39.76% @140% Lv170 (dmowiki). Tipo de atacante no publicado → CT base estimado.
  { n: 'Abbadomon', f: 'Mega', m: 2, a: 'Unknown', e: 'Pitch Black', fam: ['UK', 'TBD'], t: null, r: 'U', est: 1, partial: 1,
    b: [19004, 6411, 8544, 441, 16.5, 51.44, 580, 2.2],
    line: ['Negamon', 'Negamon (Evolved Form)', 'Abbadomon', 'Abbadomon Core'], from: 'Negamon (Evolved Form)', u: 'Abbadomon',
    note: 'HP/DS/AT/DE oficiales (patch 14.01.2026). CT/EV/HT/AS tomados de Abbadomon Core (estimado).' },
  { n: 'Abbadomon Core', f: 'Burst Mode', m: 2.5, a: 'Unknown', e: 'Pitch Black', fam: ['UK', 'TBD'], t: null, r: 'U', est: 1,
    b: [19004, 6411, 8544, 441, 16.5, 51.44, 580, 2.2], w: { lv: 170, sz: 140, s: [null, null, null, null, 39.76, 51.44, 580, 2.2] },
    line: ['Negamon', 'Negamon (Evolved Form)', 'Abbadomon', 'Abbadomon Core'], from: 'Abbadomon', u: 'Abbadomon_Core',
    note: 'HP/DS/AT/DE oficiales (patch 25.02.2026). Tipo de atacante no publicado: CT base estimado.' },
  // Apollomon Whispered: nota oficial 16.09.2026 (HP/DS/DE/AT). CT/EV/HT/AS y tipo no publicados → estimados.
  { n: 'Apollomon Whispered', f: 'Mega', m: 2, a: 'Virus', e: 'Pitch Black', fam: ['DR', 'NSp', 'TBD'], t: null, r: 'U', est: 1, partial: 1,
    b: [17639, 8410, 9402, 529, 15.9, 54.11, 500, 2.2],
    line: ['Bearmon', 'Grizzmon', 'Grapleomon', 'Apollomon', 'Apollomon Whispered'], from: 'Grapleomon',
    note: 'HP/DS/AT/DE oficiales (patch 16.09.2026). CT/EV/HT/AS estimados: corregilos con "Editar stats base a mano".' },
  // Apollomon: HP/DS/AT/DE de la nota oficial 15.7.2026. CT/EV/HT/AS y tipo de atacante NO publicados → estimados (promedio U).
  { n: 'Apollomon', f: 'Mega', m: 2, a: 'Vaccine', e: 'Fire', fam: ['DR', 'NSp', 'VB'], t: null, r: 'U', est: 1, partial: 1,
    b: [19407, 6410, 9102, 529, 15.9, 54.11, 500, 2.2],
    line: ['Bearmon', 'Grizzmon', 'Grapleomon', 'Apollomon'], from: 'Grapleomon',
    note: 'HP/DS/AT/DE oficiales (patch 15.7.2026). CT/EV/HT/AS estimados: corregilos con "Editar stats base a mano".' },
);

/* Joyería / Accesorios. Sólo la joyería de endgame: Zero Unit, Digital Hazard, Miracle [Special]
   y la joyería de dungeons (Kaiser's Base, Dark Web, Nightmare, Marketplace, Barbamon, Belphemon).
   Fuentes: notas oficiales GameKing (valores a 100% de Digitary Power), dmowiki Clothing, jyj9655/dmo-upgrade-helper (mínimos).
   Valor final de cada línea = valor × DP / 100. DP: base 100, mín 95, máx 200.

   opts:      { STAT: [mín, máx] }                     mismo pool para todas las líneas
   dupLimits: { STAT: maximo de repeticiones }         limites propios de la pieza
   lvlR:      { STAT: [[mín,máx] por nivel] }           rango por nivel de mejora (levelBase 0 = +0..+N)
   Stats: HP/DS/AT/DE/HT/SK planos · CT/EV/BL/ATT/CD/AS/FD en % · HPP/DSP/DEP/ATP = % del stat base */
window.DMO = window.DMO || {};
(function () {
  // ── Pools base (dmowiki, máximos a 100% DP; mínimos de la herramienta KR) ──
  const RING = { HP: [150, 800], DS: [150, 800], AT: [50, 300], DE: [7, 25], CT: [1, 5], SK: [50, 400], ATT: [1, 5] };
  const NECK = { HP: [150, 800], DS: [150, 800], AT: [20, 200], DE: [5, 50], CT: [1, 5], SK: [30, 250], ATT: [1, 5], CD: [1, 20], AS: [1, 15] };
  const EAR = { HP: [150, 800], DS: [150, 800], DE: [10, 100], CT: [1, 7], SK: [50, 300], ATT: [1, 7], CD: [1, 20], HT: [100, 500], EV: [1, 7], BL: [1, 6] };
  const fixed = (o) => Object.fromEntries(Object.entries(o).map(([k, [, max]]) => [k, [max, max]]));

  // Pool completo de Vital Breath; cada linea puede elegir todas las opciones.
  const VITAL_FLAT = { AT: [1000, 1500], DE: [300, 500], HP: [2000, 3000], DS: [1500, 2500], SK: [2000, 2500], CT: [5, 10], CD: [25, 40], EV: [10, 15], HT: [800, 1200] };
  const VITAL_PCT = { DEP: [15, 20], DSP: [5, 10], HPP: [5, 10], SKP: [3, 7], FD: [1, 5] };

  const items = [
    // ───────── ANILLOS ─────────
    { id: 'ring_zero', slot: 'ring', name: 'Zero Unit Ring', lines: 5,
      opts: { HP: [960, 960], DS: [960, 960], AT: [360, 360], DE: [30, 30], CT: [6, 6], SK: [480, 480], ATT: [6, 6] } },
    { id: 'ring_hazard', slot: 'ring', name: 'Digital Hazard Ring', lines: 5, opts: fixed(RING) },
    { id: 'ring_miracle_sp', slot: 'ring', name: 'Miracle Ring [Special]', lines: 5, opts: RING },
    // Shining Arena Ring (Arena [Hard], dmowiki; la tabla oficial de 09.07.2024 es una imagen)
    { id: 'ring_arena', slot: 'ring', name: 'Shining Arena Ring · Arena', lines: 5, src: 'WIKI',
      dupLimits: { HP: 3, DS: 3, AT: 2, DE: 2, CT: 2, SK: 2, ATT: 2, CD: 1, HT: 1 },
      opts: { HP: [200, 960], DS: [200, 960], AT: [100, 360], DE: [10, 30], CT: [1, 6], SK: [100, 480], ATT: [1, 6], CD: [1, 20], HT: [100, 500] } },
    { id: 'ring_hope', slot: 'ring', name: 'Brilliant Ring of Hope - Nightmare', lines: 5, src: 'OFFICIAL 26.11.2025 / WIKI Clothing',
      dupLimits: { HP: 2, DS: 2, DE: 2, AT: 2, SK: 2, DEP: 2, DSP: 2, EV: 2, BL: 2, CT: 2, ATT: 2, CD: 2, HT: 2 },
      opts: { HP: [750, 1500], DS: [750, 1500], DE: [50, 100], AT: [500, 1000], SK: [1000, 2000], DEP: [7.5, 15], DSP: [5, 10],
        EV: [1, 5], BL: [1, 5], CT: [2, 10], ATT: [2, 10], CD: [10, 20], HT: [1000, 2000] } },

    // ───────── COLLARES ─────────
    { id: 'neck_zero', slot: 'necklace', name: 'Zero Unit Necklace', lines: 5,
      opts: { HP: [960, 960], DS: [960, 960], AT: [240, 240], DE: [60, 60], CT: [6, 6], SK: [300, 300], ATT: [6, 6], CD: [24, 24], AS: [15, 15] } },
    { id: 'neck_hazard', slot: 'necklace', name: 'Digital Hazard Necklace', lines: 5, opts: fixed(NECK) },
    { id: 'neck_miracle_sp', slot: 'necklace', name: 'Miracle Necklace [Special]', lines: 5, opts: NECK },
    { id: 'neck_radiant_miracle', slot: 'necklace', name: 'Radiant Miracle Necklace - Dark Web', lines: 5, src: 'OFFICIAL 27.05.2025 / 02.09.2026 / WIKI Clothing',
      dupLimits: { HP: 4, DS: 4, AT: 2, DE: 3, CT: 2, SK: 1, ATT: 2, AS: 1, CD: 1, ATP: 1, DEP: 1, HPP: 1, DSP: 1 },
      opts: { HP: [600, 1200], DS: [600, 1200], DE: [50, 100], CT: [5, 10], AS: [10, 15], CD: [15, 30], ATT: [1, 8],
        AT: [150, 300], SK: [200, 500], ATP: [2.5, 5], DEP: [25, 50], HPP: [5, 15], DSP: [25, 50] } },

    // ───────── AROS ─────────
    { id: 'ear_zero', slot: 'earring', name: 'Zero Unit Earrings', lines: 5,
      dupLimits: { HP: 2, DS: 2, DE: 2, CT: 2, SK: 1, ATT: 2, CD: 2, HT: 1, EV: 1, BL: 1 },
      opts: { HP: [960, 960], DS: [960, 960], DE: [120, 120], CT: [9, 9], SK: [360, 360], ATT: [9, 9], CD: [24, 24], HT: [600, 600], EV: [8, 8], BL: [7, 7] } },
    { id: 'ear_hazard', slot: 'earring', name: 'Digital Hazard Earring', lines: 5, opts: fixed(EAR) },
    { id: 'ear_miracle_sp', slot: 'earring', name: 'Miracle Earring [Special]', lines: 5, dupLimits: { HT: 1 }, opts: EAR },
    { id: 'ear_kindness', slot: 'earring', name: "Brilliant Kindness Earring - Kaiser's Base", lines: 5, src: 'OFFICIAL 25.03.2025 / WIKI Clothing',
      dupLimits: { DE: 3, HP: 2, DS: 2, SK: 2, ATT: 2, CT: 2, CD: 2, EV: 2, BL: 2, HT: 1, DEP: 1, HPP: 1, SKP: 1 },
      opts: { DE: [100, 200], HP: [750, 1500], DS: [750, 1500], SK: [300, 600], ATT: [6, 12], CT: [6, 12], CD: [10, 30],
        EV: [1, 10], BL: [1, 10], HT: [500, 1000], DEP: [15, 30], HPP: [25, 50], SKP: [5, 10] } },

    // ───────── PULSERAS ─────────
    { id: 'brace_zero', slot: 'bracelet', name: 'Zero Unit Bracelet', lines: 5,
      opts: { HP: [1440, 1440], DS: [1440, 1440], AT: [720, 720], DE: [180, 180], CT: [12, 12], SK: [540, 540], CD: [36, 36], HT: [900, 900], EV: [10, 10] } },
    { id: 'brace_miracle_sp', slot: 'bracelet', name: 'Miracle Bracelet [Special]', lines: 5,
      opts: { HP: [600, 1200], DS: [600, 1200], AT: [300, 600], DE: [75, 150], CT: [5, 10], SK: [225, 450], CD: [15, 30], HT: [375, 750], EV: [4, 9] } },
    { id: 'brace_vital', slot: 'bracelet', name: 'Vital Breath -V- - Marketplace', lines: 5, src: 'OFFICIAL 21.01.2025 / WIKI Clothing',
      dupLimits: { AT: 2, DE: 2, HP: 2, DS: 2, SK: 2, CT: 2, CD: 2, EV: 2, HT: 2, DEP: 1, DSP: 1, HPP: 1, SKP: 1, FD: 1 },
      opts: { ...VITAL_FLAT, ...VITAL_PCT } },
    // Sloth: cantidad de opciones y repeticiones estimadas a partir de Vital Breath.
    { id: 'brace_sloth', slot: 'bracelet', name: 'Sloth Bracelet · Belphemon', lines: 5, levels: 11, levelBase: 0, src: 'OFFICIAL 22.09.2026',
      estStats: ['cantidad de opciones y repeticiones (estimadas como Vital Breath)'],
      dupLimits: { AT: 2, DE: 2, HP: 2, DS: 2, SK: 2, CT: 2, CD: 2, EV: 2, HT: 2, DEP: 1, DSP: 1, HPP: 1, SKP: 1, FD: 1 },
      lvlR: {
        AT: [[760, 1140], [800, 1200], [840, 1260], [880, 1320], [920, 1380], [960, 1440], [1000, 1500], [1080, 1620], [1150, 1725], [1230, 1845], [1310, 1965]],
        DE: [[230, 380], [240, 400], [250, 420], [265, 440], [275, 460], [290, 480], [300, 500], [325, 540], [345, 575], [370, 615], [395, 655]],
        HP: [[1400, 2300], [1600, 2400], [1680, 2520], [1760, 2640], [1840, 2760], [1920, 2880], [2000, 3000], [2160, 3240], [2300, 3450], [2460, 3690], [2620, 3930]],
        DS: [[1100, 1900], [1200, 2000], [1260, 2100], [1320, 2200], [1380, 2300], [1440, 2400], [1500, 2500], [1620, 2700], [1725, 2875], [1845, 3075], [1965, 3275]],
        SK: [[1500, 1900], [1600, 2000], [1680, 2100], [1760, 2200], [1840, 2300], [1920, 2400], [2000, 2500], [2160, 2700], [2300, 2875], [2460, 3075], [2620, 3275]],
        CT: [[3, 7], [4, 8], [4, 8.5], [4.5, 9], [4.5, 9], [5, 9.5], [5, 10], [5.5, 11], [6, 11.5], [6, 12.5], [6.5, 13]],
        CD: [[18, 30], [20, 32], [21, 33.5], [22, 35], [23, 37], [24, 38.5], [25, 40], [27, 43], [28.5, 46], [31, 49], [33, 52.5]],
        EV: [[7, 15], [8, 12], [8.5, 12.5], [9, 13], [9, 14], [9.5, 14.5], [10, 15], [11, 16], [11.5, 17.5], [12.5, 18.5], [13, 19.5]],
        HT: [[600, 900], [640, 960], [670, 1010], [705, 1055], [735, 1105], [770, 1150], [800, 1200], [865, 1295], [920, 1380], [985, 1475], [1050, 1570]],
        DEP: [[10, 15], [12, 16], [12.5, 17], [13, 17.5], [14, 18.5], [14.5, 19], [15, 20], [16, 21.5], [17.5, 23], [18.5, 24.5], [19.5, 26]],
        DSP: [[3, 7], [4, 8], [4, 8.5], [4.5, 9], [4.5, 9], [5, 9.5], [5, 10], [5.5, 11], [6, 11.5], [6, 12.5], [6.5, 13]],
        HPP: [[3, 7], [4, 8], [4, 8.5], [4.5, 9], [4.5, 9], [5, 9.5], [5, 10], [5.5, 11], [6, 11.5], [6, 12.5], [6.5, 13]],
        SKP: [[2.5, 6], [3, 6.5], [3.5, 6.5], [3.5, 7], [3.5, 7.5], [4, 7.5], [4, 8], [4.5, 8.5], [4.5, 9], [5, 10], [5, 10.5]],
        FD: [[1, 3], [1, 4], [1, 4], [1, 4.5], [1, 4.5], [1, 5], [1, 5], [1, 5.5], [1, 6], [1, 6], [1.5, 6.5]],
      } },
  ];

  DMO.jewelry = {
    slots: [
      { key: 'ring', label: 'Anillo' },
      { key: 'necklace', label: 'Collar' },
      { key: 'earring', label: 'Aros' },
      { key: 'bracelet', label: 'Pulsera' },
    ],
    dp: { def: 100, min: 95, max: 200 },
    // Limites por defecto del slot; cada pieza puede reemplazarlos.
    dupLimits: {
      ring: { HP: 3, DS: 3, AT: 2, DE: 2, CT: 2, SK: 2, ATT: 2 },
      necklace: { HP: 3, DS: 3, AT: 1, DE: 2, CT: 2, SK: 1, ATT: 2, CD: 1, AS: 1 },
      earring: { HP: 2, DS: 2, DE: 2, CT: 1, SK: 2, ATT: 2, CD: 2, HT: 2, EV: 1, BL: 1 },
      bracelet: { HP: 2, DS: 2, AT: 1, DE: 2, CT: 2, SK: 1, CD: 2, HT: 2, EV: 2 },
    },
    recommended: {
      ring: 'AT, AT, ATT/SK, ATT/SK',
      necklace: 'AT, AS, CD + ATT o HP',
      earring: 'CD, CD, HT + ATT, SK o BL',
      bracelet: 'AT, CD, HT + SK o HP',
    },
    items,
  };

  const levelIdx = (item, level) => Math.max(0, Math.min((level || item.levels) - 1, item.levels - 1));

  // Todas las lineas ofrecen el pool completo de la pieza.
  DMO.jewelry.linePool = (item, level) => DMO.jewelry.rangesFor(item, level);
  DMO.jewelry.rangesFor = function (item, level) {
    if (item.opts) return item.opts;
    const out = {};
    if (item.lvlR) {
      const i = levelIdx(item, level);
      for (const [k, arr] of Object.entries(item.lvlR)) out[k] = arr[i];
    }
    return out;
  };
  DMO.jewelry.limitFor = (item, stat) => item.dupLimits?.[stat] ?? DMO.jewelry.dupLimits[item.slot]?.[stat];
  // Completa builds antiguos conservando sus stats y valores.
  DMO.jewelry.normalizeBuild = function (build) {
    for (const j of Object.values(build.jewelry || {})) {
      if (!j) continue;
      const item = items.find((x) => x.id === j.id);
      if (!item) continue;
      if (!Array.isArray(j.lines)) j.lines = [];
      while (j.lines.length < item.lines) j.lines.push({ stat: '', v: 0 });
    }
    return build;
  };
  DMO.jewelry.linesFor = (item) => item.lines;
})();

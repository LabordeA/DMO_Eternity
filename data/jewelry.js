/* Joyería / Accesorios. Fuente: dmowiki Clothing (Accessories), jyj9655/dmo-upgrade-helper (mínimos KDMO),
   DigitalWorldOnline emu (fórmula). Valores máximos a 100% de Digitary Power.
   Valor final de cada línea = valor × DP / 100. DP: base 100, mín 95, máx 200 (Imperial 150, Underworld 100).
   opts: { STAT: [min, max] }  (min null = desconocido)
   lvl:  { STAT: [máx nivel1, nivel2, ...] } para accesorios con niveles (Fanglongmon, Holy Beasts, Miracle)
   lvlR: { STAT: [[mín,máx] nivel1, ...] }   rango por nivel (Sloth Bracelet). levelBase 0 = niveles +0..+N
   Stats: HP/DS/AT/DE/HT/SK planos · CT/EV/BL/ATT/CD/AS en % */
window.DMO = window.DMO || {};
(function () {
  // Interpola un rango [a,b] en n niveles (cuando la wiki sólo da extremos) — marcado como estimado
  const lin = (a, b, n) => Array.from({ length: n }, (_, i) => Math.round((a + (b - a) * (n === 1 ? 1 : i / (n - 1))) * 10) / 10);

  const items = [
    // ───────── ANILLOS ─────────
    { id: 'ring_generic3', slot: 'ring', name: 'Anillo genérico 3 opciones (Arcane, World Cup, Growth)', lines: 3,
      opts: { HP: [150, 500], DS: [150, 500], AT: [50, 150], DE: [7, 15], CT: [1, 4], SK: [50, 200], ATT: [1, 2] } },
    { id: 'ring_std', slot: 'ring', name: 'Anillo estándar 4 op. (Quad-core, Holy Beast sellado, Boundless, Miracle Lv10)', lines: 4,
      opts: { HP: [150, 800], DS: [150, 800], AT: [50, 300], DE: [7, 25], CT: [1, 5], SK: [50, 400], ATT: [1, 5] } },
    { id: 'ring_std5', slot: 'ring', name: 'Anillo 5 op. (Digital Hazard / Miracle Special)', lines: 5,
      opts: { HP: [150, 800], DS: [150, 800], AT: [50, 300], DE: [7, 25], CT: [1, 5], SK: [50, 400], ATT: [1, 5] } },
    { id: 'ring_imperial', slot: 'ring', name: 'Imperial Ring (AT, AT, CT, SK)', lines: 4, dpMax: 150,
      fixed: ['AT', 'AT', 'CT', 'SK'], opts: { AT: [null, 450], CT: [null, 7], SK: [null, 500] } },
    { id: 'ring_underworld', slot: 'ring', name: 'Underworld Ring (AT, AT, CT, SK)', lines: 4, dpMax: 100,
      fixed: ['AT', 'AT', 'CT', 'SK'], opts: { AT: [null, 450], CT: [null, 7], SK: [null, 500] } },
    { id: 'ring_fanglong', slot: 'ring', name: "Fanglongmon's Ancient Ring", lines: 4, levels: 10,
      lvl: { HP: [640, 664, 688, 712, 736, 760, 800, 856, 912, 960], DS: [640, 664, 688, 712, 736, 760, 800, 856, 912, 960],
        AT: [240, 249, 258, 267, 276, 285, 300, 321, 342, 360], DE: [20, 21, 22, 23, 24, 25, 27, 29, 30, 30],
        SK: [320, 332, 344, 356, 368, 380, 400, 428, 456, 480], CT: lin(4, 6, 10), ATT: lin(4, 6, 10) }, estStats: ['CT', 'ATT'] },
    { id: 'ring_fhb', slot: 'ring', name: 'Ring of Four Holy Beasts', lines: 4, levels: 5,
      lvl: { HP: [816, 832, 848, 864, 880], DS: [816, 832, 848, 864, 880], AT: [306, 312, 318, 324, 330], DE: [26, 26, 27, 27, 28],
        SK: [408, 416, 424, 432, 440], CT: lin(5, 6, 5), ATT: lin(5, 6, 5) }, estStats: ['CT', 'ATT'] },
    { id: 'ring_fhb_rad', slot: 'ring', name: 'Radiant Ring of Four Holy Beasts', lines: 4, levels: 5,
      lvl: { HP: [896, 920, 960, 1000, 1040], DS: [896, 920, 960, 1000, 1040], AT: [336, 345, 360, 375, 390], DE: [28, 29, 30, 32, 33],
        SK: [448, 460, 480, 500, 520], CT: lin(6, 7, 5), ATT: lin(6, 7, 5) }, estStats: ['CT', 'ATT'] },
    { id: 'ring_zero', slot: 'ring', name: 'Zero Unit Ring (máx fijo)', lines: 5, fixedMax: true,
      opts: { HP: [960, 960], DS: [960, 960], AT: [360, 360], DE: [30, 30], CT: [6, 6], SK: [480, 480], ATT: [6, 6] } },
    { id: 'ring_arena', slot: 'ring', name: 'Shining Arena Ring', lines: 5,
      opts: { HP: [200, 960], DS: [200, 960], AT: [100, 360], DE: [10, 30], CT: [1, 6], SK: [100, 480], ATT: [1, 6], CD: [1, 20], HT: [100, 500] } },

    // ───────── COLLARES ─────────
    { id: 'neck_generic3', slot: 'necklace', name: 'Collar genérico 3 opciones (Arcane, Sealed Datamon, Growth)', lines: 3,
      opts: { HP: [150, 500], DS: [150, 500], AT: [20, 100], DE: [5, 25], CT: [1, 2], SK: [30, 150], ATT: [1, 2], CD: [1, 5], AS: [1, 4] } },
    { id: 'neck_std', slot: 'necklace', name: 'Collar estándar 4 op. (Quad-core, Holy Beast, Boundless, Miracle Lv10)', lines: 4,
      opts: { HP: [150, 800], DS: [150, 800], AT: [20, 200], DE: [5, 50], CT: [1, 5], SK: [30, 250], ATT: [1, 5], CD: [1, 20], AS: [1, 15] } },
    { id: 'neck_std5', slot: 'necklace', name: 'Collar 5 op. (Digital Hazard / Miracle Special)', lines: 5,
      opts: { HP: [150, 800], DS: [150, 800], AT: [20, 200], DE: [5, 50], CT: [1, 5], SK: [30, 250], ATT: [1, 5], CD: [1, 20], AS: [1, 15] } },
    { id: 'neck_imperial', slot: 'necklace', name: 'Imperial Necklace (AT, AS, CT, CD)', lines: 4, dpMax: 150,
      fixed: ['AT', 'AS', 'CT', 'CD'], opts: { AT: [null, 450], AS: [null, 20], CT: [null, 7], CD: [null, 30] } },
    { id: 'neck_underworld', slot: 'necklace', name: 'Underworld Necklace (AT, AS, CT, CD)', lines: 4, dpMax: 100,
      fixed: ['AT', 'AS', 'CT', 'CD'], opts: { AT: [null, 450], AS: [null, 20], CT: [null, 7], CD: [null, 30] }, estStats: ['AS'] },
    { id: 'neck_fanglong', slot: 'necklace', name: "Fanglongmon's Ancient Necklace", lines: 4, levels: 10,
      lvl: { HP: [640, 664, 688, 712, 736, 760, 800, 856, 912, 960], DS: [640, 664, 688, 712, 736, 760, 800, 856, 912, 960],
        AT: [160, 166, 172, 178, 184, 190, 200, 214, 228, 240], DE: [40, 42, 43, 45, 46, 48, 50, 54, 57, 60],
        CT: [4, 5, 5, 5, 5, 5, 5, 6, 6, 6], SK: [200, 208, 215, 223, 230, 238, 250, 268, 285, 300], ATT: [4, 5, 5, 5, 5, 5, 5, 6, 6, 6],
        CD: [16, 16.6, 17.2, 17.8, 18.4, 19, 20, 21.4, 22.8, 24], AS: [1, 2, 3, 4, 5, 6, 8, 10, 13, 15] } },
    { id: 'neck_fhb', slot: 'necklace', name: 'Necklace of Four Holy Beasts', lines: 4, levels: 5,
      lvl: { HP: [816, 832, 848, 864, 880], DS: [816, 832, 848, 864, 880], AT: [204, 208, 212, 216, 220], DE: [51, 52, 53, 54, 55],
        SK: [255, 260, 265, 270, 275], CD: [20.4, 20.8, 21.2, 21.6, 22], AS: [15, 15, 15, 15, 15], CT: lin(5, 6, 5), ATT: lin(5, 6, 5) }, estStats: ['CT', 'ATT'] },
    { id: 'neck_fhb_rad', slot: 'necklace', name: 'Radiant Necklace of Four Holy Beasts', lines: 4, levels: 5,
      lvl: { HP: [896, 920, 960, 1000, 1040], DS: [896, 920, 960, 1000, 1040], AT: [224, 230, 240, 250, 260], DE: [56, 58, 60, 63, 65],
        SK: [280, 288, 300, 313, 325], CD: [22.4, 23, 24, 25, 26], AS: [15, 15, 15, 15, 15], CT: lin(6, 7, 5), ATT: lin(6, 7, 5) }, estStats: ['CT', 'ATT'] },
    { id: 'neck_zero', slot: 'necklace', name: 'Zero Unit Necklace (máx fijo)', lines: 5, fixedMax: true,
      opts: { HP: [960, 960], DS: [960, 960], AT: [240, 240], DE: [60, 60], CT: [6, 6], SK: [300, 300], ATT: [6, 6], CD: [24, 24], AS: [15, 15] } },

    // ───────── AROS ─────────
    { id: 'ear_std3', slot: 'earring', name: 'Aro 3 op. (Zhuqiaomon / Baihumon sellados)', lines: 3,
      opts: { HP: [150, 800], DS: [150, 800], DE: [10, 100], CT: [1, 7], SK: [50, 300], ATT: [1, 7], CD: [1, 20], HT: [100, 500], EV: [1, 7], BL: [1, 6] } },
    { id: 'ear_std', slot: 'earring', name: 'Aro 4 op. (Qinglongmon, Quad-core, Boundless, Miracle Lv10)', lines: 4,
      opts: { HP: [150, 800], DS: [150, 800], DE: [10, 100], CT: [1, 7], SK: [50, 300], ATT: [1, 7], CD: [1, 20], HT: [100, 500], EV: [1, 7], BL: [1, 6] } },
    { id: 'ear_std5', slot: 'earring', name: 'Aro 5 op. (Digital Hazard / Miracle Special)', lines: 5,
      opts: { HP: [150, 800], DS: [150, 800], DE: [10, 100], CT: [1, 7], SK: [50, 300], ATT: [1, 7], CD: [1, 20], HT: [100, 500], EV: [1, 7], BL: [1, 6] } },
    { id: 'ear_imperial', slot: 'earring', name: 'Imperial Earrings (CT, CD, HT, SK)', lines: 4, dpMax: 150,
      fixed: ['CT', 'CD', 'HT', 'SK'], opts: { CT: [null, 7], CD: [null, 30], HT: [null, 700], SK: [null, 500] } },
    { id: 'ear_nanomon', slot: 'earring', name: "Nanomon's Shiny Earring", lines: 4,
      opts: { HP: [null, 600], DS: [null, 600], SK: [null, 200], ATT: [null, 5], CD: [null, 10], HT: [null, 300], BL: [null, 5] }, estStats: ['lines'] },
    { id: 'ear_fanglong', slot: 'earring', name: "Fanglongmon's Ancient Earring", lines: 4, levels: 10,
      lvl: { HP: [640, 664, 688, 712, 736, 760, 800, 856, 912, 960], DS: [640, 664, 688, 712, 736, 760, 800, 856, 912, 960],
        DE: [80, 83, 86, 89, 92, 95, 100, 107, 114, 120], CT: [6, 6, 7, 7, 7, 7, 7, 7, 8, 9], SK: [240, 249, 258, 267, 276, 285, 300, 321, 342, 360],
        ATT: [6, 6, 7, 7, 7, 7, 7, 7, 8, 9], CD: [16, 16.6, 17.2, 17.8, 18.4, 19, 20, 21.4, 22.8, 24],
        HT: [400, 415, 430, 445, 460, 475, 500, 535, 570, 600], EV: [5, 5, 6, 6, 6, 6, 6, 7, 7, 8], BL: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7] } },
    { id: 'ear_fhb', slot: 'earring', name: 'Earrings of Four Holy Beasts', lines: 4, levels: 5,
      lvl: { HP: [816, 832, 848, 864, 880], DS: [816, 832, 848, 864, 880], DE: [102, 104, 106, 108, 110], SK: [306, 312, 318, 324, 330],
        CD: [20.4, 20.8, 21.2, 21.6, 22], HT: [510, 520, 530, 540, 550], CT: lin(7, 8, 5), ATT: lin(7, 8, 5), EV: lin(7, 8, 5), BL: lin(6, 7, 5) },
      estStats: ['DE', 'SK', 'HT', 'CT', 'ATT', 'EV', 'BL'] },
    { id: 'ear_fhb_rad', slot: 'earring', name: 'Radiant Earrings of Four Holy Beasts', lines: 4, levels: 5,
      lvl: { HP: [896, 920, 960, 1000, 1040], DS: [896, 920, 960, 1000, 1040], DE: [112, 115, 120, 125, 130], SK: [336, 345, 360, 375, 390],
        CD: [22.4, 23, 24, 25, 26], HT: [560, 575, 600, 625, 650], CT: lin(8, 10, 5), ATT: lin(8, 10, 5), EV: lin(8, 10, 5), BL: lin(7, 8, 5) },
      estStats: ['CT', 'ATT', 'EV', 'BL'] },
    { id: 'ear_zero', slot: 'earring', name: 'Zero Unit Earrings (máx fijo)', lines: 5, fixedMax: true,
      opts: { HP: [960, 960], DS: [960, 960], DE: [120, 120], CT: [9, 9], SK: [360, 360], ATT: [9, 9], CD: [24, 24], HT: [600, 600], EV: [8, 8], BL: [7, 7] } },

    // ───────── PULSERAS ─────────
    { id: 'brace_ancient', slot: 'bracelet', name: 'Fancy Bracelet of Ancient Breath', lines: 3,
      opts: { HP: [null, 299], DS: [null, 299], DE: [null, 37], CT: [null, 2], SK: [null, 112], CD: [null, 7.47], HT: [null, 187], EV: [null, 2] } },
    { id: 'brace_knight', slot: 'bracelet', name: "Knight's Bracelet (1 línea)", lines: 1,
      opts: { HP: [null, 800], DS: [null, 800], DE: [null, 100], CT: [null, 7], SK: [null, 300], CD: [null, 20], HT: [null, 500], EV: [null, 6] } },
    { id: 'brace_knight_rad', slot: 'bracelet', name: "Radiant Knight's Bracelet (2 líneas)", lines: 2,
      opts: { HP: [null, 800], DS: [null, 800], DE: [null, 100], CT: [null, 7], SK: [null, 300], CD: [null, 20], HT: [null, 500], EV: [null, 6] } },
    { id: 'brace_royal', slot: 'bracelet', name: "Royal Knight's Bracelet (3 líneas)", lines: 3,
      opts: { HP: [null, 800], DS: [null, 800], DE: [null, 100], CT: [null, 7], SK: [null, 300], CD: [null, 20], HT: [null, 500], EV: [null, 6] } },
    { id: 'brace_royal_rad', slot: 'bracelet', name: "Royal Radiant Knight's Bracelet (4 líneas)", lines: 4,
      opts: { HP: [null, 800], DS: [null, 800], DE: [null, 100], CT: [null, 7], SK: [null, 300], CD: [null, 20], HT: [null, 500], EV: [null, 6] } },
    { id: 'brace_xknight', slot: 'bracelet', name: "Royal: X-Knight's Bracelet", lines: 5,
      opts: { HP: [600, 960], DS: [600, 960], AT: [300, 480], DE: [75, 120], CT: [5, 8], SK: [225, 360], CD: [15, 24], HT: [375, 600], EV: [4, 7] } },
    { id: 'brace_miracle', slot: 'bracelet', name: 'Miracle Bracelet', levels: 10, linesPerLevel: [3, 3, 4, 4, 4, 5, 5, 5, 5, 5],
      lvl: { HP: [720, 768, 816, 864, 912, 960, 1008, 1056, 1104, 1152], DS: [720, 768, 816, 864, 912, 960, 1008, 1056, 1104, 1152],
        AT: [360, 384, 408, 432, 456, 480, 504, 528, 552, 576], DE: [90, 96, 102, 108, 114, 120, 126, 132, 138, 144],
        SK: [270, 288, 306, 324, 342, 360, 378, 396, 414, 432], CD: [18, 19.2, 20.4, 21.6, 22.8, 24, 25.2, 26.4, 27.6, 28.8],
        HT: [450, 480, 510, 540, 570, 600, 630, 660, 690, 720], CT: lin(6, 10, 10), EV: lin(5, 9, 10) }, estStats: ['CT', 'EV'] },
    { id: 'brace_miracle_sp', slot: 'bracelet', name: 'Miracle Bracelet [Special]', lines: 5,
      opts: { HP: [600, 1200], DS: [600, 1200], AT: [300, 600], DE: [75, 150], CT: [5, 10], SK: [225, 450], CD: [15, 30], HT: [375, 750], EV: [4, 9] } },
    { id: 'brace_zero', slot: 'bracelet', name: 'Zero Unit Bracelet (máx fijo)', lines: 5, fixedMax: true,
      opts: { HP: [1440, 1440], DS: [1440, 1440], AT: [720, 720], DE: [180, 180], CT: [12, 12], SK: [540, 540], CD: [36, 36], HT: [900, 900], EV: [10, 10] } },
    // Vital Breath Digivice -V- (pulsera, dungeon Marketplace, oficial 21.01.2025). Valores a 100% DP. Nº de líneas no publicado.
    { id: 'brace_vital', slot: 'bracelet', name: 'Vital Breath Digivice -V-', lines: 5, estStats: ['nº de líneas'],
      opts: { AT: [1000, 1500], DE: [300, 500], HP: [2000, 3000], DS: [1500, 2500], SK: [2000, 2500], CT: [5, 10], CD: [25, 40], EV: [10, 15], HT: [800, 1200],
        DEP: [15, 20], DSP: [5, 10], HPP: [5, 10], SKP: [3, 7], FD: [1, 5] } },
    // Sloth Bracelet (Santuario de Belphemon, oficial 22.09.2026). Mejora +0..+10, rango [mín,máx] por nivel.
    { id: 'brace_sloth', slot: 'bracelet', name: 'Sloth Bracelet (Belphemon)', lines: 5, levels: 11, levelBase: 0, estStats: ['nº de líneas'],
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
    // Máximo de líneas repetidas por stat en cada slot (dmowiki)
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

  // Devuelve {stat:[min,max]} para un ítem a cierto nivel
  DMO.jewelry.rangesFor = function (item, level) {
    if (item.opts) return item.opts;
    const out = {};
    const i = Math.max(0, Math.min((level || item.levels) - 1, item.levels - 1));
    if (item.lvlR) { for (const [k, arr] of Object.entries(item.lvlR)) out[k] = arr[i]; return out; }
    for (const [k, arr] of Object.entries(item.lvl)) out[k] = [null, arr[i]];
    return out;
  };
  DMO.jewelry.linesFor = function (item, level) {
    if (item.linesPerLevel) return item.linesPerLevel[Math.max(0, (level || item.levels) - 1)];
    return item.lines;
  };
})();

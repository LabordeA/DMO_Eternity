/* Equipamiento del Tamer, Sets, Digivice, Chipsets, Tamers.
   Fuentes: notas oficiales Move Games / GameKing (2023-2026), dmowiki (Clothing, ChipSets, Tamers), dmokb mirror.
   Claves de stat del planner:
     planos: HP DS AT DE HT SK(daño skill plano)
     %:      CT EV BL AS CD(daño crítico) SKP(daño skill %) ATT(daño atributo) FD(daño final) NDMG(daño normal)
             HPP/ATP/DEP/DSP (% sobre el base)  MS EXP (informativos)
   Nota de unidades: el equipo moderno a veces expresa el CT como "rating" (1500 = 15%). Acá todo CT está en %.
   Tipos de ítem:
     stats:    {STAT: valor}                       fijo
     range:    {STAT: [min,max]}                   el usuario ajusta (por defecto máx)
     enh:      {STAT: [v+0, v+1, ... v+15]}         según nivel de mejora
     grades:   {STAT: {Grado: [v+0..v+10]}}         según grado y mejora
     variants: {OPCIÓN: {STAT: v}}                una opción a elegir (costumes HP / AT / SCD)
   set: id del set al que pertenece (para bonos de set). */
window.DMO = window.DMO || {};
(function () {
  const slots = [
    { key: 'head', label: 'Cabeza' },
    { key: 'fashion', label: 'Accesorio / Fashion' },
    { key: 'top', label: 'Torso' },
    { key: 'bottom', label: 'Pantalón' },
    { key: 'gloves', label: 'Guantes' },
    { key: 'shoes', label: 'Zapatos' },
    { key: 'costume', label: 'Costume' },
    { key: 'id_card', label: 'ID Card' },
    { key: 'goggles', label: 'Goggles' },
    { key: 'xai', label: 'XAI' },
    { key: 'digiaura', label: 'DigiAura' },
    { key: 'keyring', label: 'Key Ring' },
  ];

  const items = [];
  const add = (o) => items.push(o);

  // ───────── Sets Digimon Kaiser (MDG) — 3 sets con stats por pieza idénticos ─────────
  // Bandas de mejora (wiki sólo da extremos): se toma el máximo de la banda y el usuario puede ajustar.
  const bands = (low, middle, high) => [...Array(5).fill(low), ...Array(5).fill(middle), ...Array(6).fill(high)];
  const mdgNote = 'Rangos por banda de mejora de DMO Wiki; las terceras líneas desde +10 se suman al stat principal. Ajustá tus valores reales.';
  const mdgPieces = {
    head: { name: 'Head', enhRanges: { CT: bands([5, 6.25], [6.5, 7.5], [12.75, 25]), CD: bands([0, 0], [10, 14], [15, 40]) } },
    fashion: { name: 'Fashion', enhRanges: { HT: bands([500, 750], [800, 1000], [1600, 3500]), AT: bands([0, 0], [500, 700], [750, 1500]) } },
    top: { name: 'Top', enhRanges: { HP: bands([1000, 1250], [1300, 1500], [2600, 4500]), DE: bands([0, 0], [200, 300], [350, 1000]) } },
    bottom: { name: 'Bottom', enhRanges: { DS: bands([1000, 1250], [1300, 1500], [2600, 4500]), SKP: bands([0, 0], [5, 9], [12, 30]) } },
    gloves: { name: 'Gloves', enhRanges: { AT: bands([500, 750], [800, 1000], [1400, 2700]), AS: bands([0, 0], [1, 1], [2, 3]) } },
    shoes: { name: 'Shoes', enhRanges: { MS: bands([20, 20], [20, 25], [25, 30]), EXP: bands([0, 0], [0, 0], [1000, 2000]) }, note: 'Afinidad +30 desde +5.' },
  };
  for (const [setId, who] of [['mdg_yolei', 'Yolei'], ['mdg_tk', 'T.K.'], ['mdg_davis', 'Davis']]) {
    for (const [slot, p] of Object.entries(mdgPieces)) {
      add({ id: `${setId}_${slot}`, slot, name: `${who} ${p.name} (Kaiser)`, enhRanges: p.enhRanges, enhMax: 15, set: setId, src: 'WIKI Clothing', note: mdgNote + (p.note ? ' ' + p.note : '') });
    }
  }

  // ───────── Sets Digimon Frontier "Spirit" (5 elementos) — tabla oficial +0..+15 ─────────
  const fr = {
    head: { name: 'Spirit Helmet', enh: {
      CT: [10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 45, 47, 49, 51, 53, 55], // opt1 + opt3 (ambas "Critical Probability")
      CD: [0, 0, 0, 0, 0, 30, 34, 36, 38, 40, 50, 51, 52, 53, 54, 55] } },
    fashion: { name: 'Spirit Accessory', enh: {
      HT: [1000, 1050, 1100, 1150, 1250, 1300, 1350, 1400, 1450, 1500, 4500, 4700, 4900, 5100, 5300, 5500],
      AT: [0, 0, 0, 0, 0, 1000, 1200, 1300, 1400, 1500, 2000, 2100, 2200, 2300, 2400, 2500] } },
    top: { name: 'Spirit Top', enh: {
      HP: [2000, 2050, 2100, 2150, 2250, 2300, 2350, 2400, 2450, 2500, 7000, 7200, 7400, 7600, 7800, 8000],
      DE: [0, 0, 0, 0, 0, 600, 625, 650, 675, 700, 1500, 1600, 1700, 1800, 1900, 2000] } },
    bottom: { name: 'Spirit Bottom', enh: {
      DS: [2000, 2050, 2100, 2150, 2250, 2300, 2350, 2400, 2450, 2500, 7000, 7200, 7400, 7600, 7800, 8000],
      SKP: [0, 0, 0, 0, 0, 20, 24, 26, 28, 30, 40, 41, 42, 43, 44, 45] } },
    gloves: { name: 'Spirit Gloves', enh: {
      AT: [1500, 1550, 1600, 1650, 1750, 1800, 1850, 1900, 1950, 2000, 4000, 4200, 4400, 4600, 4800, 5000],
      AS: [0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5] } },
    shoes: { name: 'Spirit Shoes', enh: {
      MS: Array(16).fill(30), EXP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3000, 3100, 3200, 3300, 3400, 3500] } },
  };
  const elements = [['fire', 'Fire'], ['light', 'Light'], ['ice', 'Ice'], ['wind', 'Wind'], ['thunder', 'Thunder']];
  for (const [eid, en] of elements) {
    for (const [slot, p] of Object.entries(fr)) {
      add({ id: `fr_${eid}_${slot}`, slot, name: `${en} : ${p.name} (Frontier)`, enh: p.enh, enhMax: 15, set: `fr_${eid}`, src: 'OFFICIAL 21.01.2026' });
    }
  }

  // ───────── Equipo Four Holy Beasts (grados Normal..Ultimate, +0..+10) ─────────
  const G = ['Normal', 'Rare', 'Unique', 'Legendary', 'Ultimate'];
  add({ id: 'fhb_head', slot: 'head', name: 'Noble Head Ornament of Huanglongmon', set: 'fhb', enhMax: 10, gradeList: G, src: 'OFFICIAL 10.06.2025',
    grades: {
      HT: { Normal: [80, 150, 159, 168, 177, 186, 195, 204, 213, 222, 231], Rare: [100, 175, 186, 196, 207, 217, 228, 238, 249, 259, 270], Unique: [120, 200, 212, 224, 236, 248, 260, 272, 284, 296, 308], Legendary: [130, 225, 239, 252, 266, 279, 293, 306, 320, 333, 347], Ultimate: [150, 250, 265, 280, 295, 310, 325, 340, 355, 370, 385] },
      AT: { Normal: [10, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315], Rare: [15, 210, 228, 245, 263, 280, 298, 315, 333, 350, 368], Unique: [20, 240, 260, 280, 300, 320, 340, 360, 380, 400, 420], Legendary: [25, 270, 293, 315, 338, 360, 383, 405, 428, 450, 473], Ultimate: [30, 300, 325, 350, 375, 400, 425, 450, 475, 500, 525] } } });
  add({ id: 'fhb_fashion', slot: 'fashion', name: 'Phoenix Feather Robe of Zhuqiaomon', set: 'fhb', enhMax: 10, gradeList: G, src: 'OFFICIAL 10.06.2025',
    grades: {
      AT: { Normal: [100, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285], Rare: [125, 175, 193, 210, 228, 245, 263, 280, 298, 315, 333], Unique: [150, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380], Legendary: [175, 225, 248, 270, 293, 315, 338, 360, 383, 405, 428], Ultimate: [200, 250, 275, 300, 325, 350, 375, 400, 425, 450, 475] },
      SKP: { Normal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], Rare: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4], Unique: [0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 6], Legendary: [0, 0, 0, 0, 0, 0, 0, 2, 4, 6, 8], Ultimate: [0, 0, 0, 0, 0, 0, 2, 4, 6, 8, 10] } } });
  const hpds = { Normal: [30, 120, 240, 360, 480, 600, 780, 960, 1140, 1320, 1500], Rare: [60, 140, 280, 420, 560, 700, 910, 1120, 1330, 1540, 1750], Unique: [90, 160, 320, 480, 640, 800, 1040, 1280, 1520, 1760, 2000], Legendary: [120, 180, 360, 540, 720, 900, 1170, 1440, 1710, 1980, 2250], Ultimate: [150, 200, 400, 600, 800, 1000, 1300, 1600, 1900, 2200, 2500] };
  add({ id: 'fhb_top', slot: 'top', name: 'Abyssal Armor of Xuanwumon', set: 'fhb', enhMax: 10, gradeList: G, src: 'OFFICIAL 10.06.2025', grades: { HP: hpds, DS: hpds } });
  add({ id: 'fhb_bottom', slot: 'bottom', name: 'Thunderbolt Bottom of Qinglongmon', set: 'fhb', enhMax: 10, gradeList: G, src: 'OFFICIAL 10.06.2025',
    grades: {
      DE: { Normal: [4, 18, 36, 54, 72, 90, 108, 126, 144, 162, 180], Rare: [8, 21, 42, 63, 84, 105, 126, 147, 168, 189, 210], Unique: [12, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240], Legendary: [16, 27, 54, 81, 108, 135, 162, 189, 216, 243, 270], Ultimate: [20, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300] },
      HT: { Normal: [120, 210, 228, 246, 264, 282, 300, 318, 336, 354, 372], Rare: [140, 245, 266, 287, 308, 329, 350, 371, 392, 413, 434], Unique: [160, 280, 304, 328, 352, 376, 400, 424, 448, 472, 496], Legendary: [180, 315, 342, 369, 396, 423, 450, 477, 504, 531, 558], Ultimate: [200, 350, 380, 410, 440, 470, 500, 530, 560, 590, 620] } } });
  add({ id: 'fhb_gloves', slot: 'gloves', name: 'Immaculate Gauntlet of Baihumon', set: 'fhb', enhMax: 10, gradeList: G, src: 'OFFICIAL 10.06.2025',
    grades: { CT: { Normal: [0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6], Rare: [0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7], Unique: [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8], Legendary: [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 10], Ultimate: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12] } } });
  add({ id: 'fhb_shoes', slot: 'shoes', name: 'Shoes of the Four Holy Beasts', set: 'fhb', enhMax: 10, gradeList: G, src: 'OFFICIAL 10.06.2025',
    grades: { MS: { Normal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], Rare: [0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 10], Unique: [0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 15], Legendary: [0, 0, 0, 0, 0, 0, 0, 5, 10, 15, 20], Ultimate: [0, 0, 0, 0, 0, 0, 5, 10, 15, 20, 25] } } });

  // ───────── Ropa legacy de raids (stats "Tamer": se suman al digimon como estimación) ─────────
  const legacy = [
    ['head', "Zhuqiaomon's Infernal Ornament", { AT: 100 }], ['head', "Xuanwumon's / Baihumon's / Qinglongmon's Ornament", { AT: 50 }],
    ['fashion', "Qinglongmon's Lightning Cape", { SKP: 7 }], ['fashion', "Xuanwumon's / Zhuqiaomon's / Baihumon's Cape", { SKP: 5 }],
    ['top', "Xuanwumon's Aquatic Hooded Shirt", { HP: 1200 }], ['top', "Baihumon's Flawless Hooded Shirt", { HP: 1100 }],
    ['top', "Zhuqiaomon's / Qinglongmon's Hooded Shirt", { HP: 900 }],
    ['bottom', 'Holy Beast Short Pants (Aquatic/Infernal/Flawless/Lightning)', { DS: 1100 }],
    ['gloves', "Baihumon's Flawless Gloves", { AT: 400 }], ['gloves', "Xuanwumon's / Zhuqiaomon's / Qinglongmon's Gloves", { AT: 330 }],
    ['gloves', 'Boundless Advanced Gloves (30d)', { AT: 250 }], ['gloves', 'Shiny Desert Gloves (60d)', { AT: 210 }],
    ['gloves', 'WaruMonzaemon Gloves', { AT: 300, HP: 200 }], ['shoes', 'Sports Sneakers / Shiny Desert Shoes', { MS: 30 }],
  ];
  legacy.forEach(([slot, name, stats], i) => add({ id: `legacy_${i}`, slot, name: `${name} [legacy/Tamer]`, stats, tamerStat: true, src: 'WIKI' }));

  // ───────── Ropa de eventos / cash (sin bono de set documentado) ─────────
  const ev = [
    ['head', "Arbormon's Helmet", { AT: 100, EXP: 200 }], ['fashion', "Arbormon's Vine Barrel", { SKP: 5, EXP: 200 }], ['top', "Arbormon's Upper Armor", { HP: 700, EXP: 50 }],
    ['bottom', "Arbormon's Lower Armor", { DS: 700, EXP: 50 }], ['gloves', "Arbormon's Gauntlet", { CT: 5, EXP: 100 }], ['shoes', "Arbormon's Boots", { MS: 30 }],
    ['head', "Chakkumon's Ear Muffs", { AT: 300, EXP: 100 }], ['fashion', "Chakkumon's Ski Board", { SKP: 5, AT: 150 }], ['top', "Chakkumon's Ice Vest", { HP: 700, AT: 150 }],
    ['bottom', "Chakkumon's Snowman", { DS: 700, AT: 150 }], ['gloves', "Chakkumon's Romeo", { CT: 5, AT: 300 }], ['shoes', "Chakkumon's Winter Boots", { MS: 30 }],
    ['head', "Lanamon's Helmet", { HP: 2000, EXP: 100 }], ['fashion', "Lanamon's Shell", { SKP: 5, HP: 2000 }], ['top', "Lanamon's Swimsuit", { HP: 700, DS: 2000 }],
    ['bottom', "Lanamon's Tights", { DS: 1500, HP: 1500 }], ['gloves', "Lanamon's Gauntlet", { CT: 5, DS: 2000 }], ['shoes', "Lanamon's Bangle", { MS: 30 }],
    ['head', "Fairimon's Wing Goggles", { AT: 150, CT: 3 }], ['fashion', "Fairimon's Fairy Wings", { SKP: 5, CT: 3 }], ['top', "Fairimon's Upper Armor", { HP: 700, CT: 3 }],
    ['bottom', "Fairimon's Lower Armor", { DS: 1000, CT: 3 }], ['gloves', "Fairimon's Gauntlet", { CT: 5, EXP: 200 }], ['shoes', "Fairimon's Fairy Boots", { MS: 30 }],
    ['head', 'Trendy Ball Cap', { AT: 100, HT: 300 }], ['fashion', 'Trendy Wireless Earphones', { SKP: 5, HT: 300 }], ['top', 'Trendy White Shirt', { SKP: 5, HP: 1000 }],
    ['bottom', 'Trendy Wide Pants', { DS: 1000, AT: 200 }], ['gloves', 'Trendy Watch', { AT: 300, DS: 1000 }], ['shoes', 'Trendy Sneakers', { MS: 30 }],
    ['fashion', 'Agumon Ornament', { AT: 100, EXP: 200 }], ['top', 'Agumon Top', { SKP: 10, HP: 700 }], ['bottom', 'Agumon Bottom', { AT: 200, DS: 1200 }],
    ['gloves', 'Agumon Paw Gloves', { AT: 300, HP: 700 }], ['shoes', 'Agumon Feet Shoes', { MS: 30, DE: 200 }],
    ['head', 'Cozy and warm Hat', { AT: 50, EXP: 200 }], ['top', 'Cozy and warm Quilting Jacket', { HP: 700, SKP: 10 }], ['bottom', 'Cozy and warm Pants', { AT: 200, DS: 1200 }],
    ['gloves', 'Cozy and warm Leather Gloves', { AT: 300, HP: 700 }], ['shoes', 'Cozy and warm Socks', { DE: 200, MS: 30 }], ['fashion', 'Warm Hand Warmer', { DE: 100, EXP: 200 }],
    ['head', "Spooky Pumpkinmon's Mask", { AT: 50, EXP: 200 }], ['top', "Spooky Soulmon's Robe", { SKP: 10, HP: 1000 }], ['shoes', 'Spooky Wizardmon Shoes', { MS: 30, DE: 100 }],
    ['gloves', 'Star Lollipop', { AT: 150, EXP: 100 }], ['top', 'Unlimited Advanced T-shirt (30d)', { HP: 800 }], ['shoes', 'Swimming Gears - Flippers', { MS: 30, DE: 200 }],
  ];
  ev.forEach(([slot, name, stats], i) => add({ id: `ev_${i}`, slot, name: `${name} [Evento]`, stats, src: 'WIKI' }));

  // ───────── Costumes ─────────
  // Costumes modernos (notas oficiales 2025-2026).
  // Advanced Costume: todos los stats juntos. Costume con stat: comunes + UNA opción a elegir (HP / AT / SCD).
  [
    ['Snowboard / Figure Skating Costume', 'OFFICIAL 25.02.2026'],
    ['Black Formal Dress Costume (Marcus, Thomas, Yoshino, Keenan)', 'OFFICIAL 01.07.2026'],
    ["T.K.'s Patamon / Hikari's Gatomon Doll Clothes", 'OFFICIAL 01.07.2026'],
    ['Mimi Princess Dress', 'OFFICIAL 01.07.2026'],
    ['Sora Tennis Costume', 'OFFICIAL 01.07.2026'],
    ['Otro Advanced Costume (crafteado con Advanced Costume Craft Coupon)', 'OFFICIAL 25.03.2026'],
  ].forEach(([name, src], i) => add({ id: `cos_adv_${i}`, slot: 'costume', name: `${name} [Advanced]`, src,
    stats: { SKP: 20, AT: 1100, HP: 2500, MS: 88, EXP: 2500 } }));
  const costumeVariants = { SCD: { SKP: 10 }, AT: { AT: 700 }, HP: { HP: 1500 } };
  [
    ['Plush Outfit (T.K. Patamon / Hikari Gatomon)', 'OFFICIAL 17.06.2025'],
    ['Princess Mimi Dress', 'OFFICIAL 17.06.2025'],
    ['Swimsuit (Thomas, Hikari, Tai, T.K., Keenan, Mimi, Matt, Marcus, Yoshino, Sora)', 'OFFICIAL 15.07.2025'],
    ['Marine Look White / Navy (Hiro, Ruli, Kiyoshiro)', 'OFFICIAL 03.12.2025'],
    ['Cat Pajama Costume', 'OFFICIAL 03.12.2025 / 05.08.2026'],
    ['Winter Cape', 'OFFICIAL 17.12.2025'],
    ["Digimon Kaiser's Costume", 'OFFICIAL 28.01.2026'],
    ['Snowboard / Figure Skating Costume', 'OFFICIAL 25.02.2026'],
    ['Black Formal Dress Costume', 'OFFICIAL 01.07.2026'],
    ['Coin Costume (T.K., Hikari, Mimi, Sora)', 'OFFICIAL 01.07.2026'],
    ['Sora Tennis Costume', 'OFFICIAL 01.07.2026'],
    ['Digimon Tamers Casual Outfit', 'OFFICIAL 09.09.2026'],
    ['Ghost Game After-School Costume', 'OFFICIAL 09.09.2026'],
  ].forEach(([name, src], i) => add({ id: `cos_var_${i}`, slot: 'costume', name, src,
    stats: { MS: 77, EXP: 1500 }, variants: costumeVariants, defVariant: 'SCD' }));
  // Costumes viejos (dmowiki)
  [
    ['Costume legacy cash (Santa, Snowboard, Fencing, Tennis...)', { AT: 600, MS: 77, EXP: 200 }, 'WIKI'],
    ['Red-Winged Santa Costume', { AT: 700, MS: 77, EXP: 300 }, 'WIKI'],
    ['Mature Blue Soccer Uniform', { AS: 7, HP: 1000, CT: 10 }, 'WIKI'],
    ["Veteran's Red Soccer Uniform", { HP: 1500, DE: 700, HT: 500 }, 'WIKI'],
    ['Professional Black Soccer Uniform', { AT: 400, HT: 300, CT: 7 }, 'WIKI'],
    ["Champion's White Soccer Uniform", { AT: 300, MS: 77, EXP: 1000 }, 'WIKI'],
    ["Champion's Taekwondo Uniform", { HP: 2500, MS: 77 }, 'WIKI'],
    ['Luxury Black Formal Dress / Newbie Yellow Soccer', { DS: 1000, MS: 77, EXP: 1000 }, 'WIKI'],
    ["Beginner's Orange Soccer", { HP: 1000, MS: 70, EXP: 700 }, 'WIKI'],
    ['Adorable / Cute Doll clothes', { AT: 150, HP: 500, DE: 150 }, 'WIKI'],
  ].forEach(([name, stats, src], i) => add({ id: `cos_${i}`, slot: 'costume', name, stats, src }));

  // ───────── Magnetic ID Cards (notas oficiales GameKing) ─────────
  // Time Ruler (Gobernante del Tiempo, 16.09.2025) y Heaven Wings (05.08.2025): mismos stats.
  //   Stat principal +0..+15 · Skill Damage desde +5 (EXP: desde +6) hasta +12% · Daño Final +1/+2/+3% en +13/+14/+15.
  // Digimon King (10.12.2025): stat principal + EXP% · Daño Final en +13..+15.  CT "rating" / 100 = % (igual que los sellos).
  const idMain = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 900, 1000, 1200, 1500];
  const idHP = [700, 800, 900, 1000, 1200, 1500, 1700, 1900, 2100, 2300, 2500, 2800, 3000, 3500, 4000, 5000];
  const idEXP = [100, 150, 200, 250, 300, 400, 450, 500, 550, 600, 700, 800, 1000, 1100, 1200, 1500];
  const idSCD = [0, 0, 0, 0, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12];
  const idSCDexp = [0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12];
  const idFD = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3];
  const idKingEXP = [0, 0, 0, 0, 0, 500, 1000, 1200, 1400, 1600, 1800, 2000, 2500, 3000, 4000, 5000];
  const mainOf = { AT: { AT: idMain }, HT: { HT: idMain }, CT: { CT: idMain.map((v) => v / 100) }, HP: { HP: idHP } };
  for (const [series, prefix, src] of [['Time Ruler', 'id_tr', 'OFFICIAL 16.09.2025'], ['Heaven Wings', 'id_hw', 'OFFICIAL 05.08.2025']]) {
    for (const [k, main] of Object.entries(mainOf)) {
      add({ id: `${prefix}_${k.toLowerCase()}`, slot: 'id_card', name: `Magnetic ID Card – ${series} [${k}]`, enhMax: 15, enh: Object.assign({}, main, { SKP: idSCD, FD: idFD }), src });
    }
    add({ id: `${prefix}_exp`, slot: 'id_card', name: `Magnetic ID Card – ${series} [EXP]`, enhMax: 15, enh: { EXP: idEXP, SKP: idSCDexp, FD: idFD }, src });
  }
  for (const [k, main] of Object.entries(mainOf)) {
    add({ id: `id_king_${k.toLowerCase()}`, slot: 'id_card', name: `Magnetic ID Card – Digimon King [${k}]`, enhMax: 15, enh: Object.assign({}, main, { EXP: idKingEXP, FD: idFD }), src: 'OFFICIAL 10.12.2025' });
  }
  add({ id: 'id_time_destroyer', slot: 'id_card', name: 'Magnetic ID Card – Time Destroyer', stats: { SKP: 10, CD: 20, HP: 2000 }, src: 'OFFICIAL 18.03.2025' });
  add({ id: 'id_green_ht', slot: 'id_card', name: 'Magnetic ID Card – Green Wings [HT]', stats: { HT: 300, HP: 2000, EXP: 400 }, src: 'OFFICIAL 11.02.2026' });
  add({ id: 'id_green_ct', slot: 'id_card', name: 'Magnetic ID Card – Green Wings [CT]', stats: { CT: 3, HP: 2000, EXP: 400 }, src: 'OFFICIAL 11.02.2026', note: 'Oficial "CA +300" = CT 3%' });
  add({ id: 'id_green_scd', slot: 'id_card', name: 'Magnetic ID Card – Green Wings [Skill]', stats: { AT: 300, SKP: 3, EXP: 400 }, src: 'OFFICIAL 05.08.2025' });
  add({ id: 'id_yellow', slot: 'id_card', name: 'Magnetic ID Card – Yellow Wings', stats: { SKP: 5, AT: 500, HT: 300 }, src: 'WIKI' });

  // ───────── Goggles ─────────
  const kgSCD = [10, 10, 11, 11, 12, 12, 13, 13, 14, 20];
  const kg = {
    HT: [1500, 1600, 1700, 1800, 1900, 2000, 2200, 2400, 2600, 3000],
    EV: [2000, 2050, 2100, 2150, 2200, 2250, 2400, 2550, 2700, 3000].map((v) => v / 100),
    CT: [3000, 3050, 3100, 3150, 3200, 3250, 3400, 3550, 3700, 4000].map((v) => v / 100),
    HP: [4000, 4050, 4100, 4150, 4200, 4250, 4400, 4550, 4700, 5000],
    AT: [2500, 2600, 2700, 2800, 2900, 3000, 3200, 3400, 3600, 4000],
  };
  for (const [k, arr] of Object.entries(kg)) {
    add({ id: `kaiser_gog_${k}`, slot: 'goggles', name: `Digimon Kaiser's Goggles [${k}] (Lv1-10)`, enhMin: 1, enhMax: 10,
      enh: { SKP: [0, ...kgSCD], [k]: [0, ...arr] }, src: 'OFFICIAL 26.11.2025', note: (k === 'CT' || k === 'EV') ? 'rating /100 = % (estimado)' : undefined });
  }
  add({ id: 'adv_gog_at', slot: 'goggles', name: 'Adventure Goggles [AT/AT] Complete', stats: { AT: 2500, SKP: 10 }, src: 'WIKI', note: 'AT 1500 + sub AT 1000' });
  add({ id: 'adv_gog_ct', slot: 'goggles', name: 'Adventure Goggles [CT/CT] Complete', stats: { CT: 30, SKP: 10 }, src: 'WIKI', note: 'CT 2000 + 1000 rating (=30% est.)' });
  add({ id: 'adv_gog_ht', slot: 'goggles', name: 'Adventure Goggles [HT/HT] Complete', stats: { HT: 1500, SKP: 10 }, src: 'WIKI' });
  add({ id: 'tamer_gog', slot: 'goggles', name: "Tamer's Goggles Complete [legacy/Tamer]", range: { AT: [100, 500], HP: [200, 1000], EXP: [20, 100] }, tamerStat: true, src: 'WIKI' });

  // ───────── XAI ─────────
  add({ id: 'xai_basic', slot: 'xai', name: 'XAI Ver. I-X (sin stats)', stats: {}, src: 'WIKI' });
  add({ id: 'xai_storm', slot: 'xai', name: 'XAI Ver. X-Mas / Storm / Storm II', stats: { AT: 200, HP: 1000 }, src: 'WIKI' });
  add({ id: 'xai_dmx', slot: 'xai', name: 'Digital Monster X', stats: { SKP: 10 }, src: 'OFFICIAL 21.01.2026' });
  add({ id: 'xai_cdmx', slot: 'xai', name: 'Complete Digital Monster X', stats: { SKP: 70, HP: 5000, HT: 5000, CT: 50 }, src: 'OFFICIAL 21.01.2026', note: 'CT "Critical Probability +50%"' });

  // ───────── DigiAura ─────────
  add({ id: 'aura_brave', slot: 'digiaura', name: 'DigiAura of Bravery and Friendship', range: { HP: [400, 2000], AT: [300, 1500], SKP: [2, 10] }, set: 'eos', src: 'OFFICIAL 01.10.2025' });
  add({ id: 'aura_super', slot: 'digiaura', name: 'SuperMoon / Feathers / Reinforced Ver. Y', stats: { AT: 300, HP: 1300 }, src: 'WIKI' });
  add({ id: 'aura_x', slot: 'digiaura', name: 'Reinforced DigiAura Ver. X', stats: { AT: 250, HP: 1200 }, src: 'WIKI' });
  add({ id: 'aura_halloween', slot: 'digiaura', name: 'Halloween DigiAura', stats: { AT: 200, HP: 1000 }, src: 'WIKI' });
  add({ id: 'aura_full', slot: 'digiaura', name: 'FullMoon DigiAura', stats: { AT: 200, HP: 800 }, src: 'WIKI' });

  // ───────── Key Rings ─────────
  add({ id: 'kr_ghost', slot: 'keyring', name: 'Ghost Keyring · Marketplace', enhMax: 15, familyLock: true,
    enh: { HT: [100, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 550, 600, 650, 750, 1000],
      HP: [0, 0, 0, 0, 0, 500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000, 5000],
      SKP: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 32, 35, 37, 40, 50] }, src: 'OFFICIAL 21.01.2025' });
  // Keyring of Greed (Santuario de Barbamon, oficial 26.08.2026). Sin restricción de familia, +0..+10.
  add({ id: 'kr_greed', slot: 'keyring', name: 'Keyring of Greed · Barbamon', enhMax: 10,
    enh: { HP: [3000, 3600, 3600, 4800, 4800, 5600, 5600, 6400, 7500, 8700, 10000],
      HT: [0, 0, 700, 1000, 1000, 1400, 1400, 1800, 2300, 2900, 3600],
      AT: [0, 0, 0, 0, 250, 250, 450, 450, 750, 1100, 1500],
      SKP: [30, 35, 40, 50, 50, 55, 55, 58, 58, 60, 60] }, src: 'OFFICIAL 26.08.2026' });

  // ───────── Sets ─────────
  const frontier4 = { pieces: 4, stats: { HP: 4500, HT: 1000, FD: 25 }, text: 'Daño recibido -30%, daño de skill recibido -20%' };
  const sets = {
    mdg_yolei: { name: 'Yolei — Heart of Love', bonuses: [
      { pieces: 4, stats: { SKP: 40, HP: 4500 }, text: 'Daño de skill recibido -20%' },
      { pieces: 6, cond: '50% al usar skill, 10s', stats: { SKP: 50, HT: 1000 }, text: 'Daño recibido -30%' }] },
    mdg_tk: { name: 'T.K. — Light of Hope', bonuses: [
      { pieces: 4, stats: { HP: 3000, HT: 1500, EXP: 1000 } },
      { pieces: 6, cond: '30% al matar monstruo, 10s', stats: { SKP: 70, AT: 3000, EXP: 2000 } }] },
    mdg_davis: { name: 'Davis — Power of Courage', bonuses: [
      { pieces: 4, cond: '30% en ataque normal, 10s', stats: { CT: 20, CD: 20, HT: 1000 } },
      { pieces: 6, cond: '70% al golpear, 10s', stats: { AS: 5, CD: 30, AT: 2000 } }] },
    fr_fire: { name: 'Frontier — Fire : Spirit', bonuses: [frontier4, { pieces: 6, stats: { HP: 4000, DS: 4000 } }] },
    fr_light: { name: 'Frontier — Light : Spirit', bonuses: [frontier4, { pieces: 6, stats: { HT: 7000, CT: 30 }, text: 'unidad de CT dudosa' }] },
    fr_ice: { name: 'Frontier — Ice : Spirit', bonuses: [frontier4, { pieces: 6, stats: { HT: 3000, CT: 70 }, text: 'unidad de CT dudosa' }] },
    fr_wind: { name: 'Frontier — Wind : Spirit', bonuses: [frontier4, { pieces: 6, stats: { AT: 4000, AS: 5 } }] },
    fr_thunder: { name: 'Frontier — Thunder : Spirit', bonuses: [frontier4, { pieces: 6, stats: { AS: 3, EXP: 4000 } }] },
    fhb: { name: 'Power of the Four Holy Beasts', requiresGrade: 'Ultimate', bonuses: [{ pieces: 6, stats: { HT: 500, AT: 500, SKP: 2 }, text: 'Las 6 piezas en grado Ultimate' }] },
    eos: { name: 'First Digivice + DigiAura of Bravery', bonuses: [{ pieces: 2, stats: { HP: 2000, HT: 1000, CT: 10, FD: 1 } }] },
  };

  // ───────── Digivices ─────────
  const digivices = [
    { id: 'dv_none', name: '— Sin digivice —', slots: 0, opts: 0 },
    { id: 'dv_101', name: '101-Orange-AP1', slots: 2, opts: 0 },
    { id: 'dv_102', name: '102-Blue-BT', slots: 3, opts: 0 },
    { id: 'dv_103', name: '103-Purple-BT', slots: 4, opts: 0 },
    { id: 'dv_begin', name: 'Digivice of Beginning Lv2', slots: 3, opts: 2, attrMax: 7, elemMax: 10, stats: { AT: 152 } },
    { id: 'dv_adv', name: 'Digivice of Adventure Lv2', slots: 4, opts: 2, attrMax: 10, elemMax: 15, stats: { AT: 168 } },
    { id: 'dv_true', name: 'True Digivice (Crests) / 103-OT / D-Ark Limited', slots: 4, opts: 2, attrMax: 10, elemMax: 15 },
    { id: 'dv_unknown', name: 'Unknown Digivice Lv.Max', slots: 3, opts: 0, stats: { AT: 400 }, text: 'Daño a Unknown +10%' },
    { id: 'dv_xros', name: 'Xros / Fusion / Darkness Loader Max', slots: 6, opts: 2, attrMax: 15, elemMax: 20 },
    { id: 'dv_dimxros', name: 'Dim Xros Loader', slots: 5, opts: 2, attrMax: 5.5, unkMax: 4.5, elemMax: 7.5 },
    { id: 'dv_first_1', name: 'First Digivice Lv1 (Eos)', slots: 6, opts: 2, attrMax: 15, unkMax: 12, elemMax: 20, set: 'eos' },
    { id: 'dv_first_5', name: 'First Digivice Lv5 (Eos)', slots: 6, opts: 2, attrMax: 17, unkMax: 14, elemMax: 22, set: 'eos' },
    { id: 'dv_first_10', name: 'First Digivice Lv10 (Eos)', slots: 7, opts: 2, attrMax: 19.5, unkMax: 16.5, elemMax: 24.5, set: 'eos' },
    { id: 'dv_first_c', name: 'First Digivice Complete (Eos)', slots: 8, opts: 2, attrMax: 20, unkMax: 17.5, elemMax: 25, set: 'eos' },
  ];

  // ───────── Chipsets ─────────
  const chipsets = {
    families: ['DR', 'DS', 'JT', 'ME', 'NSp', 'NSo', 'UK', 'VB', 'WG', 'DA'],
    stats: ['HP', 'DS', 'AT', 'DE', 'HT', 'CT', 'EV'],
    // máximo por rango R1..R20. R15 HP/DS/DE y R19/R20 son estimados (interpolación/extrapolación)
    family: {
      HP: [135, 269, 404, 538, 672, 807, 941, 1076, 1210, 1344, 1479, 1613, 1749, 1882, 2016, 2151, 2285, 2420, 2554, 2689],
      DS: [120, 240, 360, 480, 600, 720, 840, 960, 1080, 1200, 1320, 1440, 1560, 1680, 1800, 1920, 2040, 2160, 2280, 2400],
      AT: [20, 39, 58, 77, 97, 115, 135, 153, 173, 192, 211, 230, 250, 268, 288, 306, 326, 345, 364, 384],
      DE: [15, 27, 41, 56, 68, 82, 94, 108, 123, 135, 149, 163, 177, 190, 203, 216, 231, 243, 256, 270],
      HT: Array.from({ length: 20 }, (_, i) => 25 * (i + 1)),
      CT: Array.from({ length: 20 }, (_, i) => 0.25 * (i + 1)),
      EV: Array.from({ length: 20 }, (_, i) => 0.25 * (i + 1)),
    },
    estRanks: [15, 19, 20],
    allFamilyRatio: 0.8,
    doubleSubRatio: 0.6,
    types: [
      { key: 'family', label: 'ChipSet R (Familia)' },
      { key: 'all', label: 'ChipSet R (All Family, ~80%)' },
      { key: 'double', label: 'Double ChipSet (principal + sub 60%)' },
    ],
  };

  // ───────── Tamers (pasivas por atributo del digimon) ─────────
  const tamers = [
    { name: '— Ninguno —', p: [] },
    { name: 'Marcus', p: [['ATP', 5, 'Vaccine'], ['HPP', 10, 'Data']], skill: 'Bash: 6x AT del tamer' },
    { name: 'Thomas', p: [['ATP', 5, 'Data'], ['HPP', 10, 'Virus']], skill: 'Insight: prob. crítico +100% 30s' },
    { name: 'Yoshino', p: [['ATP', 5, 'Data'], ['HPP', 10, 'Vaccine']], skill: 'Protection: inmune 3s' },
    { name: 'Keenan', p: [['ATP', 5, 'Vaccine'], ['ATP', 10, 'Unknown']], skill: 'Shock: daño crítico +100% 30s' },
    { name: 'Tai', p: [['ATP', 5, 'Vaccine'], ['HPP', 10, 'Virus']], skill: 'Berserker: AT base +50% 30s' },
    { name: 'Mimi', p: [['ATP', 5, 'Data'], ['ATP', 10, 'Unknown']], skill: 'Pray: cura party 40%' },
    { name: 'T.K.', p: [['ATP', 5, 'Virus'], ['ATP', 10, 'Unknown']], skill: 'Cheer: HP/DS completo' },
    { name: 'Matt', p: [['ATP', 5, 'Virus'], ['HPP', 10, 'Data']], skill: 'Vigor: daño skill +30% 30s' },
    { name: 'Kari', p: [['ATP', 5, 'Virus'], ['HPP', 10, 'Vaccine']], skill: 'Encouragement: HP party +30%' },
    { name: 'Sora', p: [['ATP', 5, 'Vaccine'], ['HPP', 10, 'Unknown']], skill: 'Impregnableness: daño recibido -30%' },
    { name: 'Izzy', p: [['ATP', 5, 'Unknown'], ['HPP', 10, 'Virus']], skill: 'Analysis: daño crítico +150% 7s' },
    { name: 'Joe', p: [['ATP', 5, 'Virus'], ['HPP', 10, 'Vaccine']], skill: 'Evade: EV +70% 10s' },
    { name: 'Takato', p: [['ATP', 5, 'Virus'], ['HPP', 10, 'Vaccine']], skill: 'Focus: daño skill party +10%' },
    { name: 'Henry', p: [['ATP', 5, 'Vaccine'], ['HPP', 10, 'Data']], skill: 'Guard: daño recibido party -30%' },
    { name: 'Rika', p: [['ATP', 5, 'Data'], ['HPP', 10, 'Virus']], skill: 'Aim: HT base +300% 10s' },
    { name: 'Ryo', p: [['ATP', 5, 'Vaccine'], ['HPP', 10, 'None']], skill: 'Suppression: AT base +100%, skill +60% 10s' },
    { name: 'Jeri', p: [['ATP', 5, 'Vaccine'], ['HPP', 10, 'Unknown']], skill: 'Naivety: HP +15%, DE +500 2min' },
    { name: 'Hiro / Kiyoshiro / Ruli / Kaiser (genérico)', p: [], est: true, skill: 'Pasivas no confirmadas — usar "Modificadores custom"' },
  ];

  const clothingSlots = ['head', 'fashion', 'top', 'bottom', 'gloves', 'shoes'];
  // El catalogo conserva las piezas antiguas para poder leer builds guardados.
  for (const item of items) {
    if (item.set === 'fhb') {
      item.fixedGrade = 'Ultimate';
      item.gradeList = ['Ultimate'];
      item.name += ' [Ultimate]';
    }
    if (clothingSlots.includes(item.slot)) {
      const agumon = item.name.startsWith('Agumon ');
      item.hidden = !(item.set?.startsWith('mdg_') || item.set?.startsWith('fr_') || item.set === 'fhb' || agumon);
      if (agumon) item.name = item.name.replace(' [Evento]', '');
    }
  }
  DMO.equipment = { slots, items, sets, digivices, chipsets, tamers, clothingSlots };
})();

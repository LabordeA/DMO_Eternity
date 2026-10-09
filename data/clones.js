/* DigiClone (Clonar). Fuente: dmowiki DigiClone, jyj9655/dmo-upgrade-helper (KDMO), rod9000/Stats-calculator-dmo.
   Clon perfecto acumulado por nivel (en %). Todos los tipos salvo BL son % del stat BASE del digimon
   (nivel + tamaño). BL suma plano. HP requiere Trascendencia. */
window.DMO = window.DMO || {};
DMO.clones = {
  maxLevel: 15,
  types: [
    { key: 'AT', label: 'AT Clone', scalesWithBase: true,
      perLevel: [3,3,3,5,5,5,10,10,10,15,15,15,15,15,15] },
    { key: 'CT', label: 'CT Clone', scalesWithBase: true,
      perLevel: [15,15,15,25,25,25,50,50,50,75,75,75,75,75,75] },
    { key: 'BL', label: 'BL Clone', scalesWithBase: false,
      perLevel: [2,2,2,3,3,3,6,6,6,9,9,9,9,9,9] },
    { key: 'EV', label: 'EV Clone', scalesWithBase: true,
      perLevel: [12,12,12,20,20,20,40,40,40,60,60,60,60,60,60] },
    { key: 'HP', label: 'HP Clone', scalesWithBase: true, requires: 'Trascendencia',
      perLevel: [2,2,2,3,3,3,4,4,4,4,4,4,5,5,5] },
  ],
  // Rango estimado del mínimo por nivel (no publicado). Se usa sólo para el modo "promedio".
  minRollRatio: 0.35,
  // Bandas de ítem por nivel (inferido): D 1-3, C 4-6, B 7-9, A 10-12, S 13-15
  items: [
    { rank: 'D', levels: [1, 3], success: 90, downOnFail: 0 },
    { rank: 'C', levels: [4, 6], success: 50, downOnFail: 20 },
    { rank: 'B', levels: [7, 9], success: 25, downOnFail: 40 },
    { rank: 'A', levels: [10, 12], success: 18, downOnFail: 60 },
    { rank: 'S', levels: [13, 15], success: 15, downOnFail: 70 },
  ],
  variants: [
    'Digiclone: puede fallar, valor aleatorio [min,max]',
    'Reinforced Digiclone: puede fallar, siempre valor máximo',
    'Mega Digiclone: nunca falla, valor aleatorio',
    'Mega Reinforced Digiclone: nunca falla, siempre máximo',
    'Backup Disk: evita bajar de nivel al fallar',
  ],
  // AT clone también sube daño de skill: ~+1% skill por cada 3.35% de AT clone (Lv15 ≈ +43%)
  atCloneSkillRatio: 43 / 144,
};

DMO.clones.cumulative = function (typeKey, level) {
  const t = DMO.clones.types.find((x) => x.key === typeKey);
  if (!t) return 0;
  let s = 0;
  for (let i = 0; i < Math.min(level, t.perLevel.length); i++) s += t.perLevel[i];
  return s;
};

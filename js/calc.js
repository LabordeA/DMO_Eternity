/* Motor de cálculo del build. Sin DOM.
   Orden (emulador + dmowiki):
     1) Base = f(nivel, tamaño, tipo, etapa)  [+ deck HP% se integra al base]
     2) Clon = base × clon% (BL suma plano)
     3) Planos: sellos, título, joyería (× DP), equipo, sets, chipsets, digivice, tamer × FS%, custom
     4) % sobre base: pasivas del tamer, buffs, custom
     5) AS = AS base × (1 - Vel.Ataque%) (mín 0.3 s) */
(function () {
  const Calc = {};
  const PCT_OF_BASE = { HPP: 'HP', ATP: 'AT', DEP: 'DE', DSP: 'DS', HTP: 'HT' };
  // Alias de claves de distintas fuentes a las del planner
  const ALIAS = { AS: 'ASP' };
  const normKey = (k, ctx) => (ctx === 'base' ? k : (ALIAS[k] || k));

  Calc.defaultBuild = function () {
    return {
      v: 1,
      name: '',
      server: 'GDMO',
      digimon: { name: 'Omegamon - Merciful Mode', level: 170, size: 140, type: null, baseOverride: null },
      clone: { AT: { lv: 15, pct: null }, CT: { lv: 15, pct: null }, BL: { lv: 15, pct: null }, EV: { lv: 0, pct: null }, HP: { lv: 0, pct: null } },
      seals: {},
      equip: {},
      digivice: { id: 'dv_none', opts: [] },
      chips: [],
      jewelry: {},
      tamer: { name: '— Ninguno —', fs: 0, stats: { HP: 0, DS: 0, AT: 0, DE: 0 } },
      deck: '',
      title: '',
      buffs: [],
      procs: false,
      custom: [],
      target: { attr: 'Data', elem: 'Neutral', de: 0, attrExp: 100, elemExp: 100, skillBase: 20000 },
      adv: Object.assign({}, DMO.advantageDefaults),
    };
  };

  Calc.findDigimon = (name) => DMO.digimon.find((d) => d.n === name) || null;

  // Interpolación del crecimiento por nivel
  Calc.growth = function (type, level) {
    const tab = DMO.levelGrowth[type] || DMO.levelGrowth.SA;
    const lvs = Object.keys(tab).map(Number).sort((a, b) => a - b);
    if (tab[level]) return tab[level].slice();
    let lo = lvs[0], hi = lvs[lvs.length - 1];
    if (level >= hi) {
      // extrapolación lineal con la última pendiente
      const a = lvs[lvs.length - 2];
      return tab[hi].map((v, i) => v + (v - tab[a][i]) / (hi - a) * (level - hi));
    }
    for (const l of lvs) { if (l <= level) lo = l; if (l >= level) { hi = l; break; } }
    const r = (level - lo) / (hi - lo || 1);
    return tab[lo].map((v, i) => v + (tab[hi][i] - v) * r);
  };

  Calc.baseStats = function (dg, level, sizePct, typeOverride, override) {
    const [bHP, bDS, bAT, bDE, bCT, bEV, bHT, bAS] = dg.b;
    const t = typeOverride || dg.t || 'SA';
    const m = dg.m || DMO.stageMultipliers[dg.f] || 2.0;
    const s = sizePct / 100;
    const [gHP, gDS, gAT, gDE, gCT] = Calc.growth(t, level);
    const base = {
      HP: Math.round(s * bHP + gHP * m),
      DS: Math.round(bDS + gDS * m),
      AT: Math.round(s * bAT + gAT * m),
      DE: Math.round(s * bDE + gDE * m),
      CT: Math.round((s * bCT + gCT) * 100) / 100,
      EV: bEV || 0,
      HT: bHT || 0,
      AS: bAS || 2,
    };
    if (override) for (const [k, v] of Object.entries(override)) if (v != null && v !== '') base[k] = Number(v);
    return { base, type: t, mult: m };
  };

  Calc.sealTier = function (seal, count) {
    if (!count || count <= 0) return -1;
    const th = DMO.seals.thresholdTables[seal.t];
    let idx = -1;
    for (let i = 0; i < th.length; i++) if (count >= th[i]) idx = i;
    return idx;
  };
  Calc.sealValue = function (seal, count) {
    const i = Calc.sealTier(seal, count);
    return i < 0 ? 0 : seal.v[i];
  };

  Calc.clonePct = function (key, c) {
    if (!c) return 0;
    if (c.pct != null && c.pct !== '') return Number(c.pct);
    return DMO.clones.cumulative(key, c.lv || 0);
  };

  // Resuelve los stats de un ítem de equipo según mejora/grado y overrides del usuario
  Calc.equipStats = function (item, eq) {
    const out = {};
    if (!item) return out;
    if (item.stats) Object.assign(out, item.stats);
    if (item.variants) Object.assign(out, item.variants[eq.variant || item.defVariant] || {});
    if (item.range) for (const [k, [, max]] of Object.entries(item.range)) out[k] = max;
    if (item.enh) {
      const e = Math.max(0, Math.min(eq.enh ?? item.enhMax ?? 0, item.enhMax ?? 15));
      for (const [k, arr] of Object.entries(item.enh)) out[k] = arr[Math.min(e, arr.length - 1)];
    }
    if (item.grades) {
      const g = eq.grade || item.gradeList[item.gradeList.length - 1];
      const e = Math.max(0, Math.min(eq.enh ?? item.enhMax, item.enhMax));
      for (const [k, byG] of Object.entries(item.grades)) out[k] = (byG[g] || [])[e] ?? 0;
    }
    if (eq.vals) for (const [k, v] of Object.entries(eq.vals)) if (v !== null && v !== '' && !isNaN(v)) out[k] = Number(v);
    return out;
  };

  Calc.chipValue = function (chip) {
    const C = DMO.equipment.chipsets;
    const r = Math.max(1, Math.min(chip.rank || 18, 20)) - 1;
    const main = (C.family[chip.stat] || [])[r] || 0;
    const ratio = chip.type === 'all' ? C.allFamilyRatio : 1;
    const out = {};
    out[chip.stat] = Math.round(main * ratio * 100) / 100;
    if (chip.type === 'double' && chip.sub) {
      const subV = (C.family[chip.sub] || [])[r] || 0;
      out[chip.sub] = (out[chip.sub] || 0) + Math.round(subV * C.doubleSubRatio * 100) / 100;
    }
    return out;
  };

  Calc.attrRelation = function (a, b) {
    if (!a || !b) return 0;
    if ((DMO.attrStrong[a] || []).includes(b)) return 1;
    if ((DMO.attrStrong[b] || []).includes(a)) return -1;
    return 0;
  };
  Calc.elemRelation = function (a, b) {
    if (!a || !b || a === 'Neutral') return 0;
    if (b === 'Neutral') return 1;
    if (a === b) return 2;
    const [strong, weak] = DMO.elemChart[a] || [];
    if (strong === b) return 1;
    if (weak === b) return -1;
    return 0;
  };

  Calc.compute = function (build) {
    const notes = [];
    const dg = Calc.findDigimon(build.digimon.name);
    const res = { dg, base: {}, final: {}, breakdown: {}, notes, sets: [], warnings: [] };
    if (!dg) { notes.push('Elegí un digimon.'); return res; }

    const { base, type, mult } = Calc.baseStats(dg, build.digimon.level, build.digimon.size, build.digimon.type, build.digimon.baseOverride);
    res.base = base; res.type = type; res.mult = mult;
    if (!dg.t && !build.digimon.type) res.warnings.push('Tipo de atacante desconocido para este digimon: se asume Short Attacker.');
    if (DMO.levelGrowthEstimated(build.digimon.level)) res.warnings.push(`Crecimiento a nivel ${build.digimon.level} interpolado/extrapolado (estimado).`);

    const bd = {};
    const add = (stat, v, src, ctx) => {
      if (!v || isNaN(v)) return;
      const k = normKey(stat, ctx);
      if (PCT_OF_BASE[k]) {
        const bk = PCT_OF_BASE[k];
        const val = (base[bk] || 0) * v / 100;
        (bd[bk] = bd[bk] || []).push({ src: `${src} (${v}% base)`, v: val });
        return;
      }
      const arr = (bd[k] = bd[k] || []);
      const same = arr.find((x) => x.src === src);
      if (same) same.v += v; else arr.push({ src, v });
    };

    // 1) base
    for (const k of DMO.baseKeys) add(k, base[k], `Base Lv${build.digimon.level} @${build.digimon.size}%`, 'base');

    // Deck (sólo 1 activo). HP% del deck se integra al base.
    const deck = DMO.extras.decks.find((d) => d.name === build.deck);
    if (deck) {
      for (const fx of deck.fx) {
        if (!fx.stat) { notes.push(`Deck ${deck.name}: ${fx.cond ? fx.cond + ' → ' : ''}${fx.text}`); continue; }
        if (fx.cond && !build.procs) { notes.push(`Deck ${deck.name}: ${fx.stat} +${fx.v}% (${fx.cond}) — no contado`); continue; }
        add(fx.stat, fx.v, `Deck: ${deck.name}${fx.cond ? ' (proc)' : ''}`);
      }
    }

    // 2) Clon
    for (const t of DMO.clones.types) {
      const pct = Calc.clonePct(t.key, build.clone[t.key]);
      if (!pct) continue;
      const lv = build.clone[t.key]?.lv || 0;
      const label = build.clone[t.key]?.pct != null && build.clone[t.key]?.pct !== '' ? `Clon ${t.key} ${pct}%` : `Clon ${t.key} Lv${lv} (${pct}%)`;
      if (t.scalesWithBase) add(t.key, (base[t.key] || 0) * pct / 100, label, 'base');
      else add(t.key, pct, label, 'base');
    }
    const atClonePct = Calc.clonePct('AT', build.clone.AT);
    res.atCloneSkill = Math.round(atClonePct * DMO.clones.atCloneSkillRatio * 10) / 10;

    // 3) Sellos
    let sealCount = 0;
    const sealTotals = {};
    for (const [name, count] of Object.entries(build.seals || {})) {
      const s = DMO.seals.list.find((x) => x.n === name);
      if (!s) continue;
      const v = Calc.sealValue(s, count);
      if (v) { sealTotals[s.s] = (sealTotals[s.s] || 0) + v; sealCount++; }
    }
    for (const [k, v] of Object.entries(sealTotals)) add(k, Math.round(v * 100) / 100, `Sellos (${sealCount})`, 'base');
    res.sealTotals = sealTotals; res.sealCount = sealCount;

    // Título
    const title = DMO.extras.titles.find((t) => t.name === build.title);
    if (title) {
      for (const [k, v] of Object.entries(title.fx)) add(k, v, `Título: ${title.name}`);
      if (title.elem) {
        if (dg.e === title.elem) add('SKP', title.elemSkp, `Título: ${title.name} (${title.elem})`);
        else res.warnings.push(`Título: el +${title.elemSkp}% de skill es sólo para ${title.elem} (tu digimon es ${dg.e}).`);
      }
      if (title.note) notes.push(`Título: ${title.note}`);
    }

    // Equipo + conteo de sets
    const tamerPool = { HP: 0, DS: 0, AT: 0, DE: 0 };
    const setCount = {};
    for (const slot of DMO.equipment.slots) {
      const eq = build.equip[slot.key];
      if (!eq || !eq.id) continue;
      if (eq.id === 'custom') {
        for (const l of eq.lines || []) add(l.stat, Number(l.v), `${slot.label}: custom`);
        continue;
      }
      const item = DMO.equipment.items.find((i) => i.id === eq.id);
      if (!item) continue;
      const st = Calc.equipStats(item, eq);
      if (item.familyLock && eq.family && !dg.fam.includes(eq.family)) {
        res.warnings.push(`${item.name}: familia ${eq.family} no coincide con el digimon → sin efecto.`);
        continue;
      }
      for (const [k, v] of Object.entries(st)) {
        if (item.tamerStat && tamerPool[k] != null) tamerPool[k] += v;
        else add(k, v, `${slot.label}: ${item.name}`);
      }
      if (item.set) {
        const okGrade = !DMO.equipment.sets[item.set]?.requiresGrade || (eq.grade || 'Ultimate') === DMO.equipment.sets[item.set].requiresGrade;
        if (okGrade) setCount[item.set] = (setCount[item.set] || 0) + 1;
      }
    }

    // Digivice
    const dv = DMO.equipment.digivices.find((d) => d.id === build.digivice.id);
    if (dv) {
      if (dv.stats) for (const [k, v] of Object.entries(dv.stats)) add(k, v, `Digivice: ${dv.name}`);
      if (dv.text) notes.push(`Digivice: ${dv.text}`);
      if (dv.set) setCount[dv.set] = (setCount[dv.set] || 0) + 1;
      for (const o of (build.digivice.opts || []).slice(0, dv.opts)) {
        if (!o || !o.target || !o.v) continue;
        const match = o.kind === 'attr' ? dg.a === o.target : dg.e === o.target;
        if (match) add('SKP', Number(o.v), `Digivice opción ${o.target}`);
        else notes.push(`Digivice opción ${o.target} +${o.v}% no aplica a ${dg.a}/${dg.e}.`);
      }
      // Chipsets
      const chips = (build.chips || []).slice(0, dv.slots);
      chips.forEach((c, i) => {
        if (!c || !c.stat) return;
        if (c.type !== 'all' && c.fam && !dg.fam.includes(c.fam)) {
          res.warnings.push(`Chip ${i + 1} (${c.fam}) no coincide con la familia del digimon → sin efecto.`);
          return;
        }
        const vals = c.v != null && c.v !== '' ? { [c.stat]: Number(c.v) } : Calc.chipValue(c);
        for (const [k, v] of Object.entries(vals)) add(k, v, `Chipsets`);
      });
    }

    // Bonos de set
    for (const [setId, n] of Object.entries(setCount)) {
      const set = DMO.equipment.sets[setId];
      if (!set) continue;
      const active = [];
      for (const b of set.bonuses) {
        if (n < b.pieces) continue;
        if (b.cond && !build.procs) { notes.push(`${set.name} (${b.pieces}p): ${b.cond} — no contado`); active.push({ ...b, counted: false }); continue; }
        for (const [k, v] of Object.entries(b.stats || {})) add(k, v, `Set ${set.name} (${b.pieces}p)`);
        if (b.text) notes.push(`${set.name} (${b.pieces}p): ${b.text}`);
        active.push({ ...b, counted: true });
      }
      res.sets.push({ id: setId, name: set.name, pieces: n, max: Math.max(...set.bonuses.map((b) => b.pieces)), active });
    }

    // Joyería
    for (const slot of DMO.jewelry.slots) {
      const j = build.jewelry[slot.key];
      if (!j || !j.id) continue;
      const item = DMO.jewelry.items.find((i) => i.id === j.id);
      const dpMax = item?.dpMax || DMO.jewelry.dp.max;
      const dp = Math.max(DMO.jewelry.dp.min, Math.min(j.dp ?? 100, dpMax));
      for (const l of j.lines || []) {
        if (!l || !l.stat || !l.v) continue;
        add(l.stat, Math.round(Number(l.v) * dp) / 100, `${slot.label}${item ? '' : ' (custom)'} @${dp}%DP`);
      }
    }

    // Tamer: FS% de sus stats + pasivas
    const tm = DMO.equipment.tamers.find((t) => t.name === build.tamer.name);
    const fs = Math.max(0, Math.min(Number(build.tamer.fs) || 0, 60));
    for (const k of ['HP', 'DS', 'AT', 'DE']) {
      const tot = (Number(build.tamer.stats?.[k]) || 0) + tamerPool[k];
      if (tot && fs) add(k, Math.floor(tot * fs / 100), `Tamer ×${fs}% FS`);
    }
    if (tm) {
      for (const [stat, v, attr] of tm.p) {
        if (attr === dg.a) add(stat, v, `Pasiva ${tm.name} (${attr})`);
      }
    }

    // Buffs
    for (const id of build.buffs || []) {
      const b = DMO.extras.buffs.find((x) => x.id === id);
      if (b) for (const [k, v] of Object.entries(b.fx)) add(k, v, `Buff: ${b.name}`);
    }

    // Custom
    for (const c of build.custom || []) if (c && c.stat) add(c.stat, Number(c.v), c.label || 'Custom');

    // Totales
    const final = {};
    for (const [k, list] of Object.entries(bd)) final[k] = list.reduce((s, x) => s + x.v, 0);
    // AS: segundos por golpe
    const asp = final.ASP || 0;
    final.AS = Math.max(0.3, base.AS * (1 - asp / 100));
    bd.AS = [{ src: 'Base', v: base.AS }].concat(asp ? [{ src: `Vel. ataque -${UIround(asp)}%`, v: final.AS - base.AS }] : []);
    for (const k of ['HP', 'DS', 'AT', 'DE', 'HT', 'SK']) if (final[k] != null) final[k] = Math.floor(final[k]);
    for (const k of ['CT', 'EV', 'BL', 'CD', 'SKP', 'ATT', 'FD', 'NDMG', 'ASP', 'MS', 'EXP']) if (final[k] != null) final[k] = Math.round(final[k] * 100) / 100;
    final.SKP = (final.SKP || 0);
    res.final = final;
    res.breakdown = bd;
    res.damage = Calc.damage(build, res);
    return res;
  };

  function UIround(n) { return Math.round(n * 100) / 100; }

  // Estimación de daño (modelo del emulador + configuración de ventajas). Sirve para COMPARAR builds.
  Calc.damage = function (build, res) {
    const f = res.final, dg = res.dg, t = build.target, adv = build.adv || DMO.advantageDefaults;
    const at = f.AT || 0;
    let nb = at - (Number(t.de) || 0);
    if (nb < 0.5 * at) nb = 0.6 * at;
    const ar = Calc.attrRelation(dg.a, t.attr), er = Calc.elemRelation(dg.e, t.elem);
    const attrExp = (Number(t.attrExp) || 0) / 100, elemExp = (Number(t.elemExp) || 0) / 100;
    const attrMult = ar === 1 ? (adv.attrAdv + (f.ATT || 0)) / 100 * attrExp : ar === -1 ? adv.attrDis / 100 : 0;
    const elemMult = er === 1 ? adv.elemAdv / 100 * elemExp : er === -1 ? adv.elemDis / 100 : er === 2 ? adv.elemSame / 100 : 0;
    const ctRaw = f.CT || 0;
    const critChance = Math.min(ctRaw, 100) / 100;
    const cd = 100 + (f.CD || 0);
    const fd = 1 + (f.FD || 0) / 100;
    const normalHit = nb * (1 + attrMult + elemMult) * (1 + (f.NDMG || 0) / 100) * fd;
    const normalCrit = normalHit + nb * cd / 100 * fd;
    const normalAvg = normalHit * (1 - critChance) + normalCrit * critChance;
    const dps = normalAvg / (f.AS || 2);
    const sb = Number(t.skillBase) || 0;
    const skillBase = sb * (1 + (res.atCloneSkill || 0) / 100);
    const skill = (skillBase * (1 + (f.SKP || 0) / 100) + at + (f.SK || 0) + skillBase * (attrMult + elemMult)) * fd;
    return {
      attrRel: ar, elemRel: er, attrMult, elemMult, critChance, cd,
      normalHit: Math.floor(normalHit), normalCrit: Math.floor(normalCrit), normalAvg: Math.floor(normalAvg),
      dps: Math.floor(dps), skill: Math.floor(skill),
    };
  };

  window.Calc = Calc;
})();

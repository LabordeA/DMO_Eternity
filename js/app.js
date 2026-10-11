/* UI del DMO Build Planner */
(function () {
  const { h, clear, select, num, field, fmt, toast } = UI;
  const LS_KEY = 'dmo_builds_v1';
  const LS_CUR = 'dmo_current_v1';

  let build = loadCurrent() || Calc.defaultBuild();
  let reference = null; // build fijado para comparar deltas
  let result = null;
  let activeTab = 'digimon';
  let openBreakdown = 'AT';
  const ui = { q: '', fForm: '', fAttr: '', fElem: '', fFam: '', fType: '', fRank: '', sort: 'rank', sq: '', sStat: '', sOwned: false };

  const LIST_RANKS = ['SSS', 'SSS+', 'U'];
  // Ayuda plegable: mantiene la info sin ocupar pantalla
  const help = (...content) => h('details', { class: 'help' }, h('summary', null, 'ⓘ Cómo funciona'), h('div', null, ...content));

  const rankBadge = (r) => r
    ? h('span', { class: 'rank rank-' + r.replace(/\+/g, 'p').toLowerCase(), title: 'Rango ' + r }, r)
    : h('span', { class: 'rank rank-none', title: 'Sin rango (sólo Mega en adelante tiene rango)' }, '—');

  const statKeysAll = Object.keys(DMO.statDefs).filter((k) => k !== 'AS').concat(['HPP', 'ATP', 'DEP', 'DSP', 'HTP']);
  const statLabel = (k) => (DMO.statDefs[k]?.label) || ({ HPP: 'HP % base', ATP: 'AT % base', DEP: 'DE % base', DSP: 'DS % base', HTP: 'HT % base' }[k] || k);
  const isPct = (k) => !!DMO.statDefs[k]?.pct || ['HPP', 'ATP', 'DEP', 'DSP', 'HTP'].includes(k);
  const fmtStat = (k, v) => {
    if (v == null) return '—';
    if (k === 'AS') return fmt(v, 3) + ' s';
    return fmt(v, isPct(k) ? 2 : 0) + (isPct(k) ? '%' : '');
  };

  // ───────────────────────── Persistencia ─────────────────────────
  function loadCurrent() {
    try {
      if (location.hash.startsWith('#b=')) return decodeShare(location.hash.slice(3));
      const raw = localStorage.getItem(LS_CUR);
      return raw ? migrate(JSON.parse(raw)) : null;
    } catch (e) { console.warn(e); return null; }
  }
  // Completa campos faltantes de builds viejos/importados
  function migrate(b) {
    const d = Calc.defaultBuild();
    const out = Object.assign(d, b);
    for (const k of ['digimon', 'clone', 'tamer', 'digivice']) out[k] = Object.assign({}, Calc.defaultBuild()[k], b[k] || {});
    out.tamer.stats = Object.assign({ HP: 0, DS: 0, AT: 0, DE: 0 }, (b.tamer || {}).stats || {});
    delete out.target; delete out.adv;
    for (const k of ['seals', 'equip', 'jewelry']) out[k] = b[k] || {};
    for (const k of ['chips', 'buffs', 'custom']) out[k] = Array.isArray(b[k]) ? b[k] : [];
    return out;
  }
  function saveCurrent() { try { localStorage.setItem(LS_CUR, JSON.stringify(build)); } catch (e) { /* lleno */ } }
  function savedBuilds() { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; } }
  function setSavedBuilds(o) { localStorage.setItem(LS_KEY, JSON.stringify(o)); }

  // Sellos en el link: clave corta estable derivada del nombre (no depende del orden de la lista)
  function sealKey(n) { let x = 5381; for (let i = 0; i < n.length; i++) x = ((x * 33) ^ n.charCodeAt(i)) >>> 0; return x.toString(36); }
  function encodeShare(b) {
    const c = JSON.parse(JSON.stringify(b));
    const s = {};
    for (const [n, cnt] of Object.entries(c.seals || {})) if (cnt) s[sealKey(n)] = cnt;
    c.seals = s; c._sk = 1;
    return btoa(unescape(encodeURIComponent(JSON.stringify(c))));
  }
  function decodeShare(str) {
    const c = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(str)))));
    if (c._sk) {
      const byKey = {}; for (const x of DMO.seals.list) byKey[sealKey(x.n)] = x.n;
      const s = {}; for (const [k, cnt] of Object.entries(c.seals || {})) if (byKey[k]) s[byKey[k]] = cnt;
      c.seals = s; delete c._sk;
    }
    return migrate(c);
  }

  // ───────────────────────── Ciclo de render ─────────────────────────
  function update(rerenderTab) {
    result = Calc.compute(build);
    saveCurrent();
    renderSummary();
    if (rerenderTab) renderTab();
  }
  function set(fn, rerenderTab) { fn(build); update(rerenderTab); }

  function renderTab() {
    const el = document.getElementById('tab-' + activeTab);
    const scroll = el.scrollTop;
    clear(el);
    const r = { digimon: tabDigimon, clone: tabClone, seals: tabSeals, equip: tabEquip, jewelry: tabJewelry, extras: tabExtras, compare: tabCompare, info: tabInfo }[activeTab];
    el.appendChild(r());
    el.scrollTop = scroll;
    // Algunas pestañas crean valores por defecto (chips, opciones): recalcular el resumen
    result = Calc.compute(build);
    saveCurrent();
    renderSummary();
  }

  // ───────────────────────── Header ─────────────────────────
  function initHeader() {
    const srv = document.getElementById('server');
    for (const s of DMO.servers) srv.appendChild(h('option', { value: s.key }, s.label));
    srv.value = build.server;
    srv.onchange = () => set((b) => { b.server = srv.value; }, true);

    const nameI = document.getElementById('buildName');
    nameI.value = build.name || '';
    nameI.onchange = () => set((b) => { b.name = nameI.value; });

    refreshSavedList();
    document.getElementById('btnSave').onclick = () => {
      const name = (nameI.value || '').trim() || `${build.digimon.name} ${new Date().toLocaleString('es-AR')}`;
      build.name = name; nameI.value = name;
      const all = savedBuilds(); all[name] = JSON.parse(JSON.stringify(build)); setSavedBuilds(all);
      refreshSavedList(name); toast('Build guardado: ' + name); saveCurrent();
    };
    document.getElementById('btnLoad').onclick = () => {
      const n = document.getElementById('savedBuilds').value; if (!n) return;
      const b = savedBuilds()[n]; if (!b) return;
      build = migrate(JSON.parse(JSON.stringify(b))); nameI.value = build.name || n; srv.value = build.server;
      update(true); toast('Cargado: ' + n);
    };
    document.getElementById('btnDelete').onclick = () => {
      const n = document.getElementById('savedBuilds').value; if (!n) return;
      if (!confirm(`¿Borrar el build "${n}"?`)) return;
      const all = savedBuilds(); delete all[n]; setSavedBuilds(all); refreshSavedList(); toast('Borrado');
    };
    document.getElementById('btnNew').onclick = () => {
      if (!confirm('¿Empezar un build nuevo? (el actual se pierde si no lo guardaste)')) return;
      build = Calc.defaultBuild(); nameI.value = ''; history.replaceState(null, '', location.pathname); update(true);
    };
    document.getElementById('btnShare').onclick = () => {
      const url = location.href.split('#')[0] + '#b=' + encodeURIComponent(encodeShare(build));
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast('Link copiado al portapapeles'), () => prompt('Copiá el link:', url));
      else prompt('Copiá el link:', url);
    };
    document.getElementById('btnExport').onclick = () => {
      const data = { builds: savedBuilds(), current: build };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = h('a', { href: URL.createObjectURL(blob), download: 'dmo-builds.json' }); a.click();
    };
    document.getElementById('fileImport').onchange = (e) => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then((t) => {
        const d = JSON.parse(t);
        if (d.builds) { const all = Object.assign(savedBuilds(), d.builds); setSavedBuilds(all); }
        if (d.current) build = migrate(d.current);
        else if (d.digimon) build = migrate(d);
        refreshSavedList(); update(true); toast('Importado');
      }).catch(() => toast('Archivo inválido'));
      e.target.value = '';
    };

    // El menú ⋯ se cierra al hacer clic afuera o al usar una opción
    const menu = document.querySelector('details.menu');
    document.addEventListener('click', (e) => { if (menu.open && (!menu.contains(e.target) || e.target.closest('.menu-pop button'))) menu.open = false; });

    document.querySelectorAll('#tabs button').forEach((b) => {
      b.onclick = () => {
        document.querySelectorAll('#tabs button').forEach((x) => x.classList.toggle('active', x === b));
        document.querySelectorAll('.tab-panel').forEach((p) => p.classList.toggle('active', p.id === 'tab-' + b.dataset.tab));
        activeTab = b.dataset.tab; renderTab();
      };
    });
  }
  function refreshSavedList(sel) {
    const s = document.getElementById('savedBuilds');
    clear(s); s.appendChild(h('option', { value: '' }, '— Builds guardados —'));
    for (const n of Object.keys(savedBuilds()).sort()) s.appendChild(h('option', { value: n, selected: n === sel }, n));
  }

  // ───────────────────────── Tab: Digimon ─────────────────────────
  function tabDigimon() {
    const srv = DMO.servers.find((s) => s.key === build.server) || DMO.servers[0];
    // Sólo los rangos altos: SSS, SSS+ y U
    const pool = DMO.digimon.filter((d) => LIST_RANKS.includes(d.r));
    const forms = [...new Set(pool.map((d) => d.f))].sort();
    const fams = Object.entries(DMO.families);
    const listEl = h('div', { class: 'digi-list' });
    const countEl = h('small', { class: 'muted' });

    const fillList = () => {
      clear(listEl);
      const q = ui.q.toLowerCase();
      const rankOk = (d) => !ui.fRank || d.r === ui.fRank;
      const items = pool.filter((d) =>
        (!q || d.n.toLowerCase().includes(q) || (d.line || []).some((l) => l.toLowerCase().includes(q))) &&
        (!ui.fForm || d.f === ui.fForm) && (!ui.fAttr || d.a === ui.fAttr) && (!ui.fElem || d.e === ui.fElem) &&
        (!ui.fFam || d.fam.includes(ui.fFam)) && (!ui.fType || d.t === ui.fType) && rankOk(d));
      const byName = (a, b) => a.n.localeCompare(b.n);
      if (ui.sort === 'rank') items.sort((a, b) => DMO.rankIndex(b.r) - DMO.rankIndex(a.r) || byName(a, b));
      else if (ui.sort === 'at') items.sort((a, b) => (b.b[2] * (b.m || 2)) - (a.b[2] * (a.m || 2)) || byName(a, b));
      else items.sort(byName);
      countEl.textContent = `${items.length} digimon`;
      for (const d of items.slice(0, 400)) {
        listEl.appendChild(h('div', {
          class: 'digi-item' + (d.n === build.digimon.name ? ' selected' : ''),
          onclick: () => set((b) => { b.digimon.name = d.n; b.digimon.type = null; b.digimon.baseOverride = null; b.digimon.level = 170; b.digimon.size = 140; }, true),
        }, h('div', { class: 'digi-item-head' }, h('b', null, d.n), rankBadge(d.r)),
          h('small', { class: 'muted' }, `${d.f} · ${d.a} · ${DMO.elemLabels[d.e] || d.e}${d.t ? ' · ' + d.t : ''}`)));
      }
      if (!items.length) listEl.appendChild(h('div', { class: 'muted' }, 'Sin resultados.'));
      if (items.length > 400) listEl.appendChild(h('div', { class: 'muted' }, `… ${items.length - 400} más, refiná la búsqueda.`));
    };

    const moreOpen = !!(ui.fForm || ui.fAttr || ui.fElem || ui.fFam || ui.fType);
    const filters = h('div', null, h('div', { class: 'row' },
      field('Buscar', h('input', { type: 'search', value: ui.q, placeholder: 'Nombre o línea evolutiva…', oninput: (e) => { ui.q = e.target.value; fillList(); } })),
      field('Rango', select([{ value: '', label: 'U, SSS+ y SSS' }, ...LIST_RANKS.slice().reverse().map((r) => ({ value: r, label: r }))], ui.fRank, (v) => { ui.fRank = v; fillList(); })),
      field('Ordenar', select([{ value: 'rank', label: 'Rango' }, { value: 'name', label: 'Nombre' }, { value: 'at', label: 'AT base × etapa' }], ui.sort, (v) => { ui.sort = v; fillList(); })),
      countEl),
      h('details', { class: 'more', open: moreOpen }, h('summary', null, 'Más filtros'), h('div', { class: 'row' },
      field('Forma', select([{ value: '', label: 'Todas' }, ...forms], ui.fForm, (v) => { ui.fForm = v; fillList(); })),
      field('Atributo', select([{ value: '', label: 'Todos' }, ...DMO.attributes], ui.fAttr, (v) => { ui.fAttr = v; fillList(); })),
      field('Elemento', select([{ value: '', label: 'Todos' }, ...DMO.elements.filter((e) => e !== 'Neutral').map((e) => ({ value: e, label: DMO.elemLabels[e] }))], ui.fElem, (v) => { ui.fElem = v; fillList(); })),
      field('Familia', select([{ value: '', label: 'Todas' }, ...fams.map(([k, v]) => ({ value: k, label: v }))], ui.fFam, (v) => { ui.fFam = v; fillList(); })),
      field('Tipo', select([{ value: '', label: 'Todos' }, ...Object.entries(DMO.attackerTypes).map(([k, v]) => ({ value: k, label: v }))], ui.fType, (v) => { ui.fType = v; fillList(); })),
      )));
    fillList();

    const dg = Calc.findDigimon(build.digimon.name);
    const detail = h('div');
    if (dg) {
      const r = result || Calc.compute(build);
      const pick = (n) => set((b) => { b.digimon.name = n; b.digimon.type = null; b.digimon.baseOverride = null; b.digimon.level = 170; b.digimon.size = 140; }, true);
      const line = (dg.line || []).map((n) => {
        const exists = DMO.digimon.find((x) => x.n === n);
        return h('button', { class: 'small' + (n === dg.n ? ' active' : ''), disabled: !exists, title: exists ? exists.f : 'No está en la base de datos', onclick: () => pick(n) }, n);
      });
      // Stats a Lv170 con 140% de tamaño (lo que se pide ver al elegir un digimon)
      const s170 = Calc.baseStats(dg, 170, 140, build.digimon.type, null).base;
      const quick = h('div', { class: 'quick-stats' }, DMO.baseKeys.map((k) =>
        h('div', { class: 'stat' }, h('div', { class: 'k' }, h('span', null, k)), h('div', { class: 'v' }, fmtStat(k, s170[k])))));
      const ov = build.digimon.baseOverride;
      const statsRows = DMO.baseKeys.map((k, i) => {
        const wikiV = dg.w ? dg.w.s[i] : null;
        return h('tr', null,
          h('td', null, k),
          h('td', { class: 'num' }, fmtStat(k, dg.b[i])),
          h('td', { class: 'num' }, ov
            ? num(ov[k] ?? r.base[k], (v) => set((b) => { b.digimon.baseOverride[k] = v; }), { style: { width: '6rem' } })
            : fmtStat(k, r.base[k])),
          h('td', { class: 'num muted' }, wikiV != null ? fmtStat(k, wikiV) : '—'));
      });
      detail.appendChild(h('div', { class: 'card selected', style: { marginTop: '.75rem' } },
        h('h4', null, h('span', null, dg.n, ' ', rankBadge(dg.r)), h('small', { class: 'muted' }, 'Lv170 · 140%')),
        h('div', { class: 'muted', style: { marginBottom: '.5rem', fontSize: '.85rem' } },
          `${dg.f} · ${dg.a} · ${DMO.elemLabels[dg.e] || dg.e}`,
          dg.note || dg.est ? h('span', { class: 'pill est', title: dg.note || 'Tipo de atacante desconocido', style: { marginLeft: '.4rem' } }, 'algunos valores estimados') : null),
        quick,
        h('details', { class: 'more' }, h('summary', null, 'Más opciones (nivel, tamaño, línea evolutiva, editar stats)'),
          line.length ? h('div', { class: 'row' }, h('span', { class: 'muted' }, 'Línea:'), h('div', { class: 'form-chips' }, line)) : null,
          h('div', { class: 'row' },
            ...dg.fam.map((f) => h('span', { class: 'pill' }, DMO.families[f] || f)),
            h('span', { class: 'pill' }, `×${dg.m ?? '?'} etapa`),
            dg.u ? h('a', { href: 'https://web.archive.org/web/2026/https://dmowiki.com/' + dg.u, target: '_blank', rel: 'noopener' }, 'dmowiki ↗') : null),
          dg.note ? h('div', { class: 'notice warn' }, dg.note) : null,
          h('div', { class: 'row' },
            field(`Nivel del build (máx ${srv.maxLevel})`, num(build.digimon.level, (v) => set((b) => { b.digimon.level = Math.max(1, Math.min(Math.round(v), 200)); }, true), { min: 1, max: 200, step: 1 })),
            field('Tamaño %', num(build.digimon.size, (v) => set((b) => { b.digimon.size = Math.max(50, Math.min(v, 150)); }, true), { style: { width: '4.5rem' } })),
            field('Tipo de atacante', select([{ value: '', label: `Auto (${dg.t || 'SA?'})` }, ...Object.entries(DMO.attackerTypes).map(([k, v]) => ({ value: k, label: v }))], build.digimon.type || '', (v) => set((b) => { b.digimon.type = v || null; }, true))),
            h('button', { onclick: () => set((b) => { b.digimon.baseOverride = b.digimon.baseOverride ? null : Object.assign({}, r.base); }, true) },
              ov ? 'Volver a la fórmula' : 'Editar stats base a mano')),
          h('table', null,
            h('thead', null, h('tr', null, h('th', null, 'Stat'), h('th', { class: 'num' }, 'Base Lv1 100%'), h('th', { class: 'num' }, `Build Lv${build.digimon.level} @${build.digimon.size}%`), h('th', { class: 'num' }, dg.w ? `Wiki (Lv${dg.w.lv} @${dg.w.sz}%)` : 'Wiki'))),
            h('tbody', null, statsRows)),
          h('p', { class: 'muted' }, 'Tamaños: ' + DMO.sizeInfo.join(' · '))),
      ));
    }

    return h('div', null, filters, listEl, detail);
  }

  // ───────────────────────── Tab: Clon ─────────────────────────
  function tabClone() {
    const r = result;
    const rows = DMO.clones.types.map((t) => {
      const c = build.clone[t.key] || { lv: 0, pct: null };
      const perfect = DMO.clones.cumulative(t.key, c.lv);
      const pct = Calc.clonePct(t.key, c);
      const contrib = t.scalesWithBase ? (r.base[t.key] || 0) * pct / 100 : pct;
      return h('tr', null,
        h('td', null, h('b', null, t.label), t.requires ? h('div', { class: 'muted' }, 'Requiere ' + t.requires) : null),
        h('td', null, select(Array.from({ length: 16 }, (_, i) => ({ value: i, label: i ? 'Lv ' + i : '—' })), c.lv, (v) => set((b) => { b.clone[t.key] = { lv: Number(v), pct: null }; }, true))),
        h('td', { class: 'num' }, perfect + '%'),
        h('td', null, h('input', { type: 'number', step: 'any', value: c.pct ?? '', placeholder: String(perfect), style: { width: '6rem' },
          onchange: (e) => set((b) => { b.clone[t.key] = { lv: c.lv, pct: e.target.value === '' ? null : Number(e.target.value) }; }, true) })),
        h('td', { class: 'num' }, t.scalesWithBase ? `${fmt(r.base[t.key], 2)} × ${fmt(pct, 2)}%` : 'plano'),
        h('td', { class: 'num' }, h('b', null, '+' + fmtStat(t.key, contrib))));
    });
    return h('div', null,
      h('div', { class: 'row' },
        h('button', { onclick: () => set((b) => { for (const t of DMO.clones.types) b.clone[t.key] = { lv: 15, pct: null }; }, true) }, 'Todo perfecto Lv15'),
        h('button', { onclick: () => set((b) => { for (const t of ['AT', 'CT', 'BL']) b.clone[t] = { lv: 15, pct: null }; b.clone.EV = { lv: 0, pct: null }; b.clone.HP = { lv: 0, pct: null }; }, true) }, 'AT/CT/BL 15 (típico DPS)'),
        h('button', { onclick: () => set((b) => { for (const t of DMO.clones.types) b.clone[t.key] = { lv: 0, pct: null }; }, true) }, 'Sin clon')),
      h('table', null,
        h('thead', null, h('tr', null, h('th', null, 'Tipo'), h('th', null, 'Nivel'), h('th', { class: 'num' }, 'Perfecto'), h('th', null, '% real (opcional)'), h('th', { class: 'num' }, 'Cálculo'), h('th', { class: 'num' }, 'Aporta'))),
        h('tbody', null, rows)),
      h('p', { class: 'muted small' }, `El clon AT también sube el daño de skill: +${result.atCloneSkill}% (Lv15 perfecto ≈ +43%).`),
      help(
        h('p', null, 'AT, CT, EV y HP son un % del stat base del digimon (nivel + tamaño); BL suma plano. HP requiere Trascendencia. Si tu clon no es perfecto, escribí el % real que ves en el juego (clon / base × 100).'),
        h('table', null, h('thead', null, h('tr', null, h('th', null, 'Rango'), h('th', null, 'Niveles'), h('th', { class: 'num' }, 'Éxito'), h('th', { class: 'num' }, 'Baja nivel al fallar'))),
        h('tbody', null, DMO.clones.items.map((i) => h('tr', null, h('td', null, i.rank), h('td', null, `${i.levels[0]}-${i.levels[1]}`), h('td', { class: 'num' }, i.success + '%'), h('td', { class: 'num' }, i.downOnFail + '%'))))),
        h('ul', { class: 'muted' }, DMO.clones.variants.map((v) => h('li', null, v)))),
    );
  }

  // ───────────────────────── Tab: Sellos ─────────────────────────
  function tabSeals() {
    const S = DMO.seals;
    const totalsEl = h('div', { class: 'row' });
    const tbody = h('tbody');
    const stats = ['AT', 'HT', 'HP', 'DS', 'DE', 'CT', 'EV', 'BL'];

    const filtered = () => {
      const q = ui.sq.toLowerCase();
      return S.list.filter((s) => (!q || s.n.toLowerCase().includes(q) || (s.kr || '').includes(q)) && (!ui.sStat || s.s === ui.sStat) && (!ui.sOwned || build.seals[s.n] > 0));
    };
    const fillTotals = () => {
      clear(totalsEl);
      for (const k of stats) {
        const v = result.sealTotals?.[k] || 0;
        const max = S.list.filter((s) => s.s === k).reduce((a, s) => a + s.v[5], 0);
        totalsEl.appendChild(h('div', { class: 'card', style: { padding: '.4rem .6rem', minWidth: '7.5rem' } },
          h('div', { class: 'muted' }, k), h('b', null, fmt(v, 2) + (S.pctStats.includes(k) ? '%' : '')), h('div', { class: 'muted', style: { fontSize: '.75rem' } }, 'máx ' + fmt(max, 1))));
      }
    };
    const fillRows = () => {
      clear(tbody);
      for (const s of filtered()) {
        const cnt = build.seals[s.n] || 0;
        const tier = Calc.sealTier(s, cnt);
        const th = S.thresholdTables[s.t];
        const valEl = h('td', { class: 'num' });
        const showVal = (c) => { const v = Calc.sealValue(s, c); valEl.textContent = v ? '+' + fmt(v, 2) + (S.pctStats.includes(s.s) ? '%' : '') : '—'; };
        showVal(cnt);
        const cntIn = num(cnt || '', (v) => { build.seals[s.n] = Math.max(0, Math.round(v)); if (!build.seals[s.n]) delete build.seals[s.n]; update(); tierSel.value = Calc.sealTier(s, build.seals[s.n] || 0); showVal(build.seals[s.n] || 0); fillTotals(); }, { min: 0, step: 1, style: { width: '5.5rem' }, placeholder: '0' });
        const tierSel = select([{ value: -1, label: '—' }, ...S.tierNames.map((n, i) => ({ value: i, label: `${n} (${th[i]})` }))], tier, (v) => {
          const i = Number(v);
          if (i < 0) delete build.seals[s.n]; else build.seals[s.n] = th[i];
          cntIn.value = build.seals[s.n] || ''; update(); showVal(build.seals[s.n] || 0); fillTotals();
        });
        tbody.appendChild(h('tr', null,
          h('td', null, s.n, s.kr ? h('small', { class: 'muted' }, ' ' + s.kr) : null,
            s.src && s.src.length === 1 && s.src[0] === 'kdmo' ? h('span', { class: 'pill est', title: 'Sólo en datos de KDMO' }, ' KR') : null,
            s.conf ? h('span', { class: 'pill est', title: 'Las fuentes no coinciden en el valor' }, ' ?') : null),
          h('td', null, s.s),
          h('td', null, tierSel),
          h('td', null, cntIn),
          h('td', { class: 'num muted' }, s.v[5] + (S.pctStats.includes(s.s) ? '%' : '') + ` @${th[5]}`),
          valEl));
      }
    };
    fillTotals(); fillRows();

    const bulk = (tierIdx) => {
      for (const s of filtered()) {
        if (tierIdx < 0) delete build.seals[s.n];
        else build.seals[s.n] = S.thresholdTables[s.t][tierIdx];
      }
      update(true);
    };

    return h('div', null,
      h('p', { class: 'muted small' }, `${result.sealCount || 0} activos de ${S.list.length} sellos`),
      help('Cada sello da su stat según la cantidad: Normal 1 · Bronze 50 · Silver 200 · Gold 500 · Platinum 1000 · Master 3000 (10/20/40/60/80/100% del valor Master). ',
        'Algunos sellos llegan a Master con menos cartas. AT/HT/HP/DS/DE son planos; CT/EV/BL son puntos %. Aplican al digimon invocado. KR = sólo en KDMO · ? = fuentes en conflicto.'),
      totalsEl,
      h('div', { class: 'row' },
        field('Buscar', h('input', { type: 'search', value: ui.sq, placeholder: 'Nombre del sello…', oninput: (e) => { ui.sq = e.target.value; fillRows(); } })),
        field('Stat', select([{ value: '', label: 'Todos' }, ...stats], ui.sStat, (v) => { ui.sStat = v; fillRows(); })),
        h('label', { class: 'inline' }, h('input', { type: 'checkbox', checked: ui.sOwned, onchange: (e) => { ui.sOwned = e.target.checked; fillRows(); } }), 'Sólo los que tengo'),
        select([{ value: '', label: 'Poner la lista filtrada en…' }, ...S.tierNames.map((n, i) => ({ value: i, label: n })), { value: -1, label: 'Quitar todos' }], '', (v) => { if (v !== '') bulk(Number(v)); })),
      h('div', { class: 'table-wrap' }, h('table', null,
        h('thead', null, h('tr', null, h('th', null, 'Sello'), h('th', null, 'Stat'), h('th', null, 'Tier'), h('th', null, 'Cantidad'), h('th', { class: 'num' }, 'Master'), h('th', { class: 'num' }, 'Aporta'))),
        tbody)),
    );
  }

  // ───────────────────────── Tab: Equipo ─────────────────────────
  function statEditor(stats, onChange, opts) {
    // stats: {k:v} resueltos. Permite editar valores.
    const wrap = h('div');
    for (const [k, v] of Object.entries(stats)) {
      if (['MS', 'EXP'].includes(k) && !opts?.showAll) continue;
      const rng = opts?.ranges?.[k];
      wrap.appendChild(h('div', { class: 'mod-line' },
        h('span', { style: { minWidth: '6.5rem' } }, statLabel(k === 'AS' ? 'ASP' : k)),
        num(v, (nv) => onChange(k, nv), { style: { width: '6.5rem' } }),
        rng ? h('small', { class: 'muted' }, `${rng[0] ?? '?'}–${rng[1]}${isPct(k) || k === 'AS' ? '%' : ''}`) : null));
    }
    return wrap;
  }

  function customLines(lines, onChange) {
    const wrap = h('div');
    const draw = () => {
      clear(wrap);
      lines.forEach((l, i) => wrap.appendChild(h('div', { class: 'mod-line' },
        select(statKeysAll.map((k) => ({ value: k, label: statLabel(k) })), l.stat, (v) => { l.stat = v; onChange(); }),
        num(l.v, (v) => { l.v = v; onChange(); }),
        h('button', { class: 'small danger', onclick: () => { lines.splice(i, 1); onChange(); draw(); } }, '✕'))));
      wrap.appendChild(h('button', { class: 'small', onclick: () => { lines.push({ stat: 'AT', v: 0 }); onChange(); draw(); } }, '+ línea'));
    };
    draw();
    return wrap;
  }

  function equipCard(slot) {
    const E = DMO.equipment;
      const eq = build.equip[slot.key] || {};
      const opts = [{ value: '', label: '— Vacío —' }, ...E.items.filter((i) => i.slot === slot.key).map((i) => ({ value: i.id, label: i.name })), { value: 'custom', label: '✎ Custom (cargar stats a mano)' }];
      const item = E.items.find((i) => i.id === eq.id);
      const body = h('div');
      if (eq.id === 'custom') {
        eq.lines = eq.lines || [];
        body.appendChild(customLines(eq.lines, () => update()));
      } else if (item) {
        const ctr = h('div', { class: 'row', style: { marginBottom: '.4rem' } });
        if (item.enh || item.grades) {
          const max = item.enhMax ?? 15, min = item.enhMin ?? 0;
          ctr.appendChild(field(item.enhMin ? 'Nivel' : 'Mejora', select(Array.from({ length: max - min + 1 }, (_, i) => ({ value: i + min, label: (item.enhMin ? 'Lv' : '+') + (i + min) })), eq.enh ?? max, (v) => set((b) => { b.equip[slot.key].enh = Number(v); b.equip[slot.key].vals = {}; }, true))));
        }
        if (item.variants) ctr.appendChild(field('Opción', select(Object.keys(item.variants).map((k) => ({ value: k, label: k === 'SCD' ? 'SCD (Skill Damage +10%)' : k === 'AT' ? 'AT +700' : 'HP +1500' })), eq.variant || item.defVariant, (v) => set((b) => { b.equip[slot.key].variant = v; b.equip[slot.key].vals = {}; }, true))));
        if (item.grades) ctr.appendChild(field('Grado', select(item.gradeList, eq.grade || item.gradeList[item.gradeList.length - 1], (v) => set((b) => { b.equip[slot.key].grade = v; b.equip[slot.key].vals = {}; }, true))));
        if (item.familyLock) ctr.appendChild(field('Familia', select([{ value: '', label: '(la del digimon)' }, ...Object.entries(DMO.families).map(([k, v]) => ({ value: k, label: v }))], eq.family || '', (v) => set((b) => { b.equip[slot.key].family = v; }, true))));
        body.appendChild(ctr);
        const st = Calc.equipStats(item, eq);
        body.appendChild(statEditor(st, (k, v) => { build.equip[slot.key].vals = Object.assign({}, build.equip[slot.key].vals, { [k]: v }); update(); }, { ranges: item.range }));
        if (item.tamerStat) body.appendChild(h('div', { class: 'muted', style: { fontSize: '.8rem' } }, 'Stats de Tamer: llegan al digimon × FS% (ver Extras).'));
        if (item.note) body.appendChild(h('div', { class: 'muted', style: { fontSize: '.8rem' } }, item.note));
        body.appendChild(h('div', { class: 'muted', style: { fontSize: '.75rem' } }, (item.set ? 'Set: ' + (E.sets[item.set]?.name || item.set) + ' · ' : '') + 'Fuente: ' + (item.src || '?')));
      }
      return h('div', { class: 'card' + (eq.id ? ' selected' : '') },
        h('h4', null, slot.label),
        select(opts, eq.id || '', (v) => set((b) => { b.equip[slot.key] = v ? { id: v } : undefined; if (!v) delete b.equip[slot.key]; }, true), { style: { width: '100%', marginBottom: '.5rem' } }),
        body);
  }

  function tabEquip() {
    const E = DMO.equipment;
    const cards = E.slots.filter((s) => s.key !== 'keyring').map(equipCard);

    // Atajo: equipar un set completo al máximo
    const setPicker = select([{ value: '', label: 'Equipar set completo al máximo…' }, ...Object.entries(E.sets).filter(([id]) => id !== 'eos').map(([id, st]) => ({ value: id, label: st.name }))], '', (id) => {
      if (!id) return;
      set((b) => { for (const it of E.items.filter((i) => i.set === id)) b.equip[it.slot] = { id: it.id, enh: it.enhMax, grade: it.gradeList ? 'Ultimate' : undefined }; }, true);
    });

    // Sets activos
    const setsInfo = (result.sets || []).map((s) => h('div', { class: 'card' },
      h('h4', null, s.name, h('span', { class: 'pill' }, `${s.pieces}/${s.max}`)),
      DMO.equipment.sets[s.id].bonuses.map((b) => h('div', { class: s.pieces >= b.pieces ? '' : 'muted' },
        `${b.pieces}p${b.cond ? ' [' + b.cond + ']' : ''}: `, Object.entries(b.stats || {}).map(([k, v]) => `${statLabel(k === 'AS' ? 'ASP' : k)} +${v}${isPct(k) || k === 'AS' ? '%' : ''}`).join(', '), b.text ? ` · ${b.text}` : ''))));

    return h('div', null,
      h('div', { class: 'row' }, setPicker,
        h('button', { class: 'small danger', onclick: () => set((b) => { b.equip = {}; }, true) }, 'Vaciar equipo')),
      help('El equipo moderno (2024+) aplica sus stats al digimon. Los valores con rango arrancan en el máximo: editalos con tus valores reales. ',
        'Los bonos de set condicionales (procs) sólo se suman si activás "Contar procs" en Extras. El equipo marcado [legacy/Tamer] suma al tamer y llega al digimon × FS%. El Key Ring está en la pestaña Joyería.'),
      setsInfo.length ? h('div', null, h('h3', null, 'Sets'), h('div', { class: 'grid-cards' }, setsInfo)) : null,
      h('h3', null, 'Ropa del tamer'),
      h('div', { class: 'grid-cards' }, cards),
      digiviceSection(),
    );
  }

  function digiviceSection() {
    const E = DMO.equipment, C = E.chipsets;
    const dv = E.digivices.find((d) => d.id === build.digivice.id) || E.digivices[0];
    const dg = result.dg;
    build.digivice.opts = build.digivice.opts || [];
    const optRows = [];
    for (let i = 0; i < dv.opts; i++) {
      const o = build.digivice.opts[i] = build.digivice.opts[i] || { kind: 'attr', target: dg?.a || 'Vaccine', v: 0 };
      const max = o.kind === 'attr' ? (o.target === 'Unknown' ? (dv.unkMax ?? dv.attrMax) : dv.attrMax) : dv.elemMax;
      optRows.push(h('div', { class: 'mod-line' },
        select([{ value: 'attr', label: 'Atributo' }, { value: 'elem', label: 'Elemento' }], o.kind, (v) => set((b) => { b.digivice.opts[i] = { kind: v, target: v === 'attr' ? (dg?.a || 'Vaccine') : (dg?.e || 'Fire'), v: 0 }; }, true)),
        select(o.kind === 'attr' ? DMO.attributes.filter((a) => a !== 'None') : DMO.elements.filter((e) => e !== 'Neutral').map((e) => ({ value: e, label: DMO.elemLabels[e] })), o.target, (v) => set((b) => { b.digivice.opts[i].target = v; }, true)),
        num(o.v, (v) => set((b) => { b.digivice.opts[i].v = v; })),
        h('small', { class: 'muted' }, `% daño skill (máx ${max}% @100%DP)`),
        h('button', { class: 'small', onclick: () => set((b) => { b.digivice.opts[i].v = max; }, true) }, 'máx')));
    }
    build.chips = build.chips || [];
    const chipRows = [];
    for (let i = 0; i < dv.slots; i++) {
      const c = build.chips[i] = build.chips[i] || { type: 'family', rank: 18, stat: 'AT', fam: dg?.fam?.[0] || 'VB' };
      const val = Calc.chipValue(c);
      chipRows.push(h('div', { class: 'mod-line' },
        h('span', { class: 'muted' }, `#${i + 1}`),
        select(C.types.map((t) => ({ value: t.key, label: t.label })), c.type, (v) => set((b) => { b.chips[i].type = v; if (v === 'double' && !b.chips[i].sub) b.chips[i].sub = 'HT'; }, true)),
        c.type !== 'all' ? select(C.families.map((f) => ({ value: f, label: f })), c.fam, (v) => set((b) => { b.chips[i].fam = v; }, true), { title: 'Familia' }) : null,
        select(Array.from({ length: 20 }, (_, r) => ({ value: r + 1, label: 'R' + (r + 1) + (C.estRanks.includes(r + 1) ? '*' : '') })), c.rank, (v) => set((b) => { b.chips[i].rank = Number(v); }, true)),
        select(C.stats, c.stat, (v) => set((b) => { b.chips[i].stat = v; }, true)),
        c.type === 'double' ? select(C.stats, c.sub, (v) => set((b) => { b.chips[i].sub = v; }, true), { title: 'Sub stat' }) : null,
        h('small', { class: 'muted' }, Object.entries(val).map(([k, v]) => `${k} +${fmt(v, 2)}`).join(' / '))));
    }
    return h('div', null,
      h('h3', null, 'Digivice y Chipsets'),
      h('div', { class: 'row' },
        field('Digivice', select(E.digivices.map((d) => ({ value: d.id, label: `${d.name} (${d.slots} slots)` })), dv.id, (v) => set((b) => { b.digivice = { id: v, opts: [] }; }, true))),
        dv.stats ? h('span', { class: 'pill' }, Object.entries(dv.stats).map(([k, v]) => `${k} +${v}`).join(', ')) : null,
        dv.slots ? h('button', { class: 'small', onclick: () => set((b) => { b.chips = Array.from({ length: dv.slots }, () => ({ type: 'family', rank: 18, stat: 'AT', fam: dg?.fam?.[0] || 'VB' })); }, true) }, `Todos R18 AT (${dg?.fam?.[0] || 'VB'})`) : null),
      optRows.length ? h('div', { class: 'card' }, h('h4', null, 'Opciones del digivice (daño de skill si coincide atributo/elemento)'), optRows) : null,
      chipRows.length ? h('div', { class: 'card', style: { marginTop: '.5rem' } }, h('h4', null, 'Chipsets'), chipRows,
        h('div', { class: 'muted', style: { fontSize: '.8rem' } }, 'Chips de familia sólo funcionan si el digimon es de esa familia. * = rango estimado. CT/EV de chips en %.')) : null,
    );
  }

  // ───────────────────────── Tab: Joyería ─────────────────────────
  function tabJewelry() {
    const J = DMO.jewelry;
    const cards = J.slots.map((slot) => {
      const j = build.jewelry[slot.key] || {};
      const item = J.items.find((i) => i.id === j.id);
      const opts = [{ value: '', label: '— Vacío —' }, ...J.items.filter((i) => i.slot === slot.key).map((i) => ({ value: i.id, label: i.name })), { value: 'custom', label: '✎ Custom' }];
      const body = h('div');
      if (j.id) {
        const level = j.level || item?.levels;
        const ranges = item ? J.rangesFor(item, level) : null;
        const nLines = item ? J.linesFor(item) : (j.lines || []).length;
        const dpMax = item?.dpMax || J.dp.max;
        j.lines = j.lines || [];
        while (j.lines.length < nLines) j.lines.push({ stat: '', v: 0 });
        if (j.lines.length > nLines) j.lines.length = nLines;
        // Pool de opciones de cada línea (los ítems de dungeon tienen un pool distinto por línea)
        const poolOf = (i) => (item ? J.linePool(item, level, i) : null);
        const perLine = !!(item && (item.linePools || item.lineGroups));
        body.appendChild(h('div', { class: 'row', style: { marginBottom: '.4rem' } },
          item?.levels ? field(item.levelBase === 0 ? 'Mejora' : 'Nivel', select(Array.from({ length: item.levels }, (_, i) => ({ value: i + 1, label: item.levelBase === 0 ? '+' + i : 'Lv' + (i + 1) })), level, (v) => set((b) => { b.jewelry[slot.key].level = Number(v); }, true))) : null,
          field(`Digitary Power % (máx ${dpMax})`, num(j.dp ?? 100, (v) => set((b) => { b.jewelry[slot.key].dp = Math.max(J.dp.min, Math.min(v, dpMax)); }, true), { style: { width: '5rem' } })),
          h('button', { class: 'small', onclick: () => set((b) => { b.jewelry[slot.key].dp = dpMax; }, true) }, 'DP máx'),
          ranges ? h('button', { class: 'small', onclick: () => set((b) => { b.jewelry[slot.key].lines.forEach((l, i) => { const r = poolOf(i)?.[l.stat]; if (r) l.v = r[1]; }); }, true) }, 'Valores al máximo') : null));
        const counts = {};
        j.lines.forEach((l) => { if (l.stat) counts[l.stat] = (counts[l.stat] || 0) + 1; });
        j.lines.forEach((l, i) => {
          const lp = poolOf(i);
          const rng = lp?.[l.stat];
          const lim = perLine ? null : J.dupLimits[slot.key]?.[l.stat];
          const over = lim && counts[l.stat] > lim;
          const keys = lp ? Object.keys(lp) : statKeysAll;
          if (l.stat && lp && !lp[l.stat]) keys.push(l.stat); // conserva un valor viejo que ya no está en el pool
          const fixed = item?.fixed?.[i];
          body.appendChild(h('div', { class: 'mod-line' },
            fixed ? h('span', { style: { minWidth: '7rem' } }, statLabel(fixed === 'AS' ? 'ASP' : fixed))
              : select([{ value: '', label: perLine ? `— línea ${i + 1} —` : '— línea —' }, ...keys.map((k) => ({ value: k, label: statLabel(k === 'AS' ? 'ASP' : k) }))], l.stat, (v) => set((b) => { const L = b.jewelry[slot.key].lines[i]; L.stat = v; L.v = lp?.[v]?.[1] ?? 0; }, true)),
            num(l.v, (v) => set((b) => { b.jewelry[slot.key].lines[i].v = v; })),
            rng ? h('small', { class: 'muted' }, `${rng[0] ?? '?'}–${rng[1]}`) : null,
            l.stat && l.v ? h('small', null, `→ ${fmt(l.v * (j.dp ?? 100) / 100, 2)}`) : null,
            over ? h('span', { class: 'pill est', title: `Máximo ${lim} líneas de ${l.stat} en este slot` }, '¡repetida!') : null));
        });
        if (!item) body.appendChild(h('div', null,
          h('button', { class: 'small', onclick: () => set((b) => { b.jewelry[slot.key].lines.push({ stat: '', v: 0 }); }, true) }, '+ línea'),
          h('button', { class: 'small', onclick: () => set((b) => { b.jewelry[slot.key].lines.pop(); }, true) }, '− línea')));
        if (item?.estStats) body.appendChild(h('div', { class: 'muted', style: { fontSize: '.75rem' } }, 'Estimados: ' + item.estStats.join(', ')));
      }
      return h('div', { class: 'card' + (j.id ? ' selected' : '') },
        h('h4', null, slot.label),
        select(opts, j.id || '', (v) => set((b) => {
          if (!v) { delete b.jewelry[slot.key]; return; }
          const it = J.items.find((i) => i.id === v);
          const lines = [];
          if (it) {
            const rg = J.rangesFor(it, it.levels);
            const n = J.linesFor(it);
            for (let i = 0; i < n; i++) { const st = it.fixed?.[i] || ''; lines.push({ stat: st, v: st ? rg[st][1] : 0 }); }
          } else for (let i = 0; i < 4; i++) lines.push({ stat: '', v: 0 });
          b.jewelry[slot.key] = { id: v, dp: 100, level: it?.levels, lines };
        }, true), { style: { width: '100%', marginBottom: '.5rem' } }),
        body);
    });
    return h('div', null,
      help(h('p', null, 'Joyería de endgame: Zero Unit y Digital Hazard (vienen al máximo), Miracle [Special], Shining Arena Ring (Arena [Hard]) y la de dungeons: ',
        "Kaiser's Base (Kindness Earring), Dark Web / Armagemon (Miracle Necklace), Nightmare / VenomMyotismon (Ring of Hope), Marketplace (Vital Breath, Ghost Keyring), Barbamon (Keyring of Greed) y Belphemon (Sloth Bracelet)."),
        h('p', null, 'Valor final de cada línea = valor × Digitary Power / 100 (DP 95%–200%). Los rangos mostrados son a 100% DP. ',
          'En la joyería de dungeon cada línea tiene sus propias opciones (según la tabla oficial). Option Change reroll todas las líneas; Number Change sólo el valor de una.'),
        h('p', null, 'Líneas recomendadas: ' + J.slots.map((x) => `${x.label}: ${J.recommended[x.key]}`).join(' · '))),
      h('div', { class: 'grid-cards' }, cards, equipCard(DMO.equipment.slots.find((x) => x.key === 'keyring'))));
  }

  // ───────────────────────── Tab: Extras ─────────────────────────
  function tabExtras() {
    const E = DMO.equipment, X = DMO.extras;
    const dg = result.dg;
    const tm = E.tamers.find((t) => t.name === build.tamer.name);
    build.custom = build.custom || [];
    return h('div', null,
      h('div', { class: 'grid-cards' },
        h('div', { class: 'card' }, h('h4', null, 'Tamer'),
          select(E.tamers.map((t) => t.name), build.tamer.name, (v) => set((b) => { b.tamer.name = v; }, true), { style: { width: '100%' } }),
          tm && tm.p.length ? h('ul', null, tm.p.map(([s, v, a]) => h('li', { class: dg && dg.a === a ? '' : 'muted' }, `${statLabel(s)} +${v}% si es ${a}`, dg && dg.a === a ? ' ✓' : ''))) : null,
          tm?.skill ? h('div', { class: 'muted', style: { fontSize: '.8rem' } }, 'Skill activa: ' + tm.skill) : null,
          h('div', { class: 'row', style: { marginTop: '.5rem' } },
            field('Friendship / Intimidad % (máx 60)', num(build.tamer.fs, (v) => set((b) => { b.tamer.fs = Math.max(0, Math.min(v, 60)); }))),
          ),
          h('div', { class: 'muted', style: { fontSize: '.8rem' } }, 'El digimon recibe FS% de HP/DS/AT/DE del tamer. Cargá los stats del tamer (sin el equipo legacy, que se suma solo):'),
          h('div', { class: 'row' }, ['HP', 'DS', 'AT', 'DE'].map((k) => field(k, num(build.tamer.stats[k], (v) => set((b) => { b.tamer.stats[k] = v; }), { style: { width: '5.5rem' } }))))),
        h('div', { class: 'card' }, h('h4', null, 'Deck (enciclopedia)'),
          select([{ value: '', label: '— Ninguno —' }, ...X.decks.map((d) => d.name)], build.deck, (v) => set((b) => { b.deck = v; }, true), { style: { width: '100%' } }),
          (() => { const d = X.decks.find((x) => x.name === build.deck); return d ? h('div', null, d.members ? h('div', { class: 'muted', style: { fontSize: '.8rem' } }, 'Digimon: ' + d.members + (d.src ? ' · ' + d.src : '')) : null, h('ul', null, d.fx.map((f) => h('li', { class: f.cond && !build.procs ? 'muted' : '' }, f.stat ? `${statLabel(f.stat === 'AS' ? 'ASP' : f.stat)} +${f.v}%` : f.text, f.cond ? ` (${f.cond})` : '', f.note ? ` — ${f.note}` : '')))) : null; })(),
          h('div', { class: 'muted', style: { fontSize: '.8rem' } }, 'Sólo 1 deck activo. El HP% del deck se integra al stat base.')),
        h('div', { class: 'card' }, h('h4', null, 'Título'),
          select([{ value: '', label: '— Ninguno —' }, ...X.titles.map((t) => t.name)], build.title, (v) => set((b) => { b.title = v; }, true), { style: { width: '100%' } }),
          (() => { const t = X.titles.find((x) => x.name === build.title); return t ? h('div', null, Object.entries(t.fx).map(([k, v]) => `${statLabel(k)} +${v}${isPct(k) ? '%' : ''}`).join(', '), t.note ? h('div', { class: 'muted' }, t.note) : null) : null; })()),
        h('div', { class: 'card' }, h('h4', null, 'Buffs y procs'),
          X.buffs.map((bf) => h('label', { class: 'inline' }, h('input', { type: 'checkbox', checked: build.buffs.includes(bf.id), onchange: (e) => set((b) => { b.buffs = e.target.checked ? [...b.buffs, bf.id] : b.buffs.filter((x) => x !== bf.id); }) }), bf.name)),
          h('div', null, h('label', { class: 'inline' }, h('input', { type: 'checkbox', checked: build.procs, onchange: (e) => set((b) => { b.procs = e.target.checked; }, true) }), 'Contar procs (efectos con probabilidad de sets y decks como activos)'))),
      ),
      h('h3', null, 'Modificadores custom'),
      h('p', { class: 'muted small' }, 'Para lo que falte: skills de tamer, buffs de guild, memory skills, ítems nuevos… "% base" = % del stat base del digimon.'),
      h('div', { class: 'card' }, customLinesLabeled(build.custom)),
    );
  }

  function customLinesLabeled(lines) {
    const wrap = h('div');
    const draw = () => {
      clear(wrap);
      lines.forEach((l, i) => wrap.appendChild(h('div', { class: 'mod-line' },
        h('input', { type: 'text', value: l.label || '', placeholder: 'Descripción', onchange: (e) => { l.label = e.target.value; update(); } }),
        select(statKeysAll.map((k) => ({ value: k, label: statLabel(k) })), l.stat, (v) => { l.stat = v; update(); }),
        num(l.v, (v) => { l.v = v; update(); }),
        h('button', { class: 'small danger', onclick: () => { lines.splice(i, 1); update(); draw(); } }, '✕'))));
      wrap.appendChild(h('button', { class: 'small', onclick: () => { lines.push({ label: '', stat: 'AT', v: 0 }); update(); draw(); } }, '+ modificador'));
    };
    draw();
    return wrap;
  }

  // ───────────────────────── Tab: Comparar ─────────────────────────
  const cmp = { a: '__current', b: '' };
  function tabCompare() {
    const all = savedBuilds();
    const opts = [{ value: '__current', label: '(build actual)' }, ...(reference ? [{ value: '__ref', label: '(referencia fijada)' }] : []), ...Object.keys(all).sort()];
    const get = (k) => k === '__current' ? build : k === '__ref' ? reference : all[k] ? migrate(all[k]) : null;
    const A = get(cmp.a), B = get(cmp.b);
    const out = h('div');
    if (A && B) {
      const ra = Calc.compute(A), rb = Calc.compute(B);
      const keys = DMO.mainStats;
      const rows = keys.map((k) => {
        const va = k === 'CD' ? 100 + (ra.final.CD || 0) : ra.final[k] || 0;
        const vb = k === 'CD' ? 100 + (rb.final.CD || 0) : rb.final[k] || 0;
        const d = vb - va;
        const better = DMO.statDefs[k]?.lowerBetter ? d < 0 : d > 0;
        return h('tr', null, h('td', null, statLabel(k)), h('td', { class: 'num' }, fmtStat(k, va)), h('td', { class: 'num' }, fmtStat(k, vb)),
          h('td', { class: 'num ' + (d === 0 ? '' : better ? 'delta-pos' : 'delta-neg') }, d === 0 ? '=' : (d > 0 ? '+' : '') + fmtStat(k, d)));
      });
      out.appendChild(h('table', null,
        h('thead', null, h('tr', null, h('th', null, 'Stat'), h('th', { class: 'num' }, `A: ${ra.dg?.n || '?'}`), h('th', { class: 'num' }, `B: ${rb.dg?.n || '?'}`), h('th', { class: 'num' }, 'B − A'))),
        h('tbody', null, rows)));
    } else out.appendChild(h('p', { class: 'muted' }, 'Elegí dos builds. Guardá builds con el botón "Guardar" o fijá una referencia desde el panel de la derecha.'));
    return h('div', null,
      h('div', { class: 'row' },
        field('Build A', select(opts, cmp.a, (v) => { cmp.a = v; renderTab(); })),
        field('Build B', select([{ value: '', label: '— elegir —' }, ...opts], cmp.b, (v) => { cmp.b = v; renderTab(); }))),
      out);
  }

  // ───────────────────────── Tab: Info ─────────────────────────
  function tabInfo() {
    return h('div', { class: 'info-block' },
      h('h2', null, 'Cómo calcula'),
      h('pre', null,
`Base  HP/AT/DE = tamaño × base_Lv1 + L(tipo, nivel) × M(etapa)
      DS       = base_Lv1 + L × M          (sin tamaño)
      CT       = tamaño × base_Lv1 + L     (sin M)
      EV/HT/AS = base_Lv1
      M: Rookie 1 · Champion 1.5 · Ultimate/Armor/Hybrid 1.85 · Mega/Side Mega 2 · Burst/Variant 2.5 · Jogress 3
Clon  AT/CT/EV/HP = base × clon%   ·   BL = clon% plano
Total = base + clon + sellos + título + joyería×DP + equipo + sets + chipsets + digivice
        + stats del tamer × FS% + % sobre base (pasivas tamer, deck, buffs) + custom
AS    = AS_base × (1 − Vel.Ataque%)  (mín 0.3 s)`),
      h('h3', null, 'Requisitos por DG'),
      h('p', null, 'El panel de la derecha muestra el CT y el HT que pide cada dungeon a Lv160 y Lv170 (tabla de la comunidad). Verde = tu digimon llega · rojo = no llega. "est." = valor estimado.'),
      h('h3', null, 'Atributos y elementos'),
      h('p', null, 'Vaccine > Virus > Data > Vaccine · Unknown le gana a todos · todos le ganan a None.'),
      h('p', null, 'Fuego > Hielo > Agua > Fuego · Viento > Madera > Tierra > Viento · Luz > Oscuridad > Trueno > Acero > Luz.'),
      h('h3', null, 'Servidores'),
      h('ul', null, DMO.servers.map((s) => h('li', null, h('b', null, s.label), ' — ', s.note))),
      h('p', { class: 'muted' }, 'No se encontraron datos específicos de LADMO que difieran de GDMO: usa el mismo cliente/datos con demora de parches. KDMO suele recibir contenido antes (sellos y equipo nuevos).'),
      h('h3', null, 'Fiabilidad de los datos'),
      h('ul', null,
        h('li', null, `Stats base de ${DMO.digimon.length} formas de digimon: oficiales (dmowiki + notas de GameKing). La fórmula reproduce la wiki con error mediano 0,03%. Lv180 es extrapolado. Los marcados "algunos valores estimados" tienen stats sin publicar.`),
        h('li', null, `Sellos (${DMO.seals.list.length}): dmowiki + 3 calculadoras comunitarias + notas oficiales. KR = sólo en KDMO; "?" = fuentes en conflicto.`),
        h('li', null, 'Clon perfecto, accesorios, chipsets R1-R18, sets Kaiser/Frontier/Holy Beasts: wiki + notas oficiales. R15/R19/R20 de chips y algunos niveles de joyería son estimados.'),
        h('li', null, 'Unidades de CT en equipo moderno: a veces el juego usa "rating" (1500 = 15%). Acá se convierte todo a %.'),
        h('li', null, 'Sets "Royal Knight", "Chronos", "Dark Tower", etc. no existen como sets de equipo con bonos: no se incluyeron.')),
      h('h3', null, 'Fuentes'),
      h('div', { class: 'sources' }, DMO.sources.map(([l, u]) => h('a', { href: u, target: '_blank', rel: 'noopener' }, l))),
    );
  }

  // ───────────────────────── Panel resumen ─────────────────────────
  function renderSummary() {
    const el = clear(document.getElementById('summary'));
    const r = result;
    if (!r || !r.dg) { el.appendChild(h('p', null, 'Elegí un digimon en la pestaña Digimon.')); return; }
    const refR = reference ? Calc.compute(reference) : null;
    const dg = r.dg;
    el.appendChild(h('div', { class: 'digi-head' },
      h('div', null, h('h2', null, dg.n, ' ', rankBadge(dg.r)), h('small', { class: 'muted' }, `${dg.f} · Lv${build.digimon.level} · ${build.digimon.size}% · ${r.type}`)),
      h('div', { style: { textAlign: 'right' } }, h('span', { class: 'pill ' + (dg.a || '').toLowerCase() }, dg.a), ' ', h('span', { class: 'pill' }, DMO.elemLabels[dg.e] || dg.e))));

    const grid = h('div', { class: 'stat-grid' });
    for (const k of DMO.mainStats) {
      let v = r.final[k] || 0;
      if (k === 'CD') v = 100 + v;
      let delta = null;
      if (refR) {
        let rv = refR.final[k] || 0; if (k === 'CD') rv = 100 + rv;
        const d = v - rv;
        if (Math.abs(d) > 1e-9) {
          const better = DMO.statDefs[k]?.lowerBetter ? d < 0 : d > 0;
          delta = h('div', { class: 'd ' + (better ? 'delta-pos' : 'delta-neg') }, (d > 0 ? '+' : '') + fmtStat(k, d));
        }
      }
      grid.appendChild(h('div', { class: 'stat', title: DMO.statDefs[k]?.desc || '', onclick: () => { openBreakdown = k; renderSummary(); }, style: openBreakdown === k ? { borderColor: 'var(--accent)' } : null },
        h('div', { class: 'k' }, h('span', null, statLabel(k)), k in r.base ? h('span', null, 'base ' + fmtStat(k, r.base[k])) : null),
        h('div', { class: 'v' }, fmtStat(k, v)), delta));
    }
    el.appendChild(grid);

    // Breakdown del stat elegido
    const list = (r.breakdown[openBreakdown] || []).slice().sort((a, b) => Math.abs(b.v) - Math.abs(a.v));
    const total = list.reduce((s, x) => s + Math.abs(x.v), 0) || 1;
    el.appendChild(h('div', { class: 'breakdown' },
      h('h3', null, `Desglose de ${statLabel(openBreakdown)}`),
      list.length ? h('table', null, h('tbody', null, list.map((x) => h('tr', null,
        h('td', null, x.src, h('div', { class: 'bar' }, h('i', { style: { width: (Math.abs(x.v) / total * 100).toFixed(1) + '%' } }))),
        h('td', { class: 'num' }, (x.v >= 0 ? '+' : '') + fmtStat(openBreakdown === 'AS' ? 'AS' : openBreakdown, x.v)))))) : h('p', { class: 'muted' }, 'Sin aportes.')));

    // Requisitos de CT / HT por dungeon (Lv160 y Lv170)
    const myCT = r.final.CT || 0, myHT = r.final.HT || 0;
    const lvCol = build.digimon.level >= 170 ? 'lv170' : build.digimon.level >= 160 ? 'lv160' : null;
    const req = (v, mine, pct) => h('span', { class: mine >= v ? 'req-ok' : 'req-no' }, fmt(v) + (pct ? '%' : ''));
    el.appendChild(h('div', { class: 'breakdown' },
      h('h3', null, 'Requisitos por DG'),
      h('div', { class: 'muted small' }, `Tu digimon: CT ${fmt(myCT, 2)}% · HT ${fmt(myHT)}`),
      h('table', { class: 'req-table' },
        h('thead', null, h('tr', null, h('th', null, 'DG'),
          h('th', { class: 'num' + (lvCol === 'lv160' ? ' req-cur' : '') }, 'Lv 160'),
          h('th', { class: 'num' + (lvCol === 'lv170' ? ' req-cur' : '') }, 'Lv 170'))),
        h('tbody', null, DMO.dungeonReqs.map((dgr) => h('tr', null,
          h('td', null, dgr.name, dgr.note ? h('small', { class: 'muted' }, ` (${dgr.note})`) : null, dgr.est ? h('small', { class: 'muted' }, ' est.') : null),
          ...['lv160', 'lv170'].map((lv) => h('td', { class: 'num' + (lvCol === lv ? ' req-cur' : '') },
            dgr[lv] ? [req(dgr[lv].ct, myCT, true), h('span', { class: 'muted' }, ' / '), req(dgr[lv].ht, myHT, false)] : h('span', { class: 'muted' }, '—'))))))),
      h('small', { class: 'muted' }, 'CT / HT · verde = llega · rojo = no llega')));

    // Sets / avisos / notas
    if (r.sets.length) el.appendChild(h('div', { class: 'breakdown' }, h('h3', null, 'Sets'), r.sets.map((s) => h('div', null, `${s.name}: ${s.pieces}/${s.max} piezas`, s.active.length ? ` · ${s.active.map((a) => a.pieces + 'p' + (a.counted ? '' : ' (proc)')).join(', ')}` : ''))));
    if (r.warnings.length) el.appendChild(h('div', { class: 'notice warn' }, r.warnings.map((w) => h('div', null, '⚠ ' + w))));
    if (r.notes.length) el.appendChild(h('details', { class: 'breakdown' }, h('summary', null, `Notas (${r.notes.length})`), h('ul', null, r.notes.map((n) => h('li', { class: 'muted' }, n)))));

    el.appendChild(h('div', { class: 'row', style: { marginTop: '.75rem' } },
      h('button', { onclick: () => { reference = JSON.parse(JSON.stringify(build)); toast('Referencia fijada: los cambios muestran la diferencia'); renderSummary(); } }, reference ? 'Actualizar referencia' : 'Fijar como referencia'),
      reference ? h('button', { onclick: () => { reference = null; renderSummary(); } }, 'Quitar referencia') : null));
  }

  // ───────────────────────── Init ─────────────────────────
  initHeader();
  update(true);
  if (location.hash.startsWith('#b=')) { toast('Build cargado desde el link'); history.replaceState(null, '', location.pathname); }
})();

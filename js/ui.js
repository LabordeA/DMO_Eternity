/* Helpers de DOM mínimos (sin dependencias) */
(function () {
  const UI = {};

  // h('div', {class:'x', onclick:fn}, child1, 'texto', [arrayDeHijos])
  UI.h = function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (k === 'value') el.value = v;
        else if (k === 'checked') el.checked = !!v;
        else if (k === 'selected') el.selected = !!v;
        else if (k === 'html') el.innerHTML = v;
        else el.setAttribute(k, v === true ? '' : v);
      }
    }
    appendChildren(el, children);
    return el;
  };

  function appendChildren(el, children) {
    for (const c of children) {
      if (c == null || c === false) continue;
      if (Array.isArray(c)) appendChildren(el, c);
      else if (c instanceof Node) el.appendChild(c);
      else el.appendChild(document.createTextNode(String(c)));
    }
  }

  UI.clear = (el) => { while (el.firstChild) el.removeChild(el.firstChild); return el; };

  UI.select = function (options, value, onchange, attrs) {
    const s = UI.h('select', Object.assign({ onchange: (e) => onchange(e.target.value) }, attrs || {}));
    for (const o of options) {
      const opt = typeof o === 'object' ? o : { value: o, label: o };
      s.appendChild(UI.h('option', { value: opt.value, selected: String(opt.value) === String(value) }, opt.label));
    }
    return s;
  };

  UI.num = function (value, onchange, attrs) {
    return UI.h('input', Object.assign({
      type: 'number', value: value ?? 0, step: 'any',
      onchange: (e) => onchange(e.target.value === '' ? 0 : Number(e.target.value)),
    }, attrs || {}));
  };

  UI.field = (label, control) => UI.h('label', { class: 'field' }, UI.h('span', null, label), control);

  UI.fmt = function (n, dec) {
    if (n == null || isNaN(n)) return '—';
    const d = dec ?? (Math.abs(n) < 100 && n % 1 !== 0 ? 2 : 0);
    return Number(n).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: d });
  };

  UI.toast = function (msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(UI._tt);
    UI._tt = setTimeout(() => t.classList.remove('show'), 2200);
  };

  window.UI = UI;
})();

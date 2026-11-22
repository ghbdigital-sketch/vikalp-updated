/* साधनों की तुलना: filter, pick any 2, compare, save as PDF. Data: window.VK_CMP */
(function () {
  const D = window.VK_CMP, T = (h, e) => lang() === 'en' ? e : h;
  const F = document.getElementById('CF'), L = document.getElementById('CL'), R = document.getElementById('CR'), GO = document.getElementById('CGO'), HINT = document.getElementById('CH'), FT = document.getElementById('CFT');
  let filter = 'all', sel = [];
  const pre = new URLSearchParams(location.search).get('m'); if (pre && D.methods.some(m => m.k === pre)) sel = [pre];
  const v = x => Array.isArray(x) ? (x.length > 1 ? '<ul>' + x.map(y => `<li>${y}</li>`).join('') + '</ul>' : x[0]) : x;
  function chips() {
    F.innerHTML = D.filters.map(f => `<button type="button" class="chip ${f.k === filter ? 'on' : ''}" data-k="${f.k}" aria-pressed="${f.k === filter}">${T(f.hi, f.en)}</button>`).join('');
    const f = D.filters.find(x => x.k === filter); FT.textContent = T(f.dhi, f.den);
  }
  function list() {
    L.innerHTML = D.methods.map(m => {
      const show = filter === 'all' || m.tags.includes(filter), n = sel.indexOf(m.k);
      return `<button type="button" class="pk ${n > -1 ? 'sel' : ''}" data-k="${m.k}" data-n="${n + 1}" aria-pressed="${n > -1}" ${show ? '' : 'hidden'}><span class="ic">${m.icon}</span><span><b>${T(m.hi.name, m.en.name)}</b><small>${T(m.hi.short, m.en.short)}</small></span></button>`;
    }).join('');
    GO.disabled = sel.length !== 2;
    HINT.textContent = sel.length === 2 ? T('दोनों साधन चुन लिए गए हैं।', 'Both methods are selected.') : sel.length === 1 ? T('एक और साधन चुनें।', 'Pick one more method.') : T('पहले साधन पर टैप करें, फिर दूसरे पर।', 'Tap the first method, then the second.');
  }
  function table() {
    if (sel.length !== 2) { R.hidden = true; return }
    const ms = sel.map(k => D.methods.find(m => m.k === k));
    const head = `<thead><tr><th>${T('तुलना', 'Compare')}</th>${ms.map(m => `<th>${T(m.hi.name, m.en.name)}</th>`).join('')}</tr></thead>`;
    const body = D.rows.map(r => `<tr><th scope="row">${T(r.hi, r.en)}${r.star ? '<span class="star">*</span>' : ''}</th>${ms.map(m => {
      const x = r.k === 'link' ? `<a href="${m.href}">${T(m.hi.name, m.en.name)} →</a>` : v(T(m.hi[r.k], m.en[r.k]));
      return `<td data-m="${T(m.hi.name, m.en.name)}" class="${r.k === 'eff' ? 'effc' : ''}">${r.k === 'eff' ? `<span class="eff">${x}</span>` : x}</td>`;
    }).join('')}</tr>`).join('');
    document.getElementById('CT').innerHTML = head + '<tbody>' + body + '</tbody>';
    R.hidden = false; window.dispatchEvent(new Event('vk-decorate'));
  }
  F.addEventListener('click', e => { const c = e.target.closest('.chip'); if (!c) return; filter = c.dataset.k; chips(); list() });
  L.addEventListener('click', e => {
    const b = e.target.closest('.pk'); if (!b) return; const k = b.dataset.k, n = sel.indexOf(k);
    if (n > -1) sel.splice(n, 1); else { if (sel.length === 2) sel.shift(); sel.push(k) }
    list();
  });
  GO.addEventListener('click', () => { table(); R.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }) });
  document.getElementById('CRS').addEventListener('click', () => { sel = []; filter = 'all'; R.hidden = true; chips(); list(); document.getElementById('cstart').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }) });
  document.getElementById('CPDF').addEventListener('click', () => window.print());
  addEventListener('langchange', () => { chips(); list(); if (!R.hidden) table() });
  chips(); list();
})();

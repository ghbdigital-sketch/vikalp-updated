/* Vikalp shared script: language, theme, menu, layout lock, effects */
(function () {
  const Q = new URLSearchParams(location.search);
  const store = {
    get(k) { try { return localStorage.getItem(k) } catch (e) { return null } },
    set(k, v) { try { localStorage.setItem(k, v) } catch (e) {} }
  };
  let LANG = Q.get('lang') || store.get('vk-lang') || 'hi';
  let THEME = Q.get('theme') || store.get('vk-theme') || 'light';
  if (LANG !== 'en') LANG = 'hi';
  if (THEME !== 'dark') THEME = 'light';

  // keep the chosen language and theme when moving between pages (works from a local folder too)
  function decorate() {
    document.querySelectorAll('a[href]').forEach(a => {
      const h = a.getAttribute('href');
      if (!h || /^(https?:|tel:|mailto:|#|javascript:)/.test(h)) return;
      const [path, hash] = h.split('#');
      const [base, qs0] = path.split('?');
      const p = new URLSearchParams(qs0 || ''); p.delete('lang'); p.delete('theme');
      if (LANG === 'en') p.set('lang', 'en');
      if (THEME === 'dark') p.set('theme', 'dark');
      const qs = p.toString();
      a.setAttribute('href', base + (qs ? '?' + qs : '') + (hash !== undefined ? '#' + hash : ''));
    });
  }

  window.setLang = function (l) {
    LANG = l === 'en' ? 'en' : 'hi';
    document.body.classList.toggle('L-en', LANG === 'en');
    document.documentElement.lang = LANG;
    document.querySelectorAll('[data-lang]').forEach(b => { b.classList.toggle('on', b.dataset.lang === LANG); b.setAttribute('aria-pressed', b.dataset.lang === LANG) });
    const t = document.documentElement.dataset['title' + (LANG === 'en' ? 'En' : 'Hi')];
    if (t) document.title = t;
    const md = document.querySelector('meta[name=description]'); if (md && md.dataset[LANG]) md.setAttribute('content', md.dataset[LANG]);
    store.set('vk-lang', LANG); decorate();
    window.dispatchEvent(new Event('langchange'));
  };
  window.lang = () => LANG;
  window.setTheme = function (t) {
    THEME = t === 'dark' ? 'dark' : 'light';
    document.body.classList.toggle('dark', THEME === 'dark');
    store.set('vk-theme', THEME); decorate();
  };

  // both languages take the same space, so switching never makes the page jump
  window.lockHeights = function () {
    const els = [...document.querySelectorAll('[data-lock]')].filter(e => e.offsetParent !== null || e.tagName === 'HEADER');
    if (!els.length) return;
    const en = document.body.classList.contains('L-en');
    els.forEach(e => e.style.minHeight = '');
    const h = els.map(() => 0);
    [false, true].forEach(l => { document.body.classList.toggle('L-en', l); els.forEach((e, k) => { h[k] = Math.max(h[k], e.getBoundingClientRect().height) }) });
    document.body.classList.toggle('L-en', en);
    els.forEach((e, k) => e.style.minHeight = Math.ceil(h[k]) + 'px');
  };
  let _lt; addEventListener('resize', () => { clearTimeout(_lt); _lt = setTimeout(lockHeights, 150) });
  addEventListener('load', lockHeights);
  document.fonts && document.fonts.ready.then(lockHeights);

  document.addEventListener('click', e => {
    const l = e.target.closest('[data-lang]'); if (l) { e.preventDefault(); setLang(l.dataset.lang); lockHeights(); }
    const m = e.target.closest('[data-menu]'); if (m) { const n = document.getElementById('MENU'); const o = n.classList.toggle('open'); m.setAttribute('aria-expanded', o) }
    const th = e.target.closest('[data-theme-toggle]'); if (th) setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { const n = document.getElementById('MENU'); n && n.classList.remove('open') } });

  // filter chips: <div class="chips" data-chips="X"> buttons data-f ; items [data-g] inside #X
  document.addEventListener('click', e => {
    const c = e.target.closest('.chip[data-f]'); if (!c) return;
    const box = c.closest('[data-chips]'), tgt = document.getElementById(box.dataset.chips), f = c.dataset.f;
    box.querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === c));
    tgt.querySelectorAll('[data-g]').forEach(x => x.hidden = !(f === 'all' || (' ' + x.dataset.g + ' ').includes(' ' + f + ' ')));
    lockHeights();
  });

  // table of contents highlight
  function toc() {
    const links = [...document.querySelectorAll('.toc nav a')]; if (!links.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href').split('?')[0] === '#' + en.target.id)) }), { rootMargin: '-30% 0px -60% 0px' });
    links.forEach(a => { const el = document.getElementById(a.getAttribute('href').slice(1).split('?')[0]); el && io.observe(el) });
  }

  addEventListener('vk-decorate', decorate);
  document.addEventListener('DOMContentLoaded', () => { setTheme(THEME); setLang(LANG); toc(); });
})();

/* small effects used by the game */
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FX = (() => {
  let c, x, P = [], on = false;
  function init() { if (c) return; c = document.createElement('canvas'); c.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:200'; document.body.appendChild(c); x = c.getContext('2d'); size(); addEventListener('resize', size) }
  function size() { c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio; x.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0) }
  function loop() {
    x.clearRect(0, 0, innerWidth, innerHeight); P = P.filter(p => p.l > 0);
    P.forEach(p => { p.vy += p.g; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.l--; x.save(); x.globalAlpha = Math.min(1, p.l / 30); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c;
      if (p.s === 'c') { x.beginPath(); x.arc(0, 0, p.z / 2, 0, 7); x.fill() } else x.fillRect(-p.z / 2, -p.z / 4, p.z, p.z / 2); x.restore() });
    if (P.length) requestAnimationFrame(loop); else on = false;
  }
  return {
    burst(px, py, o = {}) { if (RM) return; init(); const n = o.n || 60, cols = ['#e0116b', '#f9a116', '#FFDB58', '#c2185b', '#39b577', '#fff'];
      for (let i = 0; i < n; i++) { const a = (o.up ? -Math.PI / 2 : 0) + (Math.random() - .5) * (o.spread || Math.PI * 2), v = (o.v || 7) * (.5 + Math.random());
        P.push({ x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v - (o.lift ?? 3), g: o.g ?? .18, r: Math.random() * 6, vr: (Math.random() - .5) * .3, z: 6 + Math.random() * 6, c: cols[i % cols.length], l: 70 + Math.random() * 50, s: Math.random() < .5 ? 'r' : 'c' }) }
      if (!on) { on = true; loop() } },
    rain() { if (RM) return; for (let k = 0; k < 6; k++) setTimeout(() => this.burst(Math.random() * innerWidth, -10, { n: 40, v: 3, g: .12, lift: 0, spread: Math.PI }), k * 180) }
  };
})();
function buzz(ms) { try { navigator.vibrate && navigator.vibrate(ms) } catch (e) {} }
function countUp(el, to, ms = 900) { if (RM) { el.textContent = to; return } const t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / ms); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f) })(t0) }

/* Engagement and micro-interactions for internal pages */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const T = (h, e) => (window.lang && lang() === 'en') ? e : h;
  const st = { get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch (e) { return null } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) {} } };
  const RMO = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* scroll reveal + count-up */
  function reveal() {
    const els = $$('[data-rv]:not(.in)');
    if (!('IntersectionObserver' in window) || RMO) { els.forEach(e => e.classList.add('in')); return }
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return; const el = en.target; io.unobserve(el);
      const sib = el.parentElement ? [...el.parentElement.children].filter(x => x.hasAttribute('data-rv')) : [];
      const i = Math.max(0, sib.indexOf(el)); el.style.transitionDelay = Math.min(i, 6) * 60 + 'ms'; el.classList.add('in');
      $$('[data-count]', el).forEach(n => { const to = +n.dataset.count, txt = n.dataset.text; if (!to || txt.includes('–')) return; const t0 = performance.now(); (function f(t) { const k = Math.min(1, (t - t0) / 900); n.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); else n.textContent = txt })(t0) });
    }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(e => io.observe(e));
  }

  /* reading progress */
  function progress() {
    if (!$('.prose')) return; const hd = $('header'); if (!hd) return;
    const bar = document.createElement('div'); bar.className = 'rprog'; bar.innerHTML = '<i></i>'; hd.appendChild(bar);
    const i = bar.firstChild; let tk = false;
    const upd = () => { tk = false; const h = document.documentElement.scrollHeight - innerHeight; i.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')' };
    addEventListener('scroll', () => { if (!tk) { tk = true; requestAnimationFrame(upd) } }, { passive: true }); upd();
  }

  /* inline myth quiz */
  document.addEventListener('click', e => {
    const b = e.target.closest('.mqb button'); if (!b) return;
    const box = b.closest('.mq'); const ok = b.dataset.a === '1';
    $$('.mqb button', box).forEach(x => { x.disabled = true; x.classList.toggle('chosen', x === b) });
    box.classList.add(ok ? 'right' : 'wrong');
    const r = $('.mqr', box);
    r.innerHTML = ok ? '<i>✓</i>' + T('सही जवाब! यह सुनी-सुनाई बात है।', 'Correct answer! This is a myth.') : '<i>✗</i>' + T('नहीं, यह सुनी-सुनाई बात है।', 'No, this is a myth.');
    $('.mqa', box).hidden = false; if (ok && window.FX) { const rc = b.getBoundingClientRect(); FX.burst(rc.left + rc.width / 2, rc.top, { n: 50, up: true, spread: Math.PI * .8, v: 9 }) }
    window.dispatchEvent(new Event('vk-decorate'));
  });

  /* myths page: tap to reveal + counter */
  function mcount() {
    const box = $('.mcount'); if (!box) return; const n = $$('.flipc.open').length, tot = +box.dataset.total;
    $('.mcn', box).textContent = n; $('.mbar i', box).style.width = (n / tot * 100) + '%';
    if (n === tot && !box.dataset.done) { box.dataset.done = 1; window.FX && FX.rain() }
  }
  function openMyth(c) { if (c.classList.contains('open')) return; c.classList.add('open'); $('.ok', c).hidden = false; const b = $('.reveal', c); b.setAttribute('aria-expanded', 'true'); b.hidden = true }
  document.addEventListener('click', e => {
    const c = e.target.closest('.flipc'); if (c && !e.target.closest('a')) { openMyth(c); mcount(); window.lockHeights && lockHeights() }
    if (e.target.closest('[data-reveal-all]')) { $$('.flipc').forEach(openMyth); mcount() }
  });

  /* accordions: icons, close button, open all / close all, search */
  function faqUI() {
    const ca = $('[data-close-all]'); if (ca) ca.disabled = !$$('#FG details[open]').length;
    const n = $('.fqn'); if (n) { const vis = $$('#FG details').filter(d => !d.hidden && !d.closest('[hidden]')); n.textContent = T(vis.length + ' सवाल', vis.length + ' questions'); $('.fqe').hidden = vis.length > 0 }
  }
  document.addEventListener('click', e => {
    const x = e.target.closest('.qx'); if (x) { const d = x.closest('details'); d.open = false; d.querySelector('summary').focus({ preventScroll: true }); const r = d.getBoundingClientRect(); if (r.top < 70) d.scrollIntoView({ block: 'start', behavior: RMO ? 'auto' : 'smooth' }); faqUI() }
    if (e.target.closest('[data-close-all]')) { $$('details[open]').forEach(d => d.open = false); faqUI() }
    if (e.target.closest('[data-open-all]')) { $$('#FG details').filter(d => !d.hidden && !d.closest('[hidden]')).forEach(d => d.open = true); faqUI() }
  });
  document.addEventListener('toggle', e => { if (e.target.matches && e.target.matches('details')) faqUI() }, true);
  function search() {
    const inp = $('#FQS'); if (!inp) return;
    inp.addEventListener('input', () => {
      const q = inp.value.trim().toLowerCase();
      if (q) { $$('[data-chips=FG] .chip').forEach((c, i) => c.classList.toggle('on', i === 0)); $$('#FG [data-g]').forEach(g => g.hidden = false) }
      $$('#FG details').forEach(d => { const t = d.textContent.toLowerCase(); d.hidden = q && !t.includes(q); if (q && !d.hidden) d.open = true; if (!q) d.open = false });
      $$('#FG .faqg').forEach(g => { g.hidden = !$$('details', g).some(d => !d.hidden) });
      faqUI(); window.lockHeights && lockHeights();
    });
    const ph = () => { inp.placeholder = lang() === 'en' ? inp.dataset.phEn : inp.dataset.phHi; faqUI() };
    addEventListener('langchange', ph); ph();
  }

  /* tabs (side effects) */
  document.addEventListener('click', e => {
    const b = e.target.closest('.tabs .tb'); if (!b) return; const box = b.closest('.sec');
    $$('.tb', box).forEach(x => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on) });
    $$('.tp2', box).forEach(p => { p.hidden = p.dataset.pane !== b.dataset.tab; if (!p.hidden) { $$('[data-rv]', p).forEach(x => x.classList.add('in')) } });
    b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: RMO ? 'auto' : 'smooth' });
  });

  /* safe days: every day is "not fully safe" */
  document.addEventListener('click', e => {
    const d = e.target.closest('.sd'); if (!d) return; const box = d.closest('.safe');
    $$('.sd', box).forEach(x => x.classList.remove('x')); void d.offsetWidth; d.classList.add('x'); $('.sdr', box).hidden = false; buzz && buzz([40, 30, 40]);
  });

  /* feedback */
  document.addEventListener('click', e => {
    const b = e.target.closest('.fbb button'); if (!b) return; const box = b.closest('.fb');
    st.set('vk-fb-' + box.dataset.page, b.dataset.v); $$('.fbb button', box).forEach(x => { x.disabled = true; x.classList.toggle('chosen', x === b) }); $('.fbt', box).hidden = false;
  });
  function fbInit() { $$('.fb').forEach(box => { const v = st.get('vk-fb-' + box.dataset.page); if (v !== null) { $$('.fbb button', box).forEach(x => { x.disabled = true; x.classList.toggle('chosen', x.dataset.v === v) }); $('.fbt', box).hidden = false } }) }

  /* learning journey */
  function journey() {
    const pg = document.body.dataset.page; const seen = st.get('vk-seen') || [];
    if (pg && !seen.includes(pg)) { seen.push(pg); st.set('vk-seen', seen) }
    $$('.journey').forEach(box => {
      const data = JSON.parse($('.jdata', box).textContent); const done = data.filter(d => seen.includes(d.k)).length;
      const draw = () => {
        $('.jc', box).textContent = T(`आपने इस वेबसाइट के ${data.length} में से ${done} पेज पढ़े हैं`, `You have read ${done} of the ${data.length} pages on this website`);
        const next = data.filter(d => !seen.includes(d.k)).slice(0, 3);
        $('.jsug', box).innerHTML = next.length ? next.map(d => `<a class="js1" href="${d.href}"><span class="ic">${d.ic}</span><b>${T(d.hi, d.en)}</b><span aria-hidden="true">→</span></a>`).join('') : `<p class="jdone">${T('शाबाश! आपने इस वेबसाइट के सभी पेज पढ़ लिए हैं।', 'Well done! You have read every page on this website.')}</p>`;
        window.dispatchEvent(new Event('vk-decorate'));
      };
      draw(); addEventListener('langchange', draw);
      requestAnimationFrame(() => { $('.jbar i', box).style.width = (done / data.length * 100) + '%' });
    });
  }

  /* read aloud */
  let speaking = false;
  /* choose the warmest available voice: natural/neural female voices first */
  const WARM = { hi: ['swara', 'kalpana', 'lekha', 'google हिन्दी', 'google hindi', 'neerja', 'female', 'natural', 'neural'],
                 en: ['neerja', 'heera', 'swara', 'veena', 'rishi', 'google uk english female', 'samantha', 'female', 'natural', 'neural'] };
  function pickVoice(L) {
    const all = speechSynthesis.getVoices(); if (!all.length) return null;
    const pref = L === 'en' ? ['en-in', 'en-gb', 'en'] : ['hi-in', 'hi'];
    const pool = all.filter(v => v.lang && pref.some(p => v.lang.toLowerCase().replace('_', '-').startsWith(p)));
    const score = v => { const n = (v.name || '').toLowerCase(); let s = 0;
      WARM[L].forEach((w, i) => { if (n.includes(w)) s += 50 - i });
      if (/male|hemant|ravi|prabhat|madhur/.test(n) && !/female/.test(n)) s -= 40;
      if (v.lang.toLowerCase().replace('_', '-').startsWith(pref[0])) s += 10; if (!v.localService) s += 5; return s };
    return pool.sort((a, b) => score(b) - score(a))[0] || null;
  }
  if ('speechSynthesis' in window) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); }
  function listen() {
    const btn = $('[data-listen]'); if (!btn || !('speechSynthesis' in window)) return; btn.hidden = false;
    const stop = () => { speechSynthesis.cancel(); speaking = false; btn.classList.remove('on') };
    btn.addEventListener('click', () => {
      if (speaking) { stop(); return }
      const L = lang() === 'en' ? 'en' : 'hi', vis = el => el && el.offsetParent !== null;
      const parts = [];
      const add = el => { if (!el) return; const c = el.cloneNode(true); $$(L === 'en' ? '.hi' : '.en', c).forEach(x => x.remove()); $$('svg,button,script,.ki,.kn', c).forEach(x => x.remove()); const t = c.textContent.replace(/\s+/g, ' ').trim(); if (t) parts.push(t) };
      add($('.ph1')); add($('.answer p'));
      $$('.prose > .sec').forEach(s => { if (s.matches('.journey,.mstrip')) return; $$('h2, p, li, .tml li, .viz figcaption', s).filter(vis).forEach(add) });
      const chunks = []; parts.join('। ').split(/(?<=[।.?!])\s+/).forEach(x => { if (x.length > 220) x.match(/.{1,200}(\s|$)/g).forEach(y => chunks.push(y)); else chunks.push(x) });
      const v = pickVoice(L);
      speaking = true; btn.classList.add('on'); let i = 0;
      const next = () => { if (!speaking || i >= chunks.length) { stop(); return } const u = new SpeechSynthesisUtterance(chunks[i++]); u.lang = L === 'en' ? 'en-IN' : 'hi-IN'; if (v) u.voice = v; u.rate = L === 'en' ? .9 : .86; u.pitch = 1.05; u.onend = next; u.onerror = stop; speechSynthesis.speak(u) };
      speechSynthesis.cancel(); next();
    });
    addEventListener('pagehide', stop); addEventListener('langchange', () => { if (speaking) stop() });
  }

  document.addEventListener('DOMContentLoaded', () => { reveal(); progress(); search(); fbInit(); journey(); listen(); });
  addEventListener('vk-reveal', reveal);
})();

/* सच या सुनी-सुनाई? quiz. Data comes from game-data.js (window.VK_GAME). */
(function () {
  const D = window.VK_GAME, G = document.getElementById('G'), FL = document.getElementById('FL');
  let i = 0, correct = 0, streak = 0, best = 0, res = [], state = 'start', ans = null;
  const T = (h, e) => lang() === 'en' ? e : h;
  const N = D.cards.length;
  const lab = x => x ? T('सच', 'Fact') : T('सुनी-सुनाई', 'Myth');
  function reset() { i = 0; correct = 0; streak = 0; best = 0; res = []; ans = null }
  window.restart = function () { reset(); state = 'play'; render(); scrollTo(0, 0) };
  window.startGame = function () { reset(); state = 'play'; render() };
  function tiles(click) {
    return '<div class="tiles">' + D.cards.map((c, k) => `<button ${click ? `onclick="peek(${k})" aria-label="${k + 1}"` : 'tabindex="-1" aria-hidden="true"'} class="${k < res.length ? (res[k] ? 'r' : 'w') : (k === i && state === 'play' ? 'c' : '')}">${k < res.length ? (res[k] ? '✓' : '✕') : k + 1}</button>`).join('') + '</div>';
  }
  function board() {
    return `<aside class="board"><div class="lab">${T('स्कोरबोर्ड', 'SCOREBOARD')}</div><div class="sc"><b id="PT">${correct}</b><span>/ ${N} ${T('सही', 'correct')}</span></div>
 <div class="meter"><div class="lb"><span>${T('लगातार सही', 'STREAK')}</span><span><span class="fire" id="FI">🔥</span> ×${streak}</span></div><div class="bar"><i style="width:${Math.min(100, streak / 5 * 100)}%"></i></div></div>${tiles(false)}</aside>`;
  }
  function star() { let p = ''; for (let k = 0; k < 24; k++) { const r = k % 2 ? 40 : 49, a = k * Math.PI / 12; p += (k ? 'L' : 'M') + (50 + r * Math.cos(a)).toFixed(1) + ' ' + (50 + r * Math.sin(a)).toFixed(1) } return p + 'Z' }
  function render() {
    if (state === 'start') {
      G.innerHTML = `<div class="start"><div><div class="lab">${T('सखी का खेल', "SAKHI'S QUIZ")}</div><h1 class="big">${T('सच', 'Myth')}<span class="l2">${T('या सुनी-सुनाई?', 'or fact?')}</span></h1><p>${T(D.intro.hi, D.intro.en)}</p>
 <div class="facts"><div><b>${N}</b>${T('कार्ड', 'questions')}</div><div><b>2</b>${T('मिनट', 'minutes')}</div><div><b>0</b>${T('लॉगिन', 'login')}</div></div><button class="btn nextb" id="ST" onclick="startGame()">${T('खेल शुरू करें', 'Start the game')} ▶</button></div>
 <div class="deck" aria-hidden="true"><span>✕</span><span>✓</span><span>?</span></div></div>`; return;
    }
    if (state === 'play') {
      const c = D.cards[i], ok = ans !== null && ans === c.ans;
      G.innerHTML = `<div class="gg"><div><div class="gh"><span class="k">${T('कार्ड', 'CARD')} ${String(i + 1).padStart(2, '0')} / ${N}</span><span class="mini">✓ ${correct}</span><button class="rst" onclick="restart()">↻ ${T('शुरू से खेलें', 'Restart')}</button></div>
 <div class="scene"><div class="flip ${ans === null ? 'in' : ''}" id="FP"><div class="face front"><span class="k">${T('लोग कहते हैं…', 'PEOPLE SAY…')}</span><div class="s">"${T(c.hi, c.en).replace(/^"|"$/g, '')}"</div><span class="q2">${T('आपको क्या लगता है?', 'What do you think?')}</span><span class="qm" aria-hidden="true">?</span></div>
 <div class="face back ${ok ? 'ok' : 'no'}" aria-live="polite">${ans === null ? '' : `<div class="rb"><i>${ok ? '✓' : '✗'}</i>${ok ? T('आपका जवाब सही है!', 'You got it right!') : T('आपका जवाब ग़लत है', 'Not quite right')}</div>
 <div class="ansl"><div><small>${T('आपने चुना', 'You chose')}</small><b class="${ok ? 'y' : 'n'}">${lab(ans)}</b></div><div><small>${T('सही उत्तर', 'Right answer')}</small><b class="y">${lab(c.ans)}</b></div></div>
 <p>${T(c.whi, c.wen)}</p>`}</div></div></div>
 <div id="BT">${ans === null ? `<div class="two"><button class="bt" onclick="pick(true,this)">${T('यह सच है', "It's a fact")}</button><button class="bf" onclick="pick(false,this)">${T('यह सुनी-सुनाई है', "It's a myth")}</button></div>` : `<button class="btn dark nextb" id="NX" onclick="nxt()">${i < N - 1 ? T('अगला कार्ड', 'Next card') : T('नतीजा देखें', 'See my result')} →</button>`}</div></div>${board()}</div>`;
      if (ans !== null) setTimeout(() => { const f = document.getElementById('FP'); f && f.classList.add('on') }, 30);
      return;
    }
    const score = Math.round(correct / N * 100), b = D.bands.find(x => score >= x.min), pct = Math.max(5, Math.min(95, Math.round(score * .85 + 6)));
    const nx = D.next.map((n, k) => `<a class="nx" href="${n.href}"><i>${k + 1}</i>${T(n.hi, n.en)}</a>`).join('');
    G.innerHTML = `<div class="gg res"><div class="result"><div class="lab">${T('आपका नतीजा', 'YOUR RESULT')}</div><div class="seal"><svg viewBox="0 0 100 100" aria-hidden="true"><path fill="#f9a116" stroke="#4a0f2e" stroke-width="2" d="${star()}"/></svg><b>${T(b.bhi, b.ben)}</b></div>
 <div class="score"><span id="SC">0</span><small>/100</small></div><div class="m">${T(b.mhi, b.men)}</div><div class="st">${correct} / ${N} ${T('सही', 'correct')} · 🔥 ${T('सबसे लंबी स्ट्रीक', 'best streak')} ${best} · ${T('आप', 'better than')} ${pct}% ${T('खिलाड़ियों से आगे', 'of players')}<span class="demo">demo</span></div>
 <div class="lab" style="margin-top:18px">${T('आगे क्या?', 'WHAT NEXT?')}</div><div class="nxs">${nx}</div><button class="btn again" onclick="restart()">↻ ${T('फिर से खेलें', 'Play again')}</button></div>
 <aside class="board"><div class="lab">${T('अपने जवाब देखें', 'REVIEW YOUR ANSWERS')}</div><p style="font-size:14px;font-weight:600;margin-bottom:10px">${T('किसी भी कार्ड पर टैप करें', 'Tap any card')}</p>${tiles(true)}<div class="peek" id="PK"></div></aside></div>`;
    countUp(document.getElementById('SC'), score, 1300); if (score >= 50) setTimeout(() => FX.rain(), 500);
    window.dispatchEvent(new Event('vk-decorate'));
  }
  window.peek = function (k) { const c = D.cards[k], p = document.getElementById('PK'); p.className = 'peek on'; p.innerHTML = `<b>${k + 1}. ${T(c.hi, c.en)}</b><span>${lab(c.ans)}</span> · ${res[k] ? T('आपने सही बताया', 'you got it') : T('आप चूक गए', 'you missed it')}<br>${T(c.whi, c.wen)}` };
  window.pick = function (a, btn) {
    if (ans !== null) return; const ok = a === D.cards[i].ans; ans = a; res.push(ok);
    if (ok) { correct++; streak++; best = Math.max(best, streak) } else streak = 0; buzz(ok ? 30 : [60, 40, 60]);
    FL.className = 'flash'; void FL.offsetWidth; FL.className = 'flash ' + (ok ? 'ok' : 'no');
    const r = (btn || document.getElementById('FP')).getBoundingClientRect();
    render(); const f = document.getElementById('FP'); if (!ok) setTimeout(() => f.classList.add('wob'), 600);
    if (ok) { FX.burst(r.left + r.width / 2, r.top, { n: 90, up: true, spread: Math.PI * .9, v: 11 }); if (streak >= 3) setTimeout(() => FX.burst(innerWidth / 2, innerHeight * .35, { n: 60, v: 9 }), 350); const fi = document.getElementById('FI'); fi && fi.classList.add('go') }
    setTimeout(() => { const n = document.getElementById('NX'); n && n.focus({ preventScroll: true }) }, 500);
  };
  window.nxt = function () { i++; ans = null; if (i >= N) state = 'result'; render() };
  window.gameState = () => state;
  addEventListener('langchange', render);
  render();
})();

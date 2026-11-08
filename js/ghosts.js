/* ═══════════════════════════════════════════════════════════════
   I·BYTE — ghosts.js (the memorial)
   your own pet fades hour by hour as you scroll, then the wall of
   the forgotten ones, with candles you can light.
   concept, design & code by ghostly.grl ♥
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, life: L, RM } = IB;
  const petId = () => IB.get('pet', 'glitch');
  const IDS = Object.keys(IB.PETS);

  /* a sprite turning into a ghost: characters thin out into dots, rows drift */
  const ghostify = (lines, amt, t = 0) => lines.map((l, r) => {
    const shift = Math.round(Math.sin(t * 1.3 + r * 0.9) * amt * 2);
    const s = [...l].map((c) => (c !== ' ' && Math.random() < amt * 0.55 ? (Math.random() < 0.5 ? '.' : ' ') : c)).join('');
    return shift > 0 ? ' '.repeat(shift) + s : s.slice(-shift);
  });
  const html = (lines) => lines.map(IB.color).join('\n');

  /* ============ intro: ghosts drift up ============ */
  const floaters = () => {
    const box = $('[data-float]');
    const N = innerWidth < 700 ? 9 : 16;
    for (let i = 0; i < N; i++) {
      const p = document.createElement('pre');
      p.className = 'gh-ghost';
      p.dataset.id = IDS[i % IDS.length];
      p.style.left = IB.rand(-4, 94) + '%';
      p.style.fontSize = IB.rand(9, 20).toFixed(0) + 'px';
      p.style.opacity = IB.rand(0.12, 0.42).toFixed(2);
      box.appendChild(p);
      // each one drifts up from wherever it starts, then loops from the bottom (no negative delays: they shift every other animation)
      const speed = IB.rand(70, 120); // px per second
      const fly = (y0) => gsap.fromTo(p, { y: y0, x: IB.rand(-30, 30) }, { y: -innerHeight * 0.5, x: IB.rand(-60, 60), duration: (y0 + innerHeight * 0.5) / speed, ease: 'none', onComplete: () => fly(innerHeight * 1.1) });
      if (!RM) fly(innerHeight * IB.rand(-0.4, 1.1));
    }
    let t = 0;
    const draw = () => { t += 0.4; $$('.gh-ghost').forEach((p, i) => (p.innerHTML = html(ghostify(IB.sprite(p.dataset.id, 'sleep', 0, i % 2 ? 1 : -1), 0.55, t + i)))); };
    draw();
    setInterval(draw, 420);
    // the counter keeps going up. people keep forgetting
    let n = 12408;
    const c = $('[data-count]');
    setInterval(() => { if (Math.random() < 0.5) { n++; c.textContent = n.toLocaleString('en-US'); } }, 2400);
  };

  /* ============ the fade ============ */
  const fade = () => {
    const pre = $('[data-fade-pet]'), steps = $$('[data-fade-steps] li');
    $('[data-fade-name]').textContent = IB.pet(petId()).name;
    let p = 0, t = 0;
    const draw = () => {
      t++;
      const id = petId(), P = IB.pet(id);
      const stage = Math.min(5, Math.floor(p * 6));
      const mood = ['idle', 'wow', 'angry', 'sad', 'sick', 'sleep'][stage];
      let art = IB.sprite(id, mood, stage === 2 ? P.walk[t % 2] : t % 2 ? P.idle[t % P.idle.length] : 0, t % 9 < 5 ? -1 : 1, stage === 5);
      const w = art[0].length;
      if (stage === 3) art = [' '.repeat(Math.floor(w / 2)) + '☁', ' '.repeat(Math.floor(w / 2) + (t % 2)) + ',', ...art];
      else if (stage === 2) art = [' '.repeat(w - 2) + (t % 2 ? '!' : '~'), ...art];
      else if (stage === 1) art = [' '.repeat(w - 3) + '...', ...art];
      else art = [' ', ...art];
      const amt = Math.max(0, (p - 0.62) / 0.38);
      if (amt > 0) art = ghostify(art, amt, t);
      pre.innerHTML = html(art);
      pre.style.opacity = (1 - amt * 0.7).toFixed(2);
      pre.style.transform = `translateY(${(-amt * 60).toFixed(0)}px)`;
      pre.classList.toggle('is-ghost', amt > 0.3);
      steps.forEach((li, i) => li.classList.toggle('on', i === stage));
      $('[data-fade-h]').textContent = 'hour ' + String(Math.round(p * 48)).padStart(2, '0');
      $('[data-fade-bar]').style.width = (p * 100).toFixed(1) + '%';
    };
    draw();
    setInterval(draw, 450);
    if (RM) { p = 1; draw(); return; }
    ScrollTrigger.create({ trigger: '[data-fade]', start: 'top top', end: '+=320%', pin: '.gh-fade__pin', scrub: true, onUpdate: (s) => { p = s.progress; draw(); } });
  };

  /* ============ the wall ============ */
  const WALL = [
    ['glitch', 'pixel', 3, 'finals week.'],
    ['cache', 'nugget', 11, 'went on holiday. left it in the car.'],
    ['ctrl', 'mr. whiskers.exe', 41, 'new phone. never transferred.'],
    ['spam', 'inbox zero', 2, 'muted it. it didn’t like that.'],
    ['blip', 'kermit 2', 6, 'got a boyfriend.'],
    ['lowbat', 'batman', 19, 'battery died. ironic.'],
    ['glitch', 'bunbun', 1, 'forgot it existed by lunch.'],
    ['cache', 'hamtaro (not that one)', 27, 'fed it too much. it was fine. then not.'],
    ['ctrl', 'cmd', 8, 'mom confiscated it in maths.'],
    ['spam', 'newsletter', 14, 'unsubscribed.'],
    ['blip', 'ribbit', 5, 'left it in the washing machine.'],
    ['lowbat', 'goth baby', 33, 'it wanted to go. it was very dramatic about it.']
  ];
  const wall = () => {
    const ul = $('[data-wall]');
    const lit = IB.get('candles', {});
    ul.innerHTML = WALL.map(([id, nm, days, why], i) => {
      const base = 3 + ((i * 37) % 41);
      return `<li class="gh-card bitable" data-i="${i}" data-id="${id}">
        <pre class="gh-card__pet"></pre>
        <p class="gh-card__name">${nm}</p>
        <p class="gh-card__kind">${IB.PETS[id].name.toLowerCase()} · ${IB.PETS[id].kind} · lived ${days} day${days > 1 ? 's' : ''}</p>
        <p class="gh-card__why">“${why}”</p>
        <button class="gh-candle${lit[i] ? ' is-lit' : ''}" type="button" data-candle="${i}" data-base="${base}" data-cur="light it"><pre></pre><span>${base + (lit[i] ? 1 : 0)}</span></button>
      </li>`;
    }).join('');
    let t = 0;
    const draw = () => {
      t++;
      $$('.gh-card').forEach((c, i) => ($('.gh-card__pet', c).innerHTML = html(ghostify(IB.sprite(c.dataset.id, 'sleep', 0, -1, true), c.classList.contains('is-warm') ? 0.15 : 0.45, t + i))));
      $$('.gh-candle').forEach((b) => ($('pre', b).innerHTML = b.classList.contains('is-lit') ? [(t % 2 ? ' ( ' : ' ) '), ' | ', '|_|'].map((l, j) => (j === 0 ? `<i>${l}</i>` : l)).join('\n') : ['   ', ' | ', '|_|'].join('\n')));
    };
    draw();
    setInterval(draw, 380);
    $$('.gh-candle').forEach((b) => b.addEventListener('click', () => {
      const i = b.dataset.candle, l = IB.get('candles', {});
      if (l[i]) { IB.toast('already lit. it saw.'); return; }
      l[i] = 1; IB.set('candles', l);
      b.classList.add('is-lit');
      $('span', b).textContent = +b.dataset.base + 1;
      const card = b.closest('.gh-card');
      card.classList.add('is-warm');
      IB.toast(`a candle for ${WALL[i][1]}. ♥`);
      if (!RM) gsap.fromTo(card, { boxShadow: '0 0 0 1px rgba(255,79,162,.8), 0 0 60px rgba(255,79,162,.6)' }, { boxShadow: '0 0 0 1px rgba(255,255,255,.08), 0 0 0 rgba(255,79,162,0)', duration: 1.6 });
    }));
    $$('.gh-card').forEach((c) => { if (lit[c.dataset.i]) c.classList.add('is-warm'); });
  };

  /* ============ yours ============ */
  const yours = () => {
    const d = IB.device($('[data-yours-dev]'), {
      shell: IB.get('shell', 'crush'), cols: 15, rows: 7,
      buttons: (i, s) => {
        if (i === 0) { L.feed(); s.feed(); IB.toast('nom. it stays.'); }
        if (i === 1) { L.play(); s.play(); IB.toast('+1 joy'); }
        if (i === 2) { L.clean(); s.clean(); IB.toast('clean.'); }
      }
    });
    d.screen.poops = L.poop;
    L.on((l) => {
      d.screen.mood = l.hungry() ? 'angry' : l.poop >= 2 ? 'sick' : l.joy <= 1 ? 'sad' : 'idle';
      $('[data-yours-k]').textContent = l.hungry() ? 'yours is getting quieter.' : 'yours isn’t here.';
      $('[data-yours-title]').textContent = l.hungry() ? 'feed it.' : 'yet.';
    });
  };

  /* ============ motion ============ */
  const motion = () => {
    if (RM) return;
    gsap.timeline()
      .from('.gh-w, .gh-hero__title .pdot', { yPercent: 110, opacity: 0, filter: 'blur(14px)', duration: 1.6, stagger: 0.1, ease: 'power3.out' })
      .from('.gh-hero__info, .gh-hero__sub', { opacity: 0, y: 14, duration: 0.9, stagger: 0.12 }, 0.6);
    gsap.fromTo('.gh-hero__title', { opacity: 1, filter: 'blur(0px)', yPercent: 0 }, { opacity: 0.15, filter: 'blur(8px)', yPercent: -20, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.gh-hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.from('.gh-card', { y: 60, opacity: 0, duration: 1, stagger: { each: 0.06, from: 'random' }, ease: 'power3.out', scrollTrigger: { trigger: '.gh-wall__grid', start: 'top 80%' } });
    gsap.from('.gh-yours > *', { y: 60, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.gh-yours', start: 'top 75%' } });
  };

  floaters();
  fade();
  wall();
  yours();
  IB.boot(motion);
})();

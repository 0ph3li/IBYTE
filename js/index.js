/* ═══════════════════════════════════════════════════════════════
   I·BYTE — index.js (home) · v2 "glossy night"
   concept, design & code by ghostly.grl ♥
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, life: L, RM } = IB;
  const screens = []; // every live LCD on the page, so a new pet updates all of them
  const track = (s) => (screens.push(s), s);
  const untrack = (s) => { if (!s) return; s.stop(); const i = screens.indexOf(s); if (i > -1) screens.splice(i, 1); };
  const HEART = '<svg viewBox="0 0 32 30"><path d="M16 29 C 6 21, 0 15, 0 8.5 A 8 8 0 0 1 16 5 A 8 8 0 0 1 32 8.5 C 32 15, 26 21, 16 29Z" fill="#ffd0e8"/><path d="M6 6 C 8 4, 11 4, 12 6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';

  /* a pendulum for things hanging from a chain */
  const pendulum = (el, o = {}) => {
    let a = 0, v = 0, lastX = null, t = Math.random() * 9;
    if (RM) return { kick() {} };
    addEventListener('pointermove', (e) => {
      if (lastX != null) {
        const r = el.getBoundingClientRect();
        if (e.clientY > r.top - 160 && e.clientY < r.bottom + 160 && e.clientX > r.left - 240 && e.clientX < r.right + 240) v += (e.clientX - lastX) * (o.k || 0.012);
      }
      lastX = e.clientX;
    });
    let hooked = false;
    gsap.ticker.add(() => {
      if (!hooked && IB.lenis) { hooked = true; IB.lenis.on('scroll', (l) => (v += IB.clamp(l.velocity, -40, 40) * 0.003)); }
      t += 0.016;
      v += -a * 0.016;
      v *= 0.965;
      a = IB.clamp(a + v, -22, 22);
      gsap.set(el, { rotation: a + Math.sin(t * 1.1) * (o.idle || 1.2) });
    });
    return { kick: (f) => (v += f) };
  };

  /* chrome starburst, like the ones floating on the flyer */
  const starburst = (size) => {
    const n = 14, pts = [];
    for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2, r = i % 2 ? 9 : (i % 4 ? 50 : 38); pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r]); }
    return `<svg class="starburst" viewBox="0 0 100 100" style="width:${size}px"><defs><linearGradient id="sb${size}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#9da3b3"/><stop offset=".6" stop-color="#fff"/><stop offset="1" stop-color="#6f7586"/></linearGradient></defs><path d="M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L')}Z" fill="url(#sb${size})"/><circle cx="50" cy="50" r="8" fill="#fff"/></svg>`;
  };

  /* ============ 01 hero ============ */
  let hero;
  const buildHero = () => {
    untrack(hero && hero.screen);
    hero = IB.device($('[data-hero-dev]'), { shell: IB.get('shell', 'crush'), cols: 15, rows: 7, buttons: (i) => act(i) });
    hero.screen.poops = L.poop;
    track(hero.screen);
    moodFromLife();
  };
  const act = (i) => {
    const s = hero.screen;
    if (i === 0) { L.feed(); s.feed(); IB.toast(L.full >= 4 ? 'full. it’s full. stop.' : 'nom. +1 full'); }
    if (i === 1) { L.play(); s.play(); IB.toast('it had fun. +1 joy'); }
    if (i === 2) { const had = L.poop; L.clean(); s.clean(); IB.toast(had ? 'cleaned. you’re a good parent' : 'nothing to clean. it’s showing off'); }
    if (!RM) gsap.fromTo('[data-float]', { scale: 0.96 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1.2, .4)' });
  };
  const moodFromLife = () => {
    const s = hero && hero.screen;
    if (!s) return;
    if (s.sweep == null) s.poops = L.poop;
    s.mood = L.hungry() ? 'angry' : L.joy <= 1 || L.poop >= 2 ? 'sad' : 'idle';
    $$('[data-m]').forEach((b) => {
      const k = b.dataset.m;
      b.textContent = k === 'poop' ? (L.poop ? '~'.repeat(L.poop) : 'none') : IB.meter(L[k]);
      b.classList.toggle('is-low', k === 'poop' ? L.poop >= 2 : L[k] <= 1);
    });
  };
  const petLabels = () => {
    const p = IB.pet(IB.get('pet', 'glitch'));
    $$('[data-hero-name]').forEach((e) => (e.textContent = p.name));
    $$('[data-hero-kind]').forEach((e) => (e.textContent = p.kind));
  };
  const orbit = () => {
    const bead = $('[data-bead]'), beadBox = $('[data-bead-box]');
    // glass bubbles + starbursts around the heart
    const g = $('[data-glass]');
    [[8, 30, 74, 1], [17, 58, 46, 0], [86, 26, 62, 1], [93, 60, 40, 0], [24, 12, 34, 0], [76, 82, 56, 1], [12, 84, 30, 0], [70, 8, 28, 0], [55, 92, 36, 0]].forEach(([x, y, s, h]) => {
      const b = document.createElement('span');
      b.className = 'bub';
      Object.assign(b.style, { left: x + '%', top: y + '%', width: s + 'px', height: s + 'px' });
      if (h) b.innerHTML = HEART;
      g.appendChild(b);
      if (!RM) gsap.to(b, { y: IB.rand(-24, 24), x: IB.rand(-14, 14), duration: IB.rand(2.6, 4.2), yoyo: true, repeat: -1, ease: 'sine.inOut' });
    });
    [[20, 70, 64], [82, 44, 84], [64, 16, 40]].forEach(([x, y, s]) => {
      g.insertAdjacentHTML('beforeend', starburst(s));
      const el = g.lastElementChild;
      Object.assign(el.style, { left: x + '%', top: y + '%' });
      if (!RM) gsap.to(el, { rotation: 360, duration: 18 + s / 4, repeat: -1, ease: 'none' });
    });
    // the chrome bead rides the ring: in front of the heart on the lower half, behind it on the upper
    const A = (-17.8 * Math.PI) / 180, ca = Math.cos(A), sa = Math.sin(A);
    const put = (t) => {
      const c = Math.cos(t) * 50.5, d = Math.sin(t) * 24.8;
      Object.assign(bead.style, { left: (52.3 + c * ca - d * sa).toFixed(2) + '%', top: (54.9 + c * sa + d * ca).toFixed(2) + '%' });
      beadBox.style.zIndex = Math.sin(t) < 0 ? 1 : 3;
    };
    if (RM) return put(0.4);
    const o = { t: 0 };
    gsap.to(o, { t: Math.PI * 2, duration: 7, repeat: -1, ease: 'none', onUpdate: () => put(o.t) });
  };
  const heroIn = () => {
    $$('[data-act]').forEach((b) => b.addEventListener('click', () => act(+b.dataset.act)));
    document.addEventListener('ib:act', (e) => act(e.detail));
    if (RM) return;
    const tl = gsap.timeline();
    tl.from('.hw', { yPercent: 105, duration: 1.2, stagger: 0.05, ease: 'power4.out' })
      .from('.hero__head p', { y: 24, opacity: 0, filter: 'blur(8px)', stagger: 0.08, duration: 0.8, ease: 'power3.out' }, 0.2)
      .from('[data-float]', { scale: 0.4, opacity: 0, rotation: -20, filter: 'blur(20px)', duration: 1.4, ease: 'expo.out' }, 0.25)
      .from('.ring img', { scale: 0.5, rotation: -25, opacity: 0, duration: 1.6, ease: 'expo.out' }, 0.4)
      .from('.glass > *', { scale: 0, opacity: 0, stagger: 0.05, duration: 0.8, ease: 'back.out(2)' }, 0.6)
      .from('.hero__info, .hero__side', { opacity: 0, y: 14, stagger: 0.08, duration: 0.7 }, 0.7);
    // the heart floats and turns toward the mouse, like it's watching
    gsap.to('[data-float]', { y: -14, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    const fl = $('[data-float]');
    fl.parentElement.style.perspective = '1100px';
    const rx = gsap.quickTo(fl, 'rotationX', { duration: 0.9, ease: 'power3' }), ry = gsap.quickTo(fl, 'rotationY', { duration: 0.9, ease: 'power3' });
    addEventListener('pointermove', (e) => { ry((e.clientX / innerWidth - 0.5) * 22); rx(-(e.clientY / innerHeight - 0.5) * 14); });
    // leaving: the word sinks, the heart lifts
    gsap.matchMedia().add('(min-width: 861px)', () => {
      const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero__word', { yPercent: 30, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__stage', { y: -120, ease: 'none', scrollTrigger: st });
      gsap.fromTo('.hero__head, .hero__side', { opacity: 1 }, { opacity: 0, ease: 'none', immediateRender: false, scrollTrigger: { ...st, end: '40% top' } });
    });
  };

  /* ============ 02 the rule ============ */
  let ruleDev;
  const BITES = [[0.58, 0.32], [0.985, 0.6], [0.82, 0.3], [0.17, 0.36]];
  const rule = () => {
    ruleDev = IB.device($('[data-rule-dev]'), { shell: 'bite', cols: 15, rows: 7 });
    track(ruleDev.screen);
    const line = $('[data-bite-line]');
    let n = 0;
    const setBites = (want) => {
      if (want === n) return;
      const grow = want > n;
      IB.unbite(line);
      const r = line.getBoundingClientRect();
      for (let i = 0; i < want; i++) {
        const [fx, fy] = BITES[i];
        IB.bite(line, r.left + fx * r.width, r.top + fy * r.height, { r: r.height * 0.19, exact: true, silent: !(grow && i === want - 1) });
      }
      n = want;
      ruleDev.screen.mood = want ? 'angry' : 'idle';
      if (grow) ruleDev.screen.say('angry', 900);
    };
    if (RM) { setBites(3); return; }
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.rule', start: 'top top', end: '+=220%', pin: '.rule__pin', scrub: 0.6,
        onUpdate: (st) => setBites(st.progress > 0.93 ? 4 : st.progress > 0.84 ? 3 : st.progress > 0.75 ? 2 : st.progress > 0.66 ? 1 : 0)
      }
    });
    tl.from('.rl > span', { yPercent: 110, stagger: 0.16, duration: 0.3, ease: 'power3.out' })
      .from('[data-rule-dev]', { xPercent: 60, rotation: 50, opacity: 0, duration: 0.4, ease: 'power3.out' }, 0.1)
      .to('[data-rule-dev]', { rotation: -6, duration: 0.5, ease: 'none' }, 0.45)
      .to({}, { duration: 0.5 });
  };

  /* ============ 03 the litter (pinned, one pet per step) ============ */
  const IDS = Object.keys(IB.PETS);
  let ltDev, ltCur = -1, ltST;
  const litter = () => {
    ltDev = IB.device($('[data-lt-dev]'), { shell: 'moon', cols: 17, rows: 7, pet: IDS[0], chain: 'loop' });
    track(ltDev.screen);
    ltDev.screen.isLitter = true;
    pendulum($('.litter__c'), { k: 0.008, idle: 1.4 });
    const list = $('[data-lt-list]');
    list.innerHTML = IDS.map((id, i) => `<li><button type="button" data-cur="meet"><small>0${i + 1}</small>${IB.PETS[id].name}</button></li>`).join('');
    const adoptBtn = $('[data-lt-adopt]');
    const meter = (v) => '■'.repeat(v) + '□'.repeat(4 - v);
    const show = (i) => {
      if (i === ltCur) return;
      const first = ltCur < 0;
      ltCur = i;
      const id = IDS[i], p = IB.PETS[id];
      ltDev.screen.setPet(id);
      ltDev.screen.say(i % 2 ? 'love' : 'play', 1600);
      $('[data-lt-no]').textContent = `n°${p.no} / 0${IDS.length}`;
      const nm = $('[data-lt-name]');
      first ? (nm.textContent = p.name) : IB.scramble(nm, p.name, 0.45);
      $('[data-lt-ghost]').textContent = p.name;
      $('[data-lt-kind]').textContent = p.kind;
      $('[data-lt-line]').textContent = p.line;
      $('[data-lt-stats]').innerHTML = Object.entries(p.stats).map(([k, v]) => `<div><dt>${k}</dt><dd>${meter(v)}</dd></div>`).join('') + `<div class="likes"><dt>likes</dt><dd>${p.likes}</dd></div>`;
      adoptBtn.textContent = IB.get('pet', 'glitch') === id ? 'yours ♥' : 'make it mine';
      $$('li', list).forEach((li, j) => li.classList.toggle('on', j === i));
      if (!first && !RM) {
        gsap.fromTo('.litter__l > *', { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.5, ease: 'power3.out' });
        gsap.fromTo('[data-lt-ghost]', { xPercent: -46, opacity: 0 }, { xPercent: -50, opacity: 1, duration: 0.8, ease: 'power3.out' });
        gsap.fromTo('[data-lt-dev] .dev__svg', { scale: 0.94 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1.1, .4)' });
      }
    };
    $$('button', list).forEach((b, i) => b.addEventListener('click', () => {
      if (!ltST) return show(i);
      IB.scrollTo(ltST.start + ((i + 0.5) / IDS.length) * (ltST.end - ltST.start));
    }));
    adoptBtn.addEventListener('click', () => {
      const id = IDS[ltCur];
      IB.adopt(id);
      IB.toast(`${IB.PETS[id].name} is yours now. good luck.`);
    });
    show(0);
    document.addEventListener('ib:pet', (e) => { if (IDS[ltCur]) adoptBtn.textContent = e.detail === IDS[ltCur] ? 'yours ♥' : 'make it mine'; });
    if (RM) return;
    ltST = ScrollTrigger.create({
      trigger: '.litter', start: 'top top', end: '+=' + IDS.length * 80 + '%', pin: '.litter__pin', scrub: true,
      onUpdate: (st) => { show(Math.min(IDS.length - 1, Math.floor(st.progress * IDS.length))); $('[data-lt-bar]').style.transform = `scaleX(${st.progress})`; }
    });
    gsap.from('[data-lt-dev]', { y: 160, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.litter', start: 'top 70%' } });
  };

  /* ============ 04 a day in the life ============ */
  const DAY = [
    { m: 420, h: '07:00', a: 'wake', t: 'wakes up. screams about it.' },
    { m: 510, h: '08:30', a: 'eat', t: 'breakfast. demands seconds.' },
    { m: 660, h: '11:00', a: 'play', t: 'plays with a ball. it’s an o.' },
    { m: 780, h: '13:00', a: 'poop', t: 'makes a mess. on purpose.' },
    { m: 900, h: '15:00', a: 'sad', t: 'sulks. you were in a meeting.' },
    { m: 1080, h: '18:00', a: 'love', t: 'you’re back. it forgives you.' },
    { m: 1260, h: '21:00', a: 'eat', t: 'dinner. crumbs everywhere.' },
    { m: 1410, h: '23:30', a: 'sleep', t: 'sleeps. finally. don’t move.' },
    { m: 1620, h: '03:00', a: 'angry', t: 'wakes up for no reason at all.' }
  ];
  const GLOW = [[420, 'rgba(255,190,170,.26)'], [660, 'rgba(150,200,255,.24)'], [900, 'rgba(170,170,255,.22)'], [1080, 'rgba(255,110,180,.3)'], [1260, 'rgba(160,90,255,.26)'], [1410, 'rgba(70,60,200,.2)'], [1620, 'rgba(30,40,140,.16)']];
  const glowAt = (m) => {
    for (let i = 1; i < GLOW.length; i++) if (m <= GLOW[i][0]) {
      const [m0, c0] = GLOW[i - 1], [m1, c1] = GLOW[i];
      return gsap.utils.interpolate(c0, c1, (m - m0) / (m1 - m0));
    }
    return GLOW[GLOW.length - 1][1];
  };
  const day = () => {
    const pre = $('[data-day-lcd]'), clock = $('[data-clock]'), log = $('[data-day-log]'), bar = $('[data-day-bar]'), pin = $('.day__pin');
    IB.fit(pre, 30, 8);
    const s = track(new IB.Screen(pre, { cols: 30, rows: 8, pet: IB.get('pet', 'glitch') }));
    log.innerHTML = DAY.map((d) => `<li><b>${d.h}</b><span>${d.t}</span></li>`).join('');
    const lis = $$('li', log);
    let cur = -1;
    const enter = (i) => {
      if (i === cur) return;
      cur = i;
      lis.forEach((li, j) => { li.classList.toggle('on', j <= i); li.classList.toggle('now', j === i); });
      const d = DAY[i];
      s.act = null; s.mood = 'idle'; s.walk = true;
      if (d.a === 'wake') s.say('angry', 2200);
      if (d.a === 'eat') s.feed();
      if (d.a === 'play') { s.play(); s.act.until = 1e15; }
      if (d.a === 'poop') { s.poops = 2; s.mood = 'smug'; }
      if (d.a === 'sad') { s.poops = 0; s.mood = 'sad'; }
      if (d.a === 'love') s.say('love', 1e9);
      if (d.a === 'sleep') { s.walk = false; s.say('sleep', 1e9); }
      if (d.a === 'angry') s.say('angry', 1e9);
      if (d.a !== 'poop' && d.a !== 'sad') s.poops = d.a === 'eat' && i > 5 ? 1 : 0;
    };
    const set = (p) => {
      const m = 420 + p * (1620 - 420);
      const hh = Math.floor(m / 60) % 24, mm = Math.floor((m % 60) / 15) * 15;
      clock.textContent = String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
      pin.style.setProperty('--daybg', glowAt(m));
      bar.style.transform = `scaleX(${p})`;
      let i = 0;
      DAY.forEach((d, j) => { if (m >= d.m) i = j; });
      enter(i);
    };
    set(0);
    if (RM) return;
    ScrollTrigger.create({ trigger: '.day', start: 'top top', end: '+=320%', pin, scrub: true, onUpdate: (st) => set(st.progress) });
    gsap.from('.day__screen', { y: 90, rotationX: 40, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.day', start: 'top 70%' } });
  };

  /* ============ 05 shells ============ */
  let shellIdx = Math.max(0, IB.SHELL_IDS.indexOf(IB.get('shell', 'crush')));
  let shellDev;
  const SHOTS = { crush: 'HOME/shell-crush.png', moon: 'HOME/moon-shell.png', berry: 'HOME/berry-shell.png', bite: 'HOME/shell-bite.png', puff: 'HOME/puff-shell.png' };
  const shells = () => {
    const host = $('[data-shell-dev]');
    const dots = $('[data-sh-dots]');
    const sec = $('.shells');
    dots.innerHTML = IB.SHELL_IDS.map((id) => `<button type="button" aria-label="${IB.SHELLS[id].name}" data-cur="${IB.SHELLS[id].name.toLowerCase()}"></button>`).join('');
    const slot = $('[data-sh-slot]');
    const swing = pendulum($('[data-sh-hang]'), { k: 0.01, idle: 1.6 });
    const render = (first) => {
      const id = IB.SHELL_IDS[shellIdx], s = IB.SHELLS[id];
      host.innerHTML = '';
      const box = document.createElement('div');
      host.appendChild(box);
      untrack(shellDev && shellDev.screen);
      shellDev = IB.device(box, { shell: id, cols: 16, rows: 7, chain: 'swirl', charm: true });
      track(shellDev.screen);
      sec.style.setProperty('--glow', s.glow);
      $('[data-sh-no]').textContent = `${s.no} / 0${IB.SHELL_IDS.length}`;
      const nm = $('[data-sh-name]');
      first ? (nm.textContent = s.name) : IB.scramble(nm, s.name, 0.5);
      $('[data-sh-traits]').textContent = s.traits.join(' · ');
      $('[data-sh-note]').textContent = s.note;
      $('[data-sh-price]').textContent = '€' + s.price;
      $$('button', dots).forEach((b, i) => b.classList.toggle('on', i === shellIdx));
      $('[data-sh-wear]').textContent = IB.get('shell', 'crush') === id ? 'you’re wearing it' : 'wear this shell';
      const shot = SHOTS[id];
      slot.dataset.img = shot;
      const lb = $('.slot__lab b', slot);
      if (lb) lb.textContent = `img/${shot}`;
      IB.slotLoad(slot, `img/${shot}`);
      if (!first && !RM) { gsap.fromTo(box, { y: -260, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'elastic.out(1, .55)' }); swing.kick(5); }
    };
    const go = (i) => {
      const next = (i + IB.SHELL_IDS.length) % IB.SHELL_IDS.length;
      if (next === shellIdx) return;
      const box = host.firstElementChild;
      const out = () => { shellIdx = next; render(); };
      RM ? out() : gsap.to(box, { y: -420, opacity: 0, duration: 0.4, ease: 'power3.in', onComplete: out });
    };
    $$('button', dots).forEach((b, i) => b.addEventListener('click', () => go(i)));
    $('[data-sh-prev]').addEventListener('click', () => go(shellIdx - 1));
    $('[data-sh-next]').addEventListener('click', () => go(shellIdx + 1));
    $('[data-sh-wear]').addEventListener('click', () => {
      const id = IB.SHELL_IDS[shellIdx];
      IB.set('shell', id);
      buildHero();
      $('[data-sh-wear]').textContent = 'you’re wearing it';
      IB.toast(`${IB.SHELLS[id].name} on. scroll up and say hi.`);
    });
    render(true);
    if (RM) return;
    gsap.from('.shells__info > *', { y: 40, opacity: 0, stagger: 0.06, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.shells__info', start: 'top 80%' } });
    gsap.from('[data-shell-dev]', { y: -500, duration: 1.6, ease: 'elastic.out(1, .5)', scrollTrigger: { trigger: '.shells', start: 'top 60%' }, onComplete: () => swing.kick(4) });
  };

  /* ============ 06 worn ============ */
  const worn = () => {
    const d = IB.device($('[data-worn-dev]'), { shell: 'puff', cols: 15, rows: 7, chain: 'hang' });
    track(d.screen);
    pendulum($('[data-worn-hang]'), { k: 0.02, idle: 2 });
    if (RM) return;
    [['.worn__close', -60], ['.worn__main', 30], ['.worn__hand', -90], ['.worn__copy', -30]].forEach(([s, y]) =>
      gsap.fromTo(s, { y: -y }, { y, ease: 'none', scrollTrigger: { trigger: '.worn', start: 'top bottom', end: 'bottom top', scrub: true } }));
    gsap.from('.worn .slot', { clipPath: 'inset(100% 0 0 0)', duration: 1.4, stagger: 0.15, ease: 'expo.out', scrollTrigger: { trigger: '.worn__grid', start: 'top 75%' } });
    gsap.from('.worn__title', { yPercent: 50, opacity: 0, filter: 'blur(10px)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.worn__title', start: 'top 92%' } });
  };

  /* ============ 07 adopt — her flip phone rings; once it opens, it stays open ============ */
  const adopt = () => {
    const pet = $('[data-ph-pet]'), mini = $('[data-ph-mini]'), nameEl = $('[data-ph-name]'), kEl = $('[data-ph-k]');
    let name = IB.get('petname', '').slice(0, 10), f = 0, k = 0, open = false;
    nameEl.textContent = name;
    const moods = ['idle', 'idle', 'blink', 'happy', 'idle', 'love', 'idle', 'smug'];
    const draw = () => {
      const id = IB.get('pet', 'glitch'), p = IB.pet(id);
      f = (f + 1) % 4;
      const m = L.hungry() ? (f % 2 ? 'angry' : 'idle') : moods[k++ % moods.length];
      pet.innerHTML = IB.sprite(id, m, m === 'happy' || m === 'love' ? 3 : f % 2, -1).map(IB.color).join('\n');
      if (!open) mini.innerHTML = IB.sprite(id, 'wow', f % 2 ? 3 : 0, -1).map(IB.color).join('\n');
      $('[data-ph-caller]').textContent = name || p.name;
      $('[data-ph-kind]').textContent = p.kind;
      const d = new Date();
      $('[data-ph-clock]').textContent = [d.getHours(), d.getMinutes()].map((n) => String(n).padStart(2, '0')).join(':');
    };
    draw();
    setInterval(draw, 520);

    /* the keys on her photo, T9 style: tap again quickly to cycle the letters */
    const T9 = { 1: '♥', 2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz', '*': '♥', 0: ' ', '#': '⌫' };
    const POS = [['1', 29, 65], ['2', 40.5, 65], ['3', 51.5, 65], ['4', 27.5, 71.5], ['5', 39.5, 71.5], ['6', 51, 71.5], ['7', 26, 77], ['8', 38.5, 77], ['9', 50, 77], ['*', 24.5, 82.5], ['0', 37.5, 82.5], ['#', 49, 82.5],
      ['call', 30.5, 59, 'adopt'], ['end', 53.5, 59, 'hang up'], ['ok', 40.5, 56.5, 'pet it', 1], ['call', 31.5, 52.5, 'adopt', 1], ['clear', 53.5, 52.5, 'clear', 1]];
    $('[data-keys]').innerHTML = POS.map(([key, x, y, lab, round]) =>
      `<button class="pk${round ? ' pk--round' : ''}" type="button" data-k="${key}" style="left:${x}%;top:${y}%" aria-label="${lab || key}" data-cur="${lab || T9[key] || key}"></button>`).join('');
    let last = null, lastT = 0, cyc = 0;
    const greet = () => { if (open) kEl.textContent = name ? `hi ${name}. ♥` : '1 new pet ♥'; };
    const setName = (v) => { name = v.slice(0, 10); nameEl.textContent = name; IB.set('petname', name); greet(); draw(); };
    const beep = () => gsap.fromTo('[data-ph]', { filter: 'brightness(1.7)' }, { filter: 'brightness(1)', duration: 0.35 });
    const typeKey = (n) => {
      const l = T9[n], now = performance.now();
      if (n === '#') setName(name.slice(0, -1));
      else if (n === '0') setName(name + ' ');
      else if (n === '1' || n === '*') setName(name + '♥');
      else if (n === last && now - lastT < 900) { cyc = (cyc + 1) % l.length; setName(name.slice(0, -1) + l[cyc]); }
      else { cyc = 0; setName(name + l[0]); }
      last = n; lastT = now;
      beep();
    };
    const call = () => {
      const p = IB.pet(IB.get('pet', 'glitch'));
      IB.toast(`calling the litter… ${(name || p.name).toUpperCase()} is coming home ♥`);
      if (!RM) gsap.to('[data-flip-in]', { x: '+=5', duration: 0.05, repeat: 9, yoyo: true });
      setTimeout(() => (location.href = 'adopt.html'), 1400);
    };
    $$('.pk').forEach((b) => b.addEventListener('click', () => {
      const kk = b.dataset.k;
      if (T9[kk] != null) return typeKey(kk);
      if (kk === 'call') call();
      if (kk === 'clear') { setName(''); beep(); }
      if (kk === 'ok') { kEl.textContent = 'it purrs. or beeps. ♥'; beep(); }
      if (kk === 'end') { kEl.textContent = 'you can’t hang up on family.'; beep(); }
    }));
    addEventListener('keydown', (e) => {
      if (!open || e.metaKey || e.ctrlKey || e.altKey) return;
      const r = $('[data-flip]').getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      if (/^[a-z ]$/i.test(e.key)) { setName(name + e.key.toLowerCase()); beep(); e.preventDefault(); }
      else if (e.key === 'Backspace') { setName(name.slice(0, -1)); beep(); e.preventDefault(); }
      else if (e.key === 'Enter') call();
      const t = Object.keys(T9).find((n) => T9[n].includes(e.key.toLowerCase()));
      const btn = t && $(`.pk[data-k="${t}"]`);
      if (btn) { btn.classList.add('is-down'); setTimeout(() => btn.classList.remove('is-down'), 140); }
    });

    const lid = $('[data-lid]'), closed = $('[data-closed]'), base = $('[data-base]'), inner = $('[data-flip-in]');
    const done = () => { open = true; closed.style.display = 'none'; kEl.textContent = '1 new pet ♥'; greet(); };
    if (RM) { gsap.set(lid, { rotationX: 0, opacity: 1 }); gsap.set(base, { opacity: 1 }); done(); return; }

    // ringing: pink rings pulse, the closed phone buzzes, sitting a bit higher
    gsap.set(inner, { yPercent: -20 });
    gsap.to('.call__rings i', { scale: 1.9, opacity: 0, duration: 2.2, repeat: -1, stagger: 0.73, ease: 'power1.out', startAt: { scale: 0.45, opacity: 0.9 } });
    const buzz = gsap.timeline({ repeat: -1, repeatDelay: 0.9 }).to(closed, { rotationZ: 2.5, duration: 0.05, repeat: 11, yoyo: true, ease: 'none' }).set(closed, { rotationZ: 0 });
    gsap.fromTo('.cw--a', { xPercent: -30, opacity: 0.2 }, { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.call', start: 'top bottom', end: 'top 20%', scrub: 0.6 } });
    gsap.fromTo('.cw--b', { xPercent: 30, opacity: 0.2 }, { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.call', start: 'top bottom', end: 'top 20%', scrub: 0.6 } });
    gsap.from('.flip', { y: 160, rotationZ: -8, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.call', start: 'top 75%' } });

    // pick up: plays once, never closes again
    let opening = false;
    const pickUp = () => {
      if (opening) return;
      opening = true;
      buzz.pause(0);
      gsap.to('.call__rings', { opacity: 0, duration: 0.6 });
      gsap.timeline({ onComplete: done })
        .to(inner, { yPercent: 0, duration: 1.5, ease: 'power3.inOut' }, 0)
        .to(closed, { rotationX: 90, duration: 0.55, ease: 'power2.in' }, 0.05)
        .to(base, { opacity: 1, duration: 0.35, ease: 'none' }, 0.2)
        .set(lid, { opacity: 1 }, 0.6)
        .fromTo(lid, { rotationX: -90 }, { rotationX: 0, duration: 1, ease: 'power3.out' }, 0.6)
        .fromTo('[data-ph]', { filter: 'brightness(.1)' }, { filter: 'brightness(1)', duration: 0.5 }, 1.05)
        .fromTo('.call__sub', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.1);
    };
    closed.addEventListener('click', pickUp);
    ScrollTrigger.create({ trigger: '.call', start: 'top 20%', once: true, onEnter: pickUp });
  };

  /* ============ pet changes everywhere ============ */
  document.addEventListener('ib:pet', (e) => {
    screens.forEach((s) => { if (!s.isLitter) s.setPet(e.detail); });
    petLabels();
  });

  /* ============ boot ============ */
  const born = new Date(IB.get('born', Date.now()));
  $('[data-born]').textContent = [born.getDate(), born.getMonth() + 1].map((n) => String(n).padStart(2, '0')).join('.') + '.' + born.getFullYear();
  buildHero();
  petLabels();
  orbit();
  L.on(moodFromLife);
  rule();
  litter();
  day();
  shells();
  worn();
  adopt();
  IB.boot(heroIn);
})();

/* ═══════════════════════════════════════════════════════════════
   I·BYTE — adopt.js (the adoption papers)
   pick a pet, pick a shell, name it, sign. a live device and a
   holographic hatch certificate fill in as you go. then: the egg.
   concept, design & code by ghostly.grl ♥
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, life: L, RM } = IB;
  const ids = () => [...Object.keys(IB.PETS), ...(IB.get('found404', false) ? ['404'] : [])];
  const S = {
    pet: IB.get('pet', 'glitch'),
    shell: IB.get('shell', 'crush'),
    name: IB.get('petname', ''),
    sig: null
  };
  if (!ids().includes(S.pet)) S.pet = 'glitch';
  const NAMES = ['bean', 'pixel', 'mochi', 'nugget', 'gremlin', 'boo', 'tofu', 'jellybean', 'error', 'kiki', 'noodle', 'dot', 'byte', 'princess', 'chaos'];
  let dev, clearSign = () => {}, setNameField = () => {}, selPet = () => {}, selShell = () => {};

  /* ============ live device ============ */
  const build = (drop) => {
    if (dev) dev.screen.stop();
    dev = IB.device($('[data-dev]'), { shell: S.shell, cols: 15, rows: 7, pet: S.pet });
    if (drop && !RM) gsap.fromTo('[data-dev]', { y: -200, opacity: 0, rotation: -8 }, { y: 0, opacity: 1, rotation: 0, duration: 1.1, ease: 'elastic.out(1, .55)' });
  };

  /* ============ the certificate ============ */
  const serial = () => {
    let h = 7;
    for (const c of S.pet + S.shell + S.name) h = (h * 31 + c.charCodeAt(0)) % 99991;
    return 'IB-' + String(h).padStart(5, '0');
  };
  const cert = () => {
    const p = IB.pet(S.pet);
    $('[data-c="name"]').textContent = S.name || '—';
    $('[data-c="kind"]').textContent = `${p.name.toLowerCase()} · ${p.kind}`;
    $('[data-c="shell"]').textContent = IB.SHELLS[S.shell].name.toLowerCase();
    const d = new Date();
    $('[data-c="date"]').textContent = [d.getDate(), d.getMonth() + 1].map((n) => String(n).padStart(2, '0')).join('.') + '.' + d.getFullYear();
    $('[data-serial]').textContent = serial();
    const img = $('[data-c="sig"]');
    if (S.sig) { img.src = S.sig; img.style.opacity = 1; } else img.style.opacity = 0;
    $('[data-cert]').style.setProperty('--glow', IB.SHELLS[S.shell].glow);
  };
  let cf = 0;
  setInterval(() => { cf++; $('[data-cert-pet]').innerHTML = IB.sprite(S.pet, cf % 6 ? 'happy' : 'blink', IB.pet(S.pet).idle[cf % IB.pet(S.pet).idle.length], -1).map(IB.color).join('\n'); }, 520);

  /* ============ 01 pets ============ */
  const pets = () => {
    const box = $('[data-pets]');
    box.innerHTML = ids().map((id) => `<button type="button" role="radio" class="ad-pet" data-pet="${id}" data-cur="${IB.pet(id).name.toLowerCase()}"><pre></pre><b>${IB.pet(id).name}</b><span>${IB.pet(id).kind}</span></button>`).join('');
    let f = 0;
    const draw = () => {
      f++;
      $$('.ad-pet').forEach((b, i) => {
        const id = b.dataset.pet, p = IB.pet(id), on = id === S.pet;
        $('pre', b).innerHTML = IB.sprite(id, on ? 'happy' : (f + i) % 7 ? 'idle' : 'blink', on ? p.trick[f % p.trick.length] : p.idle[(f + i) % p.idle.length], -1).map(IB.color).join('\n');
      });
    };
    const sel = () => { $$('.ad-pet').forEach((b) => b.setAttribute('aria-checked', b.dataset.pet === S.pet)); draw(); };
    selPet = sel;
    sel();
    setInterval(draw, 460);
    $$('.ad-pet').forEach((b) => b.addEventListener('click', () => {
      S.pet = b.dataset.pet;
      sel(); cert();
      dev.screen.setPet(S.pet);
      if (!RM) gsap.fromTo(b, { scale: 0.9 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1.2, .4)' });
    }));
  };

  /* ============ 02 shells ============ */
  const shells = () => {
    const box = $('[data-shells]');
    box.innerHTML = IB.SHELL_IDS.map((id) => {
      const s = IB.SHELLS[id], ph = (IB.SHELL_PHOTOS || {})[id];
      return `<button type="button" role="radio" class="ad-shell" data-shell="${id}" style="--glow:${s.glow}" data-cur="${s.name.toLowerCase()}">${ph ? `<img src="${ph.file}" alt="" />` : ''}<b>${s.name}</b><span>€${s.price}</span></button>`;
    }).join('');
    const sel = () => $$('.ad-shell').forEach((b) => b.setAttribute('aria-checked', b.dataset.shell === S.shell));
    selShell = sel;
    sel();
    $$('.ad-shell').forEach((b) => b.addEventListener('click', () => {
      if (S.shell === b.dataset.shell) return;
      S.shell = b.dataset.shell;
      sel(); cert(); build(true);
    }));
  };

  /* ============ 03 name ============ */
  const name = () => {
    const inp = $('[data-name]');
    inp.value = S.name;
    setNameField = (v) => (inp.value = v);
    inp.addEventListener('input', () => { S.name = inp.value.trim().slice(0, 10); cert(); });
    inp.addEventListener('change', () => dev.screen.say('wow', 1200));
    $('[data-dice]').addEventListener('click', () => {
      let n;
      do n = IB.pick(NAMES); while (n === S.name);
      S.name = n; inp.value = n; cert();
      dev.screen.say('love', 1400);
      if (!RM) IB.scramble($('[data-c="name"]'), n, 0.5);
    });
  };

  /* ============ 04 signature ============ */
  const sign = () => {
    const cv = $('[data-sign]'), ctx = cv.getContext('2d');
    let drawing = false, last = null, dirty = false;
    const size = () => {
      const r = cv.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = r.width * dpr; cv.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = ctx.lineJoin = 'round';
      dirty = false; S.sig = null; cert();
    };
    size();
    addEventListener('resize', () => { if (!dirty) size(); });
    const pt = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.addEventListener('pointerdown', (e) => { drawing = true; last = pt(e); cv.setPointerCapture(e.pointerId); e.preventDefault(); });
    cv.addEventListener('pointermove', (e) => {
      if (!drawing) return;
      const p = pt(e);
      const w = Math.max(1.6, 4.2 - Math.hypot(p[0] - last[0], p[1] - last[1]) * 0.08);
      ctx.shadowColor = '#ff4fa2'; ctx.shadowBlur = 10;
      ctx.strokeStyle = '#ffe6f3'; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(...last); ctx.lineTo(...p); ctx.stroke();
      last = p; dirty = true;
    });
    const end = () => { if (!drawing) return; drawing = false; if (dirty) { S.sig = cv.toDataURL('image/png'); cert(); } };
    cv.addEventListener('pointerup', end);
    cv.addEventListener('pointercancel', end);
    clearSign = () => { ctx.clearRect(0, 0, cv.width, cv.height); dirty = false; S.sig = null; cert(); };
    $('[data-sign-clear]').addEventListener('click', clearSign);
  };

  /* ============ hatch ============ */
  const EGG = ['    .--.    ', "  .'    '.  ", ' /        \\ ', '|          |', '|          |', ' \\        / ', "  '.____.'  "];
  const CR = [[3, 4, '/'], [3, 5, '\\'], [3, 6, '/'], [4, 7, '\\'], [2, 6, '/'], [4, 3, '/'], [3, 8, '\\'], [4, 8, '/'], [2, 3, '\\'], [5, 5, '/']];
  const hatch = () => {
    const inp = $('[data-name]');
    if (!S.name) {
      IB.toast('it needs a name first. ↑ step 03');
      inp.focus();
      if (!RM) gsap.fromTo('.ad-name', { x: -10 }, { x: 0, duration: 0.6, ease: 'elastic.out(1.2, .3)' });
      return;
    }
    // it's official
    IB.set('pet', S.pet); IB.set('shell', S.shell); IB.set('petname', S.name);
    L.full = 4; L.joy = 4; L.poop = 0; L.save();
    document.dispatchEvent(new CustomEvent('ib:pet', { detail: S.pet }));
    const layer = $('[data-hatch-layer]'), egg = $('[data-egg]'), k = $('[data-hatch-k]');
    layer.classList.add('is-on');
    layer.setAttribute('aria-hidden', 'false');
    IB.lenis && IB.lenis.stop();
    const st = { p: 0 };
    const draw = () => {
      const g = EGG.map((l) => [...l].map((c) => (c === '<' ? '&lt;' : c === '>' ? '&gt;' : c)));
      const n = Math.floor(st.p * CR.length);
      for (let i = 0; i < n; i++) { const [r, c, ch] = CR[i]; g[r][c] = `<i>${ch}</i>`; }
      if (n > (draw.n || 0)) IB.sound.crack();
      draw.n = n;
      egg.innerHTML = g.map((r) => r.join('')).join('\n');
      k.textContent = st.p < 1 ? `hatching ${String(Math.floor(st.p * 100)).padStart(2, '0')}%` : '';
    };
    const reveal = () => {
      const p = IB.pet(S.pet);
      egg.innerHTML = ['', ...IB.sprite(S.pet, 'happy', p.trick[0], -1).map(IB.color), ''].join('\n');
      k.innerHTML = `it’s ${/^[aeiou]/.test(p.kind) ? "an" : "a"} ${p.kind}. say hi to <b>${S.name}</b>.`;
      IB.rain();
      IB.sound.hatch();
      IB.toast(`${S.name.toUpperCase()} hatched. ${serial()}. it’s yours forever-ish.`);
      let t = 0;
      layer._loop = setInterval(() => { t++; egg.innerHTML = ['', ...IB.sprite(S.pet, t % 5 ? 'happy' : 'love', p.trick[t % p.trick.length], t % 8 < 4 ? -1 : 1).map(IB.color), ''].join('\n'); }, 420);
    };
    if (RM) { st.p = 1; reveal(); $('[data-hatch-done]').classList.add('is-on'); return; }
    gsap.timeline()
      .fromTo(layer, { clipPath: 'circle(0% at 50% 60%)' }, { clipPath: 'circle(150% at 50% 60%)', duration: 0.9, ease: 'power3.inOut' })
      .add(draw)
      .fromTo(egg, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2)' })
      .to(st, { p: 1, duration: 2, ease: 'power1.in', onUpdate: draw })
      .to(egg, { x: 6, duration: 0.05, repeat: 13, yoyo: true, ease: 'none' }, '-=0.8')
      .to(egg, { scale: 1.25, duration: 0.15, ease: 'power2.in' })
      .add(reveal)
      .fromTo(egg, { scale: 0.7 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1.2, .4)' })
      .add(() => $('[data-hatch-done]').classList.add('is-on'), '+=0.4');
  };

  /* ============ start over: pressing "adopt" again gives you fresh papers ============ */
  const restart = () => {
    const layer = $('[data-hatch-layer]');
    clearInterval(layer._loop);
    const fresh = () => {
      layer.classList.remove('is-on');
      layer.setAttribute('aria-hidden', 'true');
      $('[data-hatch-done]').classList.remove('is-on');
      $$('pre.rain').forEach((n) => n.remove());
      S.pet = 'glitch'; S.shell = 'crush'; S.name = '';
      setNameField(''); clearSign(); selPet(); selShell(); cert(); build(true);
      IB.lenis && IB.lenis.start();
      IB.lenis ? IB.lenis.scrollTo(0, { duration: 1.2 }) : scrollTo({ top: 0, behavior: 'smooth' });
      IB.toast('new papers. pick again.');
      if (!RM) gsap.from('.ad-step', { y: 40, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out', delay: 0.3 });
    };
    if (layer.classList.contains('is-on') && !RM) gsap.to(layer, { clipPath: 'circle(0% at 50% 60%)', duration: 0.7, ease: 'power3.inOut', onComplete: fresh });
    else fresh();
  };
  $$('a[href="adopt.html"]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); restart(); }));
  $('[data-again]').addEventListener('click', restart);

  /* ============ motion ============ */
  const motion = () => {
    if (RM) return;
    gsap.timeline()
      .from('.ad-w', { yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'power4.out' })
      .from('.ad-step', { y: 50, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0.3)
      .from('[data-dev]', { y: -300, opacity: 0, duration: 1.4, ease: 'elastic.out(1, .55)' }, 0.3)
      .from('[data-cert]', { rotationX: 50, y: 80, opacity: 0, duration: 1.2, ease: 'power4.out' }, 0.5)
      .from('.ad-hatch, .ad__info', { opacity: 0, y: 20, duration: 0.8 }, 0.8);
    // the certificate tilts with the mouse, the foil catches the light
    const c = $('[data-cert]');
    c.parentElement.style.perspective = '1000px';
    addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      if (Math.abs(x) > 1.4 || Math.abs(y) > 1.4) return;
      gsap.to(c, { rotationY: x * 16, rotationX: -y * 12, duration: 0.8, ease: 'power3.out' });
      c.style.setProperty('--fx', (x + 0.5) * 100 + '%');
    });
  };

  build(false);
  pets();
  shells();
  name();
  sign();
  cert();
  $('[data-hatch]').addEventListener('click', hatch);
  document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && document.activeElement === $('[data-name]')) hatch(); });
  IB.boot(motion);
})();

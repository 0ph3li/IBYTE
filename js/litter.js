/* ═══════════════════════════════════════════════════════════════
   I·BYTE — litter.js (the litter page)
   six chapters, one per pet: the shell it lives in, hanging on a
   pearl chain and alive; its stats; its quirk; every face it makes.
   concept, design & code by ghostly.grl ♥
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM } = IB;
  const IDS = Object.keys(IB.PETS);
  const SHELL = { glitch: 'crush', cache: 'berry', ctrl: 'moon', spam: 'puff', blip: 'crush', lowbat: 'bite' };
  const QUIRK = {
    glitch: 'when it’s happy it glitches: characters flicker into static. it’s fine. probably.',
    cache: 'eats, then keeps the food in its cheeks for later. the cheeks stay puffed for a while.',
    ctrl: 'swishes its tail, then swats a cup [_] off the table and looks at you. smug.',
    spam: 'sends @ @ @ every few seconds. when it’s upset it squirts ink ░ all over the screen.',
    blip: 'hops everywhere, puffs its throat, and shoots its tongue ----• at anything that moves.',
    lowbat: 'always on 3%: shows you [|  ]. goes to sleep upside down, hanging from a branch.'
  };
  const MOODS = ['idle', 'blink', 'happy', 'sad', 'angry', 'sleep', 'eat', 'chew', 'sick', 'love', 'smug', 'wow'];
  const bar = (n) => '■'.repeat(n) + '□'.repeat(4 - n);
  const screens = [];

  /* pendulum for things on chains */
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
    gsap.ticker.add(() => {
      t += 0.016; v += -a * 0.016; v *= 0.965; a = IB.clamp(a + v, -22, 22);
      gsap.set(el, { rotation: a + Math.sin(t * 1.1) * (o.idle || 1.2) });
    });
    return { kick: (f) => (v += f) };
  };

  /* ============ intro bubbles ============ */
  const bubs = () => {
    const ol = $('[data-bubs]');
    ol.innerHTML = IDS.map((id, i) => `<li><button class="lt-bub" type="button" data-go="${id}" data-cur="meet ${IB.PETS[id].name.toLowerCase()}"><pre data-bub="${id}"></pre></button><span>${String(i + 1).padStart(2, '0')} ${IB.PETS[id].name}</span></li>`).join('');
    let f = 0;
    const hov = {};
    const draw = () => {
      f++;
      $$('[data-bub]').forEach((pre, i) => {
        const id = pre.dataset.bub, p = IB.PETS[id];
        const mood = hov[id] ? 'happy' : (f + i) % 9 === 0 ? 'blink' : 'idle';
        const fr = hov[id] ? p.trick[f % p.trick.length] : p.idle[(f + i) % p.idle.length];
        pre.innerHTML = IB.sprite(id, mood, fr, -1).map(IB.color).join('\n');
      });
    };
    draw();
    setInterval(draw, 420);
    $$('.lt-bub').forEach((b) => {
      const id = b.dataset.go;
      b.addEventListener('pointerenter', () => (hov[id] = 1));
      b.addEventListener('pointerleave', () => (hov[id] = 0));
      b.addEventListener('click', () => {
        const t = $('#pet-' + id);
        IB.lenis ? IB.lenis.scrollTo(t, { duration: 1.6 }) : t.scrollIntoView({ behavior: 'smooth' });
      });
    });
  };

  /* ============ the chapters ============ */
  const chapters = () => {
    const wrap = $('[data-pets]');
    wrap.innerHTML = IDS.map((id, i) => {
      const p = IB.PETS[id], sh = IB.SHELLS[SHELL[id]];
      return `<section class="pet${i % 2 ? ' pet--flip' : ''}" id="pet-${id}" style="--glow:${sh.glow}">
        <div class="pet__ghost" aria-hidden="true">${p.name}</div>
        <div class="pet__info">
          <p class="pet__no">n°${p.no} / 0${IDS.length}</p>
          <h2 class="pet__name chrome-t" aria-label="${p.name}">${[...p.name].map((c) => `<span>${c}</span>`).join('')}</h2>
          <p class="pet__kind">${p.kind}</p>
          <p class="pet__line">${p.line}</p>
          <dl class="pet__stats">
            ${Object.entries(p.stats).map(([k, v]) => `<div><dt>${k}</dt><dd data-bar="${v}">${bar(0)}</dd></div>`).join('')}
          </dl>
          <p class="pet__q"><b>its thing</b>${QUIRK[id]}</p>
          <p class="pet__q"><b>likes</b>${p.likes}</p>
          <div class="pet__btns">
            <button class="btn btn--pearl" type="button" data-adopt="${id}" data-mag=".2" data-cur="adopt">make it mine</button>
            <a class="pet__shell" href="shells.html">lives in <b>${sh.name}</b> →</a>
          </div>
        </div>
        <div class="pet__stage">
          <div class="pet__hang" data-hang><div class="pet__dev" data-dev="${id}"></div></div>
          <p class="pet__tip">press its keys: feed · play · clean. tap the screen to pet it.</p>
        </div>
        <div class="pet__faces">
          <p class="pet__fk">every face it makes <span>(tap one)</span></p>
          <ul>${MOODS.map((m) => `<li><button type="button" data-face="${m}" data-cur="${m}"><pre></pre><span>${m}</span></button></li>`).join('')}</ul>
        </div>
      </section>`;
    }).join('');

    $$('.pet').forEach((sec) => {
      const id = sec.id.slice(4);
      const d = IB.device($('[data-dev]', sec), { shell: SHELL[id], cols: 15, rows: 7, pet: id, chain: 'drop' });
      screens.push(d.screen);
      sec._scr = d.screen;
      const swing = pendulum($('[data-hang]', sec), { k: 0.006, idle: 1 });
      // face sheet: tiny animated tiles; tapping one makes the live pet do it
      const tiles = $$('[data-face]', sec);
      const drawTiles = (f) => tiles.forEach((b, i) => {
        const m = b.dataset.face, p = IB.PETS[id];
        const fr = m === 'happy' || m === 'love' ? p.trick[(f + i) % p.trick.length] : m === 'eat' || m === 'chew' ? (p.stuffed != null ? p.stuffed : 0) : (f + i) % 2;
        $('pre', b).innerHTML = IB.sprite(id, m, fr, -1, m === 'sleep').map(IB.color).join('\n');
      });
      drawTiles(0);
      sec._tiles = drawTiles;
      tiles.forEach((b) => b.addEventListener('click', () => {
        const m = b.dataset.face, s = d.screen;
        if (m === 'eat' || m === 'chew') s.feed();
        else if (m === 'happy') s.play();
        else if (m === 'love') s.love();
        else if (m === 'idle' || m === 'blink') s.say('wow', 900);
        else s.say(m, 2600);
        swing.kick(1.5);
        tiles.forEach((t) => t.classList.toggle('on', t === b));
      }));
      // adopt
      const ab = $('[data-adopt]', sec);
      const label = () => (ab.textContent = IB.get('pet', 'glitch') === id ? 'yours ♥' : 'make it mine');
      label();
      document.addEventListener('ib:pet', label);
      ab.addEventListener('click', () => {
        IB.adopt(id);
        IB.toast(`${IB.PETS[id].name} is yours now. it’s on every screen.`);
        d.screen.love();
        swing.kick(2.5);
      });
      sec._swing = swing;
    });

    // only the chapters on screen keep their lcd running
    let f = 0;
    setInterval(() => { f++; $$('.pet.is-on').forEach((s) => s._tiles(f)); }, 600);
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      e.target.classList.toggle('is-on', e.isIntersecting);
      e.isIntersecting ? e.target._scr.start() : e.target._scr.stop();
    }), { rootMargin: '120px 0px' });
    $$('.pet').forEach((s) => { s._scr.stop(); io.observe(s); });
  };

  /* ============ the 404 card ============ */
  const secret = () => {
    const pre = $('[data-404-pet]');
    let f = 0;
    const found = () => IB.get('pet', '') === '404' || IB.get('found404', false);
    const draw = () => {
      f++;
      let art = IB.sprite(IB.SECRET, f % 7 ? 'idle' : 'wow', f % 2, -1);
      if (!found()) art = art.map((l) => [...l].map((c) => (c !== ' ' && Math.random() < 0.55 ? '#%@&▓░*?'[(Math.random() * 8) | 0] : c)).join(''));
      pre.innerHTML = art.map(IB.color).join('\n');
    };
    const reveal = () => {
      IB.set('found404', true);
      $('[data-404]').classList.add('is-found');
      IB.scramble($('[data-404-name]'), '404', 0.8);
      $('[data-404-line]').textContent = IB.SECRET.line;
      $('[data-404-hint]').textContent = 'you found it. it’s yours now. good luck.';
    };
    if (found()) reveal();
    document.addEventListener('ib:pet', (e) => e.detail === '404' && reveal());
    draw();
    setInterval(draw, 380);
  };

  /* ============ motion ============ */
  const motion = () => {
    if (RM) { $$('[data-bar]').forEach((d) => (d.textContent = bar(+d.dataset.bar))); return; }
    gsap.timeline()
      .from('.lt-w', { yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'power4.out' })
      .from('.lt-bubs li', { scale: 0, opacity: 0, duration: 1, stagger: 0.07, ease: 'back.out(2.4)' }, 0.35)
      .from('.lt-hero__info, .lt-hero__sub', { opacity: 0, y: 16, duration: 0.8, stagger: 0.1 }, 0.5);
    $$('.lt-bub').forEach((b, i) => gsap.to(b, { y: i % 2 ? 12 : -12, duration: 2.4 + i * 0.2, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    gsap.to('.lt-bubs', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: '.lt-hero', start: 'top top', end: 'bottom top', scrub: true } });

    $$('.pet').forEach((sec) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 62%' } });
      tl.from($$('.pet__name span', sec), { yPercent: 100, opacity: 0, rotation: 8, duration: 0.9, stagger: 0.04, ease: 'power4.out' })
        .from($$('.pet__no, .pet__kind, .pet__line, .pet__stats > div, .pet__q, .pet__btns', sec), { y: 22, opacity: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out' }, 0.15)
        .from($('[data-hang]', sec), { y: -480, duration: 1.6, ease: 'elastic.out(1, .5)', onComplete: () => sec._swing.kick(2) }, 0.05)
        .from($$('.pet__faces li', sec), { scale: 0.4, opacity: 0, duration: 0.6, stagger: { each: 0.035, from: 'random' }, ease: 'back.out(2.2)' }, 0.4)
        .add(() => $$('[data-bar]', sec).forEach((d) => {
          const n = +d.dataset.bar, o = { v: 0 };
          gsap.to(o, { v: n, duration: 0.8, ease: 'steps(' + n + ')', onUpdate: () => (d.textContent = bar(Math.round(o.v))) });
        }), 0.5);
      gsap.fromTo($('.pet__ghost', sec), { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    gsap.from('.lt-404__card', { rotationX: 40, y: 120, opacity: 0, duration: 1.3, ease: 'power4.out', scrollTrigger: { trigger: '.lt-404', start: 'top 70%' } });
    gsap.from('.lt-out__go', { yPercent: 60, opacity: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.lt-out', start: 'top 80%' } });
  };

  bubs();
  chapters();
  secret();
  IB.boot(motion);
})();

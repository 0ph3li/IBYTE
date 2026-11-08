/* ═══════════════════════════════════════════════════════════════
   I·BYTE — shells.js (the shells page)
   a keychain rack (five shells on pearl chains, your pet in each),
   then the counter: one shell at a time, sliding sideways.
   concept, design & code by ghostly.grl ♥
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, RM } = IB;
  const IDS = IB.SHELL_IDS;
  const SHOTS = { crush: 'HOME/shell-crush.png', moon: 'HOME/moon-shell.png', berry: 'HOME/berry-shell.png', bite: 'HOME/shell-bite.png', puff: 'HOME/puff-shell.png' };
  const BEST = { crush: 'glitch, blip', moon: 'ctrl', berry: 'cache', bite: 'lowbat', puff: 'spam' };
  const screens = [];

  const pendulum = (el, o = {}) => {
    let a = 0, v = 0, lastX = null, t = Math.random() * 9;
    if (RM) return { kick() {} };
    addEventListener('pointermove', (e) => {
      if (lastX != null) {
        const r = el.getBoundingClientRect();
        if (e.clientY > r.top - 120 && e.clientY < r.bottom + 120 && e.clientX > r.left - 160 && e.clientX < r.right + 160) v += (e.clientX - lastX) * (o.k || 0.008);
      }
      lastX = e.clientX;
    });
    gsap.ticker.add(() => {
      t += 0.016; v += -a * 0.016; v *= 0.965; a = IB.clamp(a + v, -18, 18);
      gsap.set(el, { rotation: a + Math.sin(t * (o.f || 1.1)) * (o.idle || 1) });
    });
    return { kick: (f) => (v += f) };
  };

  /* ============ the rack ============ */
  const rack = () => {
    const row = $('[data-rack]');
    row.innerHTML = IDS.map((id, i) => `<div class="sh-hook" style="--mt:${[12, 3, 16, 5, 10][i]}vh;--glow:${IB.SHELLS[id].glow}" data-hook="${id}"><div class="sh-hook__dev" data-rack-dev="${id}"></div><span class="sh-hook__tag">${IB.SHELLS[id].no} ${IB.SHELLS[id].name}</span></div>`).join('');
    $$('[data-hook]').forEach((h, i) => {
      const id = h.dataset.hook;
      const d = IB.device($('[data-rack-dev]', h), { shell: id, cols: 13, rows: 6, chain: 'drop' });
      screens.push(d.screen);
      const sw = pendulum(h, { k: 0.004, idle: 0.8 + (i % 2) * 0.4, f: 0.9 + i * 0.12 });
      h._sw = sw;
      h.addEventListener('pointerenter', () => { sw.kick(i % 2 ? 0.8 : -0.8); d.screen.say('wow', 900); });
      $('.sh-hook__tag', h).addEventListener('click', () => go(i));
    });
  };

  /* ============ the counter ============ */
  let goTo = () => {};
  const go = (i) => goTo(i);
  const counter = () => {
    const track = $('[data-track]');
    track.innerHTML = IDS.map((id, i) => {
      const s = IB.SHELLS[id];
      return `<article class="sh-panel" style="--glow:${s.glow}" data-panel="${id}">
        <div class="sh-panel__photo slot slot--dark bitable" data-img="${SHOTS[id]}" data-note="${s.name} studio shot"></div>
        <div class="sh-panel__dev"><div data-counter-dev="${id}"></div></div>
        <div class="sh-panel__info">
          <p class="sh-panel__no">${s.no} / 0${IDS.length}</p>
          <h2 class="sh-panel__name chrome-t">${s.name}</h2>
          <p class="sh-panel__note">${s.note}</p>
          <ul class="sh-panel__traits">${s.traits.map((t) => `<li>${t}</li>`).join('')}</ul>
          <dl class="sh-panel__spec">
            <div><dt>price</dt><dd>€${s.price}</dd></div>
            <div><dt>best with</dt><dd>${BEST[id]}</dd></div>
            <div><dt>glow</dt><dd><i style="background:${s.glow}"></i>${s.glow}</dd></div>
          </dl>
          <button class="btn btn--pink" type="button" data-wear="${id}" data-mag=".2" data-cur="wear">wear this shell</button>
        </div>
      </article>`;
    }).join('');
    $('[data-dots]').innerHTML = IDS.map((id) => `<button type="button" aria-label="${IB.SHELLS[id].name}" data-cur="${IB.SHELLS[id].name.toLowerCase()}"></button>`).join('');
    IB.slots();
    $$('[data-counter-dev]').forEach((el) => screens.push(IB.device(el, { shell: el.dataset.counterDev, cols: 15, rows: 7 }).screen));
    const label = () => $$('[data-wear]').forEach((b) => (b.textContent = IB.get('shell', 'crush') === b.dataset.wear ? 'you’re wearing it ♥' : 'wear this shell'));
    label();
    $$('[data-wear]').forEach((b) => b.addEventListener('click', () => {
      IB.set('shell', b.dataset.wear);
      label();
      IB.toast(`${IB.SHELLS[b.dataset.wear].name} on. your pet moved in.`);
      if (!RM) gsap.fromTo(b.closest('.sh-panel').querySelector('.sh-panel__dev'), { scale: 0.92 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1.2, .4)' });
    }));

    const set = (i) => {
      $('[data-count]').textContent = String(i + 1).padStart(2, '0');
      $$('[data-dots] button').forEach((b, j) => b.classList.toggle('on', j === i));
      $('[data-counter]').style.setProperty('--glow', IB.SHELLS[IDS[i]].glow);
    };
    set(0);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', () => {
      if (RM) return;
      const n = IDS.length;
      const st = ScrollTrigger.create({
        trigger: '[data-counter]', start: 'top top', end: () => '+=' + innerWidth * (n - 1) * 1.1, pin: '.sh-counter__pin', scrub: 0.8,
        animation: gsap.to(track, { xPercent: (-100 * (n - 1)) / n, ease: 'none' }),
        snap: { snapTo: 1 / (n - 1), duration: { min: 0.3, max: 0.7 }, ease: 'power2.inOut' },
        onUpdate: (s) => set(Math.round(s.progress * (n - 1)))
      });
      goTo = (i) => {
        const y = st.start + (st.end - st.start) * (i / (n - 1));
        IB.lenis ? IB.lenis.scrollTo(y, { duration: 1.4 }) : scrollTo(0, y);
      };
      // the panel in the middle comes forward, the others sink back
      $$('.sh-panel').forEach((p, i) => {
        gsap.fromTo($('.sh-panel__dev', p), { rotation: -10, scale: 0.85 }, {
          rotation: 0, scale: 1, ease: 'none',
          scrollTrigger: { trigger: '[data-counter]', start: () => st.start + (st.end - st.start) * ((i - 1) / (n - 1)), end: () => st.start + (st.end - st.start) * (i / (n - 1)), scrub: true }
        });
      });
      return () => { goTo = () => {}; };
    });
    mm.add('(max-width: 860px)', () => {
      goTo = (i) => { const t = $$('.sh-panel')[i]; IB.lenis ? IB.lenis.scrollTo(t, { duration: 1.4 }) : t.scrollIntoView(); };
      const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && set(IDS.indexOf(e.target.dataset.panel))), { threshold: 0.5 });
      $$('.sh-panel').forEach((p) => io.observe(p));
    });
    $$('[data-dots] button').forEach((b, i) => b.addEventListener('click', () => go(i)));
  };

  /* ============ motion ============ */
  const motion = () => {
    if (RM) return;
    gsap.timeline()
      .from('.sh-w', { yPercent: 110, duration: 1.2, ease: 'power4.out' })
      .from('[data-hook]', { y: -700, duration: 1.8, stagger: 0.09, ease: 'elastic.out(1, .45)', onComplete() { this.targets().forEach((h, i) => h._sw && h._sw.kick(i % 2 ? 1 : -1)); } }, 0.2)
      .from('.sh-rack__info, .sh-rack__sub', { opacity: 0, y: 14, duration: 0.8, stagger: 0.1 }, 0.5);
    gsap.from('.sh-box__list li', { y: 40, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: '.sh-box', start: 'top 70%' } });
    gsap.to('[data-marquee]', { xPercent: -50, duration: 22, repeat: -1, ease: 'none' });
    gsap.from('.sh-out__go', { yPercent: 60, opacity: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.sh-out', start: 'top 80%' } });
  };

  const mq = $('[data-marquee]');
  mq.textContent = mq.textContent.repeat(6);
  rack();
  counter();
  document.addEventListener('ib:pet', (e) => screens.forEach((s) => s.setPet(e.detail)));
  IB.boot(motion);
})();

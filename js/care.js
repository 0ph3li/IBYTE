/* ═══════════════════════════════════════════════════════════════
   I·BYTE — care.js (the care guide)
   a manual you do instead of read: your pet in your shell sticks on
   screen, and each step happens to it as you scroll past.
   concept, design & code by ghostly.grl ♥
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const { $, $$, life: L, RM } = IB;
  const petId = () => IB.get('pet', 'glitch');
  const t0 = Date.now();

  /* ============ right now: live meters + countdowns ============ */
  const now = () => {
    const verdict = (l) => (l.hungry() ? 'hungry. it bites. ↓ step 01' : l.poop >= 2 ? 'it made a mess. ↓ step 03' : l.joy <= 1 ? 'bored. ↓ step 02' : 'alive & fine. keep it that way.');
    L.on((l) => {
      $('[data-now="full"]').textContent = IB.meter(l.full);
      $('[data-now="joy"]').textContent = IB.meter(l.joy);
      $('[data-now="poop"]').textContent = IB.meter(l.poop, 3);
      $('[data-now-verdict]').textContent = verdict(l);
      $('.cr-now').classList.toggle('is-angry', l.hungry());
    });
    $('[data-now-name]').textContent = IB.pet(petId()).name;
    const P = { full: [40, '−1'], joy: [55, '−1'], poop: [70, '+1'] };
    const tick = () => {
      const s = Math.floor((Date.now() - t0) / 1000);
      Object.entries(P).forEach(([k, [per, sign]]) => ($(`[data-next="${k}"]`).textContent = `${sign} in ${String(per - (s % per)).padStart(2, '0')}s`));
    };
    tick();
    setInterval(tick, 1000);
  };

  /* ============ the steps ============ */
  let dev;
  const keys = $$('.cr-keys span');
  const flash = (i) => { const k = keys[i]; if (!k || RM) return; gsap.fromTo(k, { scale: 1.3, backgroundColor: '#ff4fa2', color: '#fff' }, { scale: 1, backgroundColor: 'rgba(255,255,255,.08)', color: '#f7f2f7', duration: 0.8, ease: 'power3.out' }); };
  const dark = (on) => { document.body.classList.toggle('is-dark', on); };
  const ACT = {
    0: () => { L.feed(); dev.screen.feed(); flash(0); IB.toast(L.full >= 4 ? 'full. it’s full. stop.' : 'nom. +1 full'); },
    1: () => { L.play(); dev.screen.play(); flash(1); IB.toast('it had fun. +1 joy'); },
    2: () => { const had = L.poop; L.clean(); dev.screen.clean(); flash(2); IB.toast(had ? 'clean. it sparkles.' : 'nothing to clean. it’s showing off'); },
    love: () => { dev.screen.love(); IB.toast('♥ ♥ ♥'); },
    sleep: () => { dark(true); dev.screen.say('sleep', 4200); IB.toast('lights out. shh.'); setTimeout(() => dark(false), 4200); },
    bite: (btn) => {
      dev.screen.say('angry', 2600);
      const card = btn.closest('.cr-step'), r = card.getBoundingClientRect();
      if ((card._bites || []).length < 9) IB.bite(card, r.right - 2, r.top + r.height * (0.3 + Math.random() * 0.4));
      L.bites++; L.save();
      IB.toast('chomp. that’s what it does. feed it and it stops.');
    }
  };
  const steps = () => {
    dev = IB.device($('[data-care-dev]'), { shell: IB.get('shell', 'crush'), cols: 15, rows: 7, buttons: (i) => ACT[i]() });
    dev.screen.poops = L.poop;
    document.addEventListener('ib:pet', (e) => dev.screen.setPet(e.detail));
    $$('[data-try]').forEach((b) => b.addEventListener('click', () => ACT[b.dataset.try](b)));
    const names = $$('.cr-step h2').map((h) => h.firstChild.textContent.trim());
    // scrolling onto a step does it once, so the manual demonstrates itself
    $$('.cr-step').forEach((st, i) => {
      ScrollTrigger.create({
        trigger: st, start: 'top 55%', end: 'bottom 45%',
        onToggle: (s) => {
          st.classList.toggle('is-on', s.isActive);
          if (!s.isActive) return;
          $('[data-step-no]').textContent = String(i + 1).padStart(2, '0');
          IB.scramble($('[data-step-name]'), names[i], 0.4);
          if (st._done) return;
          st._done = true;
          const k = st.dataset.step;
          if (k === 'feed') ACT[0]();
          else if (k === 'play') ACT[1]();
          else if (k === 'clean') { dev.screen.poops = Math.max(1, dev.screen.poops); setTimeout(() => ACT[2](), 900); }
          else if (k === 'love') ACT.love();
          else if (k === 'sleep') ACT.sleep();
          else if (k === 'bite') ACT.bite($('[data-try="bite"]', st));
        }
      });
    });
  };

  /* ============ read the face ============ */
  const FACES = [
    ['idle', 'nothing’s wrong.', 'carry on. glance at it now and then.'],
    ['happy', 'it’s having a good one.', 'whatever you did, again.'],
    ['love', 'it loves you right now.', 'screenshot it. it won’t last.'],
    ['sad', 'bored. a little cloud follows it.', 'play with it ●'],
    ['angry', 'hungry. dangerously.', 'feed it − before it bites.'],
    ['sick', 'the screen is dirty.', 'clean up +'],
    ['sleep', 'asleep.', 'leave it. waking it is rude.'],
    ['eat', 'eating.', 'wait for all four bites.'],
    ['smug', 'it knows something you don’t.', 'nothing. you’ll never know.'],
    ['wow', 'something changed: a new shell, a new page.', 'let it look around.']
  ];
  const faces = () => {
    const ul = $('[data-faces]');
    ul.innerHTML = FACES.map(([m, mean, fix]) => `<li class="cr-face bitable" data-face="${m}"><pre></pre><div><b>${m}</b><p>${mean}</p></div><p class="cr-face__fix">${fix}</p></li>`).join('');
    let f = 0;
    const draw = () => {
      f++;
      const id = petId(), p = IB.pet(id);
      $$('.cr-face').forEach((li, i) => {
        const m = li.dataset.face, hot = li.classList.contains('is-hot');
        const fr = hot && (m === 'happy' || m === 'love') ? p.trick[f % p.trick.length] : (f + i) % 2;
        $('pre', li).innerHTML = IB.sprite(id, m, fr, -1, m === 'sleep').map(IB.color).join('\n');
      });
    };
    draw();
    setInterval(draw, 500);
    $$('.cr-face').forEach((li) => {
      li.addEventListener('pointerenter', () => li.classList.add('is-hot'));
      li.addEventListener('pointerleave', () => li.classList.remove('is-hot'));
      li.addEventListener('click', () => { $$('.cr-face').forEach((x) => x.classList.toggle('is-open', x === li && !li.classList.contains('is-open'))); });
    });
  };

  /* ============ motion ============ */
  const motion = () => {
    if (RM) return;
    gsap.timeline()
      .from('.cr-w', { yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'power4.out' })
      .from('.cr-now', { y: 60, opacity: 0, rotationX: 30, duration: 1.1, ease: 'power4.out' }, 0.3)
      .from('.cr-hero__info, .cr-hero__sub', { opacity: 0, y: 14, duration: 0.8, stagger: 0.1 }, 0.5);
    gsap.from('.cr-stage', { y: 120, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.cr-steps', start: 'top 70%' } });
    $$('.cr-step').forEach((st) => gsap.from(st.children, { y: 40, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: st, start: 'top 80%' } }));
    gsap.from('.cr-face', { x: -40, opacity: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out', scrollTrigger: { trigger: '.cr-faces__list', start: 'top 80%' } });
    gsap.from('.cr-out__go', { yPercent: 60, opacity: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.cr-out', start: 'top 80%' } });
    // the device leans toward the step you're on
    gsap.to('[data-care-dev]', { rotation: 6, ease: 'none', scrollTrigger: { trigger: '.cr-steps', start: 'top top', end: 'bottom bottom', scrub: true } });
  };

  now();
  steps();
  faces();
  IB.boot(motion);
})();

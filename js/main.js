/* ═══════════════════════════════════════════════════════════════
   I·BYTE — main.js (shared engine)
   concept, design & code by ghostly.grl ♥

   window.IB  ·  localStorage prefix "ib-"
   - ascii pets (IB.PETS) + the tiny LCD renderer (IB.Screen)
   - pearl / chrome shells drawn in svg (IB.shellSVG / IB.device)
   - the life model: full / joy / poop, decays in real time (IB.life)
   - bites: when it's hungry it chews whatever you hover (IB.bite)
   - loader, cursor, nav, lenis, scramble, magnetic, slots, konami
   ═══════════════════════════════════════════════════════════════ */
(() => {
  const IB = (window.IB = {});
  const RM = (IB.RM = matchMedia('(prefers-reduced-motion: reduce)').matches);
  const $ = (IB.$ = (s, r = document) => r.querySelector(s));
  const $$ = (IB.$$ = (s, r = document) => [...r.querySelectorAll(s)]);
  const clamp = (IB.clamp = (v, a, b) => Math.max(a, Math.min(b, v)));
  const rand = (IB.rand = (a, b) => a + Math.random() * (b - a));
  const pick = (IB.pick = (a) => a[(Math.random() * a.length) | 0]);
  const S = String.raw;
  let uid = 0;

  /* ---------- store ---------- */
  IB.get = (k, d) => {
    try { const v = localStorage.getItem('ib-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
  };
  IB.set = (k, v) => { try { localStorage.setItem('ib-' + k, JSON.stringify(v)); } catch (e) {} };
  if (!IB.get('born')) IB.set('born', Date.now());

  /* ═══════════════ the litter: ascii pets ═══════════════
     {f} is the face: always 3 characters, swapped per mood.
     f[] are the frames (all the same height), drawn facing left;
     IB.mirror flips them. walk / idle / trick are frame sequences. */
  const FACES = {
    idle: '•.•', blink: '-.-', happy: '^‿^', sad: 'T.T', angry: '>.<', sleep: '-‿-',
    eat: '°o°', chew: '^∪^', sick: 'x.x', love: '♥‿♥', smug: '¬‿¬', wow: 'O.O'
  };
  IB.PETS = {
    glitch: {
      name: 'GLITCH', kind: 'bunny', no: '01',
      line: 'flickers when it’s happy. nobody knows why.',
      likes: 'static, carrots, being stared at',
      stats: { appetite: 3, mess: 2, drama: 4 },
      f: [
        [S`  (\ /)  `, S` ( {f} ) `, S` /  ♥  \ `, S` (")_(")o`],
        [S`  (\ /)  `, S` ( {f} ) `, S` /  ♥  \ `, S`(")   (")o`],
        [S`  (\_/)  `, S` ( {f} ) `, S` /  ♥  \ `, S` (")_(")o`],
        [S`  (\ /)  `, S`\( {f} )/`, S`    ♥    `, S` (")_(")o`]
      ],
      nap: [S`         `, S`  (\ /)    `, S` ( {f} )__ `, S`(___(")(")o`],
      walk: [0, 1], idle: [0, 0, 2, 0, 0, 0, 2], trick: [3, 0, 3, 0], hop: true
    },
    cache: {
      name: 'CACHE', kind: 'hamster', no: '02',
      line: 'hoards everything you feed it. for later.',
      likes: 'seeds, cookies (the browser kind)',
      stats: { appetite: 4, mess: 3, drama: 1 },
      f: [
        [S`  ()___()  `, S` ( ={f}= ) `, S` (  u  u ) `, S`  (")_(")  `],
        [S`  ()___()  `, S` ( ={f}= ) `, S` (  u  u ) `, S` (")   (") `],
        [S`  ()___()  `, S` ((={f}=)) `, S` (  u  u ) `, S`  (")_(")  `],
        [S`  ()___()  `, S` ( ={f}= ) `, S` (  u•u  ) `, S`  (")_(")  `]
      ],
      nap: [S`           `, S`  ()___()  `, S` ( ={f}= )_ `, S`(____(")(")`],
      walk: [0, 1], idle: [0, 0, 3, 3, 0, 0], trick: [2, 2, 3, 3], stuffed: 2
    },
    ctrl: {
      name: 'CTRL', kind: 'cat', no: '03',
      line: 'undoes your whole day. on purpose.',
      likes: 'warm laptops, keyboards, pushing things off tables',
      stats: { appetite: 2, mess: 3, drama: 4 },
      f: [
        [S`  /\_/\    `, S` ( {f} )   `, S` /     \ ) `, S`(")___(")/ `],
        [S`  /\_/\    `, S` ( {f} )   `, S` /     \ ) `, S` (")  (")/ `],
        [S`  /\_/\    `, S` ( {f} )   `, S` /     \  (`, S`(")___(")_)`],
        [S`  /\_/\    `, S`c( {f} )   `, S` \     \ ) `, S`  ")___(")/`]
      ],
      nap: [S`           `, S`   /\_/\   `, S` _( {f} )_ `, S`(___(")(")~)`],
      walk: [0, 1], idle: [0, 0, 2, 0, 0, 2, 2], trick: [3, 3, 0, 3], knock: true
    },
    spam: {
      name: 'SPAM', kind: 'octopus', no: '04',
      line: 'eight arms. eight messages. per second.',
      likes: 'full inboxes, ink, unsubscribe buttons (ignored)',
      stats: { appetite: 3, mess: 4, drama: 3 },
      f: [
        [S`   .-"-.   `, S`  ( {f} )  `, S`  ) ||| (  `, S` (/(/ \)\) `],
        [S`   .-"-.   `, S`  ( {f} )  `, S`  ( ||| )  `, S` \)\) (/(/ `],
        [S`  .-'"'-.  `, S`  ( {f} )  `, S`  ) ||| (  `, S` (/(/ \)\) `],
        [S` \ .-"-. / `, S` \( {f} )/ `, S`   )|||(   `, S`   (/ \)   `]
      ],
      nap: [S`           `, S`   .-"-.   `, S`  ( {f} )  `, S`~(/(/_\)\)~`],
      walk: [0, 1], idle: [0, 0, 2, 0, 2, 0], trick: [3, 0, 3, 0], spam: true, ink: true
    },
    blip: {
      name: 'BLIP', kind: 'frog', no: '05',
      line: 'catches every bug you leave lying around.',
      likes: 'flies, rain, the sound of a dial-up modem',
      stats: { appetite: 4, mess: 2, drama: 1 },
      f: [
        [S`  .-. .-.  `, S` (  {f}  ) `, S` ( >___< ) `, S` ^^     ^^ `],
        [S`  .-. .-.  `, S` (  {f}  ) `, S` ( >___< ) `, S`  ^^   ^^  `],
        [S`  .-. .-.  `, S` (  {f}  ) `, S` ((  O  )) `, S` ^^     ^^ `],
        [S`  .-. .-.  `, S` (  {f}  ) `, S` ( >___< ) `, S`//       \\`]
      ],
      nap: [S`           `, S`  .-. .-.  `, S` (  {f}  ) `, S`(_>_____<_)`],
      walk: [0, 1], idle: [0, 0, 0, 2, 2, 0], trick: [3, 0, 3, 0], hop: true, tongue: true
    },
    lowbat: {
      name: 'LOWBAT', kind: 'bat', no: '06',
      line: 'always on 3%. sleeps upside down.',
      likes: 'dark mode, chargers, just hanging out',
      stats: { appetite: 1, mess: 1, drama: 2 },
      f: [
        ["/\\  /\\_/\\  /\\", S`\ \( {f} )/ /`, S` \_/'---'\_/ `, S`     " "     `],
        [S`    /\_/\    `, S`  _( {f} )_  `, "/\\/\\'---'/\\/\\", S`     " "     `],
        ["/\\  /\\_/\\  /\\", S`\ \( {f} )/ /`, S` \_/'---'\_/ `, S`    "   "    `],
        [S`\   /\_/\   /`, S` \_( {f} )_/ `, S`   \'---'/   `, S`     " "     `]
      ],
      nap: [S`     " "     `, S`   .(   ).   `, S`  ( ({f}) )  `, S`   '.\_/.'   `, S`    \/-\/    `],
      walk: [0, 1], idle: [0, 1, 0, 1, 2, 1], trick: [3, 1, 3, 1], float: true, hang: true, battery: true
    }
  };
  IB.SECRET = {
    name: '404', kind: 'unknown', no: '??', line: 'not found. found you.', likes: '↑↑↓↓←→←→ba',
    stats: { appetite: 4, mess: 4, drama: 4 },
    f: [
      [S`  _____  `, S` |[404]| `, S` ( {f} ) `, S` /|   |\ `],
      [S`  _____  `, S` |[404]| `, S` ( {f} ) `, S` \|   |/ `],
      [S`  _____  `, S` |[4 4]| `, S` ( {f} ) `, S` /|   |\ `],
      [S`  _____  `, S` |[???]| `, S`\( {f} )/`, S`  |   |  `]
    ],
    walk: [0, 1], idle: [0, 2, 0, 0], trick: [3, 3, 0, 3], fade: true
  };
  IB.pet = (id) => (id === '404' ? IB.SECRET : IB.PETS[id] || IB.PETS.glitch);

  const SWAP = { '(': ')', ')': '(', '<': '>', '>': '<', '/': '\\', '\\': '/', '[': ']', ']': '[', '{': '}', '}': '{', '`': '´', '´': '`', "'": "'" };
  IB.mirror = (lines) => lines.map((l) => [...l].reverse().map((c) => SWAP[c] || c).join(''));

  /* sprite for a pet in a mood, frame n, facing -1 (left) / 1 (right) */
  IB.sprite = (pet, mood = 'idle', frame = 0, dir = -1, nap = false) => {
    const p = typeof pet === 'string' ? IB.pet(pet) : pet;
    const faces = p.faces || FACES;
    const f = faces[mood] || faces.idle;
    const src = nap && p.nap ? p.nap : p.f[((frame % p.f.length) + p.f.length) % p.f.length];
    let art = src.map((l) => l.replace('{f}', f));
    const w = Math.max(...art.map((l) => [...l].length));
    art = art.map((l) => l + ' '.repeat(w - [...l].length));
    return dir > 0 ? IB.mirror(art) : art;
  };

  /* ═══════════════ the LCD ═══════════════ */
  const ART = {
    food: [S`.--.`, S`(##)`],
    bite1: [S`.--`, S`(##`], bite2: [S`.-`, S`(#`], bite3: [S`.`, S`(`],
    ball: ['o'],
    poop: [S` ~ `, S`(@)`], poop2: [S`~  `, S`(@)`],
    cloud: ['☁'], drop: [','],
    zz: ['z'], ZZ: ['Z'], bang: ['!'], note: ['♪'], q: ['?'], heart: ['♥'], spark: ['✦'], dots: ['...'], one: ['(1)'], steam: ['~'], cup: ['[_]'], mail: ['@'], ink: ['░'], bat: ['[|  ]'], batfull: ['[|||]']
  };
  const ACCENT = new Set(['♥', '!', '♪', '✦', '?', '♫', '1']);
  const GL = '#%@&▓░*';
  const esc = (c) => (c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c);
  IB.color = (line) => [...line].map((c) => (ACCENT.has(c) && c !== '1' ? `<i>${c}</i>` : esc(c))).join('');

  class Screen {
    constructor(pre, o = {}) {
      this.pre = pre;
      this.cols = o.cols || 20;
      this.rows = o.rows || 8;
      this.petId = o.pet || 'glitch';
      this.x = o.x != null ? o.x : Math.floor(this.cols / 2) - 4;
      this.dir = -1;
      this.step = 0;
      this.fi = 0;
      this.mood = 'idle';
      this.act = null;
      this.fx = [];
      this.trail = [];
      this.poops = 0;
      this.ground = o.ground !== false;
      this.walk = o.walk !== false;
      this.speed = o.speed || 400;
      this.blinkIn = 6;
      this.t = 0;
      this.beh = { type: 'walk', n: 6 };
      this.hooks = o;
      this.paused = false;
      this.render();
      if (o.auto !== false) this.start();
    }
    get pet() { return IB.pet(this.petId); }
    setPet(id) { this.petId = id; this.fx = []; this.trail = []; this.x = clamp(this.x, 0, Math.max(0, this.cols - this.w())); this.say('wow', 900); }
    start() {
      if (this.timer) return;
      const loop = () => { if (!this.paused) this.tick(); this.timer = setTimeout(loop, this.pet.slow ? this.speed * 1.45 : this.speed); };
      this.timer = setTimeout(loop, this.speed);
    }
    stop() { clearTimeout(this.timer); this.timer = null; }
    say(type, ms = 2600) { this.act = { type, until: performance.now() + ms, t: 0 }; this.tick(true); }
    emote(art, ttl = 4, vy = -1) {
      const x = clamp(this.x + Math.floor(this.w() / 2) + (this.dir < 0 ? -1 : 1), 0, this.cols - art[0].length);
      this.fx.push({ art, x, y: this.top() - 1, vy, ttl, kind: 'emote' });
    }
    feed() {
      const x = clamp(this.dir < 0 ? this.x - 3 : this.x + this.w(), 0, this.cols - 4);
      this.fx.push({ art: ART.food, x, y: 0, vy: 1, kind: 'food', stage: 0 });
      this.say('eat', 3600);
    }
    play() { this.say('play', 3600); this.ball = { x: clamp(this.x + (this.dir > 0 ? this.w() + 1 : -2), 0, this.cols - 1), y: 2, vx: this.dir, vy: 0 }; }
    clean() { this.say('clean', 2000); this.sweep = this.cols + 2; }
    love() { this.say('love', 2000); }
    w() { return this.pet.f[0][0].length; }
    h() { return this.pet.f[0].length; }
    gy() { return this.ground ? this.rows - 1 : this.rows; }
    top() { return this.gy() - this.h() - this.lift(); }
    lift() {
      const a = this.act, p = this.pet;
      let j = 0;
      if (a && (a.type === 'play' || a.type === 'love') && p.hop !== false) j = this.t % 2;
      if (this.beh.type === 'trick' && p.hop) j = this.t % 2;
      if (p.float) j += Math.round((Math.sin(this.t * 0.9) + 1) / 2);
      return j;
    }
    face() {
      const a = this.act;
      if (a) {
        if (a.type === 'eat') return this.t % 2 ? 'eat' : 'chew';
        if (a.type === 'play' || a.type === 'love') return a.type === 'love' ? 'love' : 'happy';
        if (a.type === 'clean') return 'happy';
        if (['sleep', 'angry', 'sad', 'sick', 'wow', 'smug'].includes(a.type)) return a.type;
      }
      if (this.mood !== 'idle') return this.mood;
      if (this.beh.type === 'trick') return 'happy';
      if (this.blinkIn <= 0) return 'blink';
      return this.beh.type === 'sit' && this.beh.smug ? 'smug' : 'idle';
    }
    napping() { const a = this.act; return (a && a.type === 'sleep') || this.mood === 'sleep'; }
    frameIndex() {
      const p = this.pet, a = this.act;
      if (a && a.type === 'eat' && p.stuffed != null) return p.stuffed;
      if (this.stuffed > 0 && p.stuffed != null) return p.stuffed;
      if (a && (a.type === 'play' || a.type === 'love')) return p.trick[this.t % p.trick.length];
      if (this.beh.type === 'trick') return p.trick[this.beh.i % p.trick.length];
      if (this.moving) return p.walk[this.step % p.walk.length];
      return p.idle[this.t % p.idle.length];
    }
    sprite() { return IB.sprite(this.pet, this.face(), this.frameIndex(), this.dir, this.napping()); }
    behave() {
      const b = this.beh;
      if (--b.n > 0) { b.i = (b.i || 0) + 1; return; }
      const r = Math.random();
      if (r < 0.46) this.beh = { type: 'walk', n: 4 + ((Math.random() * 8) | 0) };
      else if (r < 0.76) this.beh = { type: 'sit', n: 4 + ((Math.random() * 6) | 0), smug: Math.random() < 0.3 };
      else if (r < 0.9) this.beh = { type: 'trick', n: 4, i: 0 };
      else { this.dir *= -1; this.beh = { type: 'sit', n: 3 }; }
      if (this.beh.type === 'sit' && Math.random() < 0.45) this.emote(pick([ART.note, ART.q, ART.heart, ART.spark]), 3);
      if (this.beh.type === 'trick' && this.pet.zip) this.zip = 3;
      if (this.beh.type === 'trick' && this.pet.knock) {
        const cx = this.dir < 0 ? this.x - 3 : this.x + this.w();
        if (cx >= 0 && cx <= this.cols - 3) this.fx.push({ art: ART.cup, x: cx, y: this.gy() - 1, vy: 0, ttl: 7, kind: 'cup', d: this.dir });
      }
    }
    tick(noStep) {
      const now = performance.now();
      if (this.act && this.act.until && now > this.act.until) this.act = null;
      const a = this.act, p = this.pet;
      if (!noStep) {
        this.t++;
        this.blinkIn = this.blinkIn <= 0 ? 4 + ((Math.random() * 6) | 0) : this.blinkIn - 1;
        if (this.stuffed > 0) this.stuffed--;
        const sleeping = this.napping();
        if (!a && !sleeping && this.mood === 'idle') this.behave();
        // walking
        this.moving = false;
        const wants = a ? ['play', 'angry'].includes(a.type) : this.beh.type === 'walk' || this.zip > 0;
        if (this.walk && !sleeping && wants) {
          let sp = a ? 2 : this.zip > 0 ? 3 : 1;
          if (p.slow && Math.random() < 0.5) sp = 0;
          if (sp) {
            const ox = this.x;
            this.x += this.dir * sp;
            this.moving = true;
            this.step++;
            if (p.trail) this.trail.push({ x: ox + Math.floor(this.w() / 2), life: 7 });
          }
          if (this.zip > 0) this.zip--;
          const max = this.cols - this.w() - (this.poops ? 3 * Math.min(this.poops, 2) : 0);
          if (this.x <= 0) { this.x = 0; this.dir = 1; }
          if (this.x >= max) { this.x = Math.max(0, max); this.dir = -1; }
          if (!a && Math.random() < 0.08) this.dir *= -1;
        }
        if (a) a.t++;
        // pet quirks
        if (p.notify && !a && this.t % 13 === 0) this.emote(ART.one, 3, 0);
        if (p.slow && !a && this.t % 11 === 0) this.emote(ART.dots, 3, 0);
        if (p.spam && !a && this.t % 9 === 0) for (let i = 0; i < 3; i++) this.fx.push({ art: ART.mail, x: clamp(this.x + 2 + i * 3, 0, this.cols - 1), y: this.top() - 1 + (i % 2), vy: -1, vx: (i - 1) * 0.5, ttl: 3 });
        if (p.battery && !a && !sleeping && this.t % 15 === 0) this.emote(ART.bat, 3, 0);
        if (p.battery && a && a.type === 'eat' && a.t === 2) this.emote(ART.batfull, 4, 0);
        if (p.ink && ((a && ['angry', 'sad'].includes(a.type)) || this.beh.type === 'trick') && this.t % 2 === 0)
          this.fx.push({ art: ART.ink, x: clamp(this.x + (this.dir < 0 ? this.w() : -1), 0, this.cols - 1), y: this.gy() - 1 - (this.t % 3), vy: 0, vx: -this.dir * 0.5, ttl: 4, kind: 'cloud' });
        // effects
        this.fx.forEach((f) => {
          if (f.kind === 'food') {
            if (f.y < this.gy() - 2) f.y += 1;
            else { f.stage++; if (f.stage % 2 === 0) { const st = [ART.food, ART.bite1, ART.bite2, ART.bite3]; f.art = st[Math.min(3, f.stage / 2)]; if (f.stage >= 8) f.done = true; } }
            return;
          }
          if (f.kind === 'cup' && f.life === 2) { f.vx = f.d * 2; f.vy = -1; this.say('smug', 1400); }
          if (f.kind === 'cup' && f.life > 2) f.vy += 1;
          f.y += f.vy || 0; f.x += f.vx || 0; f.life = (f.life || 0) + 1;
        });
        this.fx = this.fx.filter((f) => (f.kind === 'food' ? !f.done : f.life < (f.ttl || 4) && f.y > -2 && f.y < this.rows + 1 && f.x > -4 && f.x < this.cols + 1));
        if (a && a.type === 'eat' && p.stuffed != null && a.t === 1) this.stuffed = 8;
        if (a && a.type === 'eat' && a.t % 3 === 2) this.fx.push({ art: [pick(['.', ',', "'"])], x: clamp(this.x + (this.dir < 0 ? -1 : this.w()), 0, this.cols - 1), y: this.gy() - 2, vy: 1, vx: this.dir * -1, ttl: 2 });
        if (a && a.type === 'play' && a.t % 3 === 0) this.emote(ART.note, 3);
        if (a && a.type === 'love') this.fx.push({ art: ART.heart, x: clamp(this.x + ((Math.random() * this.w()) | 0), 0, this.cols - 1), y: this.top() - 1, vy: -1, ttl: 4 });
        if (sleeping && this.t % 2 === 0) this.fx.push(p.hang
          ? { art: this.t % 4 ? ART.zz : ART.ZZ, x: clamp(this.x + this.w() + ((this.t / 2) % 2), 0, this.cols - 1), y: 2, vy: 1, vx: 0.5, ttl: 4 }
          : { art: this.t % 4 ? ART.zz : ART.ZZ, x: clamp(this.x + this.w() - 2 + ((this.t / 2) % 2), 0, this.cols - 1), y: this.top(), vy: -1, vx: 0.5, ttl: 4 });
        if (a && a.type === 'angry' && this.t % 2 === 0) this.fx.push({ art: this.t % 4 ? ART.bang : ART.steam, x: clamp(this.x + (this.t % 4 ? this.w() - 1 : 0), 0, this.cols - 1), y: this.top() - 1, vy: 0, ttl: 2 });
        if ((a && a.type === 'sad') || (!a && this.mood === 'sad')) {
          if (this.t % 3 === 0) this.fx.push({ art: ART.cloud, x: clamp(this.x + Math.floor(this.w() / 2), 0, this.cols - 1), y: Math.max(0, this.top() - 2), vy: 0, ttl: 3, kind: 'cloud' });
          if (this.t % 2) this.fx.push({ art: ART.drop, x: clamp(this.x + Math.floor(this.w() / 2) + pick([-1, 0, 1]), 0, this.cols - 1), y: Math.max(1, this.top() - 1), vy: 1, ttl: 2 });
        }
        if (this.ball) {
          const B = this.ball;
          B.vy += 1; B.y += B.vy; B.x += B.vx;
          if (B.y >= this.gy() - 1) { B.y = this.gy() - 1; B.vy = -2; }
          if (B.x <= 0 || B.x >= this.cols - 1) { B.vx *= -1; B.x = clamp(B.x, 0, this.cols - 1); }
          if (!a || a.type !== 'play') this.ball = null;
          else if (Math.abs(B.x - (this.x + this.w() / 2)) > 3) this.dir = B.x < this.x ? -1 : 1;
        }
        this.trail.forEach((t) => t.life--);
        this.trail = this.trail.filter((t) => t.life > 0);
        if (this.sweep != null) {
          this.sweep -= 3;
          if (this.sweep < -2) {
            this.sweep = null; this.poops = 0; this.trail = [];
            for (let i = 0; i < 4; i++) this.fx.push({ art: ART.spark, x: (Math.random() * (this.cols - 1)) | 0, y: (Math.random() * (this.gy() - 1)) | 0, vy: 0, ttl: 2 + i % 2 });
            this.hooks.onClean && this.hooks.onClean();
          }
        }
      }
      this.render();
    }
    render() {
      const R = this.rows, C = this.cols, p = this.pet;
      const g = Array.from({ length: R }, () => Array(C).fill(' '));
      const k = Array.from({ length: R }, () => Array(C).fill(''));
      const blit = (art, x, y, cls = '') => art.forEach((l, j) => [...l].forEach((c, i) => {
        const X = Math.round(x) + i, Y = Math.round(y) + j;
        if (c !== ' ' && X >= 0 && X < C && Y >= 0 && Y < R) { g[Y][X] = c; k[Y][X] = cls || (ACCENT.has(c) ? 'k' : ''); }
      }));
      const gy = this.gy();
      if (this.ground) {
        g[R - 1] = Array.from({ length: C }, (_, i) => ((i + this.t) % 5 === 0 ? '.' : '_'));
        k[R - 1] = Array(C).fill('d');
        this.trail.forEach((t) => { if (t.x >= 0 && t.x < C) { g[R - 1][t.x] = t.life > 4 ? '~' : '.'; k[R - 1][t.x] = 'k'; } });
      }
      // poops sit on the right
      for (let i = 0; i < Math.min(this.poops, 2); i++) blit(this.t % 2 ? ART.poop : ART.poop2, C - 3 - i * 3, gy - 2, 'd');
      let spr = this.sprite();
      // quirks that change the drawing itself
      const glitchy = this.petId === 'glitch' && (this.face() === 'happy' || this.face() === 'love' || Math.random() < 0.06);
      const faded = p.fade && Math.random() < 0.12;
      if (glitchy || faded) spr = spr.map((l) => [...l].map((c) => (c !== ' ' && Math.random() < (faded ? 0.5 : 0.14) ? (faded ? '.' : pick([...GL])) : c)).join(''));
      if (p.float && this.ground) { const sx = this.x + Math.floor(this.w() / 2) - 1; blit(['.‿.'], sx, R - 1, 'd'); }
      if (p.hang && this.napping()) {
        // upside down, from a branch along the top of the screen
        g[0] = g[0].map((c, i) => (i >= this.x - 1 && i <= this.x + this.w() ? '=' : c));
        k[0] = k[0].map((c, i) => (i >= this.x - 1 && i <= this.x + this.w() ? 'd' : c));
        blit(spr, this.x, 1, '');
      } else blit(spr, this.x, gy - spr.length - this.lift(), glitchy ? 'gl' : '');
      if (p.tongue && (this.beh.type === 'trick' || (this.act && this.act.type === 'eat')) && !this.napping()) {
        const L = [3, 6, 4, 1][(this.beh.i || this.t) % 4], my = gy - spr.length - this.lift() + 2;
        for (let i = 1; i <= L; i++) {
          const X = this.dir < 0 ? this.x + 1 - i : this.x + this.w() - 2 + i;
          if (X >= 0 && X < C && my >= 0 && my < R) { g[my][X] = i === L ? '•' : '-'; k[my][X] = 'k'; }
        }
      }
      if (this.ball) blit(ART.ball, this.ball.x, this.ball.y, 'k');
      this.fx.forEach((f) => blit(f.art, f.x, f.y, f.kind === 'cloud' ? 'd' : ''));
      if (this.sweep != null) for (let y = 0; y < gy; y++) { const sx = this.sweep + (y % 2); if (sx >= 0 && sx < C) { g[y][sx] = '|'; k[y][sx] = 'k'; } if (sx + 1 >= 0 && sx + 1 < C) { g[y][sx + 1] = '/'; k[y][sx + 1] = 'k'; } }
      // to html, grouping runs of the same colour
      let out = '';
      for (let y = 0; y < R; y++) {
        let cur = null, run = '';
        const flush = () => { if (run) out += cur ? `<i class="${cur}">${run}</i>` : run; run = ''; };
        for (let x = 0; x < C; x++) {
          const cl = k[y][x] || null;
          if (cl !== cur) { flush(); cur = cl; }
          run += esc(g[y][x]);
        }
        flush();
        if (y < R - 1) out += '\n';
      }
      if (out !== this.last) { this.pre.innerHTML = out; this.last = out; }
    }
  }
  IB.Screen = Screen;

  /* size the font so cols × rows fill the box exactly */
  IB.fit = (pre, cols, rows) => {
    const go = () => {
      const w = pre.clientWidth, h = pre.clientHeight; // layout size, not the transformed one
      if (!w) return;
      const fs = Math.min(w / (cols * 0.6), (h / rows) * 1.18);
      pre.style.fontSize = fs.toFixed(2) + 'px';
      pre.style.paddingLeft = Math.max(0, (w - fs * 0.6 * cols) / 2).toFixed(1) + 'px';
      pre.style.lineHeight = (h / rows).toFixed(2) + 'px';
    };
    go();
    new ResizeObserver(go).observe(pre);
  };

  /* ═══════════════ shells (pearl, chrome & jelly, in svg) ═══════════════ */
  const poly = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + 'Z';
  const heartPts = (cx = 200, cy = 175, sx = 11.5, sy = 14.5, n = 140) =>
    Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2;
      const x = 16 * Math.sin(t) ** 3, y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      return [cx + x * sx, cy + y * sy];
    });
  const eggPts = (cx = 200, cy = 250, rx = 172, ry = 196, n = 140) =>
    Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2;
      return [cx + rx * Math.cos(t) * (1 + 0.08 * Math.sin(t)), cy + ry * Math.sin(t)];
    });
  const puffPts = (cx = 200, cy = 248, n = 200) =>
    Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2;
      const r = 166 + 22 * Math.cos(6 * t + Math.PI / 2);
      return [cx + r * Math.cos(t), cy + r * Math.sin(t) * 1.02];
    });

  /* ✎✎✎ YOUR SHELL PHOTOS ✎✎✎
     every shell uses the png in img/SHELLS/ (transparent background, screen cut out).
     if a file is missing, the shell is drawn in svg instead.
     numbers are % of the PHOTO (0 = left/top edge, 100 = right/bottom edge):
       size   how big the photo sits in the device box (1 = as wide as the box)
       screen [left, top, width, height] of the see-through screen hole
       keys   [[x, y] ×3] centres of the three buttons (feed, play, clean)
       ring   [x, y] where a chain hooks on · chain: false = the photo already has one
     to fix one: open index.html?tune, drag the pink box / dots / ring onto the photo,
     click the pink code under it (it copies) and paste it over that line. */
  IB.SHELL_PHOTOS = {
    crush: { file: 'img/SHELLS/heart-shell.png', size: 1.12, screen: [31, 30, 37.4, 23.3], keys: [[36, 64.5], [49.4, 64.5], [63.6, 64.5]], ring: [50, 19] },
    moon: { file: 'img/SHELLS/cat-shell.png', size: 1.22, screen: [25.9, 35.8, 49.2, 36.4], keys: [[30.3, 88.5], [48.5, 88.5], [65, 88.5]], ring: [50, 12], chain: false },
    berry: { file: 'img/SHELLS/berry-shell.png', size: 1.16, screen: [28.1, 30.4, 43.5, 41.2], keys: [[35.8, 84.8], [48.5, 86.4], [61.2, 83.3]], ring: [71, 6] },
    bite: { file: 'img/SHELLS/spikeheart-shell.png', size: 1.04, screen: [31.3, 30.7, 37.4, 23.3], keys: [[34.8, 64.5], [48.5, 64.5], [62.1, 64.5]], ring: [50, 3] },
    puff: { file: 'img/SHELLS/puff-shell.png', size: 1.34, screen: [36.7, 50.2, 24.6, 22], keys: [[66.7, 46.7], [26.7, 64.2], [47.9, 83.3]], ring: [47.5, 2] }
  };
  IB.CHAIN_PHOTO = { file: 'img/SHELLS/chain.png', end: [4, 93], ratio: 1349 / 1166 }; // the pearl chain with the bow (shells carousel)
  IB.CHAIN_DROP = { file: 'img/LITTER/chain.png', width: 120 }; // the straight pearl chain with the bow (litter page); beads above it repeat from chain-beads.png
  // load them once, so every device can use them straight away
  const PH = {};
  Object.entries(IB.SHELL_PHOTOS).forEach(([id, ph]) => {
    const im = new Image();
    PH[id] = { ok: null, cbs: [] };
    im.onload = () => { PH[id].ok = true; PH[id].nw = im.naturalWidth; PH[id].nh = im.naturalHeight; PH[id].cbs.forEach((f) => f(true)); };
    im.onerror = () => { PH[id].ok = false; PH[id].cbs.forEach((f) => f(false)); };
    im.src = ph.file;
  });
  const whenPhoto = (id, f) => { const r = PH[id]; if (!r) return f(false); if (r.ok != null) return f(r.ok); r.cbs.push(f); };

  /* btn: [x, y, r] dome, or {x, y, w, h, g:'-'|'+'} key */
  IB.SHELLS = {
    crush: {
      name: 'CRUSH', no: '01', price: 45, glow: '#ff8fc8',
      note: 'pink pearl, two screws, a screen that glows in the dark.',
      traits: ['pearl finish', 'black glow screen', '− ● + keys'],
      body: ['#fff4fa', '#ffc6df', '#d97aa8'], iri: ['#ffe0f4', '#d9d6ff'], lcd: ['#050307', '#ffd7ec'],
      screen: [124, 108, 152, 116], bezel: '#2a1d26',
      btns: [{ x: 152, y: 272, w: 46, h: 32, g: '-' }, [200, 274, 19], { x: 248, y: 272, w: 46, h: 32, g: '+' }], keys: '#25202a',
      shape: 'heart', screws: true, grills: true, leds: true, hook: [112, 7]
    },
    moon: {
      name: 'MOON', no: '02', price: 49, glow: '#9fb8ff',
      note: 'pearl, two ears, eleven rhinestones.',
      traits: ['pearl finish', 'periwinkle screen', 'rhinestones'],
      body: ['#ffffff', '#e6e8f3', '#9298b4'], iri: ['#f3e6ff', '#cfe3ff'], lcd: ['#050307', '#ffd7ec'],
      screen: [104, 156, 192, 150], bezel: '#c7cbe0',
      btns: [[150, 386, 19], [200, 389, 25], [250, 386, 19]], btn: ['#a9c3ff', '#ffffff', '#a9c3ff'], band: true,
      shape: 'egg', cy: 262, ry: 188, ears: true, gems: true, hook: [200, 46]
    },
    berry: {
      name: 'BERRY', no: '03', price: 39, glow: '#ff9ccf',
      note: 'strawberry milk, with an antenna for gossip.',
      traits: ['glossy pink', 'cream icon screen', 'side antenna'],
      body: ['#fff0f7', '#ffb0d6', '#d9649c'], iri: ['#ffe9f6', '#ffd7e6'], lcd: ['#050307', '#ffd7ec'],
      screen: [112, 156, 176, 146], bezel: '#ffe2ef',
      btns: [[150, 380, 17], [200, 388, 17], [250, 380, 17]], btn: ['#ffc4e0', '#ffc4e0', '#ffc4e0'],
      shape: 'egg', berries: true, antenna: true, logo: true, hook: [318, 76]
    },
    bite: {
      name: 'BITE', no: '04', price: 45, glow: '#ff6fae',
      note: 'for pets with a temper. the spikes are soft. mostly.',
      traits: ['bubblegum clay', 'chrome spikes', 'cracked lcd (on purpose)'],
      body: ['#ffd8ea', '#ff9cc9', '#d9558f'], iri: ['#ffe3f1', '#ffc0dc'], lcd: ['#050307', '#ffd7ec'],
      screen: [126, 110, 148, 112], bezel: '#c94d86',
      btns: [[166, 262, 11], [200, 268, 11], [234, 262, 11]], btn: ['#ffd23f', '#ffd23f', '#ffd23f'],
      shape: 'heart', spikes: true, crack: true, star: true, badge: true, hook: [200, -48]
    },
    puff: {
      name: 'PUFF', no: '05', price: 39, glow: '#7fb8ff',
      note: 'a jelly cloud you can see through. it can see you too.',
      traits: ['translucent jelly', 'oled screen', 'pebble keys'],
      body: ['#d6ecff', '#7fb6f0', '#2f6bbd'], iri: ['#e6f4ff', '#c8c4ff'], lcd: ['#050307', '#ffd7ec'],
      screen: [116, 160, 166, 140], bezel: '#eae4d8',
      btns: [[300, 230, 24], [134, 352, 20], [214, 372, 30]], btn: ['#eee8dc', '#eee8dc', '#eee8dc'],
      shape: 'puff', clear: true, spk: [74, 252], cat: true, hook: [200, 28]
    }
  };
  IB.SHELL_IDS = Object.keys(IB.SHELLS);
  IB.shell = (id) => IB.SHELLS[id] || IB.SHELLS.crush;

  IB.shellSVG = (id) => {
    const s = IB.shell(id);
    const u = 'g' + ++uid;
    const pts = s.shape === 'heart' ? heartPts() : s.shape === 'puff' ? puffPts() : eggPts(200, s.cy || 250, 172, s.ry || 196);
    const d = poly(pts);
    const [hi, mid, lo] = s.body;
    const top = Math.min(...pts.map((p) => p[1]));
    let under = '', deco = '';
    const chromeRing = (x, y, r, w = 6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="url(#${u}c)" stroke-width="${w}"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.4" stroke-dasharray="${r * 1.2} ${r * 5}" transform="rotate(200 ${x} ${y})"/>`;

    /* -- what sits behind the body -- */
    if (s.ears) under += `<path d="M62 176 L74 30 Q82 20 93 29 L182 108 Z" fill="url(#${u}b)"/><path d="M338 176 L326 30 Q318 20 307 29 L218 108 Z" fill="url(#${u}b)"/><path d="M80 120 L86 52 L132 96Z" fill="#fff" opacity=".55"/>`;
    if (s.spikes) {
      [9, 22, 37, 52, 88, 103, 118, 131].forEach((kk, i) => {
        const p = pts[kk], c = [200, 205];
        const nx = p[0] - c[0], ny = p[1] - c[1], L = Math.hypot(nx, ny);
        const len = 70 + (i % 3) * 12;
        const tip = [p[0] + (nx / L) * len, p[1] + (ny / L) * len];
        const tx = (-ny / L) * 14, ty = (nx / L) * 14;
        under += `<path d="M${p[0] + tx} ${p[1] + ty} L${tip[0]} ${tip[1]} L${p[0] - tx} ${p[1] - ty} Z" fill="url(#${u}c)"/><path d="M${p[0] + tx * .2} ${p[1] + ty * .2} L${tip[0]} ${tip[1]}" stroke="#fff" stroke-width="2" opacity=".9"/>`;
      });
    }
    if (s.antenna) under += `<g transform="rotate(-24 70 170)"><rect x="52" y="60" width="34" height="130" rx="17" fill="url(#${u}b)"/><rect x="60" y="70" width="8" height="90" rx="4" fill="#fff" opacity=".6"/></g>`;
    if (s.screws) under += chromeRing(112, 22, 15) + chromeRing(288, 22, 15);
    else if (s.star) under += `<path d="M200 -48 L209 -22 L236 -22 L214 -6 L222 20 L200 4 L178 20 L186 -6 L164 -22 L191 -22Z" fill="none" stroke="url(#${u}c)" stroke-width="6" stroke-linejoin="round"/>` + chromeRing(200, 40, 11, 5);
    else if (s.antenna) under += chromeRing(318, 92, 16);
    else under += chromeRing(200, top - 10, 18);

    /* -- decoration on the body -- */
    if (s.berries) {
      const berry = (x, y, k, r) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${k})"><path d="M0 -14 C14 -14 18 0 0 20 C-18 0 -14 -14 0 -14Z" fill="#ff3d7f"/><path d="M-9 -14 L-3 -20 L0 -14 L3 -20 L9 -14 L0 -10Z" fill="#ff9ccf"/>${[[-5, -4], [4, -5], [-2, 4], [5, 5], [0, 12], [-7, 6]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1.4" fill="#fff"/>`).join('')}<ellipse cx="-5" cy="-7" rx="3" ry="5" fill="#fff" opacity=".45"/></g>`;
      deco += [[66, 220, 1.3, -18], [334, 214, 1.2, 14], [312, 332, 1.25, 22], [88, 334, 1.2, -10], [298, 110, .9, 30], [104, 112, .9, -26], [200, 432, 1, 0]].map((b) => berry(...b)).join('');
    }
    if (s.logo) deco += `<text x="200" y="128" text-anchor="middle" font-family="Geist, system-ui, sans-serif" font-weight="800" font-size="26" fill="#ff3d8f" letter-spacing="-1">i·byte</text><text x="200" y="146" text-anchor="middle" font-family="Geist, system-ui, sans-serif" font-weight="700" font-size="11" fill="#d9649c" letter-spacing="3">CONNECTION</text>`;
    if (s.gems) {
      const gem = (x, y, c, r, sz = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${sz})"><path d="M0 -10 L9 -2 L5 9 L-5 9 L-9 -2Z" fill="${c}"/><path d="M0 -10 L9 -2 L0 1 L-9 -2Z" fill="#fff" opacity=".55"/><path d="M-5 9 L0 1 L5 9Z" fill="#000" opacity=".12"/><circle cx="-3" cy="-4" r="1.6" fill="#fff"/></g>`;
      deco += [[86, 300, '#9ec4ff', 10], [322, 196, '#ffc6e8', -14, 1.2], [334, 330, '#d3c2ff', 22], [70, 206, '#c7ecff', 0, .9], [270, 110, '#ffffff', 30, .8], [126, 120, '#9ec4ff', -20, 1.1], [306, 416, '#ffc6e8', 8], [96, 420, '#ffffff', -8, .9], [200, 118, '#ffc6e8', 0, .7], [356, 258, '#9ec4ff', 40, .8], [48, 300, '#ffffff', 12, .8]]
        .map((g) => gem(...g)).join('');
      deco += `<g transform="translate(92 352)"><path d="M0 0 C-22 -20 -30 6 -6 8 C-30 12 -18 34 0 12 C18 34 30 12 6 8 C30 6 22 -20 0 0Z" fill="#7aa2ff" opacity=".9"/><circle r="5" fill="#cfe0ff"/></g>`;
    }
    if (s.spk) deco += Array.from({ length: 19 }, (_, i) => { const a = (i / 19) * 6.283, r = i % 2 ? 7 : 14; return `<circle cx="${s.spk[0] + Math.cos(a) * r}" cy="${s.spk[1] + Math.sin(a) * r}" r="2.4" fill="${lo}"/>`; }).join('') + `<circle cx="${s.spk[0]}" cy="${s.spk[1]}" r="2.4" fill="${lo}"/>`;
    if (s.cat) deco += `<g transform="translate(200 116)" fill="#eef4ff" opacity=".9"><path d="M-16 -8 L-12 -20 L-4 -12 L4 -12 L12 -20 L16 -8 L16 8 Q16 14 10 14 L-10 14 Q-16 14 -16 8Z"/><circle cx="-6" cy="0" r="2.4" fill="${lo}"/><circle cx="6" cy="0" r="2.4" fill="${lo}"/></g>`;
    if (s.grills) {
      const grill = (x0) => Array.from({ length: 30 }, (_, i) => `<circle cx="${x0 + (i % 5) * 7}" cy="${132 + Math.floor(i / 5) * 8}" r="2" fill="#a8557f" opacity=".7"/>`).join('');
      deco += grill(70) + grill(302);
    }
    if (s.screws) deco += [[132, 70], [268, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="url(#${u}c)"/><path d="M${x - 3.5} ${y} H${x + 3.5}" stroke="#6b6f7c" stroke-width="1.6"/>`).join('');
    if (s.leds) deco += [186, 200, 214].map((x, i) => `<circle cx="${x}" cy="94" r="3.2" fill="#ff4fa2" class="dev__led" style="animation-delay:${i * .25}s"/>`).join('') + `<path d="M188 322 l12 -14 l12 14 m-18 -4 l6 -6 l6 6" stroke="#b9658f" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (s.star) deco += `<g transform="translate(92 150) rotate(-12)"><path d="M0 -30 L9 -10 L30 -9 L13 5 L19 27 L0 14 L-19 27 L-13 5 L-30 -9 L-9 -10Z" fill="#ffd23f" stroke="#e6a800" stroke-width="2" stroke-linejoin="round"/><path d="M-6 -14 L0 -26 L4 -12Z" fill="#fff" opacity=".7"/></g>`;
    if (s.badge) deco += `<g transform="translate(306 150) rotate(10)"><circle r="30" fill="#fff" stroke="#e8e8ee" stroke-width="2"/><text y="-3" text-anchor="middle" font-family="Geist, system-ui" font-weight="800" font-size="15" fill="#111">I <tspan fill="#e5194f">♥</tspan></text><text y="15" text-anchor="middle" font-family="Geist, system-ui" font-weight="800" font-size="12" fill="#111">ASCII</text></g><g transform="translate(200 318) rotate(-3)"><rect x="-60" y="-16" width="120" height="32" rx="3" fill="#fff"/><text y="7" text-anchor="middle" font-family="Geist, system-ui" font-weight="800" font-size="19" fill="#e5194f" letter-spacing="-1">i·byte</text></g>`;

    /* -- screen -- */
    const [sx, sy, sw, sh] = s.screen;
    const bz = s.shape === 'puff'
      ? `<path d="M${sx - 18} ${sy - 18} H${sx + sw + 10} Q${sx + sw + 50} ${sy - 18} ${sx + sw + 52} ${sy + 20} Q${sx + sw + 54} ${sy + 52} ${sx + sw + 18} ${sy + 58} V${sy + sh + 18} H${sx - 18}Z" fill="url(#${u}z)" stroke="${lo}" stroke-opacity=".25"/>`
      : s.shape === 'heart' && !s.spikes
        ? `<rect x="${sx - 16}" y="${sy - 16}" width="${sw + 32}" height="${sh + 32}" rx="14" fill="${s.bezel}"/><rect x="${sx - 16}" y="${sy - 16}" width="${sw + 32}" height="${sh + 32}" rx="14" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>`
        : `<rect x="${sx - 15}" y="${sy - 15}" width="${sw + 30}" height="${sh + 30}" rx="${s.shape === 'egg' ? 26 : 16}" fill="url(#${u}z)"/>`;
    const glass = `<rect class="dev__glass" x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="7" fill="${s.lcd[0]}"/>`;
    const crack = s.crack ? `<path d="M${sx + 30} ${sy} L${sx + 58} ${sy + 40} L${sx + 46} ${sy + 62} L${sx + 80} ${sy + 96} M${sx + 58} ${sy + 40} L${sx + 98} ${sy + 30} L${sx + 120} ${sy + 52} M${sx + 46} ${sy + 62} L${sx + 12} ${sy + 80}" stroke="#fff" stroke-width="1.6" fill="none" opacity=".8"/>` : '';

    /* -- buttons -- */
    let band = '';
    if (s.band) band = `<rect x="104" y="356" width="192" height="64" rx="32" fill="#141a35"/><rect x="104" y="356" width="192" height="64" rx="32" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`;
    const btns = s.btns.map((b, i) => {
      if (Array.isArray(b)) {
        const [x, y, r] = b, c = s.btn ? s.btn[i] : s.keys;
        return `<g class="dev__b" data-b="${i}"><circle cx="${x}" cy="${y + 4}" r="${r + 3}" fill="#000" opacity=".28" filter="url(#${u}s)"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${u}k)"/><ellipse cx="${x - r * .28}" cy="${y - r * .42}" rx="${r * .46}" ry="${r * .24}" fill="#fff" opacity=".85"/></g>`;
      }
      const { x, y, w, h, g } = b;
      const glyph = g === '+' ? `<path d="M${x - 8} ${y} H${x + 8} M${x} ${y - 8} V${y + 8}" stroke="#d9d4de" stroke-width="3" stroke-linecap="round"/>` : `<path d="M${x - 8} ${y} H${x + 8}" stroke="#d9d4de" stroke-width="3" stroke-linecap="round"/>`;
      return `<g class="dev__b" data-b="${i}"><rect x="${x - w / 2}" y="${y - h / 2 + 4}" width="${w}" height="${h}" rx="7" fill="#000" opacity=".3" filter="url(#${u}s)"/><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="7" fill="${s.keys}"/><rect x="${x - w / 2 + 3}" y="${y - h / 2 + 2}" width="${w - 6}" height="${h * .4}" rx="5" fill="#fff" opacity=".12"/>${glyph}</g>`;
    }).join('');

    return `<svg class="dev__svg ${u}" viewBox="0 -60 400 520" aria-hidden="true">
      <defs>
        <radialGradient id="${u}b" cx=".34" cy=".24" r=".92"><stop offset="0" stop-color="${hi}"/><stop offset=".5" stop-color="${mid}"/><stop offset="1" stop-color="${lo}"/></radialGradient>
        <linearGradient id="${u}i" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${s.iri[0]}" stop-opacity=".0"/><stop offset=".45" stop-color="${s.iri[0]}" stop-opacity=".55"/><stop offset=".7" stop-color="${s.iri[1]}" stop-opacity=".6"/><stop offset="1" stop-color="${s.iri[1]}" stop-opacity="0"/></linearGradient>
        <linearGradient id="${u}r" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".45" stop-color="#fff" stop-opacity=".0"/><stop offset=".85" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".55"/></linearGradient>
        <linearGradient id="${u}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#9aa1b1"/><stop offset=".5" stop-color="#ffffff"/><stop offset=".72" stop-color="#5d6474"/><stop offset="1" stop-color="#eef1f7"/></linearGradient>
        <radialGradient id="${u}k" cx=".4" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></radialGradient>
        <linearGradient id="${u}z" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.bezel}"/><stop offset="1" stop-color="${s.bezel}" stop-opacity=".82"/></linearGradient>
        <clipPath id="${u}p"><path d="${d}"/></clipPath>
        <filter id="${u}s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
        <filter id="${u}l" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
        <filter id="${u}m" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
      ${under}
      <path d="${d}" fill="url(#${u}b)" ${s.clear ? 'fill-opacity=".8"' : ''}/>
      <path d="${d}" fill="url(#${u}i)"/>
      <g clip-path="url(#${u}p)">
        <path d="${d}" fill="none" stroke="${lo}" stroke-width="54" filter="url(#${u}l)" opacity=".75"/>
        <path d="${d}" fill="none" stroke="url(#${u}r)" stroke-width="12" filter="url(#${u}s)" transform="translate(5 7)"/>
        <ellipse cx="128" cy="${top + 64}" rx="74" ry="30" fill="#fff" opacity=".7" filter="url(#${u}m)" transform="rotate(-28 128 ${top + 64})"/>
        <ellipse cx="112" cy="${top + 58}" rx="22" ry="8" fill="#fff" transform="rotate(-30 112 ${top + 58})"/>
        <ellipse cx="300" cy="${top + 320}" rx="60" ry="14" fill="#fff" opacity=".35" filter="url(#${u}m)" transform="rotate(-40 300 ${top + 320})"/>
        ${s.clear ? `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" transform="translate(200 250) scale(.93) translate(-200 -250)"/>` : ''}
      </g>
      <path d="${d}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>
      ${deco}
      ${bz}
      ${glass}
      ${band}
      ${btns}
      <g class="dev__over">${crack}</g>
    </svg>`;
  };

  /* pearl ball chain: any <svg class="chain"><path d=…/></svg> becomes beads */
  IB.chains = (root = document) => {
    $$('svg.chain', root).forEach((svg) => {
      if (svg.dataset.done) return;
      svg.dataset.done = 1;
      const d = $('path', svg).getAttribute('d');
      const gap = +svg.dataset.gap || 15, w = gap * 0.8;
      const mk = (c, k, dx, dy, op = 1) => `<path d="${d}" stroke="${c}" stroke-width="${(w * k).toFixed(1)}" stroke-dasharray="0 ${gap}" stroke-linecap="round" fill="none" transform="translate(${dx * w} ${dy * w})" opacity="${op}"/>`;
      svg.innerHTML = mk('#000', 1.05, .08, .25, .45) + mk('#80869a', 1, 0, 0) + mk('#e8eaf3', .78, -.06, -.08) + mk('#ffffff', .3, -.18, -.22, .95);
    });
  };

  /* a full device: svg shell (or your photo) + live LCD + clickable buttons */
  const TUNE = /[?&]tune\b/.test(location.search);
  const pc = (v) => +v.toFixed(1);
  IB.device = (host, o = {}) => {
    const id = IB.SHELLS[o.shell] ? o.shell : 'crush';
    const s = IB.SHELLS[id];
    host.classList.add('dev');
    host.dataset.shell = id;
    host.style.setProperty('--glow', s.glow);
    // layout in % of the device box (svg viewBox is 0 -60 400 520)
    const toPc = ([x, y]) => [pc(x / 4), pc((y + 60) / 5.2)];
    const lay = {
      screen: [pc(s.screen[0] / 4), pc((s.screen[1] + 60) / 5.2), pc(s.screen[2] / 4), pc(s.screen[3] / 5.2)],
      keys: s.btns.map((b) => toPc(Array.isArray(b) ? b : [b.x, b.y])),
      ring: toPc(s.hook)
    };
    const chainSVG = () => {
      if (!o.chain) return '';
      const hx = lay.ring[0] * 4, hy = lay.ring[1] * 5.2 - 60;
      const CH = {
        hang: `M${hx - 70} -900 C ${hx - 90} -520, ${hx + 50} -260, ${hx} ${hy}`,
        loop: `M${hx} ${hy} C ${hx + 40} ${hy - 130}, ${hx - 60} ${hy - 250}, ${hx - 190} ${hy - 230} C ${hx - 330} ${hy - 210}, ${hx - 330} ${hy - 70}, ${hx - 220} ${hy - 40} C ${hx - 140} ${hy - 18}, ${hx - 50} ${hy - 30}, ${hx} ${hy}`,
        swirl: `M${hx} ${hy} C ${hx + 70} ${hy - 160}, ${hx + 230} ${hy - 170}, ${hx + 220} ${hy - 60} C ${hx + 212} ${hy + 30}, ${hx + 120} ${hy + 10}, ${hx + 110} ${hy - 50} C ${hx + 96} ${hy - 160}, ${hx - 20} ${hy - 300}, ${hx - 60} ${hy - 900}`
      };
      const bow = o.charm ? `<g transform="translate(${hx + 150} ${hy - 120}) rotate(18)"><path d="M0 0 C -30 -34, -56 -26, -50 0 C -56 26, -30 34, 0 0 C 30 34, 56 26, 50 0 C 56 -26, 30 -34, 0 0Z" fill="#ffb3d8"/><path d="M0 0 C -30 -34, -56 -26, -50 0 C -50 -10, -30 -26, 0 0Z" fill="#fff" opacity=".45"/><path d="M-6 4 L-24 52 L-8 46 L0 60 L4 6Z M6 4 L22 50 L8 44 L0 60Z" fill="#ff9ccf"/><circle r="11" fill="#ffc6e2"/><ellipse cx="-30" cy="-12" rx="10" ry="5" fill="#fff" opacity=".7" transform="rotate(-20 -30 -12)"/></g>` : '';
      return `<svg class="chain dev__chain" viewBox="0 -60 400 520" data-gap="17"><path d="${CH[o.chain] || CH.hang}"/></svg>${bow ? `<svg class="dev__charm" viewBox="0 -60 400 520">${bow}</svg>` : ''}`;
    };
    host.innerHTML = chainSVG() + IB.shellSVG(id) + `<pre class="lcd lcd--${id}" aria-label="ascii pet screen"></pre>`;
    IB.chains(host);
    const pre = $('.lcd', host);
    const place = () => {
      const [l, t, w, h] = lay.screen;
      Object.assign(pre.style, { left: l + '%', top: t + '%', width: w + '%', height: h + '%' });
    };
    place();
    Object.assign(pre.style, { color: s.lcd[1], background: s.lcd[0] });
    const cols = o.cols || 18, rows = o.rows || 8;
    IB.fit(pre, cols, rows);
    const scr = new Screen(pre, { cols, rows, pet: o.pet || IB.get('pet', 'glitch'), walk: o.walk, speed: o.speed, ...o.screen });
    const bind = (b) => {
      b.style.cursor = 'pointer';
      b.setAttribute('data-cur', ['feed', 'play', 'clean'][b.dataset.b]);
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.gsap) gsap.fromTo(b, { scale: 0.86, transformOrigin: 'center' }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
        if (o.buttons) o.buttons(+b.dataset.b, scr);
        else [() => scr.feed(), () => scr.play(), () => scr.clean()][b.dataset.b]();
      });
    };
    $$('.dev__b', host).forEach(bind);
    pre.addEventListener('click', () => scr.love());
    pre.dataset.cur = 'pet it';

    // your photo replaces the svg (the lcd sits behind it, seen through the cut-out screen)
    const ph = (IB.SHELL_PHOTOS || {})[id];
    if (ph && ph.file) {
      host.classList.add('dev--wait');
      whenPhoto(id, (ok) => {
        host.classList.remove('dev--wait');
        if (!ok || !host.isConnected || host.dataset.shell !== id) return;
        const P = JSON.parse(JSON.stringify(ph));
        const r = PH[id];
        let F;
        const frame = () => {
          const w = P.size * 100, h = P.size * 100 * (400 / 520) * (r.nh / r.nw);
          F = { l: (100 - w) / 2, t: (100 - h) / 2, w, h };
        };
        const bx = (u, v) => [F.l + (u * F.w) / 100, F.t + (v * F.h) / 100];
        host.classList.add('dev--photo');
        const img = new Image();
        img.className = 'dev__img'; img.alt = ''; img.src = ph.file;
        $('.dev__svg', host).replaceWith(img);
        const hits = P.keys.map((k, i) => {
          const b = document.createElement('button');
          b.type = 'button'; b.className = 'dev__b dev__hit'; b.dataset.b = i;
          b.setAttribute('aria-label', ['feed', 'play', 'clean'][i]);
          host.appendChild(b); bind(b);
          return b;
        });
        const chainUp = () => {
          $$('.dev__chain, .dev__charm, .dev__chainimg, .dev__drop', host).forEach((n) => n.remove());
          if (!o.chain || (P.chain === false && o.chain !== 'drop')) return;
          const [rx, ry] = bx(P.ring[0], P.ring[1]);
          if (o.chain === 'drop' && IB.CHAIN_DROP) {
            host.insertAdjacentHTML('afterbegin', `<div class="dev__drop" style="left:${rx}%;top:${ry}%;width:${IB.CHAIN_DROP.width}%"><img src="${IB.CHAIN_DROP.file}" alt=""></div>`);
            return;
          }
          if (o.chain === 'swirl' && IB.CHAIN_PHOTO) {
            const C = IB.CHAIN_PHOTO, cw = 95, ch = cw * (400 / 520) * C.ratio;
            host.insertAdjacentHTML('afterbegin', `<img class="dev__chainimg" src="${C.file}" alt="" style="width:${cw}%;left:${rx - (C.end[0] * cw) / 100}%;top:${ry - (C.end[1] * ch) / 100}%">`);
            return;
          }
          lay.ring = [rx, ry];
          host.insertAdjacentHTML('afterbegin', chainSVG());
          IB.chains(host);
        };
        const apply = () => {
          frame();
          Object.assign(img.style, { left: F.l + '%', top: F.t + '%', width: F.w + '%', height: F.h + '%' });
          const [l, t] = bx(P.screen[0], P.screen[1]);
          lay.screen = [l - 0.4, t - 0.4, (P.screen[2] * F.w) / 100 + 0.8, (P.screen[3] * F.h) / 100 + 0.8];
          place();
          hits.forEach((b, i) => { const [x, y] = bx(...P.keys[i]); Object.assign(b.style, { left: x + '%', top: y + '%' }); });
        };
        apply();
        chainUp();
        if (TUNE) tune(host, id, P, bx, () => F, apply, chainUp, hits);
      });
    }
    return { el: host, screen: scr, shell: id };
  };

  /* ?tune: drag the screen box, the button dots and the chain ring onto your photo */
  const tune = (host, id, P, bx, getF, apply, chainUp, hits) => {
    host.classList.add('is-tuning');
    const pre = $('.lcd', host);
    const out = document.createElement('button');
    out.type = 'button'; out.className = 'tune__code';
    const ring = document.createElement('span');
    ring.className = 'tune__ring';
    const corner = document.createElement('span');
    corner.className = 'tune__corner';
    host.append(ring, corner, out);
    const r1 = (v) => +v.toFixed(1);
    const show = () => {
      apply();
      const [rx, ry] = bx(...P.ring), [cx, cy] = bx(P.screen[0] + P.screen[2], P.screen[1] + P.screen[3]);
      Object.assign(ring.style, { left: rx + '%', top: ry + '%' });
      Object.assign(corner.style, { left: cx + '%', top: cy + '%' });
      out.textContent = `${id}: { file: '${P.file}', size: ${P.size}, screen: [${P.screen.map(r1)}], keys: [${P.keys.map((k) => `[${k.map(r1)}]`).join(', ')}], ring: [${P.ring.map(r1)}]${P.chain === false ? ', chain: false' : ''} },`;
    };
    const drag = (el, move, done) => el.addEventListener('pointerdown', (e) => {
      e.preventDefault(); e.stopPropagation();
      const r = host.getBoundingClientRect();
      let px = e.clientX, py = e.clientY;
      const mv = (ev) => {
        const F = getF();
        move(((ev.clientX - px) / r.width) * 100 * (100 / F.w), ((ev.clientY - py) / r.height) * 100 * (100 / F.h));
        px = ev.clientX; py = ev.clientY; show();
      };
      const up = () => { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); done && done(); };
      addEventListener('pointermove', mv); addEventListener('pointerup', up);
    });
    drag(pre, (dx, dy) => { P.screen[0] += dx; P.screen[1] += dy; });
    drag(corner, (dx, dy) => { P.screen[2] = Math.max(3, P.screen[2] + dx); P.screen[3] = Math.max(3, P.screen[3] + dy); });
    drag(ring, (dx, dy) => { P.ring[0] += dx; P.ring[1] += dy; }, chainUp);
    hits.forEach((b, i) => drag(b, (dx, dy) => { P.keys[i][0] += dx; P.keys[i][1] += dy; }));
    // + / − on the keyboard: bigger / smaller photo
    addEventListener('keydown', (e) => {
      if (!host.matches(':hover')) return;
      if (e.key === '+' || e.key === '=') P.size = r1(P.size + 0.02);
      else if (e.key === '-') P.size = r1(Math.max(0.3, P.size - 0.02));
      else return;
      show(); chainUp();
    });
    out.addEventListener('click', (e) => { e.stopPropagation(); navigator.clipboard && navigator.clipboard.writeText(out.textContent); IB.toast('copied. paste it in js/main.js → IB.SHELL_PHOTOS'); });
    show();
  };

  /* ═══════════════ life: needs that drain in real time ═══════════════ */
  const L = (IB.life = {
    full: 3, joy: 3, poop: 0, fed: 0, bites: 0, t: Date.now(),
    load() {
      const s = IB.get('life', null);
      if (s) Object.assign(this, s);
      // catch up on the time you were away (it kept living)
      const away = (Date.now() - (this.t || Date.now())) / 1000;
      this.full = clamp(this.full - Math.floor(away / 90), 0, 4);
      this.joy = clamp(this.joy - Math.floor(away / 120), 0, 4);
      this.poop = clamp(this.poop + Math.floor(away / 150), 0, 3);
      this.t = Date.now();
      this.save();
    },
    save() { this.t = Date.now(); IB.set('life', { full: this.full, joy: this.joy, poop: this.poop, fed: this.fed, bites: this.bites, t: this.t }); this.emit(); },
    hungry() { return this.full <= 0; },
    subs: [],
    on(fn) { this.subs.push(fn); fn(this); },
    emit() { this.subs.forEach((f) => f(this)); },
    feed() { this.full = clamp(this.full + 1, 0, 4); this.fed++; this.save(); },
    play() { this.joy = clamp(this.joy + 1, 0, 4); this.full = clamp(this.full - (Math.random() < 0.3 ? 1 : 0), 0, 4); this.save(); },
    clean() { this.poop = 0; this.joy = clamp(this.joy + (this.poop ? 1 : 0), 0, 4); this.save(); },
    start() {
      let n = 0;
      setInterval(() => {
        n++;
        if (n % 40 === 0) this.full = clamp(this.full - 1, 0, 4);
        if (n % 55 === 0) this.joy = clamp(this.joy - 1, 0, 4);
        if (n % 70 === 0 && this.full > 0) this.poop = clamp(this.poop + 1, 0, 3);
        if (n % 5 === 0 || n % 40 === 0 || n % 55 === 0 || n % 70 === 0) this.save();
      }, 1000);
    }
  });
  IB.meter = (v, max = 4) => '■'.repeat(v) + '□'.repeat(max - v);

  /* ═══════════════ bites ═══════════════ */
  const applyMask = (el) => {
    const layers = el._bites.map((b) => `radial-gradient(circle ${b.r}px at ${b.x}px ${b.y}px, transparent 97%, #000 100%)`);
    const v = layers.join(',');
    el.style.webkitMaskImage = v; el.style.maskImage = v;
    el.style.webkitMaskComposite = layers.map(() => 'source-in').join(',');
    el.style.maskComposite = layers.map(() => 'intersect').join(',');
    el.style.webkitMaskRepeat = el.style.maskRepeat = 'no-repeat';
  };
  IB.unbite = (el) => {
    el._bites = [];
    ['webkitMaskImage', 'maskImage', 'webkitMaskComposite', 'maskComposite'].forEach((k) => (el.style[k] = ''));
  };
  /* bite el at viewport point (cx, cy) — snaps to the nearest edge, 3 teeth */
  IB.bite = (el, cx, cy, o = {}) => {
    const r = el.getBoundingClientRect();
    let px = cx - r.left, py = cy - r.top;
    const d = [px, r.width - px, py, r.height - py], m = Math.min(...d), side = d.indexOf(m);
    if (!o.exact) { if (side === 0) px = 0; else if (side === 1) px = r.width; else if (side === 2) py = 0; else py = r.height; }
    const R = o.r || clamp(Math.min(r.width, r.height) * 0.16, 16, 58);
    const along = side < 2 ? [0, 1] : [1, 0];
    el._bites = el._bites || [];
    [-1.05, 0, 1.05].forEach((k, i) => {
      el._bites.push({ x: px + along[0] * k * R + (side === 0 ? R * .25 : side === 1 ? -R * .25 : 0) * (i === 1 ? 1.4 : 1), y: py + along[1] * k * R + (side === 2 ? R * .25 : side === 3 ? -R * .25 : 0) * (i === 1 ? 1.4 : 1), r: R * (i === 1 ? 1.08 : 0.92) });
    });
    applyMask(el);
    if (!o.silent) IB.crumbs(r.left + px, r.top + py);
    if (!o.silent && window.gsap) gsap.fromTo(el, { x: -4 }, { x: 0, duration: 0.35, ease: 'elastic.out(1.2,.3)' });
  };
  IB.crumbs = (x, y) => {
    if (RM) return;
    const chars = ['.', ',', "'", '`', '*', ':', '#'];
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('span');
      s.className = 'crumb';
      s.textContent = chars[i % chars.length];
      s.style.left = x + 'px'; s.style.top = y + 'px';
      document.body.appendChild(s);
      gsap.to(s, { x: rand(-70, 70), y: rand(-60, 90), rotation: rand(-200, 200), opacity: 0, duration: rand(0.6, 1.1), ease: 'power2.out', onComplete: () => s.remove() });
    }
  };
  /* hungry pet → hovering .bitable things gets them chewed */
  IB.chomper = () => {
    let timer;
    document.addEventListener('pointerover', (e) => {
      const el = e.target.closest('.bitable');
      clearTimeout(timer);
      if (!el || !L.hungry()) return;
      timer = setTimeout(() => {
        if (!L.hungry() || (el._bites || []).length >= 12) return;
        IB.bite(el, e.clientX, e.clientY);
        IB.sound.chomp();
        L.bites++; L.save();
        IB.toast('chomp. it’s hungry — feed it ↑');
      }, 380);
    });
  };

  /* ═══════════════ ui bits ═══════════════ */
  IB.toast = (msg) => {
    let t = $('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('on'), 2600);
  };

  const GLYPHS = '█▓▒░#@%&*+=<>/\\';
  IB.scramble = (el, text, dur = 0.8) => {
    text = text != null ? text : el.dataset.text || el.textContent;
    el.dataset.text = text;
    if (RM) { el.textContent = text; return; }
    const o = { p: 0 };
    gsap.to(o, {
      p: 1, duration: dur, ease: 'none',
      onUpdate: () => {
        const n = Math.floor(o.p * text.length);
        el.textContent = text.slice(0, n) + [...text.slice(n)].map((c) => (c === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
      },
      onComplete: () => (el.textContent = text)
    });
  };

  IB.magnetic = () => {
    if (RM || matchMedia('(hover: none)').matches) return;
    $$('[data-mag]').forEach((el) => {
      const k = +el.dataset.mag || 0.35;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * k, y: (e.clientY - r.top - r.height / 2) * k, duration: 0.4, ease: 'power3.out' });
      });
      el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,.4)' }));
    });
  };

  /* cursor: a pixel pointer + a label pill */
  IB.cursor = () => {
    if (matchMedia('(hover: none)').matches) return;
    const c = document.createElement('div');
    c.className = 'cur';
    c.setAttribute('aria-hidden', 'true');
    c.innerHTML = `<svg class="cur__arrow" viewBox="0 0 13 19" shape-rendering="crispEdges"><path d="M1 1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h-4v1h1v2h1v2h1v2h-2v-1h-1v-2h-1v-2h-1v-1h-1v1h-1v1h-1v1h-1z" fill="#fff" stroke="#0b0b14" stroke-width="1"/></svg><span class="cur__lab"></span>`;
    document.body.appendChild(c);
    document.documentElement.classList.add('has-cur');
    const lab = $('.cur__lab', c);
    const xTo = gsap.quickTo(c, 'x', { duration: 0.12, ease: 'power3' });
    const yTo = gsap.quickTo(c, 'y', { duration: 0.12, ease: 'power3' });
    addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); });
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cur], a, button, .bitable');
      let txt = '';
      if (t) txt = t.getAttribute('data-cur') || (t.matches('.bitable') && L.hungry() ? 'chomp' : '') || (t.matches('a,button') ? '' : '');
      if (t && t.matches('.bitable') && L.hungry()) txt = 'chomp';
      lab.textContent = txt;
      c.classList.toggle('is-lab', !!txt);
      c.classList.toggle('is-link', !!(t && t.matches('a,button,[data-cur]')));
      c.classList.toggle('is-chomp', txt === 'chomp');
    });
    addEventListener('pointerdown', () => c.classList.add('is-down'));
    addEventListener('pointerup', () => c.classList.remove('is-down'));
    document.addEventListener('pointerleave', () => (c.style.opacity = 0));
    document.addEventListener('pointerenter', () => (c.style.opacity = 1));
  };

  /* smooth scroll */
  IB.lenis = null;
  IB.smooth = () => {
    gsap.registerPlugin(ScrollTrigger);
    if (RM || !window.Lenis) return;
    const l = (IB.lenis = new Lenis({ lerp: 0.11, smoothWheel: true }));
    l.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => l.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  };
  IB.scrollTo = (t) => (IB.lenis ? IB.lenis.scrollTo(t, { duration: 1.4 }) : (typeof t === 'string' ? $(t) : t)?.scrollIntoView({ behavior: 'smooth' }));

  /* image slots: <div class="slot" data-img="HOME/x.jpg" data-note="..."> */
  IB.slots = () => {
    $$('.slot').forEach((s) => {
      const src = 'img/' + s.dataset.img;
      if (!s.querySelector('.slot__lab')) {
        const lab = document.createElement('span');
        lab.className = 'slot__lab';
        lab.innerHTML = `<b>img/${s.dataset.img}</b>${s.dataset.note ? '<i>' + s.dataset.note + '</i>' : ''}`;
        s.appendChild(lab);
      }
      IB.slotLoad(s, src);
    });
  };
  IB.slotLoad = (s, src) => {
    const im = new Image();
    s._want = src; // only the last request wins, even when clicking fast
    im.alt = s.dataset.alt || '';
    const clear = () => $$(':scope > img', s).forEach((n) => n.remove());
    im.onload = () => { if (s._want !== src) return; clear(); s.prepend(im); s.classList.add('is-filled'); };
    im.onerror = () => { if (s._want !== src) return; clear(); s.classList.remove('is-filled'); };
    im.src = src;
  };

  /* nav status + mobile menu */
  /* ═══════════════ sound: tiny square-wave beeps, like the real toys ═══════════════
     off until you switch it on (the ♪ in the nav). remembered in ib-sound. */
  IB.sound = (() => {
    let ctx = null, on = IB.get('sound', false), master;
    const boot = () => {
      if (ctx) return ctx;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.16;
      // a little lowpass so the square waves are cute, not painful
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5200;
      master.connect(lp); lp.connect(ctx.destination);
      return ctx;
    };
    // one note: freq (or [from, to] for a slide), start offset, length, wave, volume
    const note = (f, t0 = 0, len = 0.07, type = 'square', vol = 1) => {
      if (!on || !boot()) return;
      if (ctx.state === 'suspended') ctx.resume();
      const t = ctx.currentTime + t0, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type;
      if (Array.isArray(f)) { o.frequency.setValueAtTime(f[0], t); o.frequency.exponentialRampToValueAtTime(f[1], t + len); }
      else o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.005);
      g.gain.setValueAtTime(vol, t + len - 0.015);
      g.gain.linearRampToValueAtTime(0, t + len);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + len + 0.02);
    };
    const seq = (notes, step = 0.09, len = 0.08) => notes.forEach((f, i) => f && note(f, i * step, len));
    const S = {
      get on() { return on; },
      set(v) { on = !!v; IB.set('sound', on); if (on) { boot(); ctx && ctx.resume(); S.hello(); } document.dispatchEvent(new CustomEvent('ib:sound', { detail: on })); },
      // the three keys: feed − / play ● / clean +
      key(i) { [() => seq([1568, 1175], 0.06, 0.05), () => seq([1319, 1760], 0.06, 0.05), () => note([1200, 2600], 0, 0.12)][+i || 0](); },
      beep() { note(2093, 0, 0.04); },
      tap() { note(1760, 0, 0.03, 'square', 0.6); },
      love() { seq([1568, 2093, 2637], 0.07, 0.06); },
      hello() { seq([1047, 1319, 1568], 0.07, 0.06); },
      sleep() { seq([1319, 1047, 880, 784, 659], 0.16, 0.14); },
      // the hatch: a little fanfare, then the happy chirp
      hatch() { seq([523, 659, 784, 1047, 0, 784, 1047, 1319, 0, 1568, 1568, 2093], 0.11, 0.1); },
      crack() { note([300, 120], 0, 0.06, 'square', 0.7); },
      // hungry: a low wobbly grumble, then a sad two-note whine
      grumble() {
        if (!on || !boot()) return;
        [0, 0.16, 0.32].forEach((d, i) => note([110 - i * 8, 70 - i * 6], d, 0.14, 'sawtooth', 0.55));
        seq([0, 0, 0, 0, 0, 988, 740], 0.09, 0.12);
      },
      chomp() { note([420, 90], 0, 0.07, 'square', 0.8); note([380, 80], 0.09, 0.07, 'square', 0.8); }
    };
    return S;
  })();

  IB.nav = () => {
    const st = $('[data-status]');
    L.on((l) => {
      if (!st) return;
      const txt = l.hungry() ? 'hungry. it bites.' : l.poop >= 2 ? 'it made a mess' : l.joy <= 1 ? 'bored' : 'alive & fine';
      st.textContent = txt;
      st.parentElement.classList.toggle('is-angry', l.hungry());
    });
    const nav = $('.nav');
    // the sound switch, next to the status
    if (nav && !$('.nav__snd', nav)) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'nav__snd'; b.dataset.cur = 'sound';
      const paint = () => { b.setAttribute('aria-pressed', IB.sound.on); b.setAttribute('aria-label', IB.sound.on ? 'sound on' : 'sound off'); b.innerHTML = `<i>♪</i><span>${IB.sound.on ? 'on' : 'off'}</span>`; };
      paint();
      b.addEventListener('click', () => { IB.sound.set(!IB.sound.on); paint(); IB.toast(IB.sound.on ? 'sound on. beep.' : 'sound off. shh.'); });
      ($('.nav__st', nav) || $('.nav__logo', nav)).after(b);
    }
    // every key on every device beeps; other toys tap
    document.addEventListener('click', (e) => {
      if (!IB.sound.on) return;
      const k = e.target.closest('.dev__b, [data-act], [data-try], .cr-keys span');
      if (k) {
        const i = k.dataset.b ?? k.dataset.act ?? k.dataset.try;
        if (i === 'love') IB.sound.love(); else if (i === 'sleep') IB.sound.sleep(); else if (i === 'bite') IB.sound.chomp(); else IB.sound.key(i);
        return;
      }
      if (e.target.closest('.lcd')) return IB.sound.love();
      if (e.target.closest('.pk, .key, [data-face], .ad-pet, .ad-shell, .lt-bub, [data-dice], [data-candle], [data-sh-next], [data-sh-prev], [data-wear], [data-adopt], [data-lt-adopt]')) IB.sound.tap();
    }, true);
    // it grumbles when it gets hungry, and again every half minute while it stays hungry
    let wasHungry = L.hungry();
    L.on((l) => { if (l.hungry() && !wasHungry) IB.sound.grumble(); wasHungry = l.hungry(); });
    setInterval(() => { if (L.hungry()) IB.sound.grumble(); }, 30000);
    const solid = () => nav && nav.classList.toggle('is-solid', scrollY > 40);
    addEventListener('scroll', solid, { passive: true }); solid();
    const btn = $('.nav__menu');
    if (btn) btn.addEventListener('click', () => document.documentElement.classList.toggle('menu-open'));
    $$('.nav__links a').forEach((a) => a.addEventListener('click', () => document.documentElement.classList.remove('menu-open')));
    $$('[data-scr]').forEach((el) => {
      el.dataset.text = el.textContent;
      el.addEventListener('pointerenter', () => IB.scramble(el, null, 0.5));
    });
  };

  /* loader: an ascii egg cracks, the pet says hi */
  IB.loader = (done) => {
    const L0 = $('.loader');
    if (!L0) return done();
    const pre = $('.loader__egg', L0), pct = $('.loader__pct', L0);
    const EGG = ['     .--.     ', "   .'    '.   ", '  /        \\  ', ' |          | ', ' |          | ', '  \\        /  ', "   '.____.'   "];
    const CR = [[3, 5, '/'], [3, 6, '\\'], [3, 7, '/'], [4, 8, '\\'], [2, 7, '/'], [4, 4, '/'], [3, 9, '\\'], [4, 9, '/'], [2, 4, '\\'], [5, 6, '/']];
    const id = IB.get('pet', 'glitch');
    if (RM) { L0.remove(); return done(); }
    const st = { p: 0 };
    let wob = 0;
    const draw = () => {
      const g = EGG.map((l) => [...l].map(esc));
      const n = Math.floor(st.p * CR.length);
      for (let i = 0; i < n; i++) { const [r, c, ch] = CR[i]; g[r][c] = `<i>${ch}</i>`; }
      const off = st.p > 0.3 ? (wob++ % 2 ? ' ' : '') : '';
      pre.innerHTML = g.map((r) => off + r.join('')).join('\n');
      pct.textContent = 'hatching ' + String(Math.floor(st.p * 100)).padStart(2, '0') + '%';
    };
    const tl = gsap.timeline({ onComplete: done });
    tl.from(pre, { scale: 0.6, opacity: 0, duration: 0.6, ease: 'back.out(2)' })
      .to(st, { p: 1, duration: 1.6, ease: 'power1.inOut', onUpdate: draw }, 0.1)
      .add(() => {
        const s = IB.sprite(id, 'happy', 3, -1);
        const W = 14, pad = (l) => ' '.repeat(Math.max(0, Math.floor((W - [...l].length) / 2))) + l;
        pre.innerHTML = ['<i>  .-/\\/\\/\\-.  </i>', '', ...s.map((l) => IB.color(pad(l))), '', "<i>  '-\\/\\/\\/-'  </i>"].join('\n');
        pct.textContent = 'hi. it’s yours now.';
        IB.sound.hello();
      })
      .fromTo(pre, { scale: 0.8 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' })
      .to(L0, { clipPath: 'circle(0% at 50% 50%)', duration: 0.9, ease: 'power3.inOut', delay: 0.55 })
      .add(() => L0.remove());
  };

  /* konami: 404 hatches + the litter rains */
  IB.konami = (fn) => {
    const K = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let i = 0;
    addEventListener('keydown', (e) => {
      i = e.key === K[i] || e.key.toLowerCase() === K[i] ? i + 1 : 0;
      if (i === K.length) { i = 0; fn(); }
    });
  };
  IB.rain = () => {
    const ids = [...Object.keys(IB.PETS), '404'];
    for (let i = 0; i < 26; i++) {
      const p = document.createElement('pre');
      p.className = 'rain';
      p.innerHTML = IB.sprite(ids[i % ids.length], 'happy', i % 4, i % 2 ? 1 : -1).map(IB.color).join('\n');
      p.style.left = rand(0, 94) + 'vw';
      document.body.appendChild(p);
      gsap.fromTo(p, { y: -150, rotation: rand(-30, 30) }, { y: innerHeight + 150, rotation: rand(-90, 90), duration: rand(1.8, 3.4), delay: rand(0, 1.4), ease: 'power1.in', onComplete: () => p.remove() });
    }
  };

  /* tab title */
  IB.tab = () => {
    const t = document.title;
    document.addEventListener('visibilitychange', () => {
      document.title = document.hidden ? (L.hungry() ? '(>.<) it’s hungry. come back.' : '(T.T) don’t leave it alone') : t;
      if (!document.hidden) setTimeout(() => (document.title = '(^.^) you came back!'), 0), setTimeout(() => (document.title = t), 1800);
    });
  };

  /* footer walker: a pet crossing the bottom of the page */
  IB.walker = (pre) => {
    if (!pre) return;
    const id = IB.get('pet', 'glitch');
    let dir = 1, f = 0;
    const draw = () => (pre.innerHTML = IB.sprite(IB.get('pet', 'glitch'), 'idle', (f ^= 1), dir).map(IB.color).join('\n'));
    draw();
    setInterval(draw, 380);
    if (RM) return;
    const go = () => {
      const W = pre.parentElement.clientWidth - pre.offsetWidth;
      gsap.to(pre, { x: dir > 0 ? W : 0, duration: W / 70, ease: 'none', onComplete: () => { dir *= -1; draw(); go(); } });
    };
    go();
  };

  /* signature */
  IB.sign = () => {
    console.log(
      '%c\n      /\\_/\\\n     ( o.o )   <3  ghostly.grl\n      > ^ <\n\n  i·byte — it’s a pet. it’s a byte. ignore it and it bites.\n  concept, design & code by ghostly.grl ♥\n  try IB.feed(), IB.adopt("lowbat"), or the konami code.\n',
      'font-family:monospace;color:#ff4fa2;font-size:12px'
    );
  };

  /* everything every page needs */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  IB.boot = (after) => {
    if (!location.hash) scrollTo(0, 0);
    IB.smooth();
    L.load();
    L.start();
    IB.nav();
    IB.cursor();
    IB.slots();
    IB.chains();
    IB.chomper();
    IB.tab();
    IB.sign();
    IB.walker($('.ft__walker'));
    IB.konami(() => { IB.set('pet', '404'); IB.set('found404', true); IB.rain(); IB.toast('404 hatched. it was always here.'); document.dispatchEvent(new CustomEvent('ib:pet', { detail: '404' })); });
    const ftb = $('[data-bitten]');
    if (ftb) L.on((l) => (ftb.textContent = l.bites));
    IB.loader(() => {
      if (!location.hash && scrollY < 300) (IB.lenis ? IB.lenis.scrollTo(0, { immediate: true, force: true }) : scrollTo(0, 0));
      IB.magnetic(); after && after(); ScrollTrigger.refresh();
    });
  };

  /* console helpers */
  IB.feed = () => { L.feed(); document.dispatchEvent(new CustomEvent('ib:act', { detail: 0 })); return '(^o^) nom'; };
  IB.adopt = (id) => { if (!IB.PETS[id] && id !== '404') return 'try: ' + Object.keys(IB.PETS).join(', '); IB.set('pet', id); document.dispatchEvent(new CustomEvent('ib:pet', { detail: id })); return 'it’s yours now: ' + IB.pet(id).name; };
})();

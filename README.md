<div align="center">

<img src="docs/hatch.gif" alt="the i·byte egg cracks and the pet floats in a pink pearl heart inside a chrome ring" width="820" />

# i·byte

**pocket pets made of ascii.**
*it's a pet. it's a byte. ignore it and it bites.*

![html](https://img.shields.io/badge/html-plain-ff4fa2?style=flat-square&labelColor=060509)
![css](https://img.shields.io/badge/css-hand_made-ff4fa2?style=flat-square&labelColor=060509)
![js](https://img.shields.io/badge/js-vanilla-ff4fa2?style=flat-square&labelColor=060509)
![gsap](https://img.shields.io/badge/gsap-3.12.5-f7f2f7?style=flat-square&labelColor=060509)
![lenis](https://img.shields.io/badge/lenis-1.1.13-f7f2f7?style=flat-square&labelColor=060509)
![build](https://img.shields.io/badge/build_step-none-a9bcff?style=flat-square&labelColor=060509)
![pages](https://img.shields.io/badge/pages-6-a9bcff?style=flat-square&labelColor=060509)

concept, design & code by **ghostly.grl ♥**

</div>

---

**i·byte** is a concept brand of pocket pets in the spirit of the 90s egg-shaped virtual pets. The twist: the pets are made of nothing but **ascii**. Every creature, every animation, every crumb and every tear is plain text, living on a tiny black LCD inside a glossy pearl, chrome or jelly shell.

The website is a pet too. One hatches the first time you open it. It gets hungry, bored and messy in real time, and it keeps living while you're away. Feed it with the keys on its shell. Forget it, and it **bites the site**: hover a photo, a card or a paragraph and a chunk gets chewed out of it, with crumbs.

### highlights

- 🥚 **an ascii egg loader** that cracks, then your pet says hi
- 🐰 **six ascii pets + a secret one**, each with 4 frames, 12 faces and its own quirk, walking around live LCDs
- 💗 **her 3d renders as shells**, with the screen cut out and the pet living behind it. The keys on the photos really work
- ⏱️ **a real life model**: hunger, joy and mess drain in real time and keep draining while the tab is closed
- 🦷 **it bites**: a starving pet chews CSS-mask teeth marks into whatever you hover
- 📱 **a flip phone that opens in 3d** and types your pet's name T9-style
- 👻 **a memorial** where your own pet fades over 48 hours as you scroll, and candles stay lit
- 📜 **adoption papers** with a canvas signature, a holographic certificate and a hatch
- 🔊 **tamagotchi beeps** made live with the Web Audio API (off by default)
- 🎮 **easter eggs**: the konami code, a talking tab title, console commands, and more

<table>
  <tr>
    <td><img src="docs/phone.gif" alt="the flip phone rings and opens" /></td>
    <td><img src="docs/faces.gif" alt="tapping faces on the sticker sheet makes the live pet do them" /></td>
  </tr>
  <tr>
    <td align="center"><sub>the adoption line: it rings, the lid opens once, the keys type</sub></td>
    <td align="center"><sub>the litter: tap a face and the live pet makes it</sub></td>
  </tr>
</table>

---

## contents

- [screens](#screens)
- [the look](#the-look)
- [the pets](#the-pets)
- [the shells](#the-shells)
- [how it lives](#how-it-lives)
- [pages](#pages)
- [sound](#sound)
- [easter eggs](#easter-eggs)
- [images](#images)
- [fixing a shell photo](#fixing-a-shell-photo)
- [stack](#stack)
- [structure](#structure)
- [run it](#run-it)
- [reel](#reel)
- [credits](#credits)

---

## screens

| | |
|---|---|
| ![home hero](docs/01-home-hero.jpg) | ![the rule](docs/02-the-rule.jpg) |
| **home** · the pink heart inside her chrome ring | **the rule** · the last line gets bitten as you scroll |
| ![the litter on the home](docs/03-home-litter.jpg) | ![a day in the life](docs/04-a-day.jpg) |
| **the litter** · one pet per scroll step in the pearl cat | **a day in the life** · a chrome clock, 07:00 → 03:00 |
| ![shells on the home](docs/05-home-shells.jpg) | ![the adoption line](docs/06-adoption-line.jpg) |
| **shells** · on her pearl chain with the bow | **the adoption line** · pick up. |
| ![litter page](docs/07-litter.jpg) | ![a litter chapter](docs/08-litter-chapter.jpg) |
| **the litter page** · six glass bubbles | **a chapter per pet** · and every face it makes |
| ![shells rack](docs/09-shells-rack.jpg) | ![shells counter](docs/10-shells-counter.jpg) |
| **shells page** · the keychain rack | **the counter** · one shell at a time, sideways |
| ![care guide](docs/11-care.jpg) | ![care steps](docs/12-care-steps.jpg) |
| **care guide** · live meters and countdowns | **six steps** · they happen to your pet as you scroll |
| ![ghosts 48 hours](docs/13-ghosts-48h.jpg) | ![ghosts wall](docs/14-ghosts-wall.jpg) |
| **ghosts** · 48 hours, if nobody comes back | **in memory of** · light a candle |
| ![adopt](docs/15-adopt.jpg) | ![hatch](docs/16-hatch.jpg) |
| **adopt one** · the papers and the holo certificate | **hatch it** · the egg cracks, the litter rains |

<p align="center"><img src="docs/mobile.jpg" alt="i·byte on a phone: home, litter, shells, care, ghosts, adopt" /></p>

## the look

One world, **glossy night**: black, pearl, chrome and a single hot pink, like a club flyer for toys.

| | |
|---|---|
| background | `#060509` near-black with a film grain over everything |
| pearl | `#f7f2f7`, pearl gradients on buttons and pills |
| chrome | a silver gradient clipped into the giant wordmarks |
| pink | `#ff4fa2`, the only accent: hearts, alerts, glows, the dot in every title |
| type | **Geist** for tiny rex-club caps and giant tight lowercase titles; **JetBrains Mono** for every screen |
| objects | her 3d renders (heart, cat, strawberry, spiked heart, jelly cloud, flip phone) with the screen cut out, pearl ball chains, chrome rings, glass bubbles, starbursts |

Every page opens with the same three-column caps row under a hairline, and every big title ends with a pink square dot.

## the pets

Six pets, plus one that doesn't exist. Each has 4 frames, its own walk / idle / trick sequences, a nap pose and a **quirk**. They wander the screen, sit, blink, turn around, do tricks and pop little emotes (♪ ? ♥ ✦). Sprites are drawn facing left and mirrored in code. Hearts and alerts render in pink.

| n° | name | kind | its thing |
|---|---|---|---|
| 01 | **GLITCH** | bunny | hops; when it's happy it glitches, characters flicker into static |
| 02 | **CACHE** | hamster | stuffs its cheeks `((=^‿^=))` and keeps them full for a while after eating |
| 03 | **CTRL** | cat | swishes its tail, then swats a cup `[_]` off the table and looks smug |
| 04 | **SPAM** | octopus | wiggles eight arms, sends `@ @ @` every few seconds, squirts ink `░` when upset |
| 05 | **BLIP** | frog | hops, puffs its throat, shoots its tongue `----•` at things |
| 06 | **LOWBAT** | bat | flaps and floats, always on `[|  ]`, sleeps **upside down** hanging from a branch |
| ?? | **404** | unknown | not found. found you. (see [easter eggs](#easter-eggs)) |

### the faces

Every pet has twelve faces, swapped into the sprite by mood:

| face | mood | | face | mood |
|---|---|---|---|---|
| `•.•` | idle | | `°o°` `^∪^` | eating, chewing |
| `-.-` | blink | | `x.x` | sick (dirty screen) |
| `^‿^` | happy | | `♥‿♥` | love (you petted it) |
| `T.T` | sad, a little cloud ☁ rains on it | | `¬‿¬` | smug |
| `>.<` | angry (hungry) | | `O.O` | wow (something changed) |
| `-‿-` | asleep, `zZ` floats up | | | |

### what it does on screen

- **feed (−)**: a snack `(##)` drops in and gets eaten in four bites, crumbs fly
- **play (●)**: a ball bounces around, it chases it, notes ♪ pop out
- **clean (+)**: a broom sweeps across the screen, the `(@)` in the corner disappears, sparkles ✦
- **pet it**: tap the screen, hearts float up

## the shells

Five shells, all her renders with a transparent cut-out screen. The pet lives on a black LCD behind each one, and the three keys on the photo really work.

| n° | shell | price | it is |
|---|---|---|---|
| 01 | **CRUSH** | €45 | pink pearl heart, two screws, a screen that glows in the dark |
| 02 | **MOON** | €49 | pearl cat, two ears, rhinestones, its own pearl chain |
| 03 | **BERRY** | €39 | strawberry milk egg with an antenna for gossip |
| 04 | **BITE** | €45 | bubblegum heart with chrome spikes. soft. mostly. |
| 05 | **PUFF** | €39 | a jelly cloud on a carabiner |

"wear this shell" (home, shells page, adopt) changes the shell your pet lives in **on every page**.

## how it lives

The life model (`IB.life`, saved as `ib-life`) has three needs:

| need | meter | on the page | while you're away |
|---|---|---|---|
| **full** | `■■■□` 0–4 | −1 every 40 s | −1 every 90 s |
| **joy** | `■■■□` 0–4 | −1 every 55 s | −1 every 120 s |
| **mess** | `■□□` 0–3 | +1 every 70 s | +1 every 150 s |

- the nav status dot says **alive & fine**, **bored**, **it made a mess** or, in pink and blinking fast, **hungry. it bites.**
- the pet's face follows its needs everywhere it appears (sad when bored, sick when dirty, angry when hungry)
- **when full hits 0 it bites**: hover anything bitable and, after a moment, three teeth marks are cut out of its edge with a CSS mask, crumbs fall, the element shakes. Feed it and it stops. The marks stay until you reload
- the footer counts every bite: *things bitten on this site*

## pages

| page | what's on it |
|---|---|
| **`index.html`** home | the egg loader · hero · the rule · the litter · a day in the life · shells · worn · the adoption line |
| **`litter.html`** the litter | six glass bubbles, a chapter per pet, the 404 card |
| **`shells.html`** shells | a keychain rack, then the counter sliding sideways |
| **`care.html`** care guide | live meters, six steps that happen to your pet as you scroll, read the face |
| **`ghosts.html`** ghosts | the memorial: your pet fades over 48 hours, a wall of the forgotten, candles |
| **`adopt.html`** adopt one | the papers: pet, shell, name, signature, holographic certificate, the hatch |

### home, screen by screen

Each screen follows one image of the moodboard in `VIBES/`.

1. **loader**: a glowing ascii egg wobbles and cracks (`hatching 00%`), then your pet says *hi. it's yours now.* and the screen opens in a circle
2. **hero**: the club flyer. A three-column info row, your hatch date, *hatch day*, the pet names; your pet in the pink heart floating inside **her chrome ring**, a chrome bead orbiting in front of it and behind it, glass bubbles and starbursts; giant `i·byte` underneath. **− ● +** on the shell (or on the side) feed, play, clean; the heart tilts toward the mouse (`VIBES/04 rex-club`)
3. **the rule**: pinned. *feed it. play with it. clean up. or it bites.* As you scroll the last line gets bitten four times while the spiked heart watches (`VIBES/09`)
4. **the litter**: pinned, one pet per scroll step in the pearl cat shell, the name scrambles in, stats, quirk, "make it mine"; the list on the right jumps to any pet (`VIBES/06 silver-cat`)
5. **a day in the life**: pinned. A chrome clock runs 07:00 → 03:00, the light changes with the hour and the pet lives its day on a wide screen (wakes up, breakfast, plays, sulks, sleeps) next to a diary (`VIBES/02`)
6. **shells**: each shell drops in on her pearl chain with the bow and swings with the mouse; her studio shot next to it; "wear this shell" (`VIBES/05`)
7. **worn**: lookbook, her photos in parallax and a jelly cloud on a ball chain (`VIBES/08`)
8. **the adoption line**: her flip phone **rings** (pink rings, it buzzes), the pet peeks through the flower window. Scroll and the lid lifts open in 3d, **once**, and stays open. Its keys type your pet's name T9-style (tap again to cycle the letters), the green key adopts. Your keyboard types too. *pick up.* in chrome and pink behind it (`VIBES/flip phone`)
9. **footer**: info row, chrome wordmark, your pet walking along the ground

### the litter

- six glass bubbles, one pet in each: hover one and it does its trick, click and you jump to its chapter
- **a chapter per pet**: the shell it lives in hanging from **her straight pearl chain with the bow**, alive with working keys; chrome name rising letter by letter; stats that fill up; its thing; what it likes
- **the sticker sheet**: all twelve faces as tiny animated tiles. Tap one and the live pet makes that face (eats, plays, gets angry, falls asleep…)
- **the 404 card**: a locked, scrambled pet with a hint. Unlock it and it shows itself

### shells

- **the rack**: the five shells drop from the top on pearl chains at different heights and swing with the mouse, your pet in every one; *shells.* in giant chrome behind
- **the counter**: pinned, the tray slides sideways one shell at a time and snaps: her studio shot, the live shell rotating upright, name, note, traits, price, the pet it suits, its glow colour, "wear this shell"
- *every shell comes with*: a pet that's already yours, a 40 cm pearl ball chain, three keys, one cr2032 battery (forever-ish), a screen that glows, zero warranty against bites

### care guide

A manual you do instead of read.

- **right now**: a black screen with your pet's live meters and a countdown to the next change of each, plus a verdict (*hungry. it bites. ↓ step 01*). It turns pink when it's hungry
- **six steps**: your device (your pet, your shell) sticks on screen while the steps scroll past, and **each step happens to it once**: 01 it eats · 02 it plays · 03 a mess appears and gets swept · 04 hearts · 05 **lights out**, the whole page goes dark around it and it sleeps · 06 it gets angry and **bites the card**. Every step also has a *try it* button
- **read the face**: ten rows, each with your pet making that face, what it means and what to do

### ghosts

The memorial, the same night but colder.

- ghost pets made of thinning characters drift up the screen; *forgotten this year* keeps counting
- **48 hours**: pinned. Your own pet, hour by hour, if nobody comes back: fine, hungry, angry, bored under a cloud, sick, then it thins out into dots and floats away. A chrome clock counts `hour 00 → 48`
- **in memory of**: twelve stones, each with a ghost, the name its owner gave it, how long it lived and the cause as reported (*batman · lived 19 days · "battery died. ironic."*). **Light a candle**: the ascii flame flickers, the count goes up, the ghost warms to pink. Candles stay lit
- **yours**: your pet, alive, in your shell. *yours isn't here. yet.*, or *feed it.* if it's hungry

### adopt one

- **01 pick a pet** · **02 pick a shell** (her renders) · **03 name it** (or roll the dice ⚄ for one) · **04 sign the papers**: draw your signature with the mouse or a finger, in glowing pink
- a live device and a **holographic hatch certificate** fill in as you go: name, kind, shell, today's date, a serial number `IB-xxxxx`, your signature. The foil shifts colour and the card tilts with the mouse
- **hatch it**: the screen closes into a circle, an ascii egg cracks and shakes, your pet pops out (*it's a frog. say hi to mochi.*) and **the whole litter rains down**. It becomes your pet, in your shell, with your name, everywhere on the site, starting full and happy
- *adopt another* (or "adopt one" in the nav) gives you fresh papers and starts over

## sound

Off until you press **♪ off** in the nav (it remembers, `ib-sound`). Tiny square-wave beeps generated live with the Web Audio API, like the real toys, no audio files.

| what | sounds like |
|---|---|
| feed − | two notes going down |
| play ● | two notes going up |
| clean + | a quick sweep up |
| pet it | a three-note chirp |
| other toys (keys, faces, bubbles, candles, dice) | a soft tick |
| lights out (care) | a little lullaby going down |
| the egg cracking (adopt) | a *crack* per crack |
| the hatch | a fanfare |
| the home loader | a three-note hello |
| hungry | a low wobbly grumble and a sad two-note whine, again every 30 s while it stays hungry |
| a bite | *chomp* |

## easter eggs

- **↑ ↑ ↓ ↓ ← → ← → b a** (the konami code, on any page): **404 hatches**, the whole litter rains down from the top of the screen and 404 becomes your pet on every screen of the site. The 404 card on the litter page unlocks, and 404 shows up as a choice on the adoption papers
- **it bites the site.** Let it starve and hover things: three teeth, crumbs, a shake, a toast (*chomp. it's hungry — feed it ↑*). The footer keeps score
- **the tab title talks**: leave the tab and it says `(T.T) don't leave it alone`, or `(>.<) it's hungry. come back.` if it is. Come back and it says `(^.^) you came back!`
- **it lived while you were gone**: close the site and come back later, the meters have dropped for the time you were away
- **the console**: open dev tools for a signed ascii cat and a hint. Then try
  - `IB.feed()` feeds it from the console
  - `IB.adopt("lowbat")` (or `glitch`, `cache`, `ctrl`, `spam`, `blip`, `404`) swaps your pet everywhere
- **type on the phone**: once the adoption line is open, your real keyboard types the name, backspace deletes, enter adopts
- **you can't hang up on family**: press the red key on the phone
- **the green dot isn't decoration**: the status in the nav changes with your pet's mood
- **GLITCH glitches**: watch it when it's happy, its characters flicker into `#%@&▓░*`
- **LOWBAT sleeps upside down**, hanging from a branch at the top of the screen, and its `zZ` falls down instead of up
- **CTRL is a menace**: wait for its trick
- **lights out**: step 05 of the care guide turns the whole page off around your pet
- **candles stay lit**: the ones you light on the ghosts page are still burning next time
- **your hatch date**: the date in the home hero is the day your pet first hatched in this browser
- **signatures in the code**: an ascii pet device in the head of `index.html`, a cat with `<3 ghostly.grl` after `</html>` on every page, *concept, design & code by ghostly.grl ♥* at the top of every css and js file
- **`?tune`**: add it to a page's address to see and drag the hidden layout of every shell photo (see below)

## images

### `img/SHELLS` — the toys (png, transparent background, screen cut out)

| file | used for |
|---|---|
| `heart-shell.png` | CRUSH |
| `cat-shell.png` | MOON (it has its own pearl chain) |
| `berry-shell.png` | BERRY |
| `spikeheart-shell.png` | BITE |
| `puff-shell.png` | PUFF |
| `chain.png` | pearl chain with the bow: the shells carousel on the home hangs from it |
| `hero-ring.png` | the chrome ring around the heart in the home hero (cut in two halves in css, so the heart sits inside it) |
| `phone-img/1.png` | the adoption line, closed: the pet peeks through the flower window |
| `phone-img/3.png` | the adoption line, open: cut into base + lid for the 3d opening |
| `phone-img/2.png`, `phone-img/4.png`, `phone.gif` | references for the opening (not loaded) |

### `img/LITTER`

| file | used for |
|---|---|
| `chain.png` | the straight pearl chain with the bow: litter chapters and the shells rack |
| `chain-beads.png` | a strip of beads cut from `chain.png`, repeated above it so the chain reaches the top of the screen |

### `img/HOME` — photos

| file | what's in it |
|---|---|
| `look-close.jpg` | close-up (square) |
| `look-main.png` | full look (portrait) |
| `look-hand.png` | a hand holding the device (portrait) |
| `shell-crush.png` · `moon-shell.png` · `berry-shell.png` · `shell-bite.png` · `puff-shell.png` | studio shots next to the shells carousel and on the shells counter |

Any slot without its file shows the file name it's waiting for.

## fixing a shell photo

The layout of every shell is in `IB.SHELL_PHOTOS`, at the top of the shells part of `js/main.js`, in % of the photo:

```js
crush: { file: 'img/SHELLS/heart-shell.png', size: 1.12, screen: [31, 30, 37.4, 23.3], keys: [[36, 64.5], [49.4, 64.5], [63.6, 64.5]], ring: [50, 19] },
```

- `size`: how big the photo sits in the device box (1 = as wide as the box)
- `screen`: `[left, top, width, height]` of the see-through hole
- `keys`: the centres of the three buttons (feed, play, clean)
- `ring`: where a chain hooks on · `chain: false` if the photo already has its own

1. open `index.html?tune`. On each photo a dashed pink box is the screen (drag it, resize it from the white corner), three pink dots are the buttons and the ring is the chain hook. Hover a device and press **+** / **−** to make the photo bigger or smaller
2. click the pink code line under the device (it copies) and paste it over that shell's line
3. to swap a toy, change its `file`. No file = the original svg shell comes back

## stack

Plain HTML / CSS / JS, no build step, no frameworks.

- **GSAP 3.12.5** + **ScrollTrigger** (pins, scrubs, the phone, the counter, every entrance) and **Lenis 1.1.13** for smooth scroll, from CDN
- fonts: **Geist**, **JetBrains Mono** (Google Fonts)
- everything else is hand-made: the ascii sprite engine, the LCD renderer, the svg shells, the pearl ball chains, the life model, the CSS-mask bites, the T9 keypad, the canvas signature, the Web Audio beeps
- state lives in `localStorage` with the prefix `ib-`: `pet`, `shell`, `petname`, `life`, `born`, `sound`, `candles`, `found404`

## structure

```
IBYTE/
├── index.html · litter.html · shells.html · care.html · ghosts.html · adopt.html
├── favicon.svg            pink pearl heart with •.• on its screen
├── css/
│   ├── style.css          shared: variables, nav, buttons, devices & lcd, slots, toast, footer
│   └── index.css · litter.css · shells.css · care.css · ghosts.css · adopt.css
├── js/
│   ├── main.js            the engine, window.IB: pets & faces, sprite + mirror, the Screen (lcd),
│   │                      svg shells + shell photos + ?tune, ball chains, life, bites, sound,
│   │                      loader, cursor, nav, konami, tab title, console signature
│   └── index.js · litter.js · shells.js · care.js · ghosts.js · adopt.js
├── img/HOME · img/SHELLS · img/LITTER
├── docs/                  screenshots and gifs for this readme (the site doesn't load them)
└── VIBES/                 the moodboard every screen follows
```

## run it

Serve the folder and open it in a browser:

```bash
python3 -m http.server 8000
```

then go to `localhost:8000`.

To start from scratch (a new egg), clear the site's `localStorage` or run this in the console:

```js
Object.keys(localStorage).filter(k => k.startsWith('ib-')).forEach(k => localStorage.removeItem(k)); location.reload();
```

## reel

i·byte is **case study 28 / 28** of the *martina.exe* series: a 2:23 vertical reel (1080×1920). The ascii egg cracks into the heart inside the chrome ring, then 18 clips captured from the live site: the hatch, the keys, the bitten rule, the litter, the clock, the shells, the phone opening, the faces, the rack, the counter, the care steps, the 48 hours, the candles, the papers and the hatch, plus the phone version.

## credits

- concept, art direction, design, code: **ghostly.grl**
- the 3d shells, the chrome ring, the pearl chains, the flip phone and the photos: **ghostly.grl**
- type: [Geist](https://vercel.com/font) by Vercel, [JetBrains Mono](https://www.jetbrains.com/lp/mono/) by JetBrains
- motion: [GSAP](https://gsap.com) + ScrollTrigger, smooth scroll: [Lenis](https://lenis.darkroom.engineering)

---

i·byte is a concept, not a real toy company, and not associated with any real virtual-pet brand (although we wish <3).

```
   .-""""""-.
 .'  _    _  '.
/   (o)  (o)   \
|  .----------. |
|  |  (\ /)   | |
|  | ( •.• )  | |
|  | (")_(")o | |
|  '----------' |
 \    −  ●  +  /
  '.         .'
    '-.___.-'      feed it. play with it. clean up. or it bites.
```

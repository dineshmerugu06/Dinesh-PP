# Dinesh PP

Dinesh Kumar's portfolio — katana-school design language: ink black, acid yellow,
mono `>` labels, blurred mega-type, floating 3D dragon hero.

## Structure

- `index.html` — the whole site, 9 sections:
  1. Hero (3D dragon canvas)
  2. Transition ("Focus / Keep scrolling / The craft awakens")
  3. Ember (particle divider)
  4. About
  5. Skills
  6. Skill Hub (projects)
  7. Who I build for
  8. Approach
  9. Footer / contact
- `assets/css/main.css` — design system
- `assets/js/main.js` — Lenis + GSAP ScrollTrigger, cursor, magnetic buttons, reveals
- `assets/js/hero3d.js` — three.js dragon (ES module)
- `assets/js/ember.js` — ember particle canvas
- `assets/js/vendor/` — gsap, ScrollTrigger, lenis, three (self-hosted, pinned)
- `assets/models/dragon.glb` — Merugu's own dragon (original colors kept)
- `assets/fonts/` — Space Grotesk + Space Mono (self-hosted, OFL)

## Run

Any static server, e.g. `python3 -m http.server` in this folder.
No build step. Zero external requests.

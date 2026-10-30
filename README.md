# katana — mirror of string-tune.fiddle.digital

100% mirror of https://string-tune.fiddle.digital/ (StringTune JS library site, Nuxt), downloaded 2026-10-28.

- `index.html` — home
- `dev-guides.html` — /dev-guides
- `skill-hub.html` — /skill-hub
- `_nuxt/` — Nuxt JS + CSS
- `images/`, `videos/` — images and videos, including all tutorial videos that exist on the live site
- `fonts/`, `fav/` — fonts and favicons

Notes: tutorial videos numbered past the live site's range (e.g. layouts/03+) return 404 on the live site too, so they are not included. Nuxt loads some assets by absolute path (`/videos/...`, `/images/...`), so this mirror must be served at a domain root, not under a subpath.

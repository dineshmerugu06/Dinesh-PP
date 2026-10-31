/* Dinesh-PP v3 — main.js */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

gsap.registerPlugin(ScrollTrigger);

/* ---- Lenis smooth scroll ---- */
const lenis = new Lenis({ lerp: 0.09 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

/* ---- progress bar ---- */
const bar = document.getElementById('progressBar');
ScrollTrigger.create({
  onUpdate: s => bar.style.width = (s.progress * 100) + '%'
});

/* ---- hero entrance ---- */
gsap.from('.hero-center .mega', { y: 80, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 });
gsap.from('.hero-kicker, .hero-sub, .giant-name', { y: 24, opacity: 0, duration: 1, stagger: 0.12, delay: 0.5 });
gsap.from('.hero-topbar, .hero-foot, .hero-logo, .hero-pills', { opacity: 0, duration: 1, delay: 0.8 });

/* ---- debug readout ---- */
const dbg = document.getElementById('debugReadout');
if (dbg) addEventListener('mousemove', e => dbg.textContent = `x:${e.clientX} y:${e.clientY}`);

/* ---- scramble title ---- */
function scramble(el) {
  const chars = '!<>-_\\/[]{}—=+*^?#';
  const orig = el.dataset.text || el.textContent;
  el.dataset.text = orig;
  let frame = 0;
  const total = 28;
  const iv = setInterval(() => {
    frame++;
    el.textContent = orig.split('').map((c, i) => {
      if (c === ' ' || c === '\n') return c;
      return (i / orig.length) < (frame / total) ? c : chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    if (frame >= total) { clearInterval(iv); el.textContent = orig; }
  }, 34);
}
document.querySelectorAll('.journey-inner .mega-sm').forEach(el => {
  ScrollTrigger.create({ trigger: el, start: 'top 75%', once: true, onEnter: () => scramble(el) });
});

/* ---- hero dragon ---- */
function makeScene(canvas, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 6, 7); scene.add(key);
  const rim = new THREE.DirectionalLight(0xd9381e, 2.8); rim.position.set(-6, 2, -5); scene.add(rim);
  return { renderer, scene, cam };
}
function fitCanvas(canvas, renderer, cam) {
  const r = canvas.getBoundingClientRect();
  const w = Math.max(2, r.width), h = Math.max(2, r.height);
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  cam.aspect = w / h; cam.updateProjectionMatrix();
}

const heroCanvas = document.getElementById('hero3d');
const hero = makeScene(heroCanvas);
hero.cam.position.set(0, 0.6, 12); hero.cam.lookAt(0, 0.4, 0);
let heroModel = null, heroMixer = null;
new GLTFLoader().load('assets/img/dragon.glb', g => {
  heroModel = g.scene;
  const box = new THREE.Box3().setFromObject(heroModel);
  const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
  heroModel.position.sub(c);
  heroModel.scale.multiplyScalar(7.5 / Math.max(s.x, s.y, s.z));
  heroModel.position.y -= 0.6;
  hero.scene.add(heroModel);
  if (g.animations.length) { heroMixer = new THREE.AnimationMixer(heroModel); heroMixer.clipAction(g.animations[0]).play(); heroMixer.timeScale = 0.5; }
  // scroll-linked spin + mouse parallax (interactive 3D, not static)
  let mx = 0, my = 0, tx = 0, ty = 0;
  addEventListener('mousemove', e => {
    tx = (e.clientX / innerWidth - 0.5);
    ty = (e.clientY / innerHeight - 0.5);
  });
  heroModel.userData.tick = (dt) => {
    mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
    heroModel.rotation.x = my * 0.35;
    heroModel.position.x = mx * 0.8;
  };
  ScrollTrigger.create({
    trigger: '.s-hero', start: 'top top', end: 'bottom top', scrub: 1,
    onUpdate: s => { if (heroModel) heroModel.rotation.y = s.progress * Math.PI * 1.2 - 0.4 + mx * 0.5; }
  });
});

/* ---- render loop (hero only) ---- */
const clock = new THREE.Clock();
function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.05);
  fitCanvas(heroCanvas, hero.renderer, hero.cam);
  if (heroMixer) heroMixer.update(dt);
  if (heroModel && heroModel.userData.tick) heroModel.userData.tick(dt);
  hero.renderer.render(hero.scene, hero.cam);
}
loop();

/* ---- focus stages ---- */
document.querySelectorAll('.focus-stage').forEach((el, i, arr) => {
  ScrollTrigger.create({
    trigger: '.s-focus', start: `${(i / arr.length) * 100}% top+=${(i / arr.length) * 400}vh`,
    end: `${((i + 1) / arr.length) * 100}% top+=${(i / arr.length) * 400}vh`,
    onEnter: () => gsap.to(el, { opacity: 1, duration: 0.5 }),
    onLeave: () => gsap.to(el, { opacity: 0, duration: 0.5 }),
    onEnterBack: () => gsap.to(el, { opacity: 1, duration: 0.5 }),
    onLeaveBack: () => gsap.to(el, { opacity: 0, duration: 0.5 })
  });
});

/* ---- storm canvas ---- */
const storm = document.getElementById('storm');
const sctx = storm.getContext('2d');
let drops = [];
function stormInit() {
  storm.width = storm.offsetWidth; storm.height = storm.offsetHeight;
  drops = Array.from({ length: 160 }, () => ({
    x: Math.random() * storm.width, y: Math.random() * storm.height,
    l: 8 + Math.random() * 18, v: 4 + Math.random() * 7, o: 0.08 + Math.random() * 0.2
  }));
}
stormInit(); addEventListener('resize', stormInit);
(function stormTick() {
  requestAnimationFrame(stormTick);
  const r = storm.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) return;
  sctx.clearRect(0, 0, storm.width, storm.height);
  sctx.strokeStyle = '#9fb4ff'; sctx.lineWidth = 1;
  for (const d of drops) {
    sctx.globalAlpha = d.o;
    sctx.beginPath(); sctx.moveTo(d.x, d.y); sctx.lineTo(d.x - 3, d.y + d.l); sctx.stroke();
    d.y += d.v; d.x -= 1.2;
    if (d.y > storm.height) { d.y = -20; d.x = Math.random() * storm.width; }
  }
  sctx.globalAlpha = 1;
})();

/* ---- dialogue reveal ---- */
gsap.utils.toArray('.dlg-line').forEach((el, i) => {
  gsap.from(el, {
    x: -40, opacity: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%' }
  });
});

/* ---- cycling word ---- */
const cycleEl = document.getElementById('cycleWord');
if (cycleEl) {
  const words = ['Clarity.', 'Focus.', 'Craft.', 'Intent.', 'Ship.'];
  let wi = 0;
  setInterval(() => {
    wi = (wi + 1) % words.length;
    gsap.to(cycleEl, { opacity: 0, y: -18, duration: 0.3, onComplete: () => {
      cycleEl.textContent = words[wi];
      gsap.to(cycleEl, { opacity: 1, y: 0, duration: 0.4 });
    }});
  }, 2600);
}

/* ---- section reveals ---- */
gsap.utils.toArray('.mega-sm, .bento-card, .tech-item, .for-card, .clarity-grid > div').forEach(el => {
  gsap.from(el, {
    y: 50, opacity: 0, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 88%' }
  });
});

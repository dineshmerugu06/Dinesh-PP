import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
gsap.registerPlugin(ScrollTrigger);

/* Lenis */
const lenis = new Lenis({ lerp: 0.09 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

/* progress */
const bar = document.getElementById('progressBar');
ScrollTrigger.create({ onUpdate: s => bar.style.width = (s.progress * 100) + '%' });

/* hero entrance */
gsap.from('.hero-giant', { opacity: 0, duration: 1.6, delay: 0.2 });
gsap.from('.hero-tr,.hero-label-1,.hero-label-2,.hero-label-3,.hero-pixel-logo,.hero-nav-min', { opacity: 0, y: 14, duration: 0.9, stagger: 0.08, delay: 0.6 });

/* hero 3D dragon — interactive */
const canvas = document.getElementById('hero3d');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
cam.position.set(0, 0.4, 11); cam.lookAt(0, 0.2, 0);
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 6, 7); scene.add(key);
const rim = new THREE.DirectionalLight(0xd9381e, 3.0); rim.position.set(-6, 2, -5); scene.add(rim);
function fit() {
  const r = canvas.getBoundingClientRect();
  const w = Math.max(2, r.width), h = Math.max(2, r.height);
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  cam.aspect = w / h; cam.updateProjectionMatrix();
}
let model = null, mixer = null, mx = 0, my = 0, tx = 0, ty = 0;
addEventListener('mousemove', e => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; });
addEventListener('touchmove', e => { const t = e.touches[0]; tx = t.clientX / innerWidth - 0.5; ty = t.clientY / innerHeight - 0.5; }, { passive: true });
new GLTFLoader().load('assets/img/dragon.glb', g => {
  model = g.scene;
  const box = new THREE.Box3().setFromObject(model);
  const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
  model.position.sub(c);
  model.scale.multiplyScalar(4.2 / Math.max(s.x, s.y, s.z));
  model.position.y -= 0.4;
  scene.add(model);
  if (g.animations.length) { mixer = new THREE.AnimationMixer(model); mixer.clipAction(g.animations[0]).play(); mixer.timeScale = 0.5; }
  ScrollTrigger.create({
    trigger: '.s-hero', start: 'top top', end: 'bottom top', scrub: 1,
    onUpdate: st => { if (model) model.rotation.y = st.progress * Math.PI * 1.5 - 0.5; }
  });
});
const clock = new THREE.Clock();
(function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.05);
  fit();
  mx += (tx - mx) * 0.045; my += (ty - my) * 0.045;
  if (model) { model.rotation.x = my * 0.4; model.position.x = mx * 1.0; }
  if (mixer) mixer.update(dt);
  renderer.render(scene, cam);
})();

/* focus stages */
document.querySelectorAll('.focus-stage').forEach((el, i, arr) => {
  ScrollTrigger.create({
    trigger: '.s-focus',
    start: `top+=${(i / arr.length) * 400}vh top`,
    end: `top+=${((i + 1) / arr.length) * 400}vh top`,
    onEnter: () => gsap.to(el, { opacity: 1, duration: 0.5 }),
    onLeave: () => gsap.to(el, { opacity: 0, duration: 0.5 }),
    onEnterBack: () => gsap.to(el, { opacity: 1, duration: 0.5 }),
    onLeaveBack: () => gsap.to(el, { opacity: 0, duration: 0.5 })
  });
});

/* storm */
const storm = document.getElementById('storm'), sctx = storm.getContext('2d');
let drops = [];
function stormInit() {
  storm.width = storm.offsetWidth; storm.height = storm.offsetHeight;
  drops = Array.from({ length: 150 }, () => ({ x: Math.random() * storm.width, y: Math.random() * storm.height, l: 8 + Math.random() * 18, v: 4 + Math.random() * 7, o: 0.08 + Math.random() * 0.2 }));
}
stormInit(); addEventListener('resize', stormInit);
(function tick() {
  requestAnimationFrame(tick);
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

/* scramble */
function scramble(el) {
  const chars = '!<>-_\\/[]{}=+*^?#';
  const orig = el.textContent;
  let f = 0; const total = 26;
  const iv = setInterval(() => {
    f++;
    el.textContent = orig.split('').map((c, i) => (c === ' ' ? c : (i / orig.length) < (f / total) ? c : chars[Math.random() * chars.length | 0])).join('');
    if (f >= total) { clearInterval(iv); el.textContent = orig; }
  }, 34);
}
ScrollTrigger.create({ trigger: '#journeyTitle', start: 'top 75%', once: true, onEnter: () => scramble(document.getElementById('journeyTitle')) });

/* dialogue reveal */
gsap.utils.toArray('.dlg-line').forEach(el => {
  gsap.from(el, { x: -40, opacity: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
});

/* reveals */
gsap.utils.toArray('.mega-sm,.bento-card,.skill-card,.for-card,.clarity-grid>div,.prin-list li').forEach(el => {
  gsap.from(el, { y: 44, opacity: 0, duration: 0.85, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
});

/* cycling word */
const cycleEl = document.getElementById('cycleWord');
const words = ['Clarity.', 'Focus.', 'Craft.', 'Intent.', 'Ship.'];
let wi = 0;
setInterval(() => {
  wi = (wi + 1) % words.length;
  gsap.to(cycleEl, { opacity: 0, y: -18, duration: 0.28, onComplete: () => {
    cycleEl.textContent = words[wi];
    gsap.to(cycleEl, { opacity: 1, y: 0, duration: 0.38 });
  }});
}, 2600);

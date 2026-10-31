/* Dinesh PP — hero 3D: dragon.glb (Merugu's own asset, original colors kept). */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('dragon-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 2000);

const key = new THREE.DirectionalLight(0xffffff, 1.1);
key.position.set(6, 8, 7);
scene.add(key);
const rim = new THREE.DirectionalLight(0xd9381e, 1.0); // vermillion rim, live-site accent
rim.position.set(-8, 2.5, -7);
scene.add(rim);
scene.add(new THREE.AmbientLight(0xffffff, 0.25));

const group = new THREE.Group();
scene.add(group);

let mixer = null;
let scrollSpin = 0;
let heroProgress = 0;

new GLTFLoader().load('./assets/models/dragon.glb', (gltf) => {
  const m = gltf.scene;
  // normalize to ~9 units tall
  const box = new THREE.Box3().setFromObject(m);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const s = 8.5 / Math.max(size.x, size.y, size.z);
  m.scale.setScalar(s);
  m.position.sub(center.multiplyScalar(s));
  m.position.y -= 1.1; // sit slightly below optical center, clear of the top tags
  group.add(m);
  // fade the canvas in once the dragon is actually on screen
  if (window.gsap) gsap.to(canvas, { opacity: 1, duration: 1.4, ease: 'power2.out' });
  else canvas.style.opacity = 1;

  if (gltf.animations && gltf.animations.length) {
    mixer = new THREE.AnimationMixer(m);
    const clip = gltf.animations[0];
    const action = mixer.clipAction(clip);
    action.play();
    mixer.timeScale = 0.5; // half speed, like Dinesh_1
  }
});

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  // frame the dragon: closer on desktop, pulled back on mobile
  const dist = w < 700 ? 27 : 13.5;
  camera.position.set(dist * 0.55, 3.0, dist * 0.82);
  camera.lookAt(0, -0.3, 0);
}
window.addEventListener('resize', resize);
resize();

// scroll-linked spin: dragon turns as you leave the hero
if (window.ScrollTrigger) {
  ScrollTrigger.create({
    trigger: '.s-hero', start: 'top top', end: 'bottom top', scrub: true,
    onUpdate: (self) => { heroProgress = self.progress; scrollSpin = self.progress * Math.PI * 1.2; }
  });
}

const clock = new THREE.Clock();
let t = 0;
(function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);
  t += dt;
  if (mixer) mixer.update(dt);
  group.rotation.y = Math.sin(t * 0.25) * 0.22 + scrollSpin;
  group.rotation.z = -0.16; // diagonal lay, like the live hero
  const gs = 1 + heroProgress * 0.4; // grow as you scroll through the pinned hero
  group.scale.setScalar(gs);
  group.position.y = Math.sin(t * 0.6) * 0.28 - heroProgress * 1.5; // hover float + sink
  renderer.render(scene, camera);
})();

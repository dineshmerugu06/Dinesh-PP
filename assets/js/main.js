/* Dinesh PP v2 — motion core: Lenis + GSAP ScrollTrigger.
   Choreography re-engineered from the live string-tune.fiddle.digital (study only). */
(function () {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const el = document.querySelector(a.getAttribute('href'));
      if (el) { e.preventDefault(); lenis.scrollTo(el, { duration: 1.6 }); }
    });
  });
  const skipBtn = document.getElementById('dlg-skip');
  if (skipBtn) skipBtn.addEventListener('click', () => lenis.scrollTo('#principles', { duration: 1.4 }));

  /* ---------- readouts: red topbar, %, debug ---------- */
  const bar = document.querySelector('.topbar span');
  const pctN = document.querySelector('.pct .n');
  const dbg = document.getElementById('dbg-top');
  ScrollTrigger.create({
    trigger: document.body, start: 'top top', end: 'bottom bottom',
    onUpdate: (self) => {
      if (bar) bar.style.transform = `scaleX(${self.progress})`;
      if (pctN) pctN.textContent = Math.round(self.progress * 100);
      if (dbg) dbg.textContent = Math.round(window.scrollY || 0);
    }
  });

  /* ---------- cursor ---------- */
  const dot = document.querySelector('.cursor');
  const ring = document.querySelector('.cursor-ring');
  let mx = -100, my = -100, rx = -100, ry = -100;
  window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    if (dot) dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    if (ring) ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
  });
  document.querySelectorAll('a, button, .cell, .row, .tech').forEach((el) => {
    el.addEventListener('mouseenter', () => ring && ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring && ring.classList.remove('is-hover'));
  });

  /* ---------- magnetic ---------- */
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * 0.28,
        y: (e.clientY - r.top - r.height / 2) * 0.28,
        duration: 0.5, ease: 'power3.out'
      });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,0.4)' }));
  });

  /* ---------- hero intro ---------- */
  gsap.set('.hud-top > *, .hero-mid > *, .giant, .flanks > *, .ver', { opacity: 0, y: 24 });
  const intro = gsap.timeline({ delay: 0.4 });
  intro.to('.hud-top > *', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, 0)
       .to('.hero-mid > *', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 }, 0.15)
       .to('.giant', { opacity: 1, y: 0, duration: 1.3, ease: 'power3.out' }, 0.3)
       .to('.flanks > *, .ver', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, 0.5);

  /* ---------- 2 · FOCUS: pinned 5-stage radial focus-pull ---------- */
  const stages = gsap.utils.toArray('.s-focus .stages p');
  gsap.set(stages, { opacity: 0.07, filter: 'blur(16px)' });
  const focusTl = gsap.timeline({
    scrollTrigger: { trigger: '.s-focus', start: 'top top', end: '+=280%', scrub: 1, pin: true }
  });
  stages.forEach((p, i) => {
    focusTl.to(p, { opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'none' }, i * 1.6)
           .to(p, { opacity: 0.07, filter: 'blur(16px)', duration: 1, ease: 'none' }, i * 1.6 + 1);
  });
  focusTl.to({}, { duration: 0.5 });

  /* ---------- 3 · JOURNEY: pinned chapter ---------- */
  const LINES = [
    'MCA final year. One laptop. Zero shortcuts.',
    'First website shipped. Then ten more — each sharper than the last.',
    'Now I build for clients. Verified on phone and desktop, every single time.'
  ];
  const lineEl = document.getElementById('dlg-line');
  const dlgBar = document.getElementById('dlg-bar');
  const scramEl = document.getElementById('scramble');
  const SCRAM = '█▓▒░<>/\\|#*';
  let scramTimer = null;
  function scrambleTo(text) {
    if (scramTimer) clearInterval(scramTimer);
    let frame = 0;
    scramTimer = setInterval(() => {
      frame++;
      const done = Math.floor(frame / 2);
      let out = text.slice(0, done);
      for (let i = done; i < text.length; i++) {
        out += text[i] === ' ' ? ' ' : SCRAM[Math.floor(Math.random() * SCRAM.length)];
      }
      scramEl.textContent = out;
      if (done >= text.length) { clearInterval(scramTimer); scramTimer = null; }
    }, 40);
  }

  const jTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.s-journey', start: 'top top', end: '+=340%', scrub: 1, pin: true,
      onUpdate: (self) => {
        window.__storm = self.progress;
        if (dlgBar) dlgBar.style.width = (self.progress * 100).toFixed(1) + '%';
      }
    }
  });
  jTl.call(() => scrambleTo('THE JOURNEY'), null, 0.05);
  LINES.forEach((text, i) => {
    const at = 0.6 + i * 1.5;
    jTl.call(() => {
      if (lineEl) {
        gsap.fromTo(lineEl, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', overwrite: true });
        lineEl.textContent = text;
      }
    }, null, at);
    jTl.to({}, { duration: 1.4 });
  });
  jTl.to('.ch-outro', { opacity: 1, duration: 0.8, ease: 'none' }, '>-0.3');
  jTl.to('#storm', { scale: 1.12, duration: 2.4, ease: 'none' }, 0);

  /* ---------- reveals ---------- */
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* ---------- clarity cycler word ---------- */
  const words = ['Websites', 'Interfaces', 'Experiences', 'Portfolios'];
  const cw = document.getElementById('cycler-word');
  let wi = 0;
  if (cw) {
    setInterval(() => {
      wi = (wi + 1) % words.length;
      gsap.to(cw, {
        opacity: 0, filter: 'blur(10px)', y: -18, duration: 0.32, ease: 'power2.in',
        onComplete: () => {
          cw.textContent = words[wi];
          gsap.fromTo(cw, { opacity: 0, filter: 'blur(10px)', y: 18 },
            { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.5, ease: 'power2.out' });
        }
      });
    }, 2600);
  }

  /* ---------- 4 · CREED: scroll-driven word illumination ---------- */
  document.querySelectorAll('.creed-line.fill-text').forEach((line) => {
    const words = line.textContent.trim().split(/\s+/);
    line.innerHTML = words.map(w => {
      const m = w.match(/^(.+?)([.,!?;:]+)$/);
      return m ? `<span class="w">${m[1]}${m[2]}</span>` : `<span class="w">${w}</span>`;
    }).join(' ');
    // restore <em> styling: re-wrap words that were inside em (alive, and, I)
    line.querySelectorAll('.w').forEach(sp => {
      if (['alive', 'and', 'I'].includes(sp.textContent.replace(/[.,!?;:]/g, ''))) {
        sp.innerHTML = `<em>${sp.innerHTML}</em>`;
      }
    });
    const spans = line.querySelectorAll('.w');
    ScrollTrigger.create({
      trigger: line, start: 'top 78%', end: 'top 30%', scrub: 0.5,
      onUpdate: (self) => {
        const n = Math.floor(self.progress * spans.length);
        spans.forEach((s, i) => s.classList.toggle('lit', i < n));
      }
    });
  });

  /* ---------- 8 · PROCESS: numerals count + ignite ---------- */
  document.querySelectorAll('.step').forEach((step) => {
    const num = step.querySelector('.step-num');
    const to = +num.dataset.count;
    ScrollTrigger.create({
      trigger: step, start: 'top 75%', once: true,
      onEnter: () => {
        step.classList.add('lit');
        const o = { v: 0 };
        gsap.to(o, { v: to, duration: 1.1, ease: 'power2.out',
          onUpdate: () => num.textContent = '0' + Math.round(o.v) });
      }
    });
  });

  /* ---------- 7 · AUDIENCE: tab switcher ---------- */
  const tabs = document.querySelectorAll('.aud-tab');
  const panels = document.querySelectorAll('.aud-panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.querySelector(`.aud-panel[data-aud="${tab.dataset.aud}"]`);
      if (panel) panel.classList.add('active');
    });
  });

  /* ---------- 9 · FINALE: live IST clock ---------- */
  const clock = document.getElementById('istClock');
  if (clock) {
    const tick = () => {
      clock.textContent = new Date().toLocaleTimeString('en-IN',
        { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
    };
    tick(); setInterval(tick, 15000);
  }

  /* ---------- cursor: new hover targets ---------- */
  document.querySelectorAll('.blade, .work, .aud-tab, .btn-big').forEach((el) => {
    el.addEventListener('mouseenter', () => ring && ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring && ring.classList.remove('is-hover'));
  });

  /* ---------- loader: clears on window load, never gated on 3D ---------- */
  const clearLoader = () => document.querySelector('.loader').classList.add('done');
  window.addEventListener('load', () => setTimeout(clearLoader, 500));
  setTimeout(clearLoader, 5000);

  window.__lenis = lenis;
})();

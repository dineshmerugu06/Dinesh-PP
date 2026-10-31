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

  /* ---------- 4 · NOW: live clock + date ---------- */
  const nowClock = document.getElementById('nowClock');
  const nowDate = document.getElementById('nowDate');
  const doorClock = document.getElementById('doorClock');
  const tickNow = () => {
    const d = new Date();
    const t = d.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
    if (nowClock) nowClock.textContent = t;
    if (doorClock) doorClock.textContent = t;
    if (nowDate) nowDate.textContent = d.toLocaleDateString('en-IN',
      { timeZone: 'Asia/Kolkata', weekday: 'long', day: 'numeric', month: 'long' });
  };
  tickNow(); setInterval(tickNow, 10000);

  /* ---------- 5 · PLAYGROUND ---------- */
  // tilt card
  const tiltCard = document.getElementById('tiltCard');
  if (tiltCard) {
    const stage = tiltCard.parentElement;
    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tiltCard.style.transform = `rotateY(${x * 36}deg) rotateX(${-y * 36}deg)`;
    });
    stage.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }
  // motion stage: tap to fire choreography
  const mStage = document.getElementById('motionStage');
  if (mStage) {
    const dots = mStage.querySelectorAll('span');
    gsap.set(dots, { y: 0, backgroundColor: '#3a3a3e' });
    let busy = false;
    mStage.addEventListener('click', () => {
      if (busy) return; busy = true;
      gsap.timeline({ onComplete: () => busy = false })
        .to(dots, { y: -46, backgroundColor: '#d9381e', duration: 0.32, ease: 'power2.out', stagger: 0.06 })
        .to(dots, { y: 0, backgroundColor: '#3a3a3e', duration: 0.55, ease: 'bounce.out', stagger: 0.06 });
    });
  }
  // type scaler
  const typeDemo = document.getElementById('typeDemo');
  const typeRange = document.getElementById('typeRange');
  if (typeDemo && typeRange) {
    const apply = () => typeDemo.style.fontSize = typeRange.value + 'rem';
    typeRange.addEventListener('input', apply); apply();
  }

  /* ---------- 6 · NUMBERS: count up + ignite ---------- */
  document.querySelectorAll('.num').forEach((num) => {
    const el = num.querySelector('.num-count');
    if (!el) return; /* new PROOF stats use .num[data-count] instead */
    const to = +el.dataset.to;
    ScrollTrigger.create({
      trigger: num, start: 'top 78%', once: true,
      onEnter: () => {
        num.classList.add('lit');
        const o = { v: 0 };
        gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out',
          onUpdate: () => el.textContent = Math.round(o.v) });
      }
    });
  });

  /* ---------- 8 · QA accordion ---------- */
  document.querySelectorAll('.qa-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const qa = btn.parentElement;
      const wasOpen = qa.classList.contains('open');
      document.querySelectorAll('.qa.open').forEach(q => q.classList.remove('open'));
      if (!wasOpen) qa.classList.add('open');
      setTimeout(() => ScrollTrigger.refresh(), 550);
    });
  });

  /* ---------- cursor: new hover targets ---------- */
  document.querySelectorAll('.toy, .dish, .door, .qa-q, .aud-tab, .btn-big').forEach((el) => {
    el.addEventListener('mouseenter', () => ring && ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring && ring.classList.remove('is-hover'));
  });

  /* ---------- loader: clears on window load, never gated on 3D ---------- */
  const clearLoader = () => document.querySelector('.loader').classList.add('done');
  window.addEventListener('load', () => setTimeout(clearLoader, 500));
  setTimeout(clearLoader, 5000);

  window.__lenis = lenis;
})();

/* ══════════ sections 4–11 · CREED / WORK / ARSENAL / METHOD / SIGNAL / PROOF / TRANSMIT / FINALE ══════════ */
(function () {
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- 4 · CREED: scroll-scrubbed word reveal ---------- */
  const creed = document.getElementById('creedLine');
  if (creed) {
    const words = [];
    const split = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span');
            s.className = 'w'; s.textContent = part;
            frag.appendChild(s); words.push(s);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) split(child);
      });
    };
    split(creed);
    gsap.set(words, { opacity: 0.12 });
    gsap.to(words, {
      opacity: 1, stagger: 0.05, ease: 'none',
      scrollTrigger: { trigger: creed, start: 'top 82%', end: 'bottom 45%', scrub: 0.6 }
    });
  }

  /* ---------- 5 · WORK: filmstrip nav + keyboard ---------- */
  const film = document.getElementById('film');
  const stepX = () => {
    const f = film && film.querySelector('.frame');
    return f ? f.getBoundingClientRect().width + 24 : 340;
  };
  const prev = document.getElementById('workPrev');
  const next = document.getElementById('workNext');
  if (film && prev) prev.addEventListener('click', () => film.scrollBy({ left: -stepX(), behavior: 'smooth' }));
  if (film && next) next.addEventListener('click', () => film.scrollBy({ left: stepX(), behavior: 'smooth' }));
  if (film) film.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); film.scrollBy({ left: stepX(), behavior: 'smooth' }); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); film.scrollBy({ left: -stepX(), behavior: 'smooth' }); }
  });

  /* ---------- 6 · ARSENAL: tabs ---------- */
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => { t.classList.remove('is-on'); t.setAttribute('aria-selected', 'false'); });
      document.querySelectorAll('.panel').forEach((p) => p.classList.remove('is-on'));
      tab.classList.add('is-on');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.querySelector('.panel[data-panel="' + tab.dataset.tab + '"]');
      if (panel) {
        panel.classList.add('is-on');
        gsap.fromTo(panel.children,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out', overwrite: true });
      }
      ScrollTrigger.refresh();
    });
  });

  /* ---------- 9 · PROOF: count-up on scroll ---------- */
  document.querySelectorAll('.num[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => {
        const o = { v: 0 };
        gsap.to(o, {
          v: target, duration: 1.6, ease: 'power2.out',
          onUpdate: () => { el.textContent = String(Math.round(o.v)).padStart(2, '0'); }
        });
      }
    });
  });

  /* ---------- 8 + 11 · live IST clocks ---------- */
  const tickClocks = () => {
    try {
      const t = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
      const s1 = document.getElementById('istClock'); if (s1) s1.textContent = t;
      const s2 = document.getElementById('footClock'); if (s2) s2.textContent = t.slice(0, 5);
    } catch (e) { /* clock unavailable — labels stay as fallback */ }
  };
  tickClocks();
  setInterval(tickClocks, 1000);

  /* ---------- 10 · TRANSMIT: chips open WhatsApp with prefilled text ---------- */
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      window.open('https://wa.me/919398359538?text=' + encodeURIComponent(chip.dataset.wa || 'Hi Dinesh.'), '_blank', 'noopener');
    });
  });

  /* ---------- cursor hover for new interactive targets ---------- */
  const ring = document.querySelector('.cursor-ring');
  if (ring) {
    document.querySelectorAll('.wbtn, .tab, .chip, .frame-link, .btn-line, .to-top').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }

  ScrollTrigger.refresh();
})();

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




/* ══════════ sticky-stack panels · 10 unique worlds ══════════ */
(function () {
  gsap.registerPlugin(ScrollTrigger);
  const lerp = (a, b, t) => a + (b - a) * t;

  /* panel inner drift — content floats as the next world wipes over */
  document.querySelectorAll('.panel').forEach((panel) => {
    const inner = panel.querySelector('.panel-in');
    if (!inner) return;
    gsap.fromTo(inner, { y: 70 }, {
      y: -70, ease: 'none',
      scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* chapter rail scroll-spy */
  const chLinks = Array.from(document.querySelectorAll('.chapters a'));
  if (chLinks.length) {
    chLinks.map((a) => a.dataset.ch).forEach((id) => {
      const sec = document.getElementById(id);
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec, start: 'top center', end: 'bottom center',
        onToggle: (self) => { if (self.isActive) chLinks.forEach((a) => a.classList.toggle('on', a.dataset.ch === id)); }
      });
    });
    chLinks.forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = document.getElementById(a.dataset.ch);
      if (sec && window.__lenis) window.__lenis.scrollTo(sec, { offset: 0 });
      else if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    }));
  }

  /* creed mask-wipe */
  document.querySelectorAll('.mline > span').forEach((s, i) => {
    gsap.fromTo(s, { yPercent: 115 }, {
      yPercent: 0, duration: 1.1, ease: 'power4.out', delay: i * 0.12,
      scrollTrigger: { trigger: s, start: 'top 88%', once: true }
    });
  });

  /* missions */
  document.querySelectorAll('.ms-card').forEach((card) => {
    const btn = card.querySelector('.ms-go');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.open('https://wa.me/919398359538?text=' + encodeURIComponent(card.dataset.wa || 'Hi Dinesh — I have a mission.'), '_blank', 'noopener');
    });
  });

  /* arsenal dodging tags */
  const field = document.getElementById('arsenalField');
  if (field) {
    const tags = Array.from(field.querySelectorAll('.tag'));
    const st = tags.map((el) => ({ el, x: 0, y: 0, x0: 0, y0: 0, ox: 0, oy: 0, ph: Math.random() * 6.28, w: 0, h: 0 }));
    let mx = -9999, my = -9999, running = true;
    const place = () => {
      const r = field.getBoundingClientRect();
      const cols = r.width < 520 ? 3 : 5;
      const rows = Math.ceil(st.length / cols);
      st.forEach((p, i) => {
        const c = i % cols, rr = Math.floor(i / cols);
        p.ox = ((c + .5) / cols) * r.width + (Math.random() * 12 - 6);
        p.oy = ((rr + .5) / rows) * r.height + (Math.random() * 10 - 5);
        if (!p.w) { p.w = p.el.offsetWidth; p.h = p.el.offsetHeight; }
        p.el.style.left = (p.ox - p.w / 2) + 'px';
        p.el.style.top = (p.oy - p.h / 2) + 'px';
        p.x0 = p.ox; p.y0 = p.oy;
        if (!p.x && !p.y) { p.x = p.ox; p.y = p.oy; }
      });
    };
    place(); window.addEventListener('resize', place);
    field.addEventListener('pointermove', (e) => { const r = field.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    field.addEventListener('pointerleave', () => { mx = -9999; my = -9999; });
    new IntersectionObserver((e) => { running = e[0].isIntersecting; }).observe(field);
    (function tick(t) {
      requestAnimationFrame(tick);
      if (!running) return;
      const time = t * .001;
      st.forEach((p) => {
        const fx = p.ox + Math.sin(time * .9 + p.ph) * 14;
        const fy = p.oy + Math.cos(time * .7 + p.ph) * 10;
        const dx = fx - mx, dy = fy - my, d = Math.hypot(dx, dy);
        let tx = fx, ty = fy, hot = false;
        if (d < 110 && d > 1) { const f = (110 - d) / 110 * 90; tx = fx + (dx / d) * f; ty = fy + (dy / d) * f; hot = true; }
        p.x = lerp(p.x, tx, .12); p.y = lerp(p.y, ty, .12);
        p.el.style.transform = 'translate(' + (p.x - p.x0).toFixed(1) + 'px,' + (p.y - p.y0).toFixed(1) + 'px)';
        p.el.classList.toggle('hot', hot);
      });
    })(0);
  }

  /* process draw line */
  const procFill = document.getElementById('procFill');
  const psteps = document.querySelectorAll('.pstep');
  const procTrack = document.querySelector('.proc-track');
  if (procFill && procTrack) {
    ScrollTrigger.create({
      trigger: procTrack, start: 'top 75%', end: 'bottom 55%', scrub: 0.6,
      onUpdate: (self) => {
        procFill.style.transform = 'scaleX(' + self.progress.toFixed(3) + ')';
        const lit = Math.round(self.progress * psteps.length);
        psteps.forEach((s, i) => s.classList.toggle('lit', i < lit));
      }
    });
  }

  /* principles tilt */
  document.querySelectorAll('.pr-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      gsap.to(card, { rotateY: x * 10, rotateX: -y * 10, transformPerspective: 800, duration: .4, ease: 'power2.out' });
    });
    card.addEventListener('pointerleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: .8, ease: 'elastic.out(1,.5)' }));
  });

  /* status clock */
  const stClock = document.getElementById('stClock');
  if (stClock) {
    const tick = () => {
      try { stClock.textContent = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST'; } catch (e) {}
    };
    tick(); setInterval(tick, 1000);
  }

  /* playground embers (full panel) */
  const pc = document.getElementById('playCanvas');
  if (pc) {
    const ctx = pc.getContext('2d');
    const panel = document.getElementById('playground');
    let W, H, pts = [], running = true, mx = -9999, my = -9999;
    const size = () => { W = pc.width = pc.offsetWidth; H = pc.height = pc.offsetHeight; seed(); };
    function seed() {
      pts = [];
      const n = Math.min(170, Math.floor(W * H / 11000));
      for (let i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: -Math.random() * .5 - .1, r: Math.random() * 2.4 + .8, ph: Math.random() * 6.28 });
    }
    size(); window.addEventListener('resize', size);
    panel.addEventListener('pointermove', (e) => { const r = pc.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    panel.addEventListener('pointerleave', () => { mx = -9999; my = -9999; });
    new IntersectionObserver((e) => { running = e[0].isIntersecting; }).observe(pc);
    (function draw(t) {
      requestAnimationFrame(draw);
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const time = t * .001;
      pts.forEach((p) => {
        p.x += p.vx + Math.sin(time + p.ph) * .3;
        p.y += p.vy;
        const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
        if (d < 120 && d > 1) { p.x += (dx / d) * 3; p.y += (dy / d) * 3; }
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
        const tw = .35 + .4 * Math.abs(Math.sin(time * 2 + p.ph));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fillStyle = 'rgba(255,' + Math.floor(90 + 60 * Math.sin(p.ph)) + ',40,' + tw.toFixed(2) + ')';
        ctx.fill();
      });
    })(0);
  }

  /* konami overdrive */
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let ki = 0;
  const toast = document.getElementById('odToast');
  window.addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    ki = (k === seq[ki]) ? ki + 1 : (k === seq[0] ? 1 : 0);
    if (ki === seq.length) {
      ki = 0;
      const on = document.documentElement.classList.toggle('overdrive');
      if (toast) {
        toast.textContent = on ? 'OVERDRIVE ENGAGED' : 'OVERDRIVE OFF';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2200);
      }
    }
  });

  /* cursor hover */
  const ring = document.querySelector('.cursor-ring');
  if (ring) {
    document.querySelectorAll('.ms-go,.chapters a,.st-cta,.crow,.cta-giant a,.wk a').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }

  ScrollTrigger.refresh();
})();

/* ST sections 04-11 — string-tune section system, written from scratch (study only). */
(function () {
  function qsa(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  if (!window.gsap || !window.ScrollTrigger) {
    qsa('[data-st] span, [data-st] .st-g, [data-st] .st-line, [data-st] p, [data-st] .st-kw span').forEach(function (el) {
      el.style.opacity = '1'; el.style.transform = 'none'; el.style.filter = 'none';
    });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  var mm = gsap.matchMedia();
  var fine = window.matchMedia('(pointer:fine)').matches;

  /* Line-mask reveals (gsap.set owns initial state — never CSS % transforms). */
  qsa('[data-st="lines"]').forEach(function (block) {
    var spans = qsa(':scope > span', block);
    if (!spans.length) return;
    gsap.set(spans, { yPercent: 110 });
    gsap.to(spans, {
      yPercent: 0, duration: 1.05, ease: 'power4.out', stagger: 0.12,
      scrollTrigger: { trigger: block, start: 'top 84%' }
    });
  });

  /* Fade-ups + staggered cards. */
  qsa('[data-st="fade"]').forEach(function (el) {
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  qsa('[data-st="cards"]').forEach(function (wrap) {
    var items = qsa(':scope > *', wrap);
    if (!items.length) return;
    gsap.to(items, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09,
      scrollTrigger: { trigger: wrap, start: 'top 82%' } });
  });

  /* Desktop: pinned scroll cinema. */
  mm.add('(min-width: 901px)', function () {
    /* 04 — ghost sequence: first ghost live at pin start (like the original),
       scroll-velocity blur on the wrapper = the signature transition */
    var ghosts = qsa('#st-intro .st-g');
    var ghostWrap = document.querySelector('#st-intro .st-ghost');
    gsap.set(ghosts[0], { opacity: 1, filter: 'blur(0px)', scale: 1 });
    gsap.set([ghosts[1], ghosts[2]], { opacity: 0, filter: 'blur(22px)', scale: 0.94 });
    var itl = gsap.timeline({ scrollTrigger: { trigger: '#st-intro', start: 'top top',
      end: '+=260%', pin: '#stIntroPin', scrub: 1,
      onUpdate: function (self) {
        var v = Math.min(Math.abs(self.getVelocity()) / 2600, 1);
        ghostWrap.style.filter = v > 0.02 ? 'blur(' + (v * 20).toFixed(1) + 'px)' : '';
      } } });
    itl.to(ghosts[0], { opacity: 0, filter: 'blur(22px)', scale: 0.94, duration: 1, ease: 'power2.in' }, 0)
       .to(ghosts[1], { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1, ease: 'power2.out' }, 0.6)
       .to(ghosts[1], { opacity: 0, filter: 'blur(22px)', scale: 0.94, duration: 1, ease: 'power2.in' }, 1.8)
       .to(ghosts[2], { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1, ease: 'power2.out' }, 2.4)
       .to('#stIntroBar', { scaleX: 1, ease: 'none', duration: 3.4 }, 0);

    /* 05 — dialog: first line live at pin start, rest advance on scroll */
    var dlines = qsa('#st-dialog .st-line');
    gsap.set(dlines[0], { opacity: 1, y: 0 });
    var dtl = gsap.timeline({ scrollTrigger: { trigger: '#st-dialog', start: 'top top',
      end: '+=170%', pin: '#stDialogPin', scrub: 1 } });
    dtl.to([dlines[1], dlines[2]], { opacity: 1, y: 0, duration: 0.5, stagger: 0.6 }, 0.2)
       .to('#stDlgBar', { scaleX: 1, ease: 'none', duration: 1.8 }, 0);

    /* 06 — pale ghost replay, with velocity blur */
    var g2 = qsa('#st-panel .st-g');
    var g2Wrap = document.querySelector('#st-panel .st-ghost');
    gsap.set(g2[0], { opacity: 1, filter: 'blur(0px)' });
    gsap.set(g2[1], { opacity: 0, filter: 'blur(20px)' });
    var ptl = gsap.timeline({ scrollTrigger: { trigger: '#st-panel .st-round',
      start: 'top 85%', end: 'bottom 45%', scrub: 1,
      onUpdate: function (self) {
        var v = Math.min(Math.abs(self.getVelocity()) / 2600, 1);
        g2Wrap.style.filter = v > 0.02 ? 'blur(' + (v * 18).toFixed(1) + 'px)' : '';
      } } });
    ptl.to(g2[0], { opacity: 0, filter: 'blur(20px)', duration: 1 }, 0.4)
       .to(g2[1], { opacity: 1, filter: 'blur(0px)', duration: 1 }, 1.2);

    /* 10 — keyword morph */
    var kws = qsa('.st-kw span');
    var ktl = gsap.timeline({ scrollTrigger: { trigger: '.st-kw',
      start: 'top 78%', end: 'bottom 30%', scrub: 1 } });
    kws.forEach(function (k, i) {
      ktl.to(k, { opacity: 1, filter: 'blur(0px)', duration: 0.45 }, i * 0.9);
      if (i < kws.length - 1) ktl.to(k, { opacity: 0, filter: 'blur(14px)', duration: 0.45 }, i * 0.9 + 0.55);
    });

    /* 10 — columns fill gray -> ink */
    qsa('.st-col p').forEach(function (p) {
      gsap.fromTo(p, { color: '#b9b9c4' }, { color: '#111111', ease: 'none',
        scrollTrigger: { trigger: p, start: 'top 88%', end: 'top 48%', scrub: 1 } });
    });

    /* 11 — watermark drift */
    gsap.to('.st-mark span', { xPercent: 6, ease: 'none',
      scrollTrigger: { trigger: '.st-foot', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });
  });

  /* Mobile: everything visible, no pins. */
  mm.add('(max-width: 900px)', function () {
    qsa('#st-intro .st-g, #st-panel .st-g').forEach(function (g, i) {
      gsap.set(g, { opacity: i === 0 ? 1 : 0.28, filter: 'blur(0px)', position: 'static', display: 'block' });
    });
    gsap.set('#st-dialog .st-line', { opacity: 1, y: 0 });
    gsap.set('#stDlgBar, #stIntroBar', { scaleX: 1 });
    var kws = qsa('.st-kw span');
    kws.forEach(function (k, i) {
      gsap.set(k, { position: 'static', display: 'block', opacity: 1, filter: 'none',
        fontSize: '2rem', justifyContent: 'flex-start', height: 'auto', marginBottom: '.4rem' });
    });
    gsap.set('.st-kw', { height: 'auto', overflow: 'visible' });
    qsa('.st-col p').forEach(function (p) { gsap.set(p, { color: '#111111' }); });
  });

  /* Magnetic pill buttons. */
  if (fine) qsa('.st-btn').forEach(function (btn) {
    var xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' });
    var yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' });
    btn.addEventListener('pointermove', function (e) {
      var r = btn.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.25);
      yTo((e.clientY - r.top - r.height / 2) * 0.25);
    });
    btn.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
  });

  /* Skip + back-to-top. */
  qsa('[data-skip]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var t = document.querySelector(a.getAttribute('href'));
      if (t && window.__lenis) window.__lenis.scrollTo(t, { duration: 1.4 });
    });
  });
  var top = qsa('[data-st-top]')[0];
  if (top) top.addEventListener('click', function (e) {
    e.preventDefault();
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();

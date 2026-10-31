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

/* ══════════ sections 5–14 · ten highlight sections (own build, own content) ══════════ */
(function () {
  gsap.registerPlugin(ScrollTrigger);
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- 5 · CRAFT: sparkles + parallax glows ---------- */
  const sparkC = document.getElementById('craftSparkles');
  if (sparkC) {
    const ctx = sparkC.getContext('2d');
    let W, H, ps = [], running = true;
    const size = () => { W = sparkC.width = sparkC.offsetWidth; H = sparkC.height = sparkC.offsetHeight; };
    size(); window.addEventListener('resize', size);
    for (let i = 0; i < 70; i++) ps.push({ x: Math.random(), y: Math.random(), r: Math.random() * 2 + .4, s: Math.random() * .0006 + .0002, tw: Math.random() * Math.PI * 2 });
    new IntersectionObserver((e) => { running = e[0].isIntersecting; }).observe(sparkC);
    (function draw(t) {
      requestAnimationFrame(draw);
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      ps.forEach((p) => {
        p.y -= p.s; if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        const a = .25 + .55 * Math.abs(Math.sin(t * .001 + p.tw));
        ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, 7);
        ctx.fillStyle = 'rgba(255,240,220,' + a.toFixed(2) + ')'; ctx.fill();
      });
    })(0);
    const glows = document.querySelectorAll('.craft-glow');
    const sec = document.getElementById('craft');
    if (sec && glows.length) {
      ScrollTrigger.create({
        trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true,
        onUpdate: (self) => {
          glows.forEach((g) => {
            const sp = parseFloat(g.dataset.speed || 0.1);
            g.style.transform = 'translateY(' + (self.progress * 400 * sp).toFixed(1) + 'px)';
          });
        }
      });
    }
  }

  /* ---------- 6 · PATHS: branching selector ---------- */
  const pathA = document.getElementById('pathA'), pathB = document.getElementById('pathB');
  const panelA = document.getElementById('panelA'), panelB = document.getElementById('panelB');
  function setPath(which) {
    const onA = which === 'A';
    if (pathA) pathA.setAttribute('aria-expanded', onA);
    if (pathB) pathB.setAttribute('aria-expanded', !onA);
    if (panelA) panelA.hidden = !onA;
    if (panelB) panelB.hidden = onA;
    const show = onA ? panelA : panelB;
    if (show) gsap.fromTo(show, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .5, ease: 'power2.out' });
    ScrollTrigger.refresh();
  }
  if (pathA) pathA.addEventListener('click', () => setPath(pathA.getAttribute('aria-expanded') === 'true' ? null : 'A'));
  if (pathB) pathB.addEventListener('click', () => setPath(pathB.getAttribute('aria-expanded') === 'true' ? null : 'B'));

  /* ---------- 7 · ORACLE: keyword wizard ---------- */
  const oIn = document.getElementById('oracleInput'), oGo = document.getElementById('oracleGo'), oOut = document.getElementById('oracleOut');
  const RULES = [
    { k: ['ai', 'agent', 'bot', 'chatbot', 'automation', 'assistant'], t: 'An AI agent, built for you', d: 'A chatbot or agent that answers questions, takes bookings, and does the boring work — trained on your business.', wa: 'Hi Dinesh — I want an AI agent built.' },
    { k: ['shop', 'store', 'ecommerce', 'e-commerce', 'cart', 'sell'], t: 'An online store', d: 'A store that sells while you sleep — clean catalog, fast checkout, made to convert.', wa: 'Hi Dinesh — I want an online store built.' },
    { k: ['portfolio', 'photograph', 'gallery'], t: 'A portfolio site', d: 'Your work, presented like it deserves — cinematic, fast, unforgettable.', wa: 'Hi Dinesh — I want a portfolio website.' },
    { k: ['redesign', 'revamp', 'improve', 'fix', 'old'], t: 'A redesign', d: 'Your current site, rebuilt to today\u2019s standard — same business, brand-new impression.', wa: 'Hi Dinesh — I want my website redesigned.' },
    { k: ['website', 'site', 'web', 'landing', 'page', 'business', 'company', 'startup'], t: 'A custom website', d: 'A fast, premium website built around your goal — no templates, verified on phone and desktop.', wa: 'Hi Dinesh — I want a website built.' }
  ];
  function askOracle(q) {
    if (!oOut) return;
    const s = (q || '').toLowerCase();
    let hit = null;
    for (const r of RULES) { if (r.k.some((k) => s.includes(k))) { hit = r; break; } }
    const wa = (hit ? hit.wa : 'Hi Dinesh — I have a project in mind: ' + (q || '').slice(0, 60));
    oOut.innerHTML = '<div class="oracle-card"><b>' + (hit ? hit.t : 'Something custom') + '</b><p>' +
      (hit ? hit.d : 'Tell me a little more on WhatsApp and I\u2019ll map the fastest way to build it.') +
      '</p><a href="https://wa.me/919398359538?text=' + encodeURIComponent(wa) + '" target="_blank" rel="noopener">Start this on WhatsApp &#8599;</a></div>';
    gsap.fromTo(oOut.firstChild, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .45, ease: 'power2.out' });
  }
  if (oGo && oIn) {
    oGo.addEventListener('click', () => askOracle(oIn.value));
    oIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') askOracle(oIn.value); });
    document.querySelectorAll('.glass-try button').forEach((b) => b.addEventListener('click', () => { oIn.value = b.dataset.q; askOracle(b.dataset.q); }));
  }

  /* ---------- 9 · LAB: scramble / marquee / invert ---------- */
  const scr = document.getElementById('labScramble');
  if (scr) {
    const CH = '█▓▒░<>/\\|#*+';
    const orig = scr.textContent;
    let iv = null;
    scr.addEventListener('mouseenter', () => {
      let n = 0; clearInterval(iv);
      iv = setInterval(() => {
        n++;
        scr.textContent = orig.split('').map((c, i) => (c === ' ' ? ' ' : (i < n ? c : CH[Math.floor(Math.random() * CH.length)]))).join('');
        if (n > orig.length) { clearInterval(iv); scr.textContent = orig; }
      }, 34);
    });
  }
  const mq = document.getElementById('labMq'), rng = document.getElementById('labRange');
  if (mq) {
    let x = 0, speed = 4, mqRun = true;
    if (rng) rng.addEventListener('input', () => { speed = +rng.value; });
    new IntersectionObserver((e) => { mqRun = e[0].isIntersecting; }).observe(mq);
    (function tick() {
      requestAnimationFrame(tick);
      if (!mqRun) return;
      x -= speed * .6; if (x < -mq.offsetWidth / 2) x = 0;
      mq.style.transform = 'translateX(' + x + 'px)';
    })();
  }
  const inv = document.getElementById('labInvert'), labSec = document.getElementById('lab');
  if (inv && labSec) inv.addEventListener('click', () => {
    const on = labSec.classList.toggle('lit');
    inv.setAttribute('aria-pressed', on);
    inv.textContent = on ? 'Lights on' : 'Flip the lights';
  });

  /* ---------- 10 · REEL: pinned scroll film ---------- */
  const reel = document.getElementById('reel'), pin = document.querySelector('.reel-pin');
  const scenes = document.querySelectorAll('.rscene'), blob = document.getElementById('reelBlob'), rbar = document.getElementById('reelBar');
  if (reel && pin && scenes.length) {
    const MORPHS = [
      { r: '58% 42% 55% 45%/48% 56% 44% 52%', c: '#ff5c1a', t: 'translate(0,0) rotate(0deg)' },
      { r: '42% 58% 38% 62%/60% 42% 58% 40%', c: '#ff7a2e', t: 'translate(6vw,-4vh) rotate(40deg)' },
      { r: '50% 50% 62% 38%/42% 60% 40% 58%', c: '#e8481a', t: 'translate(-4vw,5vh) rotate(-30deg) scale(1.2)' },
      { r: '36% 64% 52% 48%/58% 38% 62% 42%', c: '#ffb03a', t: 'translate(3vw,-3vh) rotate(70deg) scale(.85)' }
    ];
    let cur = -1;
    ScrollTrigger.create({
      trigger: reel, start: 'top top', end: 'bottom bottom', pin: pin, scrub: .6,
      onUpdate: (self) => {
        const idx = Math.min(scenes.length - 1, Math.floor(self.progress * scenes.length));
        if (rbar) rbar.style.transform = 'scaleX(' + self.progress.toFixed(3) + ')';
        if (idx !== cur) {
          cur = idx;
          scenes.forEach((s, i) => s.classList.toggle('is-on', i === idx));
          if (blob) {
            const m = MORPHS[idx];
            blob.style.borderRadius = m.r; blob.style.background = m.c; blob.style.transform = m.t;
          }
        }
      }
    });
  }

  /* ---------- 11 · FIELD: pointer-reactive particles ---------- */
  const fc = document.getElementById('fieldCanvas');
  if (fc) {
    const ctx = fc.getContext('2d');
    let W, H, pts = [], mode = 0, running = true, mx = -999, my = -999;
    const MODES = 3;
    const size = () => { W = fc.width = fc.offsetWidth; H = fc.height = fc.offsetHeight; seed(); };
    function seed() {
      pts = [];
      const n = Math.min(220, Math.floor(W * H / 9000));
      for (let i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, r: Math.random() * 2.2 + .6 });
    }
    size(); window.addEventListener('resize', size);
    fc.parentElement.addEventListener('pointermove', (e) => { const r = fc.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    fc.parentElement.addEventListener('pointerleave', () => { mx = -999; my = -999; });
    const shuf = document.getElementById('fieldShuffle');
    if (shuf) shuf.addEventListener('click', () => { mode = (mode + 1) % MODES; seed(); });
    new IntersectionObserver((e) => { running = e[0].isIntersecting; }).observe(fc);
    (function draw(t) {
      requestAnimationFrame(draw);
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const time = t * .0004;
      pts.forEach((p) => {
        let ax, ay;
        if (mode === 0) { ax = Math.sin(p.y * .008 + time * 2); ay = Math.cos(p.x * .006 - time * 1.4); }
        else if (mode === 1) { const dx = p.x - W / 2, dy = p.y - H / 2, d = Math.hypot(dx, dy) || 1; ax = -dy / d * .9; ay = dx / d * .9; }
        else { ax = Math.sin(p.x * .01 + p.y * .008 + time * 3); ay = Math.cos(p.y * .012 - time * 2.2); }
        const pdx = p.x - mx, pdy = p.y - my, pd = Math.hypot(pdx, pdy);
        if (pd < 130 && pd > 1) { ax += (pdx / pd) * 2.4; ay += (pdy / pd) * 2.4; }
        p.vx = lerp(p.vx, ax * 1.4, .06); p.vy = lerp(p.vy, ay * 1.4, .06);
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
        ctx.fillStyle = 'rgba(232,98,44,.55)'; ctx.fill();
      });
    })(0);
  }

  /* ---------- 12 · MATERIAL: flowing wave ribbons ---------- */
  const mc = document.getElementById('materialCanvas');
  if (mc) {
    const ctx = mc.getContext('2d');
    let W, H, running = true;
    const size = () => { W = mc.width = mc.offsetWidth; H = mc.height = mc.offsetHeight; };
    size(); window.addEventListener('resize', size);
    const RIBBONS = [
      { c: 'rgba(212,162,78,.5)', y: .32, amp: 46, f: .006, sp: .9, ph: 0 },
      { c: 'rgba(233,217,184,.34)', y: .44, amp: 60, f: .004, sp: .6, ph: 1.6 },
      { c: 'rgba(63,125,122,.5)', y: .56, amp: 52, f: .005, sp: 1.1, ph: 3.1 },
      { c: 'rgba(201,143,61,.4)', y: .66, amp: 44, f: .007, sp: .8, ph: 4.4 },
      { c: 'rgba(242,234,216,.28)', y: .76, amp: 56, f: .005, sp: 1.3, ph: 5.8 }
    ];
    new IntersectionObserver((e) => { running = e[0].isIntersecting; }).observe(mc);
    (function draw(t) {
      requestAnimationFrame(draw);
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const time = t * .001;
      RIBBONS.forEach((r) => {
        ctx.beginPath(); ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 14) {
          const y = r.y * H + Math.sin(x * r.f + time * r.sp + r.ph) * r.amp + Math.sin(x * r.f * 2.3 + time * r.sp * 1.7) * r.amp * .3;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H); ctx.closePath();
        ctx.fillStyle = r.c; ctx.fill();
      });
    })(0);
  }

  /* ---------- 13 · ONAIR: SMPTE timecode ---------- */
  const smpte = document.getElementById('smpte'), oIst = document.getElementById('onairIst');
  if (smpte) {
    const t0 = Date.now();
    const pad = (n) => String(n).padStart(2, '0');
    setInterval(() => {
      const el = Date.now() - t0, fr = Math.floor(el / (1000 / 24));
      const f = fr % 24, s = Math.floor(fr / 24) % 60, m = Math.floor(fr / 1440) % 60, h = Math.floor(fr / 86400);
      smpte.textContent = pad(h) + ':' + pad(m) + ':' + pad(s) + ':' + pad(f);
      if (oIst) { try { oIst.textContent = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }).slice(0, 5); } catch (e) {} }
    }, 1000 / 24);
  }

  /* ---------- 14 · INDEX: gallery nav + keyboard ---------- */
  const ifilm = document.getElementById('indexFilm');
  const istep = () => { const c = ifilm && ifilm.querySelector('.icard'); return c ? c.getBoundingClientRect().width + 24 : 340; };
  const iprev = document.getElementById('idxPrev'), inext = document.getElementById('idxNext');
  if (ifilm && iprev) iprev.addEventListener('click', () => ifilm.scrollBy({ left: -istep(), behavior: 'smooth' }));
  if (ifilm && inext) inext.addEventListener('click', () => ifilm.scrollBy({ left: istep(), behavior: 'smooth' }));
  if (ifilm) ifilm.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); ifilm.scrollBy({ left: istep(), behavior: 'smooth' }); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); ifilm.scrollBy({ left: -istep(), behavior: 'smooth' }); }
  });

  /* ---------- cursor hover for new targets ---------- */
  const ring = document.querySelector('.cursor-ring');
  if (ring) {
    document.querySelectorAll('.path-card,.pchip,.glass-go,.glass-try button,.lab-mag,.lab-inv,.field-shuffle,.icard-link').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }

  ScrollTrigger.refresh();
})();

/* Dinesh PP — storm chapter canvas. Original ukiyo-e-flavored art:
   dark teal churning clouds, cream foam swirls, crimson mountain ridges, grain. */
(function () {
  const cv = document.getElementById('storm');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, running = true, t = 0;

  function resize() {
    const r = cv.parentElement.getBoundingClientRect();
    W = cv.width = Math.max(2, r.width); H = cv.height = Math.max(2, r.height);
    drawRidges();
  }
  window.addEventListener('resize', resize);

  // pre-generated crimson ridgelines
  let ridges = [];
  function drawRidges() {
    ridges = [];
    const defs = [
      { y: 0.62, amp: 46, col: 'rgba(160,44,26,0.55)', seed: 3 },
      { y: 0.74, amp: 60, col: 'rgba(207,58,36,0.42)', seed: 7 },
      { y: 0.86, amp: 52, col: 'rgba(120,30,18,0.6)', seed: 11 }
    ];
    for (const d of defs) {
      const pts = [];
      for (let x = 0; x <= W; x += 18) {
        const n = Math.sin(x / 170 + d.seed) * 0.6 + Math.sin(x / 61 + d.seed * 2.3) * 0.3 + Math.sin(x / 23 + d.seed * 0.7) * 0.1;
        pts.push([x, H * d.y + n * d.amp]);
      }
      ridges.push({ pts, col: d.col });
    }
  }
  resize();
  new IntersectionObserver((es) => { running = es[0].isIntersecting; }).observe(cv);

  // foam swirls
  const swirls = [];
  for (let i = 0; i < 16; i++) {
    swirls.push({
      x: Math.random(), y: 0.15 + Math.random() * 0.6,
      r: 30 + Math.random() * 90, sp: (Math.random() - 0.5) * 0.35,
      a: 0.04 + Math.random() * 0.09, ph: Math.random() * 6.28
    });
  }

  function tick() {
    requestAnimationFrame(tick);
    if (!running) return;
    t += 0.016;
    const inten = 0.6 + (window.__storm || 0) * 1.6; // scroll-driven intensity

    // deep ink sky
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0b0f13'); g.addColorStop(0.55, '#10161c'); g.addColorStop(1, '#0d1114');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // churning cloud bands
    for (let b = 0; b < 6; b++) {
      const yB = H * (0.08 + b * 0.11);
      ctx.beginPath();
      for (let x = 0; x <= W; x += 16) {
        const y = yB + Math.sin(x / 240 + t * 0.22 * inten + b * 1.7) * 34
                      + Math.sin(x / 97 - t * 0.13 * inten + b) * 18;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(38,58,70,${0.34 - b * 0.04})`;
      ctx.lineWidth = 26 - b * 3;
      ctx.stroke();
    }

    // cream foam swirls
    for (const s of swirls) {
      const x = ((s.x + t * 0.008 * s.sp * inten) % 1 + 1) % 1 * W;
      const y = s.y * H + Math.sin(t * 0.5 + s.ph) * 12;
      ctx.beginPath();
      ctx.arc(x, y, s.r, s.ph + t * 0.1 * s.sp, s.ph + t * 0.1 * s.sp + 4.4);
      ctx.strokeStyle = `rgba(240,232,213,${s.a})`;
      ctx.lineWidth = 7;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, s.r * 0.55, -s.ph - t * 0.14 * s.sp, -s.ph - t * 0.14 * s.sp + 3.6);
      ctx.strokeStyle = `rgba(240,232,213,${s.a * 0.7})`;
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    // crimson ridges
    for (const r of ridges) {
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (const [x, y] of r.pts) ctx.lineTo(x, y + Math.sin(t * 0.4 + x / 300) * 4);
      ctx.lineTo(W, H); ctx.closePath();
      ctx.fillStyle = r.col; ctx.fill();
    }

    // vignette
    const v = ctx.createRadialGradient(W/2, H/2, Math.min(W,H)*0.35, W/2, H/2, Math.max(W,H)*0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  }
  tick();
})();

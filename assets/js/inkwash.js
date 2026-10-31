/* Dinesh PP — hero ink-wash backdrop: faint painted mist + ink branches behind the dragon. */
(function () {
  const cv = document.getElementById('inkwash');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, running = true, t = 0;

  function resize() {
    const r = cv.parentElement.getBoundingClientRect();
    W = cv.width = Math.max(2, r.width); H = cv.height = Math.max(2, r.height);
  }
  window.addEventListener('resize', resize);
  resize();
  new IntersectionObserver((es) => { running = es[0].isIntersecting; }).observe(cv);

  // faint ink branches (pre-generated polylines)
  const branches = [];
  const seeds = [2, 5, 9, 13, 21];
  for (const s of seeds) {
    const pts = [];
    let x = W * (0.08 + (s % 5) * 0.2), y = H * 0.12;
    const ang = 0.5 + (s % 3) * 0.22;
    for (let i = 0; i < 26; i++) {
      pts.push([x, y]);
      x += Math.cos(ang + Math.sin(i * 0.6 + s) * 0.35) * 26;
      y += Math.sin(ang + Math.sin(i * 0.6 + s) * 0.35) * 26 + 9;
    }
    branches.push({ pts, w: 1 + (s % 3) * 0.8, a: 0.05 + (s % 4) * 0.014 });
  }

  (function tick() {
    requestAnimationFrame(tick);
    if (!running) return;
    t += 0.016;
    ctx.clearRect(0, 0, W, H);

    // drifting mist bands
    for (let b = 0; b < 4; b++) {
      const yB = H * (0.2 + b * 0.2);
      const grd = ctx.createLinearGradient(0, yB - 60, 0, yB + 60);
      grd.addColorStop(0, 'rgba(30,42,52,0)');
      grd.addColorStop(0.5, `rgba(30,42,52,${0.16 - b * 0.025})`);
      grd.addColorStop(1, 'rgba(30,42,52,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 20) {
        const y = yB + Math.sin(x / 300 + t * 0.1 + b * 2) * 26;
        x === 0 ? ctx.moveTo(x, y - 60) : ctx.lineTo(x, y - 60);
      }
      for (let x = W; x >= 0; x -= 20) {
        const y = yB + Math.sin(x / 300 + t * 0.1 + b * 2) * 26;
        ctx.lineTo(x, y + 60);
      }
      ctx.closePath(); ctx.fill();
    }

    // ink branches, barely there
    for (const br of branches) {
      ctx.beginPath();
      br.pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.strokeStyle = `rgba(200,210,220,${br.a})`;
      ctx.lineWidth = br.w;
      ctx.stroke();
    }
  })();
})();

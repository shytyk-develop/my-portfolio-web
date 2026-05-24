export function initMatrix() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  if (reducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let columns = Math.floor(width / 20);
  const charArray = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  let drops = Array.from({ length: columns }, () => Math.random() * -100);
  let rafId = null;
  let lastFrame = 0;
  const frameInterval = isMobile ? 48 : 32;

  function draw() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.fillStyle = isLight ? 'rgba(248, 250, 252, 0.15)' : 'rgba(5, 5, 5, 0.05)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = isLight ? '#1e3a8a' : '#4AF626';
    ctx.font = '14px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = charArray[(Math.random() * charArray.length) | 0];
      ctx.fillText(text, i * 20, drops[i] * 20);
      if (drops[i] * 20 > height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  function loop(timestamp) {
    if (!document.hidden && timestamp - lastFrame >= frameInterval) {
      lastFrame = timestamp;
      draw();
    }
    rafId = requestAnimationFrame(loop);
  }

  rafId = requestAnimationFrame(loop);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / 20);
    drops = Array.from({ length: columns }, () => Math.random() * -100);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!document.hidden && !rafId) {
      lastFrame = 0;
      rafId = requestAnimationFrame(loop);
    }
  });
}

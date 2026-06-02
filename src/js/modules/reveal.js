export function initReveal() {
  const revealText = document.querySelector('.reveal-text');
  const revealSection = document.getElementById('reveal-section');
  if (!revealText || !revealSection) return;

  let cachedRect = null;
  let pendingMouse = null;
  let mouseTicking = false;
  let scrollTicking = false;

  const refreshRect = () => {
    cachedRect = revealText.getBoundingClientRect();
  };

  const applyMouse = () => {
    mouseTicking = false;
    if (!pendingMouse || !cachedRect) return;
    revealText.style.setProperty('--x', `${pendingMouse.x - cachedRect.left}px`);
    revealText.style.setProperty('--y', `${pendingMouse.y - cachedRect.top}px`);
  };

  revealSection.addEventListener(
    'mousemove',
    (e) => {
      if (window.innerWidth < 768) return;
      if (!cachedRect) refreshRect();
      pendingMouse = { x: e.clientX, y: e.clientY };
      if (!mouseTicking) {
        mouseTicking = true;
        requestAnimationFrame(applyMouse);
      }
    },
    { passive: true }
  );

  revealSection.addEventListener('mouseenter', refreshRect, { passive: true });

  const applyScroll = () => {
    scrollTicking = false;
    if (window.innerWidth >= 768) return;
    const rect = revealSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionCenterY = rect.top + rect.height / 2;
    const start = windowHeight * 0.8;
    const end = windowHeight * 0.2;
    let progress = ((start - sectionCenterY) / (start - end)) * 100;
    progress = Math.max(-30, Math.min(130, progress));
    revealText.style.setProperty('--x', `${progress}%`);
    revealText.style.setProperty('--y', '50%');
  };

  window.addEventListener(
    'scroll',
    () => {
      if (window.innerWidth >= 768) return;
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(applyScroll);
      }
    },
    { passive: true }
  );

  window.addEventListener('resize', () => {
    cachedRect = null;
  });

  requestAnimationFrame(applyScroll);
}

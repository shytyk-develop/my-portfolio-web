export function initReveal() {
  const revealText = document.querySelector('.reveal-text');
  const revealSection = document.getElementById('reveal-section');
  if (!revealText || !revealSection) return;

  revealSection.addEventListener('mousemove', (e) => {
    if (window.innerWidth >= 768) {
      const rect = revealText.getBoundingClientRect();
      revealText.style.setProperty('--x', `${e.clientX - rect.left}px`);
      revealText.style.setProperty('--y', `${e.clientY - rect.top}px`);
    }
  });

  window.addEventListener('scroll', () => {
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
  });

  window.dispatchEvent(new Event('scroll'));
}

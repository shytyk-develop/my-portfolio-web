export function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring || !window.matchMedia('(pointer: fine)').matches) return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;
  let isActive = false;

  const hideCursor = () => {
    isActive = false;
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    document.body.classList.remove('cursor-hover');
  };

  const showCursor = () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  };

  const isInsideViewport = (x, y) => {
    const margin = 1;
    return (
      x >= margin &&
      y >= margin &&
      x <= window.innerWidth - margin &&
      y <= window.innerHeight - margin
    );
  };

  const onPointerMove = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;

    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isInsideViewport(mouseX, mouseY)) {
      hideCursor();
      return;
    }

    if (!isActive) {
      isActive = true;
      ringX = mouseX;
      ringY = mouseY;
      showCursor();
    }
  };

  document.addEventListener('pointermove', onPointerMove, { passive: true });

  document.addEventListener('pointerout', (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const related = e.relatedTarget;
    if (!related || !(related instanceof Node) || !document.documentElement.contains(related)) {
      hideCursor();
    }
  });

  document.documentElement.addEventListener('mouseleave', hideCursor);

  window.addEventListener('blur', hideCursor);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hideCursor();
  });

  function animate() {
    if (isActive) {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      const dist = Math.hypot(dx, dy);
      const isHover = document.body.classList.contains('cursor-hover');
      const maxRadius = isHover ? 3 : 1.5;

      if (dist > maxRadius) {
        const angle = Math.atan2(dy, dx);
        ringX = mouseX - Math.cos(angle) * maxRadius;
        ringY = mouseY - Math.sin(angle) * maxRadius;
      }

      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
    }
    requestAnimationFrame(animate);
  }
  animate();

  const hoverSelector =
    'a, button, .cursor-pointer, .stack-item, .contact-card, .exp-chapter-nav__btn, .project-row, #gate-recover-key, #gate-copy-key';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelector)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelector)) document.body.classList.remove('cursor-hover');
  });
}

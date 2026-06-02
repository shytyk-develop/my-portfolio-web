const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  'label',
  '[role="button"]',
  '.cursor-pointer',
  '.stack-item',
  '.contact-card',
  '.workflow-step',
  '.experience-chapter-nav__btn',
  '.project-row',
  '.site-nav__link',
  '.editor-tab',
  '#gate-recover-key',
  '#gate-copy-key',
  '#copy-boot-key',
  '#continue-boot',
  '.boot-skip-btn',
].join(', ');

const TEXT_SELECTOR = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
  'pre',
  'code',
  '.section-lead',
  '.reveal-text',
  '.experience-slide__desc',
  '.experience-slide__headline',
  '.workflow-detail__text',
].join(', ');

export function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor || !window.matchMedia('(pointer: fine)').matches) return;

  let visible = false;

  const show = () => {
    if (visible) return;
    visible = true;
    cursor.classList.add('is-visible');
  };

  const hide = () => {
    visible = false;
    cursor.classList.remove('is-visible', 'is-interactive', 'is-text', 'is-pressed');
  };

  const move = (x, y) => {
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const updateState = (target) => {
    if (!(target instanceof Element)) return;

    const interactive = target.closest(INTERACTIVE_SELECTOR);
    const text = !interactive && target.closest(TEXT_SELECTOR);

    cursor.classList.toggle('is-interactive', Boolean(interactive));
    cursor.classList.toggle('is-text', Boolean(text));
  };

  const onPointerMove = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;

    move(e.clientX, e.clientY);
    updateState(e.target);
    show();
  };

  document.addEventListener('pointermove', onPointerMove, { passive: true });

  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    cursor.classList.add('is-pressed');
  });

  document.addEventListener('pointerup', () => {
    cursor.classList.remove('is-pressed');
  });

  document.addEventListener('pointerout', (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const related = e.relatedTarget;
    if (!related || !(related instanceof Node) || !document.documentElement.contains(related)) {
      hide();
    }
  });

  document.documentElement.addEventListener('mouseleave', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hide();
  });
}

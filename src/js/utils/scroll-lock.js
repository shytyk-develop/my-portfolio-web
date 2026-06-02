const BOOT_SCROLLABLE = '#boot-terminal-body';
const LOCK_CLASS = 'boot-scroll-lock';

let lockCount = 0;
let savedScrollY = 0;
let listenersAttached = false;

function isBootInteractiveTarget(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest('#boot-screen'));
}

function canScrollBootTerminal(deltaY) {
  const el = document.querySelector(BOOT_SCROLLABLE);
  if (!el) return false;

  const { scrollTop, scrollHeight, clientHeight } = el;
  if (scrollHeight <= clientHeight) return false;

  if (deltaY < 0) return scrollTop > 0;
  if (deltaY > 0) return scrollTop + clientHeight < scrollHeight;
  return true;
}

function onWheel(event) {
  if (lockCount === 0) return;

  if (isBootInteractiveTarget(event.target)) {
    if (canScrollBootTerminal(event.deltaY)) return;
  }

  event.preventDefault();
}

function onTouchMove(event) {
  if (lockCount === 0) return;
  if (isBootInteractiveTarget(event.target)) return;
  event.preventDefault();
}

function onWindowScroll() {
  if (lockCount === 0) return;
  window.scrollTo(0, savedScrollY);
}

function onKeyDown(event) {
  if (lockCount === 0) return;

  const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
  if (!scrollKeys.includes(event.key)) return;
  if (isBootInteractiveTarget(event.target)) return;

  event.preventDefault();
}

function attachListeners() {
  if (listenersAttached) return;
  listenersAttached = true;

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('scroll', onWindowScroll, { passive: true });
  window.addEventListener('keydown', onKeyDown);
}

function detachListeners() {
  if (!listenersAttached) return;
  listenersAttached = false;

  window.removeEventListener('wheel', onWheel);
  window.removeEventListener('touchmove', onTouchMove);
  window.removeEventListener('scroll', onWindowScroll);
  window.removeEventListener('keydown', onKeyDown);
}

function applyLockStyles() {
  savedScrollY = window.scrollY || window.pageYOffset || 0;
  document.documentElement.classList.add(LOCK_CLASS);
  document.body.classList.add(LOCK_CLASS);
  document.body.style.top = `-${savedScrollY}px`;
  window.scrollTo(0, savedScrollY);
}

function removeLockStyles(restoreY) {
  document.documentElement.classList.remove(LOCK_CLASS);
  document.body.classList.remove(LOCK_CLASS);
  document.body.style.top = '';
  window.scrollTo(0, restoreY);
}

/** Block page scroll while the boot / preloader screen is visible. */
export function lockScroll() {
  if (lockCount === 0) {
    applyLockStyles();
    attachListeners();
  }
  lockCount += 1;
}

/**
 * Release scroll lock. Pass `scrollTo` to override restored position (e.g. 0 after boot).
 * @param {{ scrollTo?: number }} [options]
 */
export function unlockScroll(options = {}) {
  if (lockCount === 0) return;

  lockCount -= 1;
  if (lockCount > 0) return;

  const restoreY = options.scrollTo ?? savedScrollY;
  detachListeners();
  removeLockStyles(restoreY);
  savedScrollY = 0;
}

export function isScrollLocked() {
  return lockCount > 0;
}

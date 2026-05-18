import { whoamiLines } from '../../data/whoami.js';

export function initWhoami() {
  const container = document.getElementById('whoami');
  if (!container) return;

  let index = 0;
  function typeNext() {
    if (index >= whoamiLines.length) return;
    const el = document.createElement('div');
    el.className = 'text-[var(--accent)] line';
    el.textContent = whoamiLines[index].text;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    index++;
    setTimeout(typeNext, 500);
  }
  typeNext();
}

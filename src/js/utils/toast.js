import { refreshIcons } from './icons.js';

export function showToast(message) {
  const container = document.getElementById('toast-container');
  const text = document.getElementById('toast-text');
  if (!container || !text) return;

  text.innerText = message;
  container.style.display = 'flex';
  requestAnimationFrame(() => {
    container.classList.add('show');
    refreshIcons();
  });

  setTimeout(() => {
    container.classList.remove('show');
    setTimeout(() => {
      container.style.display = 'none';
    }, 400);
  }, 3000);
}

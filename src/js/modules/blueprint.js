import { blueprintContent } from '../../data/blueprint.js';

export function initBlueprint() {
  document.querySelectorAll('.editor-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.editor-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const file = tab.getAttribute('data-file');
      const code = document.getElementById('code-content');
      if (code && file) code.innerHTML = blueprintContent[file];
    });
  });
}

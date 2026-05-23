import { blueprintContent } from '../../data/blueprint.js';

export function initBlueprint() {
  const code = document.getElementById('code-content');
  const tabs = document.querySelectorAll('.editor-tab');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const file = tab.getAttribute('data-file');
      if (code && file) {
        code.classList.remove('editor-content--fade');
        void code.offsetWidth;
        code.innerHTML = blueprintContent[file];
        code.classList.add('editor-content--fade');
      }
    });
  });
}

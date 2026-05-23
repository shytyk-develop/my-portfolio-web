import './styles/main.css';

import { refreshIcons } from './js/utils/icons.js';
import { initTheme } from './js/modules/theme.js';
import { initCursor } from './js/modules/cursor.js';
import { initMatrix } from './js/modules/matrix.js';
import { initBoot } from './js/modules/boot.js';
import { initTerminal } from './js/modules/terminal.js';
import { initProjects } from './js/modules/projects.js';
import { initStack } from './js/modules/stack.js';
import { initBlueprint } from './js/modules/blueprint.js';
import { initReveal } from './js/modules/reveal.js';
import { initWhoami } from './js/modules/whoami.js';
import { initClock } from './js/modules/clock.js';
import { initContact } from './js/modules/contact.js';
import { initWorkflow } from './js/modules/workflow.js';
import { initSignals } from './js/modules/signals.js';
import { renderExperienceSection } from './js/render/experience.js';
import { initCinematic } from './js/cinematic/engine.js';

function init() {
  renderExperienceSection();
  initTheme();
  initCursor();
  initMatrix();
  initBoot();
  initTerminal();
  initProjects();
  initStack();
  initBlueprint();
  initWorkflow();
  initSignals();
  initReveal();
  initWhoami();
  initClock();
  initContact();
  initCinematic();
  refreshIcons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

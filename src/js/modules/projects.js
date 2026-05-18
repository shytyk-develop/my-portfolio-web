import { projects, projectList } from '../../data/projects.js';
import { refreshIcons } from '../utils/icons.js';
import { showToast } from '../utils/toast.js';
import {
  getSessionKey,
  hasSessionKey,
  copySessionKey,
  setProjectsUnlocked,
  applyProjectsUnlockIfSaved,
} from '../utils/session-key.js';

export function initProjects() {
  initDrawer();
  initProjectGate();
  renderProjectList();
  applyProjectsUnlockIfSaved();
}

function renderProjectList() {
  const list = document.getElementById('projects-list');
  if (!list) return;

  list.innerHTML = projectList
    .map(
      (p) => `
    <div class="project-row flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-strict hover:border-accent group cursor-pointer bg-[var(--card-bg)] backdrop-blur-sm gap-4 md:gap-0" data-project="${p.id}" data-cinematic="card">
      <div class="flex items-center gap-4 md:gap-6">
        <span class="text-[var(--text-dim)] text-[9px] md:text-[10px] mono">ID: ${p.hex}</span>
        <span class="group-hover:text-[var(--accent)] transition-colors font-bold uppercase tracking-tight text-xs md:text-sm">${p.name}</span>
      </div>
      <div class="flex items-center justify-between w-full md:w-auto md:gap-8">
        <div class="hidden lg:flex items-center gap-2">
          <span class="text-[8px] text-[var(--text-dim)]">CRC32:</span>
          <span class="text-[8px] text-[var(--text-dim)] mono">${p.crc}</span>
        </div>
        <div class="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-end">
          <div class="w-16 hidden sm:block h-1 bg-[var(--border)]"><div class="h-1 bg-[var(--accent)] w-full"></div></div>
          <span class="status-badge text-[var(--accent)] text-[9px] md:text-[10px] border border-accent px-2 py-1 uppercase">DISCOVER</span>
        </div>
      </div>
    </div>`
    )
    .join('');

  list.querySelectorAll('.project-row').forEach((row) => {
    row.addEventListener('click', () => window.openDrawer(row.dataset.project));
  });
}

function initDrawer() {
  window.openDrawer = (id) => {
    const prj = projects[id];
    if (!prj) return;
    document.getElementById('drawer-title').innerText = prj.title;
    document.getElementById('drawer-content').innerText = prj.content;
    document.getElementById('drawer-stack').innerHTML = prj.stack
      .map(
        (s) =>
          `<span class="text-[var(--accent)] text-[10px] border border-accent px-2 py-1 uppercase">${s}</span>`
      )
      .join('');
    const repoLink = document.getElementById('drawer-repo-link');
    if (repoLink) repoLink.href = prj.repoUrl || '#';
    document.getElementById('side-drawer')?.classList.add('open');
    refreshIcons();
  };

  window.closeDrawer = () => document.getElementById('side-drawer')?.classList.remove('open');
}

function initProjectGate() {
  const recoverBtn = document.getElementById('gate-recover-key');
  const recoveredPanel = document.getElementById('gate-recovered-panel');
  const recoveredValue = document.getElementById('gate-recovered-value');
  const copyBtn = document.getElementById('gate-copy-key');

  window.verifyProjectsKey = () => {
    const input = document.getElementById('gate-key-input');
    const errorMsg = document.getElementById('gate-error-msg');
    const storedKey = getSessionKey();
    const entered = input?.value.trim().toUpperCase();

    if (!storedKey) {
      if (errorMsg) errorMsg.textContent = 'ERR: No session key. Reload and complete boot.';
      input?.classList.add('error');
      setTimeout(() => input?.classList.remove('error'), 600);
      return;
    }

    if (entered === storedKey) {
      if (errorMsg) errorMsg.textContent = '';
      setProjectsUnlocked();
      document.getElementById('projects-lock-wrapper')?.classList.add('unlocked');
      showToast('ACCESS_GRANTED // JOB_QUEUE_UNLOCKED');
    } else {
      if (errorMsg) errorMsg.textContent = 'INVALID_KEY // ACCESS_DENIED';
      input?.classList.add('error');
      setTimeout(() => input?.classList.remove('error'), 600);
      if (input) {
        input.value = '';
        input.focus();
      }
    }
  };

  window.showSessionKeyAtGate = () => {
    const key = getSessionKey();
    const errorMsg = document.getElementById('gate-error-msg');

    if (!key) {
      if (errorMsg) errorMsg.textContent = 'NO_KEY_IN_SESSION // Reload page';
      return;
    }

    if (recoveredPanel) recoveredPanel.hidden = false;
    if (recoveredValue) recoveredValue.textContent = key;
    if (errorMsg) errorMsg.textContent = '';
    if (recoverBtn) recoverBtn.textContent = 'HIDE SESSION KEY';
  };

  window.hideSessionKeyAtGate = () => {
    if (recoveredPanel) recoveredPanel.hidden = true;
    if (recoverBtn) recoverBtn.textContent = 'RECOVER SESSION KEY';
  };

  recoverBtn?.addEventListener('click', () => {
    if (recoveredPanel && !recoveredPanel.hidden) {
      window.hideSessionKeyAtGate();
    } else {
      window.showSessionKeyAtGate();
    }
  });

  copyBtn?.addEventListener('click', () => {
    copySessionKey();
  });

  const gateInput = document.getElementById('gate-key-input');
  gateInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') window.verifyProjectsKey();
  });
  gateInput?.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
  });

  if (hasSessionKey() && recoverBtn) {
    recoverBtn.disabled = false;
  }
}

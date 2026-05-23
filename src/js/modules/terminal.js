import { refreshIcons } from '../utils/icons.js';
import { apiHealth, apiMetrics, apiStatus } from '../api/client.js';
import {
  getSessionKey,
  copySessionKey,
  maskSessionKey,
  recoverSessionKeyFromApi,
} from '../utils/session-key.js';

const availableSections = [
  'home',
  'stack',
  'experience',
  'projects',
  'blueprint',
  'workflow',
  'signals',
  'contact',
];

export function initTerminal() {
  const terminalWindow = document.getElementById('terminal-window');
  const terminalBody = document.getElementById('terminal-body');
  const termToggleBtn = document.getElementById('term-toggle-btn');
  const termArrow = document.getElementById('term-arrow');
  const cliInput = document.getElementById('cli');
  const cliGhost = document.getElementById('cli-ghost');
  const cliPrompt = document.getElementById('cli-prompt');

  if (!terminalWindow || !cliInput) return;

  let cmdHistory = [];
  let historyIdx = -1;

  window.toggleTerminal = () => {
    terminalWindow.classList.toggle('expanded');
    termToggleBtn?.classList.remove('active');
    const isExpanded = terminalWindow.classList.contains('expanded');
    if (termArrow) termArrow.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
  };

  window.clearTerminal = () => {
    if (terminalBody) {
      terminalBody.innerHTML =
        '<div class="text-[var(--text-dim)] opacity-50 italic text-[10px] mb-2">-- Session cleared --</div>';
    }
  };

  async function printToTerminal(lines, isError = false) {
    if (!terminalWindow.classList.contains('expanded')) {
      terminalWindow.classList.add('expanded');
      if (termArrow) termArrow.style.transform = 'rotate(0deg)';
      termToggleBtn?.classList.remove('active');
    }

    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    const group = document.createElement('div');
    group.className = 'mb-4 last:mb-0';
    terminalBody?.appendChild(group);

    for (const line of lines) {
      const p = document.createElement('div');
      const textColorClass = isError ? 'text-red-500' : '';
      p.className = `flex gap-1 items-start opacity-0 translate-x-[-5px] transition-all duration-300 ${textColorClass}`;
      p.innerHTML = `<span class="term-timestamp">[${timestamp}]</span> <span class="opacity-30">>></span> <span class="flex-grow">${line}</span>`;
      group.appendChild(p);
      requestAnimationFrame(() => p.classList.remove('opacity-0', 'translate-x-[-5px]'));
      if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
      await new Promise((r) => setTimeout(r, 60));
    }
  }

  const commands = {
    help: () =>
      printToTerminal([
        'COMMANDS_MANUAL:',
        '  cd [dir]  - Navigate (home, stack, experience, projects, blueprint, contact)',
        '  ls        - Show available sections',
        '  whoami    - Architect information',
        '  theme     - Toggle color scheme',
        '  date      - Current system time',
        '  clear     - Clear the console',
        '  key       - Show / copy session SECURITY_KEY',
        '  ping      - API health + status',
        '  metrics   - Server portfolio metrics',
        '  help      - Show this help',
      ]),
    key: async () => {
      const key = await recoverSessionKeyFromApi();
      if (!key) {
        printToTerminal(['ERROR: No session key. Complete boot sequence first.'], true);
        return;
      }
      printToTerminal([
        'SESSION_VAULT:',
        `  KEY: ${key}`,
        `  MASKED: ${maskSessionKey(key)}`,
        '  ACTION: Copying to clipboard...',
      ]);
      copySessionKey();
    },
    ping: async () => {
      try {
        const health = await apiHealth();
        const status = await apiStatus();
        printToTerminal([
          'API_PING:',
          `  health: ${health.status} v${health.version}`,
          `  region: ${status.region}`,
          `  message: ${status.message}`,
        ]);
      } catch (err) {
        printToTerminal([`API_OFFLINE: ${err.message}`], true);
      }
    },
    metrics: async () => {
      try {
        const m = await apiMetrics();
        printToTerminal([
          'SERVER_METRICS:',
          `  api_version: ${m.api_version}`,
          `  projects_indexed: ${m.projects_indexed}`,
          `  stack_modules: ${m.stack_modules}`,
          `  experience_chapters: ${m.experience_chapters}`,
        ]);
      } catch (err) {
        printToTerminal([`METRICS_UNAVAILABLE: ${err.message}`], true);
      }
    },
    ls: () => printToTerminal(['System sections:', ...availableSections.map((s) => `  /bin/${s}`)]),
    whoami: () =>
      printToTerminal([
        'IDENT_VERIFIED: Jan Shytyk',
        'CLASS: Backend_Architect',
        'CORE: Python / FastAPI / PostgreSQL',
        'STATUS: ONLINE',
      ]),
    date: () => printToTerminal([new Date().toString()]),
    theme: () => window.toggleTheme?.(),
    clear: () => window.clearTerminal?.(),
    cd: (args) => {
      const target = args[0]?.toLowerCase();
      if (target === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (cliPrompt) cliPrompt.innerHTML = 'root@architect:~$';
        printToTerminal([`PATH_UPDATE: ~/${target}... OK`]);
      } else if (availableSections.includes(target)) {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
        if (cliPrompt) cliPrompt.innerHTML = `root@architect:~/${target}$`;
        printToTerminal([`PATH_UPDATE: ~/${target}... OK`]);
      } else {
        printToTerminal([`ERROR: Section '${target || ''}' does not exist. Use 'ls'.`], true);
      }
    },
  };

  cliInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    if (cliGhost) cliGhost.textContent = '';
    if (val.startsWith('cd ')) {
      const query = val.slice(3);
      const match = availableSections.find((s) => s.startsWith(query));
      if (match && cliGhost) cliGhost.textContent = val + match.slice(query.length);
    } else {
      const match = Object.keys(commands).find((c) => c.startsWith(val));
      if (match && val && cliGhost) cliGhost.textContent = match;
    }
  });

  cliInput.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' || (e.key === 'ArrowRight' && cliGhost?.textContent)) {
      e.preventDefault();
      if (cliGhost?.textContent) {
        cliInput.value = cliGhost.textContent;
        cliGhost.textContent = '';
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx < cmdHistory.length - 1) {
        historyIdx++;
        cliInput.value = cmdHistory[cmdHistory.length - 1 - historyIdx];
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        cliInput.value = cmdHistory[cmdHistory.length - 1 - historyIdx];
      } else {
        historyIdx = -1;
        cliInput.value = '';
      }
    }
    if (e.key === 'Enter') {
      const raw = cliInput.value.trim();
      cliInput.value = '';
      if (cliGhost) cliGhost.textContent = '';
      if (!raw) return;
      cmdHistory.push(raw);
      historyIdx = -1;
      const [cmd, ...args] = raw.split(' ');
      if (commands[cmd.toLowerCase()]) commands[cmd.toLowerCase()](args);
      else printToTerminal([`ERROR: Command '${cmd}' not recognized.`], true);
    }
  });

  window.openTerminalWithWelcome = () => {
    if (!terminalWindow.classList.contains('expanded')) window.toggleTerminal();
    printToTerminal([
      'SESSION_INITIALIZED: Granted access to ARCHITECT_OS.',
      'Welcome to the system.',
      "INFO: type 'ls' or 'key' to recover your session SECURITY_KEY.",
    ]);
  };

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const drawer = document.getElementById('side-drawer');
    if (drawer?.classList.contains('open')) window.closeDrawer?.();
    else if (terminalWindow.classList.contains('expanded')) window.toggleTerminal();
  });
}

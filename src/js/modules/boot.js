import { refreshIcons } from '../utils/icons.js';
import { saveSessionKey } from '../utils/session-key.js';

const bootSequence = [
  { type: 'text', content: '<span class="boot-dim">──────────────────────────────────────────</span>' },
  { type: 'text', content: '<span class="boot-ok">[ OK ]</span> <span class="boot-white">Loading ARCHITECT_OS core...</span>' },
  { type: 'text', content: '<span class="boot-ok">[ OK ]</span> <span class="boot-white">Mounting encrypted file system...</span>' },
  { type: 'text', content: '<span class="boot-ok">[ OK ]</span> <span class="boot-white">Loading environment modules...</span>' },
  { type: 'text', content: '<span class="boot-ok">[ OK ]</span> <span class="boot-white">Establishing secure tunnel...</span>' },
  { type: 'text', content: '<span class="boot-ok">[ OK ]</span> <span class="boot-white">Authentication system initialized.</span>' },
  { type: 'text', content: '<span class="boot-dim">──────────────────────────────────────────</span>' },
  { type: 'text', content: '' },
  { type: 'text', content: '<span class="boot-warn">[ AUTH ]</span> <span class="boot-white">Authorization is required to access the system.</span>' },
  { type: 'text', content: '<span class="boot-white">  A <span class="boot-cmd">SECURITY_KEY</span> will be generated and stored in this session.</span>' },
  { type: 'text', content: '<span class="boot-white">  You can recover it anytime via terminal: <span class="boot-cmd">key</span></span>' },
  { type: 'text', content: '' },
  { type: 'text', content: '<span class="boot-white">Continue and create key?  [<span class="boot-cmd">y</span> / <span class="boot-cmd-2">n</span>]</span>' },
  { type: 'input' },
];

export function initBoot() {
  const bootScreen = document.getElementById('boot-screen');
  const bootTerminalEl = document.getElementById('boot-terminal');
  const bootBody = document.getElementById('boot-terminal-body');
  const bootWelcome = document.getElementById('boot-welcome-overlay');
  const bootSession = document.getElementById('boot-session');

  if (!bootBody || !bootScreen) return;

  let bootSeqIdx = 0;

  if (bootSession) {
    bootSession.innerText = `Session: 0x${Math.floor(Math.random() * 65535)
      .toString(16)
      .toUpperCase()}`;
  }

  async function runBootSequence() {
    if (bootSeqIdx >= bootSequence.length) return;
    const item = bootSequence[bootSeqIdx];

    if (item.type === 'text') {
      const line = document.createElement('div');
      line.className = 'opacity-0 translate-x-[-10px] transition-all duration-200';
      line.innerHTML = item.content;
      bootBody.appendChild(line);
      requestAnimationFrame(() => line.classList.remove('opacity-0', 'translate-x-[-10px]'));
      bootBody.scrollTop = bootBody.scrollHeight;
      bootSeqIdx++;
      setTimeout(runBootSequence, 150 + Math.random() * 150);
    } else {
      createBootInput();
    }
  }

  function createBootInput() {
    const inputLine = document.createElement('div');
    inputLine.className = 'boot-input-line';
    inputLine.innerHTML =
      '<span class="boot-ok">❯</span><input type="text" id="boot-cli-input" maxlength="1" spellcheck="false" autocomplete="off">';
    bootBody.appendChild(inputLine);
    const input = document.getElementById('boot-cli-input');
    input?.focus();
    input?.addEventListener('keydown', async (e) => {
      if (e.key !== 'Enter') return;
      const val = input.value.trim().toLowerCase();
      input.disabled = true;
      if (val === 'y') await startKeyGeneration();
      else if (val === 'n') blockBootAccess();
      else {
        const err = document.createElement('div');
        err.className = 'boot-warn';
        err.textContent = '  Expected "y" or "n". Try again.';
        bootBody.appendChild(err);
        input.disabled = false;
        input.value = '';
        input.focus();
      }
    });
  }

  async function startKeyGeneration() {
    const steps = [
      'Gathering entropy from the hardware pool...',
      'Generating 128-bit session vector...',
      'Calculating key checksum...',
      'Finalizing SECURITY_KEY...',
    ];
    for (const s of steps) {
      const div = document.createElement('div');
      div.innerHTML = `<span class="boot-cmd">[ GEN ]</span> <span class="boot-white">${s}</span>`;
      bootBody.appendChild(div);
      bootBody.scrollTop = bootBody.scrollHeight;
      await new Promise((r) => setTimeout(r, 380));
    }

    const key = Array.from({ length: 16 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
    ).join('');

    saveSessionKey(key);

    const sep = document.createElement('div');
    sep.innerHTML = '<span class="boot-dim">──────────────────────────────────────────</span>';
    bootBody.appendChild(sep);

    const keyBox = document.createElement('div');
    keyBox.className = 'boot-key-box opacity-0 transition-opacity duration-700';
    keyBox.innerHTML = `
      <div class="boot-key-value">${key}</div>
      <div class="boot-key-actions">
        <button id="copy-boot-key" type="button">COPY KEY</button>
        <button id="continue-boot" type="button">CONTINUE</button>
      </div>`;
    bootBody.appendChild(keyBox);
    bootBody.scrollTop = bootBody.scrollHeight;
    requestAnimationFrame(() => keyBox.classList.remove('opacity-0'));

    const hint = document.createElement('div');
    hint.className = 'boot-key-hint';
    hint.innerHTML =
      '<span class="boot-warn">ℹ</span> <span>Key is saved in this browser session. Lost clipboard? Use terminal command <span class="boot-cmd">key</span> or recover at projects gate.</span>';
    bootBody.appendChild(hint);

    document.getElementById('copy-boot-key')?.addEventListener('click', async () => {
      const btn = document.getElementById('copy-boot-key');
      try {
        await navigator.clipboard.writeText(key);
      } catch {
        const temp = document.createElement('textarea');
        temp.value = key;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      if (btn) {
        btn.textContent = 'COPIED ✓';
        btn.style.background = '#4AF626';
        btn.style.color = '#000';
      }
    });

    document.getElementById('continue-boot')?.addEventListener('click', () => {
      const success = document.createElement('div');
      success.style.marginTop = '8px';
      success.innerHTML =
        '<span class="boot-ok">[ OK ]</span> <span class="boot-white">Session key stored. Initializing...</span>';
      bootBody.appendChild(success);
      bootBody.scrollTop = bootBody.scrollHeight;
      setTimeout(finalizeBoot, 800);
    });
  }

  function blockBootAccess() {
    const div = document.createElement('div');
    div.style.cssText =
      'margin-top:12px;padding:14px 16px;border:1px solid #3a1010;background:rgba(239,68,68,0.06)';
    div.innerHTML = `<div style="color:#ef4444;font-weight:bold;margin-bottom:6px;letter-spacing:0.1em">ACCESS_DENIED</div>
      <span style="color:#888;font-size:11px">Session interrupted by user. Refresh the page to try again.</span>`;
    bootBody.appendChild(div);
  }

  function finalizeBoot() {
    window.scrollTo(0, 0);
    bootTerminalEl.style.opacity = '0';
    bootTerminalEl.style.transform = 'scale(0.97)';
    setTimeout(() => {
      bootWelcome?.classList.add('show');
      setTimeout(() => {
        bootScreen.style.opacity = '0';
        window.scrollTo(0, 0);
        setTimeout(() => {
          bootScreen.style.display = 'none';
          refreshIcons();
          window.dispatchEvent(new CustomEvent('boot-complete'));
        }, 800);
      }, 1800);
    }, 400);
  }

  runBootSequence();
}

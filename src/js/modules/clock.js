import { apiHealth, apiStatus } from '../api/client.js';

export function initClock() {
  const startTime = Date.now();
  const apiDot = document.getElementById('api-status-dot');
  const apiLabel = document.getElementById('api-status-label');

  setInterval(() => {
    const uptime = document.getElementById('uptime-display');
    const diff = Math.floor((Date.now() - startTime) / 1000);
    const h = String(Math.floor(diff / 3600)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');
    if (uptime) uptime.innerText = `UPTIME: ${h}:${m}:${s}`;
  }, 1000);

  async function pingApi() {
    const t0 = performance.now();
    try {
      await apiHealth();
      const status = await apiStatus();
      const ms = Math.round(performance.now() - t0);
      if (apiDot) {
        apiDot.classList.remove('api-status-dot--offline');
        apiDot.classList.add('api-status-dot--online');
      }
      if (apiLabel) {
        apiLabel.textContent = `API ${ms}ms`;
        apiLabel.title = status.message || 'API online';
      }
    } catch {
      if (apiDot) {
        apiDot.classList.remove('api-status-dot--online');
        apiDot.classList.add('api-status-dot--offline');
      }
      if (apiLabel) {
        apiLabel.textContent = 'API OFF';
        apiLabel.title = 'Backend unavailable';
      }
    }
  }

  pingApi();
  setInterval(pingApi, 30000);
}

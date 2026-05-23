export function initClock() {
  const startTime = Date.now();

  setInterval(() => {
    const uptime = document.getElementById('uptime-display');
    const diff = Math.floor((Date.now() - startTime) / 1000);
    const h = String(Math.floor(diff / 3600)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');
    if (uptime) uptime.innerText = `UPTIME: ${h}:${m}:${s}`;
  }, 1000);
}

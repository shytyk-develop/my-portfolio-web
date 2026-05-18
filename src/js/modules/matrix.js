export function initMatrix() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let columns = Math.floor(width / 20);
  const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charArray = characters.split('');
  let drops = Array.from({ length: columns }, () => Math.random() * -100);

  function draw() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.fillStyle = isLight ? 'rgba(248, 250, 252, 0.15)' : 'rgba(5, 5, 5, 0.05)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = isLight ? '#1e3a8a' : '#4AF626';
    ctx.font = '14px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = charArray[Math.floor(Math.random() * charArray.length)];
      ctx.fillText(text, i * 20, drops[i] * 20);
      if (drops[i] * 20 > height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  setInterval(draw, 50);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / 20);
    drops = Array.from({ length: columns }, () => Math.random() * -100);
  });
}

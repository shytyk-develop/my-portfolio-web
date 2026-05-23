export function initStack() {
  document.querySelectorAll('.stack-item').forEach((item) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.toggleStack(item);
      }
    });
  });

  window.toggleStack = (element) => {
    const isActive = element.classList.contains('active');
    document.querySelectorAll('.stack-item').forEach((item) => item.classList.remove('active'));
    if (!isActive) element.classList.add('active');
  };
}

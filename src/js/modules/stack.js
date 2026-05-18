export function initStack() {
  window.toggleStack = (element) => {
    const isActive = element.classList.contains('active');
    document.querySelectorAll('.stack-item').forEach((item) => item.classList.remove('active'));
    if (!isActive) element.classList.add('active');
  };
}

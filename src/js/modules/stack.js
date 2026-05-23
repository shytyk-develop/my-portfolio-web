const STACK_SKILLS = {
  languages: [
    ['Python', 95],
    ['SQL', 82],
    ['AI APIs', 78],
  ],
  databases: [
    ['PostgreSQL', 90],
    ['Redis', 75],
    ['Schema design', 85],
  ],
  infrastructure: [
    ['Docker', 88],
    ['AWS', 72],
    ['CI/CD', 80],
  ],
  integrations: [
    ['REST / WS', 92],
    ['Git workflow', 88],
  ],
};

const STACK_KEYS = ['languages', 'databases', 'infrastructure', 'integrations'];

export function initStack() {
  document.querySelectorAll('.stack-item').forEach((item, index) => {
    const key = STACK_KEYS[index];
    if (key && STACK_SKILLS[key]) {
      const details = item.querySelector('.stack-details');
      if (details && !details.querySelector('.stack-bars')) {
        const bars = document.createElement('div');
        bars.className = 'stack-bars';
        bars.innerHTML = STACK_SKILLS[key]
          .map(
            ([name, level]) => `
          <div class="stack-bar-row">
            <span class="stack-bar-row__label">${name}</span>
            <div class="stack-bar" data-level="${level}"><span></span></div>
          </div>`
          )
          .join('');
        details.appendChild(bars);
      }
    }

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
    if (!isActive) {
      element.classList.add('active');
      animateBars(element);
    }
  };
}

function animateBars(item) {
  item.querySelectorAll('.stack-bar span').forEach((fill) => {
    const row = fill.closest('.stack-bar');
    const level = row?.getAttribute('data-level') || '0';
    fill.style.width = '0%';
    requestAnimationFrame(() => {
      fill.style.width = `${level}%`;
    });
  });
}

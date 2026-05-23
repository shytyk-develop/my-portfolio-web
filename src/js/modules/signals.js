import { apiMetrics } from '../api/client.js';

const FALLBACK = {
  api_version: '2.1.0',
  projects_indexed: 6,
  stack_modules: 4,
  experience_chapters: 4,
};

export function initSignals() {
  const grid = document.getElementById('signals-grid');
  if (!grid) return;

  renderSignals(grid, FALLBACK);
  apiMetrics()
    .then((data) => renderSignals(grid, data))
    .catch(() => {});
}

function renderSignals(grid, data) {
  const items = [
    { label: 'API_VERSION', value: data.api_version, suffix: '' },
    { label: 'PROJECTS_INDEXED', value: data.projects_indexed, suffix: '' },
    { label: 'STACK_MODULES', value: data.stack_modules, suffix: '' },
    { label: 'EXPERIENCE_CHAPTERS', value: data.experience_chapters, suffix: '' },
  ];

  grid.innerHTML = items
    .map(
      (item) => `
    <div class="signal-card border-strict" data-cinematic="card">
      <span class="signal-card__label">${item.label}</span>
      <span class="signal-card__value" data-signal-value>${item.value}${item.suffix}</span>
      <span class="signal-card__source">// server: GET /api/metrics</span>
    </div>`
    )
    .join('');
}

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { apiMetrics } from '../api/client.js';

gsap.registerPlugin(ScrollTrigger);

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
  animateSignalCards(grid);

  apiMetrics()
    .then((data) => updateSignalValues(grid, data))
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
      (item, i) => `
    <div class="signal-card border-strict" data-signal-card data-signal-label="${item.label}">
      <span class="signal-card__label">${item.label}</span>
      <span class="signal-card__value" data-signal-value>${item.value}${item.suffix}</span>
      <span class="signal-card__source">// server: GET /api/metrics</span>
      <span class="signal-card__pulse" aria-hidden="true"></span>
    </div>`
    )
    .join('');
}

function updateSignalValues(grid, data) {
  const map = {
    API_VERSION: String(data.api_version),
    PROJECTS_INDEXED: String(data.projects_indexed),
    STACK_MODULES: String(data.stack_modules),
    EXPERIENCE_CHAPTERS: String(data.experience_chapters),
  };

  grid.querySelectorAll('[data-signal-card]').forEach((card) => {
    const label = card.getAttribute('data-signal-label');
    const valueEl = card.querySelector('[data-signal-value]');
    if (label && valueEl && map[label] !== undefined) {
      valueEl.textContent = map[label];
    }
  });
}

function animateSignalCards(grid) {
  const cards = grid.querySelectorAll('[data-signal-card]');
  if (!cards.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  gsap.fromTo(
    cards,
    { opacity: 0, y: 20, scale: 0.96 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.65,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
        id: 'signals-cards',
      },
    }
  );

  cards.forEach((card, i) => {
    const valueEl = card.querySelector('[data-signal-value]');
    if (!valueEl) return;

    const raw = valueEl.textContent?.trim() || '';
    const num = Number(raw);
    if (!Number.isInteger(num)) return;

    const counter = { val: 0 };
    gsap.to(counter, {
      val: num,
      duration: 1.1,
      delay: 0.12 + i * 0.07,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        once: true,
        id: `signals-count-${i}`,
      },
      onUpdate: () => {
        valueEl.textContent = String(Math.round(counter.val));
      },
    });
  });
}

import { workflowSteps } from '../../data/workflow.js';
import { refreshIcons } from '../utils/icons.js';

export function initWorkflow() {
  const track = document.getElementById('workflow-track');
  const detail = document.getElementById('workflow-detail');
  if (!track || !detail) return;

  track.innerHTML = workflowSteps
    .map(
      (step, i) => `
    <button type="button" class="workflow-step${i === 0 ? ' is-active' : ''}" data-step="${step.id}" data-cinematic="card">
      <span class="workflow-step__phase text-accent-inline">${step.phase}</span>
      <span class="workflow-step__title">${step.title}</span>
      <span class="workflow-step__subtitle text-muted">${step.subtitle}</span>
    </button>`
    )
    .join('');

  function renderDetail(step) {
    detail.innerHTML = `
      <div class="workflow-detail__head">
        <span class="text-label">Phase ${step.phase}</span>
        <h3 class="workflow-detail__title">${step.title}</h3>
      </div>
      <p class="workflow-detail__text">${step.detail}</p>
      <div class="workflow-detail__tags">
        ${step.tags.map((t) => `<span class="workflow-detail__tag"><span class="text-prefix">·</span> ${t}</span>`).join('')}
      </div>`;
    detail.classList.remove('workflow-detail--swap');
    requestAnimationFrame(() => detail.classList.add('workflow-detail--swap'));
  }

  renderDetail(workflowSteps[0]);

  track.querySelectorAll('.workflow-step').forEach((btn) => {
    btn.addEventListener('click', () => {
      track.querySelectorAll('.workflow-step').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const step = workflowSteps.find((s) => s.id === btn.dataset.step);
      if (step) renderDetail(step);
    });
  });

  refreshIcons();
}

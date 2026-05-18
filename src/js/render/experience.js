import { experience } from '../../data/experience.js';

export function renderExperienceSection() {
  const mount = document.getElementById('experience-mount');
  if (!mount) return;

  const slidesHtml = experience
    .map(
      (job, i) => `
    <article class="experience-slide${i === 0 ? ' is-active' : ''}" data-slide="${i}" data-job="${job.id}" aria-hidden="${i !== 0}">
      <span class="experience-slide__chapter" aria-hidden="true">${job.chapter}</span>
      <div class="experience-slide__inner">
        <div class="experience-slide__meta">
          <span class="experience-slide__status${job.status === 'ARCHIVE' ? ' experience-slide__status--archive' : ''}">${job.status}</span>
          <span class="experience-slide__location">${job.location}</span>
          <span class="experience-slide__location">· ${job.period}</span>
        </div>
        <h3 class="experience-slide__company" data-exp="company">${job.company}</h3>
        <p class="experience-slide__role" data-exp="role">${job.role}</p>
        <p class="experience-slide__headline" data-exp="headline">${job.headline}</p>
        <p class="experience-slide__desc" data-exp="desc">${job.description}</p>
        <ul class="experience-slide__highlights" data-exp="list">
          ${job.highlights.map((h) => `<li>${h}</li>`).join('')}
        </ul>
        <div class="experience-slide__tags" data-exp="tags">
          ${job.tags.map((t) => `<span class="experience-slide__tag">${t}</span>`).join('')}
        </div>
      </div>
    </article>`
    )
    .join('');

  const navHtml = experience
    .map(
      (job, i) =>
        `<button type="button" class="experience-chapter-nav__btn${i === 0 ? ' is-active' : ''}" data-chapter="${i}">${job.chapter} · ${job.company.split(' ')[0]}</button>`
    )
    .join('');

  const dotsHtml = experience
    .map((_, i) => `<span class="experience-progress__dot${i === 0 ? ' is-active' : ''}" data-dot="${i}"></span>`)
    .join('');

  mount.innerHTML = `
    <section id="experience" class="experience-cinema">
      <div class="experience-cinema__intro max-w-6xl mx-auto px-4 md:px-6">
        <div class="section-heading" data-cinematic="heading">
          <span class="section-heading__num">02</span>
          <h2 class="section-heading__title">WORK EXPERIENCE // CAREER_LOG</h2>
          <div class="section-heading__line"></div>
        </div>
        <p class="text-[var(--text-dim)] text-[10px] md:text-xs uppercase tracking-widest max-w-xl" data-cinematic="fade">
          Scroll to play through career chapters — cinematic timeline
        </p>
        <div class="experience-cinema__scroll-hint" data-cinematic="fade">
          <span>SCROLL TO PLAY</span>
          <div class="experience-cinema__scroll-hint-line"></div>
        </div>
      </div>

      <div class="experience-pin-wrap" id="experience-pin-wrap">
        <div class="experience-stage" id="experience-stage">
          <div class="experience-stage__letterbox experience-stage__letterbox--top"></div>
          <div class="experience-stage__letterbox experience-stage__letterbox--bottom"></div>
          <div class="experience-stage__grain"></div>
          <div class="experience-stage__vignette"></div>

          <div class="experience-stage__timecode">
            <span>TC</span>
            <span class="experience-stage__timecode-val" id="exp-timecode">00:00:00:00</span>
            <span id="exp-frame">FRAME 001</span>
          </div>

          <div class="experience-progress">
            <div class="experience-progress__chapters">${dotsHtml}</div>
            <div class="experience-progress__track">
              <div class="experience-progress__fill" id="exp-progress-fill"></div>
            </div>
          </div>

          <div class="experience-slides" id="experience-slides">
            ${slidesHtml}
          </div>

          <nav class="experience-chapter-nav" aria-label="Chapters">
            ${navHtml}
          </nav>
        </div>
      </div>
    </section>`;
}

import { experience } from '../../data/experience.js';

function shortCompanyName(company) {
  if (company === 'Independent Practice') return 'Freelance';
  return company.split(' ')[0];
}

export function renderExperienceSection() {
  const mount = document.getElementById('experience-mount');
  if (!mount) return;

  const slidesHtml = experience
    .map(
      (job, i) => `
    <article class="experience-slide${i === 0 ? ' is-active' : ''}" id="exp-${job.id}" data-slide="${i}" data-job="${job.id}" aria-hidden="${i !== 0}">
      <span class="experience-slide__chapter experience-stage__chrome" aria-hidden="true">${job.chapter}</span>
      <div class="experience-slide__card">
        <header class="experience-slide__header">
          <span class="text-chip${job.status === 'ARCHIVE' ? ' text-chip--archive' : ''}">${job.status}</span>
          <div class="experience-slide__meta">
            <span class="text-meta"><span class="text-label">Location</span> <span class="text-value">${job.location}</span></span>
            <span class="text-meta"><span class="text-label">Period</span> <span class="text-value">${job.period}</span></span>
          </div>
        </header>
        <h3 class="experience-slide__company">${job.company}</h3>
        <p class="experience-slide__role"><span class="text-accent-inline">Role ·</span> ${job.role}</p>
        <p class="experience-slide__headline">${job.headline}</p>
        <p class="experience-slide__desc">${job.description}</p>
        <div class="experience-slide__block">
          <span class="text-label text-label--block">Key contributions</span>
          <ul class="experience-slide__highlights">
            ${job.highlights.map((h) => `<li><span class="text-prefix" aria-hidden="true">&gt;</span> ${h}</li>`).join('')}
          </ul>
        </div>
        <div class="experience-slide__block experience-slide__block--tags">
          <span class="text-label text-label--block">Stack & focus</span>
          <div class="experience-slide__tags">
            ${job.tags.map((t) => `<span class="experience-slide__tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    </article>`
    )
    .join('');

  const navHtml = experience
    .map(
      (job, i) => `
        <button type="button" class="experience-chapter-nav__btn${i === 0 ? ' is-active' : ''}" data-chapter="${i}">
          <span class="exp-nav__num experience-stage__chrome">${job.chapter}</span>
          <span class="exp-nav__name">${shortCompanyName(job.company)}</span>
        </button>`
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
          <h2 class="section-heading__title">
            <span class="section-heading__title-main">WORK EXPERIENCE</span>
            <span class="section-heading__title-sub">CAREER LOG</span>
          </h2>
          <div class="section-heading__line"></div>
        </div>
        <p class="section-lead experience-cinema__tagline" data-cinematic="fade">
          <span class="experience-cinema__tagline-desktop">Roles where I shipped <span class="text-accent-inline">automation, APIs, and internal tools</span> — scroll on desktop to step through chapters.</span>
          <span class="experience-cinema__tagline-mobile">Tap a role below or scroll through each position.</span>
        </p>
        <div class="experience-cinema__scroll-hint experience-stage__chrome hidden lg:flex" data-cinematic="fade">
          <span>SCROLL TO PLAY</span>
          <div class="experience-cinema__scroll-hint-line"></div>
        </div>
      </div>

      <div class="experience-pin-wrap" id="experience-pin-wrap">
        <div class="experience-stage" id="experience-stage">
          <div class="experience-stage__letterbox experience-stage__letterbox--top experience-stage__chrome"></div>
          <div class="experience-stage__letterbox experience-stage__letterbox--bottom experience-stage__chrome"></div>
          <div class="experience-stage__grain experience-stage__chrome"></div>
          <div class="experience-stage__vignette experience-stage__chrome"></div>

          <div class="experience-stage__timecode experience-stage__chrome">
            <span class="text-label">Timecode</span>
            <span class="experience-stage__timecode-val" id="exp-timecode">00:00:00:00</span>
            <span id="exp-frame" class="text-muted">FRAME 001</span>
          </div>

          <div class="experience-progress experience-stage__chrome">
            <div class="experience-progress__chapters">${dotsHtml}</div>
            <div class="experience-progress__track">
              <div class="experience-progress__fill" id="exp-progress-fill"></div>
            </div>
          </div>

          <nav class="experience-chapter-nav" aria-label="Chapters">
            ${navHtml}
          </nav>

          <div class="experience-slides" id="experience-slides">
            ${slidesHtml}
          </div>
        </div>
      </div>
    </section>`;
}

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initExperienceCinema } from './experience-cinema.js';

gsap.registerPlugin(ScrollTrigger);

let bootDone = false;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initCinematic() {
  const run = () => {
    if (bootDone) return;
    bootDone = true;

    if (prefersReducedMotion()) {
      gsap.set('[data-cinematic]', { clearProps: 'all', opacity: 1, y: 0, filter: 'none' });
      initExperienceCinema();
      ScrollTrigger.refresh();
      return;
    }

    initGlobalScroll();
    initHeroCinematic();
    initSectionReveals();
    initExperienceCinema();
    initWorkflowCinematic();
    initRevealDivider();
    initNavHighlight();
    ScrollTrigger.refresh();
  };

  window.addEventListener('boot-complete', run, { once: true });

  setTimeout(() => {
    if (!bootDone && !document.getElementById('boot-screen')?.offsetParent) run();
  }, 3000);
}

function initGlobalScroll() {
  gsap.utils.toArray('[data-cinematic="fade"]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 28,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  gsap.utils.toArray('[data-cinematic="heading"]').forEach((el) => {
    const num = el.querySelector('.section-heading__num');
    const title = el.querySelector('.section-heading__title');
    const line = el.querySelector('.section-heading__line');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    if (num) tl.from(num, { x: -40, opacity: 0, duration: 0.7, ease: 'power4.out' }, 0);
    if (title) tl.from(title, { x: -28, opacity: 0, duration: 0.8, ease: 'power4.out' }, 0.08);
    if (line) tl.from(line, { scaleX: 0, transformOrigin: 'left', duration: 0.9, ease: 'power3.inOut' }, 0.2);
  });

  gsap.utils.toArray('[data-cinematic="card"]').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 36,
      duration: 0.85,
      delay: (i % 3) * 0.06,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function initHeroCinematic() {
  const hero = document.getElementById('home');
  if (!hero) return;

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.from('#home [data-cinematic="hero-tag"]', { opacity: 0, y: 16, duration: 0.55 }, 0.15)
    .from('#home .hero-title-line', { y: '105%', duration: 1, stagger: 0.1, ease: 'power4.out' }, 0.3)
    .from('#home [data-cinematic="hero-bio"]', { opacity: 0, x: -24, duration: 0.8 }, 0.55)
    .from('#home [data-cinematic="hero-actions"]', { opacity: 0, y: 12, duration: 0.55, clearProps: 'opacity,transform' }, 0.75)
    .from('#home [data-cinematic="hero-card"]', { opacity: 0, scale: 0.96, duration: 0.95 }, 0.45);

  if (window.matchMedia('(max-width: 1023px)').matches) {
    tl.from('#home .hero-scroll-hint', { opacity: 0, y: 8, duration: 0.5 }, 1.05);
  }

  gsap.set('#home .hero-actions, #home .hero-btn', { opacity: 1, visibility: 'visible' });

  gsap.to('#home [data-cinematic="hero-card"]', {
    y: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });
}

function initWorkflowCinematic() {
  const section = document.getElementById('workflow');
  if (!section) return;

  const heading = section.querySelector('[data-cinematic="heading"]');
  const lead = section.querySelector('.section-lead');
  const steps = gsap.utils.toArray('#workflow .workflow-step');
  const detail = section.querySelector('.workflow-detail');
  const layout = section.querySelector('.workflow-layout');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 82%',
      toggleActions: 'play none none reverse',
    },
  });

  if (lead) {
    tl.from(lead, { opacity: 0, y: 20, duration: 0.65, ease: 'power3.out' }, heading ? 0.12 : 0);
  }

  if (layout) {
    tl.from(layout, { opacity: 0, y: 28, duration: 0.85, ease: 'power3.out' }, 0.15);
  }

  if (steps.length) {
    tl.from(
      steps,
      {
        opacity: 0,
        x: -28,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
      },
      0.28
    );
  }

  if (detail) {
    tl.from(detail, { opacity: 0, x: 32, duration: 0.75, ease: 'power3.out' }, 0.32);

    const detailParts = detail.querySelectorAll(
      '.workflow-detail__head, .workflow-detail__text, .workflow-detail__tag'
    );
    if (detailParts.length) {
      tl.from(
        detailParts,
        { opacity: 0, y: 14, duration: 0.45, stagger: 0.07, ease: 'power2.out' },
        0.45
      );
    }
  }

  steps.forEach((step) => {
    step.addEventListener('mouseenter', () => {
      gsap.to(step, { x: 4, duration: 0.25, ease: 'power2.out' });
    });
    step.addEventListener('mouseleave', () => {
      gsap.to(step, { x: 0, duration: 0.3, ease: 'power2.out' });
    });
  });
}

function initSectionReveals() {
  gsap.utils.toArray('section[id]').forEach((section) => {
    if (section.id === 'experience' || section.id === 'reveal-section' || section.id === 'workflow') return;

    gsap.from(section, {
      opacity: 0.85,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 94%',
        end: 'top 70%',
        scrub: 0.4,
      },
    });
  });
}

function initRevealDivider() {
  const section = document.getElementById('reveal-section');
  const text = document.querySelector('.reveal-text');
  if (!section || !text) return;

  gsap.from(text, {
    scale: 0.92,
    opacity: 0.4,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 82%',
      end: 'top 45%',
      scrub: 0.8,
    },
  });
}

function initNavHighlight() {
  const links = gsap.utils.toArray('.site-nav__link');
  if (!links.length) return;

  links.forEach((link) => {
    const id = link.getAttribute('href')?.slice(1);
    const section = id ? document.getElementById(id) : null;
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: (self) => {
        if (self.isActive) {
          links.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      },
    });
  });
}

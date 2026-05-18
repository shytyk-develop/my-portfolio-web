import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initExperienceCinema } from './experience-cinema.js';

gsap.registerPlugin(ScrollTrigger);

let bootDone = false;

export function initCinematic() {
  const run = () => {
    if (bootDone) return;
    bootDone = true;
    initGlobalScroll();
    initHeroCinematic();
    initSectionReveals();
    initExperienceCinema();
    initRevealDivider();
    ScrollTrigger.refresh();
  };

  window.addEventListener('boot-complete', run, { once: true });

  // Fallback if boot was skipped (dev hot reload)
  setTimeout(() => {
    if (!bootDone && !document.getElementById('boot-screen')?.offsetParent) run();
  }, 3000);
}

function initGlobalScroll() {
  gsap.utils.toArray('[data-cinematic="fade"]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      filter: 'blur(8px)',
      duration: 1.2,
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

    if (num) tl.from(num, { x: -60, opacity: 0, duration: 0.8, ease: 'power4.out' }, 0);
    if (title) tl.from(title, { x: -40, opacity: 0, duration: 0.9, ease: 'power4.out' }, 0.1);
    if (line) tl.from(line, { scaleX: 0, transformOrigin: 'left', duration: 1, ease: 'power3.inOut' }, 0.25);
  });

  gsap.utils.toArray('[data-cinematic="card"]').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 50,
      scale: 0.96,
      rotateX: 8,
      transformPerspective: 800,
      duration: 1,
      delay: (i % 4) * 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

function initHeroCinematic() {
  const hero = document.getElementById('home');
  if (!hero) return;

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.from('#home [data-cinematic="hero-tag"]', { opacity: 0, y: 20, duration: 0.6 }, 0.2)
    .from(
      '#home .hero-title-line',
      { y: '110%', duration: 1.1, stagger: 0.12, ease: 'power4.out' },
      0.35
    )
    .from('#home [data-cinematic="hero-bio"]', { opacity: 0, x: -30, filter: 'blur(6px)', duration: 0.9 }, 0.7)
    .from('#home [data-cinematic="hero-cta"]', { opacity: 0, y: 24, duration: 0.7 }, 0.95)
    .from(
      '#home [data-cinematic="hero-card"]',
      { opacity: 0, scale: 0.92, rotateY: -12, transformPerspective: 1000, duration: 1.1 },
      0.5
    );

  gsap.to('#home [data-cinematic="hero-card"]', {
    y: -12,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
    },
  });
}

function initSectionReveals() {
  gsap.utils.toArray('section[id]').forEach((section) => {
    if (section.id === 'experience' || section.id === 'reveal-section') return;

    gsap.from(section, {
      opacity: 0.6,
      y: 30,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 92%',
        end: 'top 60%',
        scrub: 0.6,
      },
    });
  });
}

function initRevealDivider() {
  const section = document.getElementById('reveal-section');
  const text = document.querySelector('.reveal-text');
  if (!section || !text) return;

  gsap.from(text, {
    scale: 0.85,
    opacity: 0.3,
    letterSpacing: '0.2em',
    duration: 1.5,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      end: 'top 40%',
      scrub: 1,
    },
  });
}

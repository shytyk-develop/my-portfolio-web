import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const MOBILE_MQ = '(max-width: 1023px)';

let cleanupFns = [];
let lastLayoutMobile = null;

function isMobileLayout() {
  return window.matchMedia(MOBILE_MQ).matches;
}

function slideInner(slide) {
  return slide.querySelector('.experience-slide__inner') || slide.querySelector('.experience-slide__card');
}

function runCleanup() {
  cleanupFns.forEach((fn) => fn());
  cleanupFns = [];
}

function onCleanup(fn) {
  cleanupFns.push(fn);
}

function bindResizeRefresh() {
  if (window.__experienceCinemaResizeBound) return;
  window.__experienceCinemaResizeBound = true;

  let timer;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const mobile = isMobileLayout();
      if (lastLayoutMobile !== mobile) {
        initExperienceCinema();
      }
      ScrollTrigger.refresh();
    }, 200);
  });
}

export function initExperienceCinema() {
  runCleanup();

  const pinWrap = document.getElementById('experience-pin-wrap');
  const stage = document.getElementById('experience-stage');
  const slides = gsap.utils.toArray('.experience-slide');
  const progressFill = document.getElementById('exp-progress-fill');
  const timecodeEl = document.getElementById('exp-timecode');
  const frameEl = document.getElementById('exp-frame');
  const dots = gsap.utils.toArray('.experience-progress__dot');
  const navBtns = gsap.utils.toArray('.experience-chapter-nav__btn');
  const hintLine = document.querySelector('.experience-cinema__scroll-hint-line');

  if (!pinWrap || !stage || slides.length === 0) return;

  bindResizeRefresh();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = isMobileLayout();
  lastLayoutMobile = mobile;
  const slideCount = slides.length;

  applyLayoutMode(pinWrap, stage, mobile);

  slides.forEach((slide, i) => {
    const inner = slideInner(slide);
    if (mobile || reducedMotion) {
      gsap.set(slide, { clearProps: 'all' });
      if (inner) gsap.set(inner, { clearProps: 'all' });
      slide.style.position = 'relative';
      slide.style.visibility = 'visible';
      slide.style.opacity = '1';
      slide.classList.toggle('is-active', i === 0);
      slide.setAttribute('aria-hidden', 'false');
    } else if (i === 0) {
      gsap.set(slide, { visibility: 'visible', opacity: 1 });
      gsap.set(inner, { y: 0, opacity: 1, filter: 'blur(0px)' });
      slide.classList.add('is-active');
    } else {
      gsap.set(slide, { visibility: 'hidden', opacity: 0 });
      gsap.set(inner, { y: 60, opacity: 0, filter: 'blur(8px)' });
      slide.classList.remove('is-active');
    }
  });

  if (reducedMotion || mobile) {
    initMobileOrReduced(slides, navBtns, mobile && !reducedMotion);
    return;
  }

  initDesktopCinema({
    pinWrap,
    stage,
    slides,
    slideCount,
    progressFill,
    timecodeEl,
    frameEl,
    dots,
    navBtns,
    hintLine,
  });
}

function applyLayoutMode(pinWrap, stage, mobile) {
  pinWrap.classList.toggle('experience-pin-wrap--mobile', mobile);
  stage.classList.toggle('experience-stage--mobile', mobile);

  if (mobile) {
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === pinWrap || st.pin === stage) st.kill();
    });
    gsap.set(stage, { clearProps: 'all' });
  }
}

function animateSlideContent(tl, slide, position) {
  const inner = slideInner(slide);
  if (!inner) return;

  const label = `slide-${slide.dataset.slide}`;
  tl.addLabel(label, position);

  const company = slide.querySelector('.experience-slide__company');
  const headline = slide.querySelector('.experience-slide__headline');
  const desc = slide.querySelector('.experience-slide__desc');
  const meta = slide.querySelector('.experience-slide__meta');
  const chapter = slide.querySelector('.experience-slide__chapter');
  const highlights = slide.querySelectorAll('.experience-slide__highlights li');
  const tags = slide.querySelectorAll('.experience-slide__tag');

  tl.fromTo(
    inner,
    { y: 70, opacity: 0, filter: 'blur(12px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'power4.out' },
    label
  );

  if (chapter) {
    tl.fromTo(chapter, { x: 40, opacity: 0 }, { x: 0, opacity: 0.3, duration: 0.5, ease: 'power3.out' }, label);
  }
  if (company) {
    tl.from(company, { y: 28, opacity: 0, duration: 0.45, ease: 'power3.out' }, `${label}+=0.05`);
  }
  if (meta) {
    tl.from(meta, { x: 20, opacity: 0, duration: 0.35, ease: 'power2.out' }, `${label}+=0.08`);
  }
  if (headline) {
    tl.from(headline, { y: 16, opacity: 0, duration: 0.4, ease: 'power2.out' }, `${label}+=0.12`);
  }
  if (desc) {
    tl.from(desc, { y: 12, opacity: 0, duration: 0.35, ease: 'power2.out' }, `${label}+=0.16`);
  }
  if (highlights.length) {
    tl.from(highlights, { x: -24, opacity: 0, stagger: 0.06, duration: 0.35, ease: 'power2.out' }, `${label}+=0.2`);
  }
  if (tags.length) {
    tl.from(tags, { y: 12, opacity: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out' }, `${label}+=0.28`);
  }
}

function initMobileOrReduced(slides, navBtns, animate) {
  const progressFill = document.getElementById('exp-progress-fill');

  slides.forEach((slide) => {
    const inner = slideInner(slide);
    if (inner) {
      gsap.set(inner, { clearProps: 'all', opacity: 1, y: 0, filter: 'none' });
    }

    if (animate && inner) {
      const st = ScrollTrigger.create({
        trigger: slide,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
        animation: gsap.from(inner, {
          opacity: 0,
          y: 28,
          duration: 0.75,
          ease: 'power3.out',
        }),
      });
      onCleanup(() => st.kill());
    }
  });

  navBtns.forEach((btn) => {
    const handler = () => {
      const idx = Number(btn.dataset.chapter);
      const target = slides[idx];
      if (target) {
        navBtns.forEach((b, i) => b.classList.toggle('is-active', i === idx));
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    btn.addEventListener('click', handler);
    onCleanup(() => btn.removeEventListener('click', handler));
  });

  if (progressFill) progressFill.style.height = '100%';
}

function initDesktopCinema(ctx) {
  const { pinWrap, stage, slides, slideCount, progressFill, timecodeEl, frameEl, dots, navBtns, hintLine } =
    ctx;

  const master = gsap.timeline({
    scrollTrigger: {
      trigger: pinWrap,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.4,
      pin: stage,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => updateUI(self.progress),
    },
  });

  onCleanup(() => master.scrollTrigger?.kill());
  onCleanup(() => master.kill());

  const chrome = stage.querySelectorAll(
    '.experience-stage__timecode, .experience-progress, .experience-chapter-nav'
  );
  if (chrome.length) {
    master.from(chrome, { opacity: 0, y: 14, duration: 0.35, stagger: 0.06, ease: 'power2.out' }, 0);
  }

  animateSlideContent(master, slides[0], 0);

  slides.forEach((slide, i) => {
    if (i === 0) return;
    const prev = slides[i - 1];
    const prevInner = slideInner(prev);
    const inner = slideInner(slide);
    const pos = master.duration();

    master
      .to(prevInner, { y: -50, opacity: 0, filter: 'blur(10px)', duration: 0.45, ease: 'power3.in' }, pos)
      .to(prev.querySelector('.experience-slide__chapter'), { opacity: 0, x: -30, duration: 0.35, ease: 'power2.in' }, pos)
      .to(prev, { opacity: 0, duration: 0.2 }, `${pos}+=0.15`)
      .set(prev, { visibility: 'hidden' })
      .set(slide, { visibility: 'visible', opacity: 1 });

    animateSlideContent(master, slide, `${pos}+=0.05`);
  });

  if (hintLine) {
    const hintSt = ScrollTrigger.create({
      trigger: pinWrap,
      start: 'top 95%',
      toggleActions: 'play none none reverse',
      animation: gsap.from(hintLine, {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1.2,
        ease: 'power3.inOut',
      }),
    });
    onCleanup(() => hintSt.kill());
  }

  function updateUI(progress) {
    const pct = Math.min(100, Math.max(0, progress * 100));
    if (progressFill) progressFill.style.height = `${pct}%`;

    const chapterIdx = Math.min(slideCount - 1, Math.floor(progress * slideCount));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === chapterIdx));
    navBtns.forEach((b, i) => b.classList.toggle('is-active', i === chapterIdx));

    slides.forEach((s, i) => {
      const active = i === chapterIdx;
      s.classList.toggle('is-active', active);
      s.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    const frames = Math.floor(progress * 240) + 1;
    if (frameEl) frameEl.textContent = `FRAME ${String(frames).padStart(3, '0')}`;

    const totalSec = Math.floor(progress * 120);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    const f = String(Math.floor((progress * 120 * 24) % 24)).padStart(2, '0');
    if (timecodeEl) timecodeEl.textContent = `${h}:${m}:${s}:${f}`;
  }

  navBtns.forEach((btn) => {
    const handler = () => {
      const idx = Number(btn.dataset.chapter);
      const st = master.scrollTrigger;
      if (!st) return;
      const target = (idx + 0.15) / slideCount;
      const y = st.start + (st.end - st.start) * target;
      window.scrollTo({ top: y, behavior: 'smooth' });
    };
    btn.addEventListener('click', handler);
    onCleanup(() => btn.removeEventListener('click', handler));
  });
}

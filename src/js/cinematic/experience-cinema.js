import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const MOBILE_MQ = '(max-width: 1023px)';
const ENTER_DURATION = 0.75;
const HOLD_DURATION = 1;
const CROSSFADE_DURATION = 1.35;
const FADE_EASE = 'power2.inOut';

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
    const chapter = slide.querySelector('.experience-slide__chapter');
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
      if (chapter) gsap.set(chapter, { x: 0, opacity: 0.3 });
      slide.classList.add('is-active');
    } else {
      gsap.set(slide, { visibility: 'hidden', opacity: 0 });
      gsap.set(inner, { y: 48, opacity: 0, filter: 'blur(10px)' });
      if (chapter) gsap.set(chapter, { x: 24, opacity: 0 });
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

/** First slide entrance — whole card moves as one unit */
function enterSlide(tl, slide, position) {
  const inner = slideInner(slide);
  const chapter = slide.querySelector('.experience-slide__chapter');

  tl.set(slide, { visibility: 'visible', opacity: 1 }, position);

  if (inner) {
    tl.fromTo(
      inner,
      { y: 44, opacity: 0, filter: 'blur(8px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: ENTER_DURATION, ease: 'power3.out' },
      position
    );
  }

  if (chapter) {
    tl.fromTo(
      chapter,
      { x: 28, opacity: 0 },
      { x: 0, opacity: 0.3, duration: ENTER_DURATION * 0.9, ease: 'power3.out' },
      position
    );
  }
}

/** Overlapping crossfade — no instant visibility/opacity jumps */
function crossfadeSlides(tl, outgoing, incoming, position) {
  const outInner = slideInner(outgoing);
  const inInner = slideInner(incoming);
  const outChapter = outgoing.querySelector('.experience-slide__chapter');
  const inChapter = incoming.querySelector('.experience-slide__chapter');

  tl.set([outgoing, incoming], { visibility: 'visible' }, position);
  tl.set(incoming, { opacity: 0 }, position);
  if (inInner) tl.set(inInner, { y: 48, opacity: 0, filter: 'blur(10px)' }, position);
  if (inChapter) tl.set(inChapter, { x: 24, opacity: 0 }, position);

  if (outInner) {
    tl.to(
      outInner,
      { y: -40, opacity: 0, filter: 'blur(10px)', duration: CROSSFADE_DURATION, ease: FADE_EASE },
      position
    );
  }

  if (outChapter) {
    tl.to(
      outChapter,
      { opacity: 0, x: -24, duration: CROSSFADE_DURATION * 0.9, ease: FADE_EASE },
      position
    );
  }

  tl.to(outgoing, { opacity: 0, duration: CROSSFADE_DURATION, ease: FADE_EASE }, position);

  tl.to(incoming, { opacity: 1, duration: CROSSFADE_DURATION, ease: FADE_EASE }, position);

  if (inInner) {
    tl.to(
      inInner,
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: CROSSFADE_DURATION, ease: FADE_EASE },
      position
    );
  }

  if (inChapter) {
    tl.to(
      inChapter,
      { x: 0, opacity: 0.3, duration: CROSSFADE_DURATION * 0.95, ease: FADE_EASE },
      position
    );
  }

  tl.set(outgoing, { visibility: 'hidden' }, position + CROSSFADE_DURATION);
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

  const chapterSwitchAt = [];

  const master = gsap.timeline({
    scrollTrigger: {
      trigger: pinWrap,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2,
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
  let cursor = 0;

  if (chrome.length) {
    master.from(chrome, { opacity: 0, y: 14, duration: 0.35, stagger: 0.06, ease: 'power2.out' }, cursor);
    cursor += 0.35;
  }

  enterSlide(master, slides[0], cursor);
  cursor += ENTER_DURATION + HOLD_DURATION;
  chapterSwitchAt.push({ idx: 0, time: 0 });

  for (let i = 1; i < slides.length; i++) {
    const switchTime = cursor + CROSSFADE_DURATION * 0.5;
    chapterSwitchAt.push({ idx: i, time: switchTime });
    crossfadeSlides(master, slides[i - 1], slides[i], cursor);
    cursor += CROSSFADE_DURATION;
    if (i < slides.length - 1) {
      cursor += HOLD_DURATION;
    } else {
      cursor += HOLD_DURATION * 0.6;
    }
  }

  const totalDuration = master.duration();

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

  function activeChapterIndex(progress) {
    const t = progress * totalDuration;
    let idx = 0;
    for (const point of chapterSwitchAt) {
      if (t >= point.time) idx = point.idx;
    }
    return idx;
  }

  function updateUI(progress) {
    const pct = Math.min(100, Math.max(0, progress * 100));
    if (progressFill) progressFill.style.height = `${pct}%`;

    const chapterIdx = activeChapterIndex(progress);
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
    const sec = String(totalSec % 60).padStart(2, '0');
    const f = String(Math.floor((progress * 120 * 24) % 24)).padStart(2, '0');
    if (timecodeEl) timecodeEl.textContent = `${h}:${m}:${sec}:${f}`;
  }

  navBtns.forEach((btn) => {
    const handler = () => {
      const idx = Number(btn.dataset.chapter);
      const st = master.scrollTrigger;
      if (!st) return;
      const targetTime = chapterSwitchAt.find((p) => p.idx === idx)?.time ?? 0;
      const y = st.start + (st.end - st.start) * (targetTime / totalDuration);
      window.scrollTo({ top: y, behavior: 'smooth' });
    };
    btn.addEventListener('click', handler);
    onCleanup(() => btn.removeEventListener('click', handler));
  });
}

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const MOBILE_MQ = '(max-width: 1023px)';

function isMobileLayout() {
  return window.matchMedia(MOBILE_MQ).matches;
}

export function initExperienceCinema() {
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

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = isMobileLayout();
  const slideCount = slides.length;

  applyLayoutMode(pinWrap, stage, mobile);

  slides.forEach((slide, i) => {
    const inner = slide.querySelector('.experience-slide__inner');
    if (mobile || reducedMotion) {
      gsap.set(slide, { clearProps: 'all' });
      gsap.set(inner, { clearProps: 'all' });
      slide.style.position = 'relative';
      slide.style.visibility = 'visible';
      slide.style.opacity = '1';
      slide.classList.toggle('is-active', i === 0);
      slide.setAttribute('aria-hidden', 'false');
    } else if (i === 0) {
      gsap.set(slide, { visibility: 'visible', opacity: 1 });
      slide.classList.add('is-active');
    } else {
      gsap.set(slide, { visibility: 'hidden', opacity: 0 });
      gsap.set(inner, { y: 60, opacity: 0 });
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

function initMobileOrReduced(slides, navBtns, animate) {
  const progressFill = document.getElementById('exp-progress-fill');

  slides.forEach((slide) => {
    const inner = slide.querySelector('.experience-slide__inner');
    if (inner) {
      gsap.set(inner, { clearProps: 'all', opacity: 1, y: 0 });
    }

    if (animate) {
      gsap.from(inner, {
        opacity: 0,
        y: 28,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: slide,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      });
    }
  });

  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.chapter);
      const target = slides[idx];
      if (target) {
        navBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
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

  slides.forEach((slide, i) => {
    if (i === 0) return;
    const prev = slides[i - 1];
    const prevInner = prev.querySelector('.experience-slide__inner');
    const inner = slide.querySelector('.experience-slide__inner');

    master
      .to(prevInner, { y: -50, opacity: 0, filter: 'blur(10px)', duration: 0.45, ease: 'power3.in' })
      .to(prev, { opacity: 0, duration: 0.2 }, '<0.15')
      .set(prev, { visibility: 'hidden' })
      .set(slide, { visibility: 'visible', opacity: 1 })
      .fromTo(
        inner,
        { y: 70, opacity: 0, filter: 'blur(12px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'power4.out' }
      )
      .from(
        slide.querySelectorAll('.experience-slide__highlights li'),
        { x: -24, opacity: 0, stagger: 0.06, duration: 0.35, ease: 'power2.out' },
        '<0.2'
      )
      .from(
        slide.querySelectorAll('.experience-slide__tag'),
        { y: 12, opacity: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out' },
        '<0.1'
      );
  });

  if (hintLine) {
    gsap.from(hintLine, {
      scaleX: 0,
      transformOrigin: 'left',
      duration: 1.2,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: pinWrap,
        start: 'top 95%',
        toggleActions: 'play none none reverse',
      },
    });
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
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.chapter);
      const st = master.scrollTrigger;
      if (!st) return;
      const target = (idx + 0.15) / slideCount;
      const y = st.start + (st.end - st.start) * target;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

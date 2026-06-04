/**
 * GSAP Animation Utilities
 * Reusable animation helpers for Aurelia Lore
 */

// ─────────────────────────────────────────────
// MOTION CONFIGS
// ─────────────────────────────────────────────

export const EASE_LUXURY = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const EASE_SLOW = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

export const MOTION_CONFIG = {
  duration: {
    fast: 0.4,
    normal: 0.8,
    slow: 1.2,
    cinematic: 1.8,
  },
  ease: {
    luxury: 'power3.out',
    smooth: 'power2.out',
    snap: 'back.out(1.7)',
    reveal: 'expo.out',
  },
  stagger: {
    tight: 0.05,
    normal: 0.1,
    loose: 0.2,
    editorial: 0.3,
  },
};

// ─────────────────────────────────────────────
// SCROLL TRIGGER DEFAULTS
// ─────────────────────────────────────────────

export const ST_DEFAULTS = {
  start: 'top 85%',
  end: 'bottom 20%',
  toggleActions: 'play none none none',
};

export const ST_SCRUB_DEFAULTS = {
  start: 'top bottom',
  end: 'bottom top',
  scrub: 1.5,
};

// ─────────────────────────────────────────────
// ANIMATION PRESETS
// ─────────────────────────────────────────────

/**
 * Fade + slide up reveal
 */
export function revealFromBottom(elements, options = {}) {
  const gsap = window.gsap;
  if (!gsap) return;

  return gsap.fromTo(
    elements,
    { opacity: 0, y: options.distance ?? 60 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration ?? MOTION_CONFIG.duration.slow,
      ease: options.ease ?? MOTION_CONFIG.ease.luxury,
      stagger: options.stagger ?? MOTION_CONFIG.stagger.normal,
      scrollTrigger: options.scrollTrigger
        ? { trigger: options.scrollTrigger, ...ST_DEFAULTS, ...options.scrollTriggerProps }
        : undefined,
      delay: options.delay ?? 0,
      ...options.gsapProps,
    }
  );
}

/**
 * Horizontal slide reveal
 */
export function revealFromLeft(elements, options = {}) {
  const gsap = window.gsap;
  if (!gsap) return;

  return gsap.fromTo(
    elements,
    { opacity: 0, x: -(options.distance ?? 80) },
    {
      opacity: 1,
      x: 0,
      duration: options.duration ?? MOTION_CONFIG.duration.slow,
      ease: MOTION_CONFIG.ease.luxury,
      stagger: options.stagger ?? MOTION_CONFIG.stagger.normal,
      scrollTrigger: options.scrollTrigger
        ? { trigger: options.scrollTrigger, ...ST_DEFAULTS }
        : undefined,
    }
  );
}

/**
 * Scale + fade reveal (for product images)
 */
export function scaleReveal(elements, options = {}) {
  const gsap = window.gsap;
  if (!gsap) return;

  return gsap.fromTo(
    elements,
    { opacity: 0, scale: options.scaleFrom ?? 1.05 },
    {
      opacity: 1,
      scale: 1,
      duration: options.duration ?? MOTION_CONFIG.duration.cinematic,
      ease: MOTION_CONFIG.ease.luxury,
      stagger: options.stagger ?? MOTION_CONFIG.stagger.loose,
      scrollTrigger: options.scrollTrigger
        ? { trigger: options.scrollTrigger, ...ST_DEFAULTS }
        : undefined,
    }
  );
}

/**
 * Text character split reveal (for large headings)
 */
export function splitTextReveal(element, options = {}) {
  const gsap = window.gsap;
  if (!gsap) return;

  return gsap.fromTo(
    element,
    { opacity: 0, y: 40, skewY: 2 },
    {
      opacity: 1,
      y: 0,
      skewY: 0,
      duration: MOTION_CONFIG.duration.cinematic,
      ease: MOTION_CONFIG.ease.reveal,
      scrollTrigger: options.scrollTrigger
        ? { trigger: options.scrollTrigger, ...ST_DEFAULTS }
        : undefined,
      delay: options.delay ?? 0,
    }
  );
}

/**
 * Parallax scroll effect
 */
export function parallax(element, yPercent = -20, options = {}) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  return gsap.to(element, {
    yPercent,
    ease: 'none',
    scrollTrigger: {
      trigger: options.trigger ?? element,
      ...ST_SCRUB_DEFAULTS,
      ...options.scrollTriggerProps,
    },
  });
}

/**
 * SVG path draw animation
 */
export function drawPath(pathElement, options = {}) {
  const gsap = window.gsap;
  if (!gsap || !pathElement) return;

  const length = pathElement.getTotalLength?.() ?? 1000;
  gsap.set(pathElement, { strokeDasharray: length, strokeDashoffset: length });

  return gsap.to(pathElement, {
    strokeDashoffset: 0,
    duration: options.duration ?? 2,
    ease: options.ease ?? 'power2.inOut',
    scrollTrigger: options.scrollTrigger
      ? { trigger: options.scrollTrigger, ...ST_DEFAULTS }
      : undefined,
    delay: options.delay ?? 0,
  });
}

/**
 * Cart drawer slide animation
 */
export function slideInDrawer(element) {
  const gsap = window.gsap;
  if (!gsap) return;

  return gsap.fromTo(
    element,
    { x: '100%' },
    { x: '0%', duration: MOTION_CONFIG.duration.normal, ease: MOTION_CONFIG.ease.luxury }
  );
}

export function slideOutDrawer(element) {
  const gsap = window.gsap;
  if (!gsap) return;

  return gsap.to(element, {
    x: '100%',
    duration: MOTION_CONFIG.duration.fast,
    ease: 'power2.in',
  });
}

/**
 * Navbar scroll behavior setup
 */
export function setupNavbarScroll(navElement) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger || !navElement) return;

  ScrollTrigger.create({
    start: 'top -80',
    onEnter: () => {
      navElement.classList.add('nav-scrolled');
    },
    onLeaveBack: () => {
      navElement.classList.remove('nav-scrolled');
    },
  });
}

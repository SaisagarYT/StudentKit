export const GSAP_DEFAULTS = {
  ease: 'power3.out',
  duration: 0.8,
} as const;

export const EASE = {
  smooth: 'power2.out',
  snappy: 'power3.out',
  elastic: 'elastic.out(1, 0.5)',
  bounce: 'back.out(1.7)',
  expo: 'expo.out',
} as const;

export const STAGGER = {
  fast: 0.05,
  normal: 0.08,
  slow: 0.12,
  card: 0.1,
} as const;

export const DURATION = {
  fast: 0.4,
  normal: 0.7,
  slow: 1,
  reveal: 0.9,
} as const;

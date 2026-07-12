'use client';

import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || !ref.current) return;

    const el = ref.current;

    gsap.set(el, { opacity: 0, y: 40 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return ref;
}

export function useGsapStaggerReveal<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const children = containerRef.current.children;
    if (!children.length) return;

    gsap.set(children, { opacity: 0, y: 30 });

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return containerRef;
}

export function useGsapHover<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  const onEnter = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: -4,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  const onLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  return { ref, onEnter, onLeave };
}

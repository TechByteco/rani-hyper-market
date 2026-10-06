import { useEffect, useRef } from 'react';

/**
 * High-performance GSAP ScrollTrigger & Lenis smooth scroll hook.
 * Integrates momentum inertia scrolling (60-120fps),
 * respects prefers-reduced-motion, cleans up via gsap.context() and lenis.destroy(),
 * and disables desktop pinning on mobile viewports (< 768px).
 */
export const useScrollAnimations = ({ heroPinRef, nextSectionRef }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lenis = null;

    // Initialize Lenis smooth scroll if available and reduced-motion not requested
    const LenisClass = window.Lenis;
    if (!prefersReducedMotion && LenisClass) {
      lenis = new LenisClass({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 1.5,
        wheelMultiplier: 1.0,
      });

      window.lenisInstance = lenis;

      if (window.ScrollTrigger) {
        lenis.on('scroll', window.ScrollTrigger.update);
      }

      if (window.gsap) {
        window.gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        window.gsap.ticker.lagSmoothing(0);
      }
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) {
      return () => {
        if (lenis) lenis.destroy();
      };
    }

    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion) {
      return () => {
        if (lenis) lenis.destroy();
      };
    }

    // Use gsap.context for clean component lifecycle scoping & teardown
    const ctx = gsap.context(() => {
      const isDesktop = window.innerWidth >= 768;

      if (isDesktop && heroPinRef && heroPinRef.current) {
        // Desktop Hero Pinning & Layered Scrub Parallax
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroPinRef.current,
            start: 'top top',
            end: '+=95%',
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        });

        // Hero Photograph: scale 1.00 -> 1.10 and translate -6%
        tl.to('.anim-hero-img', {
          scale: 1.10,
          yPercent: -6,
          ease: 'none'
        }, 0);

        // Subtle dark overlay on photo transition
        tl.to('.anim-hero-overlay', {
          opacity: 0.35,
          ease: 'none'
        }, 0);

        // Hero text group: translate upward by ~-48px and fade to 0.15
        tl.to('.anim-hero-text-group', {
          y: -48,
          opacity: 0.15,
          ease: 'none'
        }, 0);

        // Layered parallax speeds for text group elements
        tl.to('.anim-hero-eyebrow', { y: -20, ease: 'none' }, 0);
        tl.to('.anim-hero-heading', { y: -36, ease: 'none' }, 0);
        tl.to('.anim-hero-desc', { y: -52, ease: 'none' }, 0);
        tl.to('.anim-hero-actions', { y: -64, ease: 'none' }, 0);
        tl.to('.anim-hero-trust', { y: -76, ease: 'none' }, 0);

        // Offer Card: translate upward by ~-70px and rotate under 1 deg
        tl.to('.anim-offer-card', {
          y: -70,
          rotate: -0.75,
          ease: 'none'
        }, 0);
      }

      // Department items entrance: staggered fade-and-rise (y: 24 to 0, opacity 0 to 1, stagger: 0.08)
      if (nextSectionRef && nextSectionRef.current) {
        gsap.fromTo(
          '.anim-dept-card',
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: nextSectionRef.current,
              start: 'top 82%',
              once: true
            }
          }
        );
      }
    });

    return () => {
      ctx.revert(); // Automatically kills and cleans up all GSAP timelines & ScrollTriggers
      if (lenis) {
        lenis.destroy();
        window.lenisInstance = null;
      }
    };
  }, [heroPinRef, nextSectionRef]);
};

export default useScrollAnimations;

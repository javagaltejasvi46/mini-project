import { useEffect, useRef, useState } from 'react';

/**
 * useReveal — returns a ref and a boolean `visible`.
 * Attach the ref to any element. `visible` becomes true once
 * the element enters the viewport (fires once, never resets).
 *
 * @param {number} threshold  — 0–1, how much of the element must be visible (default 0.08)
 * @param {string} rootMargin — IntersectionObserver rootMargin (default '0px 0px -40px 0px')
 */
export const useReveal = (threshold = 0.08, rootMargin = '0px 0px -40px 0px') => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el); // fire once only
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, visible];
};

/**
 * useCountUp — animates a number from 0 to `target` when `active` becomes true.
 * Uses requestAnimationFrame for silky smooth counting.
 *
 * @param {number} target   — the final value
 * @param {boolean} active  — start counting when true
 * @param {number} duration — animation duration in ms (default 900)
 */
export const useCountUp = (target, active, duration = 900) => {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(from + (target - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration]);

  return count;
};

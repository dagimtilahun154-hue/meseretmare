import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to detect when an element enters the viewport.
 * Returns [ref, isVisible] — attach ref to the element, isVisible becomes true when in view.
 */
export function useInView(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element); // Only trigger once
        }
      },
      {
        threshold: options.threshold || 0.15,
        rootMargin: options.rootMargin || '0px 0px -60px 0px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options.threshold, options.rootMargin]);

  return [ref, isVisible];
}

/**
 * Custom hook for animated counting numbers.
 * Returns the current count value.
 */
export function useCountUp(target, isVisible, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    // Parse target — handle strings like "10,000+"
    const numericTarget = parseInt(String(target).replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericTarget)) {
      setCount(target);
      return;
    }

    const startTime = performance.now();
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * numericTarget);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return count;
}

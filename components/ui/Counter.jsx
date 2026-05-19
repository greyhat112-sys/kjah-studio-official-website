'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export default function Counter({ value, suffix = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10px' });
  const [display, setDisplay] = useState(0);
  const numericValue = parseFloat(value);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;

    const run = () => {
      const start = performance.now();
      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(numericValue * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (delay > 0) {
      const id = setTimeout(run, delay * 1000);
      return () => clearTimeout(id);
    }
    run();
  }, [inView, numericValue, delay]);

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}

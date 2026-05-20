'use client';
import { useEffect, useState } from 'react';

export default function Counter({ value, suffix = '', delay = 0 }) {
  const [display, setDisplay] = useState(0);
  const numericValue = parseFloat(value);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(numericValue);
      return;
    }

    const duration = 1400;
    const fps = 30;
    const totalFrames = Math.ceil(duration / (1000 / fps));
    let frame = 0;
    let intervalId = null;

    const run = () => {
      intervalId = setInterval(() => {
        frame++;
        const progress = Math.min(frame / totalFrames, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(numericValue * eased));
        if (frame >= totalFrames) {
          clearInterval(intervalId);
          setDisplay(numericValue);
        }
      }, 1000 / fps);
    };

    const timerId = setTimeout(run, delay * 1000);
    return () => {
      clearTimeout(timerId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [numericValue, delay]);

  return <span>{display}{suffix}</span>;
}

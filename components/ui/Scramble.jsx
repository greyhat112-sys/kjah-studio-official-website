'use client';
import { useEffect, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const ALPHA = /[A-Z0-9]/i;

export default function Scramble({ text, delay = 0, duration = 1100 }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      return;
    }

    let startTime;
    let raf;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      let output = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (!ALPHA.test(ch)) {
          output += ch;
          continue;
        }
        const charThreshold = (i / text.length) * 0.65;
        if (progress >= charThreshold + 0.3) {
          output += ch;
        } else {
          output += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(output);

      if (progress < 1) raf = requestAnimationFrame(step);
      else setDisplay(text);
    };

    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text, delay, duration]);

  return display;
}

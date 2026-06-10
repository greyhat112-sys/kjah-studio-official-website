'use client';
import { useEffect, useRef } from 'react';
import styles from './Cursor.module.css';

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      dotRef.current.classList.add(styles.hover);
      ringRef.current.classList.add(styles.hover);
    };
    const onLeave = () => {
      dotRef.current.classList.remove(styles.hover);
      ringRef.current.classList.remove(styles.hover);
    };

    window.addEventListener('mousemove', onMove);
    const interactives = document.querySelectorAll('a, button, [role="button"]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
    </>
  );
}

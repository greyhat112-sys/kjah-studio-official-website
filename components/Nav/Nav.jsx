'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';
import { useBooking } from '@/contexts/BookingContext';
import styles from './Nav.module.css';

const links = [
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#works', label: 'Works' },
  { href: '#testimonials', label: 'Reviews' },
];

export default function Nav() {
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { openBooking } = useBooking();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY < window.innerHeight * 0.5) setActive('');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const activeLabel = links.find((l) => l.href.slice(1) === active)?.label ?? '';

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Image src="/assets/brand/logo.png" width={32} height={32} alt="KJAH Studio" priority />
          <span className={styles.wordmark}>KJAH Studio</span>
        </Link>

        <ul className={styles.links}>
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`${styles.link} ${active === l.href.slice(1) ? styles.active : ''}`}
              >
                {l.label}
                {active === l.href.slice(1) && (
                  <motion.span className={styles.activeDot} layoutId="navDot" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.navRight}>
          <span className={styles.ctaWrap}>
            <MagneticButton onClick={openBooking} className="btn-p">Book a Call</MagneticButton>
          </span>
          {activeLabel && (
            <span className={styles.sectionLabel}>— {activeLabel}</span>
          )}
        </div>
      </div>
    </nav>
  );
}

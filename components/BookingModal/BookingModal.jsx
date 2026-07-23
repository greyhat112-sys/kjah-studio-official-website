'use client';
import { useEffect, useRef, useState } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import styles from './BookingModal.module.css';

export default function BookingModal() {
  const { isOpen, closeBooking } = useBooking();
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!isOpen) { setLoaded(false); return; }
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeBooking(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeBooking]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={closeBooking}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Book a call with KJAH Studio"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} className={styles.close} onClick={closeBooking} aria-label="Close booking modal">✕</button>
        {!loaded && (
          <div className={styles.loader}>
            <span className={styles.spinner} aria-hidden="true" />
            <p>Loading calendar…</p>
          </div>
        )}
        <iframe
          src="https://calendly.com/kjahstudio-support/30min?background_color=000000&text_color=ffffff&primary_color=4ddff0&hide_gdpr_banner=1"
          title="Book a call with KJAH Studio"
          className={`${styles.frame} ${loaded ? styles.frameVisible : styles.frameHidden}`}
          frameBorder="0"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}

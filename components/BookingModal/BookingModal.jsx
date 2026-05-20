'use client';
import { useEffect } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import styles from './BookingModal.module.css';

export default function BookingModal() {
  const { isOpen, closeBooking } = useBooking();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
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
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={closeBooking} aria-label="Close">✕</button>
        <iframe
          src="https://calendly.com/kjahstudio-support/30min?background_color=000000&text_color=ffffff&primary_color=4ddff0&hide_gdpr_banner=1"
          title="Book a call with KJAH Studio"
          className={styles.frame}
          frameBorder="0"
        />
      </div>
    </div>
  );
}

'use client';
import { useBooking } from '@/contexts/BookingContext';
import styles from './CTA.module.css';

export default function CTA() {
  const { openBooking } = useBooking();

  return (
    <section className={styles.section} id="contact">
      <div className="wrap">
        <p className="s-tag" style={{ display: 'block', textAlign: 'center' }}>— Ready to build?</p>
        <h2 className={styles.hl}>Let&apos;s build your<br />digital engine.</h2>
        <p className={styles.sub}>Send us a message. We&apos;ll map out exactly what you need and how we&apos;ll build it — no commitment required.</p>
        <div className={styles.actions}>
          <button onClick={openBooking} className="btn-p">Contact Us</button>
        </div>
      </div>
    </section>
  );
}

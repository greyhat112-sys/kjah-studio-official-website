'use client';
import { useEffect, useRef, useState } from 'react';
import { useBooking } from '@/contexts/BookingContext';
import styles from './BookingModal.module.css';

export default function BookingModal() {
  const { isOpen, closeBooking } = useBooking();
  const closeRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setForm({ name: '', email: '', message: '' });
      setStatus('idle');
      setErrorMsg('');
      return;
    }
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

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <div className={styles.backdrop} onClick={closeBooking}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Contact KJAH Studio"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} className={styles.close} onClick={closeBooking} aria-label="Close">✕</button>

        {status === 'success' ? (
          <div className={styles.success}>
            <span className={styles.successIcon}>✓</span>
            <p className={styles.successTitle}>Message sent.</p>
            <p className={styles.successSub}>We&rsquo;ll get back to you shortly.</p>
            <button className={styles.doneBtn} onClick={closeBooking}>Done</button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <p className={styles.label}>GET IN TOUCH</p>
            <h2 className={styles.heading}>Send us a message</h2>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                className={styles.input}
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={status === 'sending'}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                className={styles.input}
                type="email"
                name="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                required
                disabled={status === 'sending'}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                className={styles.textarea}
                name="message"
                placeholder="Tell us about your project..."
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                disabled={status === 'sending'}
              />
            </div>

            {status === 'error' && <p className={styles.errorMsg}>{errorMsg}</p>}

            <button className={styles.submit} type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

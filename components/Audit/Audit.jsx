'use client';
import { useState } from 'react';
import styles from './Audit.module.css';

const perks = [
  'Conversion & funnel gaps that are costing you leads',
  'Page speed, mobile & SEO health check',
  'Design and trust-signal quick wins',
  'A prioritized action list — yours to keep',
];

export default function Audit() {
  const [form, setForm] = useState({ name: '', email: '', website: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (ev) => setForm((f) => ({ ...f, [ev.target.name]: ev.target.value }));

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'audit' }),
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
    <section className={styles.section} id="audit">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.copy}>
          <p className="s-tag">— Free website audit</p>
          <h2 className={styles.hl}>See exactly what&rsquo;s<br />holding your site back.</h2>
          <p className={styles.sub}>
            Drop your URL and we&rsquo;ll send a no-strings breakdown of where your website
            is leaking leads — and the fastest ways to fix it. Free, personalized, no pitch.
          </p>
          <ul className={styles.perks}>
            {perks.map((p) => (
              <li key={p} className={styles.perk}>
                <span className={styles.check} aria-hidden="true">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.formWrap}>
          {status === 'success' ? (
            <div className={styles.success}>
              <span className={styles.successIcon}>✓</span>
              <p className={styles.successTitle}>Audit requested.</p>
              <p className={styles.successSub}>Check your inbox — we&rsquo;ll send your breakdown within 24&ndash;48 hours.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <p className={styles.formLabel}>GET YOUR FREE AUDIT</p>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="audit-name">Name</label>
                <input
                  id="audit-name"
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
                <label className={styles.fieldLabel} htmlFor="audit-email">Email</label>
                <input
                  id="audit-email"
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
                <label className={styles.fieldLabel} htmlFor="audit-website">Website URL</label>
                <input
                  id="audit-website"
                  className={styles.input}
                  type="url"
                  name="website"
                  placeholder="https://yoursite.com"
                  value={form.website}
                  onChange={handleChange}
                  required
                  disabled={status === 'sending'}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="audit-message">
                  Anything specific? <span className={styles.optional}>(optional)</span>
                </label>
                <textarea
                  id="audit-message"
                  className={styles.textarea}
                  name="message"
                  placeholder="What's your #1 goal for the site?"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  disabled={status === 'sending'}
                />
              </div>

              {status === 'error' && <p className={styles.errorMsg}>{errorMsg}</p>}

              <button className={styles.submit} type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Get My Free Audit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

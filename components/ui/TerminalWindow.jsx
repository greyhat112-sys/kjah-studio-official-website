'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TerminalWindow.module.css';

const sequences = [
  {
    title: 'fitpro-coaching.com',
    lines: [
      { tag: '$', text: 'kjah --build fitpro-coaching.com', type: 'cmd' },
      { tag: '[SCAN]',   text: 'auditing existing presence ......... done', type: 'status' },
      { tag: '[BUILD]',  text: 'scaffolding landing page ........... ✓',    type: 'status' },
      { tag: '[FUNNL]',  text: 'configuring lead capture flow ...... ✓',    type: 'status' },
      { tag: '[AUTO]',   text: 'email sequences (5 steps) .......... ✓',    type: 'status' },
      { tag: '[INTG]',   text: 'CRM → Zapier → Notion .............. ✓',    type: 'status' },
      { tag: '[DEPLOY]', text: 'pushing to production .............. ✓',    type: 'status' },
      { type: 'blank' },
      { tag: 'load time',  text: '→ 0.9s',  type: 'metric' },
      { tag: 'conv. rate', text: '→ +34%',  type: 'metric' },
      { tag: 'status',     text: '→ LIVE ●', type: 'live' },
    ],
  },
  {
    title: 'shopcraft-store.com',
    lines: [
      { tag: '$', text: 'kjah --build shopcraft-store.com', type: 'cmd' },
      { tag: '[SCAN]',   text: 'analyzing store performance ........ done', type: 'status' },
      { tag: '[BUILD]',  text: 'rebuilding product pages ........... ✓',    type: 'status' },
      { tag: '[FUNNL]',  text: 'checkout funnel optimization ....... ✓',    type: 'status' },
      { tag: '[AUTO]',   text: 'abandoned cart (3 triggers) ........ ✓',    type: 'status' },
      { tag: '[INTG]',   text: 'Shopify → Klaviyo → Gorgias ........ ✓',    type: 'status' },
      { tag: '[DEPLOY]', text: 'deploying to production ............ ✓',    type: 'status' },
      { type: 'blank' },
      { tag: 'page speed',   text: '→ 98 / 100', type: 'metric' },
      { tag: 'cart recovery', text: '→ +22%',    type: 'metric' },
      { tag: 'status',        text: '→ LIVE ●',  type: 'live' },
    ],
  },
  {
    title: 'elitecoach-academy.com',
    lines: [
      { tag: '$', text: 'kjah --build elitecoach-academy.com', type: 'cmd' },
      { tag: '[SCAN]',   text: 'mapping coaching pipeline .......... done', type: 'status' },
      { tag: '[BUILD]',  text: 'high-ticket sales page ............. ✓',    type: 'status' },
      { tag: '[FUNNL]',  text: 'VSL + application flow ............. ✓',    type: 'status' },
      { tag: '[AUTO]',   text: 'booking + follow-up automation ..... ✓',    type: 'status' },
      { tag: '[INTG]',   text: 'GHL → Stripe → Calendly ............ ✓',    type: 'status' },
      { tag: '[DEPLOY]', text: 'going live ......................... ✓',     type: 'status' },
      { type: 'blank' },
      { tag: 'time to build', text: '→ 6 days', type: 'metric' },
      { tag: 'close rate',    text: '→ +41%',   type: 'metric' },
      { tag: 'status',        text: '→ LIVE ●', type: 'live' },
    ],
  },
];

export default function TerminalWindow({ initialSeq = 0, initialLine = 0 }) {
  const [seqIndex, setSeqIndex] = useState(initialSeq % sequences.length);
  const [visibleCount, setVisibleCount] = useState(() => {
    const s = sequences[initialSeq % sequences.length];
    return Math.min(initialLine, s.lines.length);
  });

  useEffect(() => {
    const current = sequences[seqIndex];
    if (visibleCount >= current.lines.length) {
      const id = setTimeout(() => {
        setSeqIndex((i) => (i + 1) % sequences.length);
        setVisibleCount(0);
      }, 3200);
      return () => clearTimeout(id);
    }
    const line = current.lines[visibleCount];
    const delay = line.type === 'cmd' ? 420 : line.type === 'blank' ? 60 : 115;
    const id = setTimeout(() => setVisibleCount((c) => c + 1), delay);
    return () => clearTimeout(id);
  }, [seqIndex, visibleCount]);

  const seq = sequences[seqIndex];
  const done = visibleCount >= seq.lines.length;

  return (
    <div className={styles.terminal}>
      <div className={styles.titleBar}>
        <div className={styles.trafficLights}>
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.yellow}`} />
          <span className={`${styles.dot} ${styles.green}`} />
        </div>
        <span className={styles.titleText}>kjah-studio — build</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={seqIndex}
          className={styles.body}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {seq.lines.slice(0, visibleCount).map((line, i) => {
            if (line.type === 'blank') return <div key={i} className={styles.blank} />;

            if (line.type === 'metric' || line.type === 'live') {
              return (
                <div key={i} className={styles.metricLine}>
                  <span className={styles.metricLabel}>{line.tag}</span>
                  <span className={line.type === 'live' ? styles.liveVal : styles.metricVal}>
                    {line.text}
                  </span>
                </div>
              );
            }

            return (
              <div key={i} className={styles.line}>
                <span className={line.type === 'cmd' ? styles.prompt : styles.tag}>
                  {line.tag}
                </span>
                <span className={line.type === 'cmd' ? styles.cmdText : styles.lineText}>
                  {line.text}
                </span>
              </div>
            );
          })}

          <div className={styles.cursorLine}>
            {done && <span className={styles.prompt}>$</span>}
            <span className={styles.cursor} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

'use client';
import MagneticButton from '@/components/ui/MagneticButton';
import Counter from '@/components/ui/Counter';
import TerminalTile from '@/components/ui/TerminalTile';
import styles from './Hero.module.css';

const lines = ['SMART', 'BUILDS.'];

const stats = [
  { value: '4',   suffix: '',  label: 'Core Specialists', cyan: false },
  { value: '6',   suffix: '',  label: 'Platforms',        cyan: false },
  { value: '100', suffix: '%', label: 'Premium Builds',   cyan: true  },
  { value: '10',  suffix: '+', label: 'Projects Shipped', cyan: false },
];

const TILE_DELAYS = [0, 3200, 6800, 1600, 5100, 9400];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.orb} aria-hidden="true" />

      {/* Terminal grid — faint silhouette on mobile, full opacity on desktop */}
      <div className={styles.termGridWrapper} aria-hidden="true">
        <div className={styles.termGrid}>
          {TILE_DELAYS.map((delay, i) => (
            <TerminalTile key={i} seqIndex={i} startDelay={delay} />
          ))}
        </div>
        <div className={styles.termGridVignette} />
      </div>

      <div className={styles.inner}>
        <div className={styles.left}>

          {/* CSS animations — visible from first paint, no JS required */}
          <p className={styles.eyebrow}>
            Websites &middot; Funnels &middot; Automation
          </p>

          <h1 className={styles.display} aria-label="Smart Builds.">
            {lines.map((word, wi) => (
              <span key={wi} className={styles[`displayLine${wi}`]} style={{ display: 'block', whiteSpace: 'nowrap' }}>
                {word}
              </span>
            ))}
          </h1>

          <p className="sr-only">
            KJAH Studio builds premium websites, sales funnels, and marketing automation systems for coaches, e-commerce brands, and service businesses.
          </p>

          <p className={styles.hl}>We build premium websites, funnels &amp; automation systems for coaches, brands, and service businesses.</p>

          <div className={styles.actions}>
            <MagneticButton href="#contact" className="btn-p">Book a Free Call</MagneticButton>
            <MagneticButton href="#works"   className="btn-s">View Our Work</MagneticButton>
          </div>

          <div className={styles.stats}>
            {stats.map((s) => (
              <div key={s.label}>
                <div className={`${styles.statVal} ${s.cyan ? styles.statCyan : ''}`}>
                  <Counter value={s.value} suffix={s.suffix} delay={1.8} />
                </div>
                <div className={styles.statLbl}>{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

'use client';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';
import Counter from '@/components/ui/Counter';
import TerminalWindow from '@/components/ui/TerminalWindow';
import styles from './Hero.module.css';

const lines = ['SMART', 'BUILDS.'];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.4 } },
};

const charVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
};

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay } },
});

const stats = [
  { value: '4', suffix: '', label: 'Core Specialists', cyan: false },
  { value: '6', suffix: '', label: 'Platforms', cyan: false },
  { value: '100', suffix: '%', label: 'Done For You', cyan: true },
  { value: '10', suffix: '+', label: 'Projects Shipped', cyan: false },
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.dots} aria-hidden="true" />
      <div className={styles.orb} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.left}>

          <motion.p
            className={styles.eyebrow}
            variants={fadeUp(0.1)}
            initial="hidden"
            animate="visible"
          >
            Digital Studio &mdash; Websites &middot; Funnels &middot; Automation
          </motion.p>

          <motion.h1
            className={styles.display}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            aria-label="Smart Builds."
          >
            {lines.map((word, wi) => (
              <div key={wi} style={{ display: 'block', whiteSpace: 'nowrap' }}>
                {word.split('').map((char, ci) => (
                  <motion.span
                    key={ci}
                    variants={charVariants}
                    style={{ display: 'inline-block' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            ))}
          </motion.h1>

          <motion.p
            className={styles.hl}
            variants={fadeUp(0.9)}
            initial="hidden"
            animate="visible"
          >
            Real growth. Zero headache.
          </motion.p>

          <motion.div
            className={styles.actions}
            variants={fadeUp(1.1)}
            initial="hidden"
            animate="visible"
          >
            <MagneticButton href="#contact" className="btn-p">Book a Free Call</MagneticButton>
            <MagneticButton href="#works" className="btn-s">View Our Work</MagneticButton>
          </motion.div>

          <motion.div
            className={styles.stats}
            variants={fadeUp(1.3)}
            initial="hidden"
            animate="visible"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className={`${styles.statVal} ${s.cyan ? styles.statCyan : ''}`}>
                  <Counter value={s.value} suffix={s.suffix} delay={1.4} />
                </div>
                <div className={styles.statLbl}>{s.label}</div>
              </div>
            ))}
          </motion.div>

        </div>
        <motion.div
          className={styles.right}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.6 }}
        >
          <TerminalWindow />
        </motion.div>
      </div>
    </section>
  );
}

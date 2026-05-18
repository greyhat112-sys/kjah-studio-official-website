'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './Services.module.css';

const services = [
  {
    num: '01', title: 'Websites',
    desc: 'Conversion-focused websites built to last. Proper domain setup, mobile-first design, back-end configuration — everything working on day one.',
    tags: ['Up to 10 pages', 'Domain config', 'Mobile-first', 'Back-end setup'],
  },
  {
    num: '02', title: 'Funnels',
    desc: 'Sales funnels engineered to capture, nurture, and convert — from opt-in to checkout, fully integrated with your email and CRM stack.',
    tags: ['Up to 7 pages', 'Email automation', 'CRM integration', 'Checkout flow'],
  },
  {
    num: '03', title: 'Automation',
    desc: 'Back-end systems that run your business while you sleep — email sequences, workflow logic, third-party integrations, and CRM setup done right.',
    tags: ['Email sequences', 'Workflow logic', '3rd-party integrations', 'CRM setup'],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.12 },
  }),
};

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const headRef = useRef(null);
  const headInView = useInView(headRef, { once: true, margin: '-80px' });

  return (
    <section className="section" id="services">
      <div className="wrap">
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="s-tag">— What we build</p>
          <h2 className="s-head">Three pillars.<br />One team.</h2>
          <p className="s-body">Full-stack digital builds: design to deployment, back-end to automation. We hand you a system, not just a page.</p>
        </motion.div>

        <div ref={ref} className={styles.grid}>
          {services.map((s, i) => (
            <motion.div
              key={s.num}
              className={styles.card}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <div className={styles.num} aria-hidden="true">{s.num}</div>
              <h3 className={styles.title}>{s.title}</h3>
              <p className={styles.desc}>{s.desc}</p>
              <div className="tags">
                {s.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

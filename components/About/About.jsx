'use client';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './About.module.css';

const team = [
  { portrait: '/assets/team/designer-2.png', role: 'Client Success', title: 'Project Manager', spec: 'Strategy · Delivery' },
  { portrait: '/assets/team/designer-1.png', role: 'Design + Dev', title: 'Funnel Specialist', spec: 'UI · Funnels · Automation' },
  { portrait: '/assets/team/designer-3.png', role: 'Design + Dev', title: 'Web Specialist', spec: 'UI · Websites · Automation' },
  { portrait: '/assets/team/designer-4.png', role: 'Design + Dev', title: 'Automation Expert', spec: 'Backend · Integrations' },
];

export default function About() {
  const headRef = useRef(null);
  const headInView = useInView(headRef, { once: true, margin: '-80px' });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-80px' });

  return (
    <section className="section section-bg" id="about">
      <div className="s-orb" aria-hidden="true" />
      <div className="wrap">
        <p className="s-tag">— Who we are</p>
        <div className={styles.layout}>
          <motion.div
            ref={headRef}
            className={styles.copy}
            initial={{ opacity: 0, y: 32 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="s-head">Four experts.<br />One studio.</h2>
            <p>KJAH Studio is a team of <strong>four core specialists</strong> — formerly solo professionals, each a proven expert in their field. We came together to build something stronger than any of us alone.</p>
            <p>We specialize in <strong>fully functional websites and sales funnels</strong> with complete back-end automation: domain configuration, email automation, third-party software integration, and workflow logic — all handled end-to-end.</p>
            <p>Beyond the technical work, <strong>design quality is non-negotiable</strong>. Every project we ship is technically sound, visually polished, modern, and built to convert.</p>
          </motion.div>

          <div ref={gridRef} className={styles.teamGrid}>
            {team.map((m, i) => (
              <motion.div
                key={m.title}
                className={styles.card}
                initial={{ opacity: 0, y: 32 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.1 }}
              >
                <Image src={m.portrait} alt="" width={200} height={200} className={styles.portrait} aria-hidden="true" />
                <div className={styles.role}>{m.role}</div>
                <div className={styles.title}>{m.title}</div>
                <div className={styles.spec}>{m.spec}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

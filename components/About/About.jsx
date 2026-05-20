'use client';
import Image from 'next/image';
import styles from './About.module.css';

const team = [
  { portrait: '/assets/team/designer-2.png', role: 'Client Success', title: 'Project Manager', spec: 'Strategy · Delivery' },
  { portrait: '/assets/team/designer-1.png', role: 'Design + Dev', title: 'Funnel Specialist', spec: 'UI · Funnels · Automation' },
  { portrait: '/assets/team/designer-3.png', role: 'Design + Dev', title: 'Web Specialist', spec: 'UI · Websites · Automation' },
  { portrait: '/assets/team/designer-4.png', role: 'Design + Dev', title: 'Automation Expert', spec: 'Backend · Integrations' },
];

export default function About() {
  return (
    <section className="section section-transparent" id="about">
      <div className="wrap">
        <p className="s-tag">— Who we are</p>
        <div className={styles.layout}>
          <div className={styles.copy}>
            <h2 className="s-head">Four experts.<br />One studio.</h2>
            <p>KJAH Studio is a team of <strong>four core specialists</strong> — formerly solo professionals, each a proven expert in their field. We came together to build something stronger than any of us alone.</p>
            <p>We specialize in <strong>fully functional websites and sales funnels</strong> with complete back-end automation: domain configuration, email automation, third-party software integration, and workflow logic — all handled end-to-end.</p>
            <p>Beyond the technical work, <strong>design quality is non-negotiable</strong>. Every project we ship is technically sound, visually polished, modern, and built to convert.</p>
          </div>

          <div className={styles.teamGrid}>
            {team.map((m) => (
              <div key={m.title} className={styles.card}>
                <Image
                  src={m.portrait}
                  alt={m.title}
                  width={200}
                  height={200}
                  className={styles.portrait}
                  loading="lazy"
                  sizes="(max-width: 900px) 40vw, 160px"
                />
                <div className={styles.role}>{m.role}</div>
                <div className={styles.title}>{m.title}</div>
                <div className={styles.spec}>{m.spec}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

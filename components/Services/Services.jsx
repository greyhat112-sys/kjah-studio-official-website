'use client';
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

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <p className="s-tag">— What we build</p>
        <h2 className="s-head">Three pillars.<br />One team.</h2>
        <p className="s-body">Full-stack digital builds: design to deployment, back-end to automation. We hand you a system, not just a page.</p>

        <div className={styles.grid}>
          {services.map((s) => (
            <div key={s.num} className={styles.card}>
              <div className={styles.num} aria-hidden="true">{s.num}</div>
              <h3 className={styles.title}>{s.title}</h3>
              <p className={styles.desc}>{s.desc}</p>
              <div className="tags">
                {s.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

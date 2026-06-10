'use client';
import { useState } from 'react';
import styles from './FAQ.module.css';

const faqs = [
  {
    q: 'What does KJAH Studio do?',
    a: 'We build premium websites, sales funnels, and automation systems. We handle everything — design, development, domain setup, email automation, CRM integration, and third-party software — start to finish.',
  },
  {
    q: 'Who do you work with?',
    a: 'Coaches, e-commerce brands, and service businesses who want a professional online presence and a system that converts leads into clients — without dealing with the tech themselves.',
  },
  {
    q: 'How much does it cost?',
    a: 'We have two tiers. $1,000 covers a website (up to 5 pages) or funnel (up to 3 pages). $2,000 covers e-commerce (up to 50 products), a larger website (up to 10 pages), or a full funnel (up to 7 pages). Send us a message and we\'ll tell you exactly which package fits your project.',
  },
  {
    q: 'What platforms do you build on?',
    a: 'WordPress, Wix, ClickFunnels, GoHighLevel, Shopify, and Systeme.io — we work with whichever platform fits your business best.',
  },
  {
    q: 'How long does a project take?',
    a: 'Most projects are delivered within 2–4 weeks from the start date, depending on scope and how quickly we receive your content and feedback.',
  },
  {
    q: 'Do you handle everything from start to finish?',
    a: 'Yes — 100%. Design, development, setup, automation, and handover. You focus on your business; we handle every technical detail.',
  },
  {
    q: 'Do you offer revisions?',
    a: 'Yes. We work with you throughout the process to make sure the final result matches your vision before anything goes live.',
  },
  {
    q: 'What happens after the project is done?',
    a: 'We hand everything over fully set up and tested. We also offer support if you run into any issues post-launch.',
  },
  {
    q: 'How do I get started?',
    a: 'Send us a message through the contact form at kjahstudio.com. We\'ll understand your goals, answer your questions, and give you a clear recommendation — no pressure, no sales pitch.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <section className="section" id="faq">
      <div className="wrap">
        <p className="s-tag">— FAQ</p>
        <h2 className="s-head">Common questions.</h2>
        <div className={styles.list}>
          {faqs.map((f, i) => (
            <div key={i} className={`${styles.item} ${open === i ? styles.open : ''}`}>
              <button
                className={styles.question}
                onClick={() => toggle(i)}
                aria-expanded={open === i}
              >
                <span>{f.q}</span>
                <span className={styles.icon} aria-hidden="true">{open === i ? '−' : '+'}</span>
              </button>
              <div className={styles.answer} aria-hidden={open !== i}>
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

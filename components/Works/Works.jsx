'use client';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './Works.module.css';

const works = [
  { img: 'fairhope-bay-dental', alt: 'Fairhope Bay Dental website', niche: 'Healthcare', title: 'Fairhope Bay Dental', type: 'Website · WordPress' },
  { img: '10x-ladies', alt: '10X Ladies coaching funnel', niche: 'Coaching', title: '10X Ladies', type: 'Sales Funnel · ClickFunnels' },
  { img: 'adoutreach-thequality', alt: 'AdOutreach TheQuality funnel', niche: 'Advertising / Coaching', title: 'AdOutreach — TheQuality', type: 'Sales Funnel · ClickFunnels' },
  { img: 'josh-pineda', alt: 'Josh Pineda coaching website', niche: 'Business Coaching', title: 'Josh Pineda', type: 'Website + Funnel · HighLevel' },
  { img: 'champion-ecommerce', alt: 'Champion E-Commerce store', niche: 'E-Commerce', title: 'Champion E-Commerce', type: 'E-Commerce Store · Shopify' },
  { img: 'unity-drives-growth', alt: 'Unity Drives Growth website', niche: 'Business Growth', title: 'Unity Drives Growth', type: 'Website · WordPress' },
  { img: 'entrepreneurialedge-coaching', alt: 'EntrepreneurialEdge coaching funnel', niche: 'Business Coaching', title: 'EntrepreneurialEdge', type: 'Coaching Funnel · ClickFunnels' },
  { img: 'jim-kwik-limitless', alt: 'Jim Kwik Limitless Expanded launch', niche: 'Personal Development', title: 'Jim Kwik — Limitless Expanded', type: 'Book Launch Funnel · ClickFunnels' },
  { img: 'ryptic-room-escape', alt: 'Ryptic Room Escape website', niche: 'Entertainment', title: 'Ryptic Room Escape', type: 'Website · HighLevel' },
  { img: 'tarek-el-moussa-flip-your-life', alt: 'Tarek El Moussa Flip Your Life book funnel', niche: 'Book Launch', title: 'Tarek El Moussa — Flip Your Life', type: 'Book Funnel · ClickFunnels' },
  { img: 'empire-coaching', alt: 'Empire Coaching website', niche: 'Business Coaching', title: 'Empire Coaching', type: 'Website + Funnel · WordPress' },
  { img: 'influential', alt: 'Influential brand growth agency website', niche: 'Marketing Agency', title: 'Influential', type: 'Website + Funnel · HighLevel' },
  { img: 'hyroz-cbd', alt: 'HYROZ CBD Tinctures e-commerce', niche: 'E-Commerce / Wellness', title: 'HYROZ CBD Tinctures', type: 'E-Commerce Funnel · Shopify' },
  { img: 'pick-your-chill', alt: 'Pick Your Chill cannabis e-commerce', niche: 'E-Commerce / Wellness', title: 'Pick Your Chill', type: 'E-Commerce Website · Shopify' },
  { img: 'virology-marketing', alt: 'Virology Marketing agency website', niche: 'Marketing Agency', title: 'Virology Marketing', type: 'Website + Funnel · WordPress' },
  { img: 'lox-swatch-ring', alt: 'Lox Swatch Ring stylist business funnel', niche: 'Beauty / Hair', title: "Lox's Swatch Ring", type: 'Sales Funnel · ClickFunnels' },
  { img: 'gsd-community', alt: 'GSD Community online business platform', niche: 'Online Business / SaaS', title: 'GSD Community', type: 'Website + Funnel · ClickFunnels' },
  { img: 'lox-stylist-business', alt: 'Lox Stylist Business coaching funnel', niche: 'Beauty / Coaching', title: 'Lox Stylist Business', type: 'Coaching Funnel · ClickFunnels' },
];

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

function WorkCard({ w }) {
  return (
    <motion.article className={styles.card} variants={cardVariants}>
      <div className={styles.thumb}>
        <Image
          src={`/assets/works/${w.img}.jpg`}
          alt={w.alt}
          width={960}
          height={540}
          className={styles.img}
          loading="lazy"
        />
        <div className={styles.overlay}>
          <span className={styles.overlayNiche}>{w.niche}</span>
          <span className={styles.overlayType}>{w.type}</span>
        </div>
      </div>
      <div className={styles.meta}>
        <div className={styles.niche}>{w.niche}</div>
        <div className={styles.title}>{w.title}</div>
        <div className={styles.type}>{w.type}</div>
      </div>
    </motion.article>
  );
}

export default function Works() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10px' });

  return (
    <section className="section section-transparent" id="works">
      <div className="wrap">
        <div className={styles.header}>
          <div>
            <p className="s-tag">— Client work</p>
            <h2 className="s-head">Built to convert.<br />Designed to impress.</h2>
          </div>
          <p className={styles.count}>{works.length} projects</p>
        </div>
        <motion.div
          ref={ref}
          className={styles.grid}
          variants={gridVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {works.map((w) => <WorkCard key={w.img} w={w} />)}
        </motion.div>
      </div>
    </section>
  );
}

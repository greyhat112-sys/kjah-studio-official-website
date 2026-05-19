'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function AnimatedSection({ children, className, delay = 0, tag = 'div' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10px' });
  const Tag = motion[tag] ?? motion.div;

  return (
    <Tag
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}

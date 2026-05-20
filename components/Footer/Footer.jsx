import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Image src="/assets/brand/logo.png" width={24} height={24} alt="" aria-hidden="true" sizes="24px" />
          <span className={styles.copy}>&copy; 2025 KJAH Studio. All rights reserved.</span>
        </div>
        <ul className={styles.nav}>
          <li><Link href="#services">Services</Link></li>
          <li><Link href="#pricing">Pricing</Link></li>
          <li><Link href="#works">Works</Link></li>
          <li><Link href="#testimonials">Reviews</Link></li>
          <li><Link href="#contact">Contact</Link></li>
        </ul>
      </div>
    </footer>
  );
}

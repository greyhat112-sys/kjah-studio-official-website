import Image from 'next/image';
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
          <li><a href="#services">Services</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#works">Works</a></li>
          <li><a href="#testimonials">Reviews</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </footer>
  );
}

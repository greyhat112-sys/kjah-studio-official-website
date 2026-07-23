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
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#audit">Free Audit</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <ul className={styles.social}>
          <li>
            <a
              href="https://instagram.com/kjahstudio"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="KJAH Studio on Instagram"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/people/KJAH-Studio/61592219882233/"
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="KJAH Studio on Facebook"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

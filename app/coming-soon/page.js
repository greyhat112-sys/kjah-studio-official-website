import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Under Maintenance | KJAH Studio',
  description:
    'KJAH Studio — premium websites, funnels, and automation systems for coaches, brands, and service businesses.',
  robots: { index: false, follow: false },
};

export default function ComingSoon() {
  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.logoRow}>
          <Image
            src="/assets/brand/logo.png"
            alt="KJAH Studio"
            width={36}
            height={36}
            priority
            sizes="36px"
          />
          <span className={styles.wordmark}>KJAH Studio</span>
        </div>

        <p className={styles.tag}>
          <span className={styles.statusDot} aria-hidden="true" />
          Status: Maintenance
        </p>

        <h1 className={styles.headline}>MAINTENANCE.</h1>

        <p className={styles.sub}>
          We&rsquo;re shipping something premium. Websites, funnels, and
          automation systems engineered for coaches, brands, and service
          businesses.
        </p>

        <p className={styles.contactLabel}>In the meantime:</p>
        <Link href="mailto:support@kjahstudio.com" className={styles.email}>
          support@kjahstudio.com
        </Link>

        <div className={styles.terminalBar}>
          <span className={styles.barLabel}>kjahstudio.com</span>
          <span className={styles.barSep}>—</span>
          <span className={styles.barText}>under maintenance</span>
        </div>
      </div>
    </section>
  );
}

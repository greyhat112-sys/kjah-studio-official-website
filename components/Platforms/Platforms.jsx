import styles from './Platforms.module.css';

const platforms = ['ClickFunnels', 'WordPress', 'Wix', 'HighLevel', 'Shopify', 'Systeme.io'];

export default function Platforms() {
  return (
    <div className={styles.platforms}>
      <div className={styles.inner}>
        <span className={styles.label}>We build on</span>
        <div className={styles.div} aria-hidden="true" />
        {platforms.map((p) => (
          <span key={p} className={styles.item}>{p}</span>
        ))}
      </div>
    </div>
  );
}

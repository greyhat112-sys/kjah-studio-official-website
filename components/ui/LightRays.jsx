import styles from './LightRays.module.css';

export default function LightRays() {
  return (
    <div className={styles.container} aria-hidden="true">
      <div className={styles.rays} />
    </div>
  );
}

import styles from './LightRays.module.css';

export default function LightRays({ origin = 'left' }) {
  const variant = origin === 'bottom' ? styles.bottom : styles.left;
  return (
    <div className={`${styles.container} ${variant}`} aria-hidden="true">
      <div className={`${styles.rays} ${variant}`} />
    </div>
  );
}

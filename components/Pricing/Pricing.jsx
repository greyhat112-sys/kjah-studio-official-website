import Link from 'next/link';
import styles from './Pricing.module.css';

function SegBar({ filled, total, color }) {
  return (
    <div className={styles.segBar}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`${styles.seg} ${i < filled ? styles[color] : ''}`} />
      ))}
    </div>
  );
}

export default function Pricing() {
  return (
    <section className="section" id="pricing">
      <div className="wrap">
        <p className="s-tag">— Pricing</p>
        <h2 className="s-head">Two tiers.<br />No surprises.</h2>
        <p className="s-body">Flat-rate, all-inclusive. You get a fully built and configured digital system — not just a template.</p>
        <div className={styles.grid}>

          <div className={styles.card}>
            <div className={`${styles.tier} ${styles.tierCyan}`}>Cyan Tier</div>
            <div className={styles.price}><sup>$</sup>1000</div>
            <div className={styles.note}>One-time &middot; All-inclusive</div>
            <hr className={styles.div} />
            <ul className={styles.features}>
              <li className={styles.feat}>
                <div className={styles.featRow}>
                  <span className={styles.featName}>Website</span>
                  <span className={styles.featVal}>Max 5 pages</span>
                </div>
                <SegBar filled={5} total={10} color="cyan" />
              </li>
              <li className={styles.feat}>
                <div className={styles.featRow}>
                  <span className={styles.featName}>Funnel</span>
                  <span className={styles.featVal}>Max 3 pages</span>
                </div>
                <SegBar filled={3} total={7} color="cyan" />
              </li>
              <li className={styles.feat}>
                <div className={styles.featRow}>
                  <span className={styles.featName}>Build &amp; Backends</span>
                  <span className={`${styles.incl} ${styles.inclCyan}`}>Included</span>
                </div>
              </li>
            </ul>
            <Link href="#contact" className="btn-s" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Get Started</Link>
          </div>

          <div className={`${styles.card} ${styles.cardAmber}`}>
            <div className={styles.badge}>Most Popular</div>
            <div className={`${styles.tier} ${styles.tierAmber}`}>Amber Tier</div>
            <div className={styles.price}><sup>$</sup>2000</div>
            <div className={styles.note}>One-time &middot; All-inclusive</div>
            <hr className={styles.div} />
            <ul className={styles.features}>
              <li className={styles.feat}>
                <div className={styles.featRow}>
                  <span className={styles.featName}>E-Commerce</span>
                  <span className={styles.featVal}>Max 50 products</span>
                </div>
                <SegBar filled={10} total={10} color="amber" />
              </li>
              <li className={styles.feat}>
                <div className={styles.featRow}>
                  <span className={styles.featName}>Website</span>
                  <span className={styles.featVal}>Max 10 pages</span>
                </div>
                <SegBar filled={10} total={10} color="amber" />
              </li>
              <li className={styles.feat}>
                <div className={styles.featRow}>
                  <span className={styles.featName}>Funnel</span>
                  <span className={styles.featVal}>Max 7 pages</span>
                </div>
                <SegBar filled={7} total={7} color="amber" />
              </li>
              <li className={styles.feat}>
                <div className={styles.featRow}>
                  <span className={styles.featName}>Build &amp; Backends</span>
                  <span className={`${styles.incl} ${styles.inclAmber}`}>Included</span>
                </div>
              </li>
            </ul>
            <Link href="#contact" className="btn-p" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Get Started</Link>
          </div>

        </div>
      </div>
    </section>
  );
}

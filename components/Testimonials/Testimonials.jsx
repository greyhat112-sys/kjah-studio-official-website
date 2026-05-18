import styles from './Testimonials.module.css';

const testimonials = [
  {
    quote: "Honestly, I was skeptical because I've been burned by 'automation experts' before. But KJAH Studio actually listened. They took my messy pile of spreadsheets and manual emails and turned it into a system that just... works. For the first time in two years, I actually took a weekend off without checking my CRM every ten minutes.",
    name: 'Dylan C.',
    initials: 'DC',
  },
  {
    quote: "I knew my services were high-end, but my website looked like a DIY project from 2022. The team at KJAH fixed that immediately. They captured that minimalist, professional vibe I was after, but the real magic is under the hood. The funnel they built is converting leads I used to lose. It's a total game-changer for my brand.",
    name: 'Sarah J.',
    initials: 'SJ',
  },
  {
    quote: "I'm a creative, not a coder. Every time I tried to set up a new landing page, I'd end up frustrated and stuck. Handing everything over to KJAH Studio was the best decision I ever made. They handled the tech headache, the integrations, and the flow. Now I just focus on my clients, and the machine handles the rest.",
    name: 'David C.',
    initials: 'DC',
  },
  {
    quote: "We're a small team, so we have to be efficient. KJAH set up our system and it feels like we hired three new employees. The way leads flow from the website directly into our calendar without us touching a button is pure magic. If you're on the fence, just do it — the ROI is instant.",
    name: 'Elena R.',
    initials: 'ER',
  },
  {
    quote: "What I love about KJAH is that they don't just build what you ask for, they build what you need. They pushed back on some of my ideas and explained why a different automation flow would work better for my customers. They were right. It's rare to find designers that care as much about your conversion rates as you do.",
    name: 'Jameson J.',
    initials: 'JJ',
  },
];

export default function Testimonials() {
  return (
    <section className="section" id="testimonials">
      <div className="wrap">
        <p className="s-tag">— What clients say</p>
        <h2 className="s-head">Results they<br />didn&apos;t expect.</h2>
        <div className={styles.grid}>
          {testimonials.map((t) => (
            <div key={t.name} className={styles.card}>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
              </div>
              <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
              <div className={styles.author}>
                <div className={styles.avatar}>
                  <span className={styles.initials}>{t.initials}</span>
                </div>
                <span className={styles.name}>{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';
import { useState, useEffect } from 'react';
import styles from './TerminalBackground.module.css';

const sequences = [
  {
    id: '01', task: 'website',
    lines: [
      { text: '> kjah agent run --task website',   type: 'cmd' },
      { tag: '[INIT]',   rest: 'parsing client brief',         s: 'ok' },
      { tag: '[SCAN]',   rest: '12 pages discovered',          s: '✓'  },
      { tag: '[BUILD]',  rest: 'page structure',               s: '✓'  },
      { tag: '[BUILD]',  rest: 'animations + effects',         s: '✓'  },
      { tag: '[BUILD]',  rest: 'mobile breakpoints',           s: '✓'  },
      { tag: '[REVIEW]', rest: 'client approved',              s: '✓'  },
      { tag: '[DEPLOY]', rest: 'pushing to production',        s: '✓'  },
      { tag: '[DONE]',   rest: 'load: 0.8s  LIVE',            type: 'done' },
    ],
  },
  {
    id: '02', task: 'funnel',
    lines: [
      { text: '> kjah agent run --task funnel',    type: 'cmd' },
      { tag: '[INIT]',   rest: 'mapping conversion path',      s: 'ok' },
      { tag: '[BUILD]',  rest: 'hero + opt-in page',           s: '✓'  },
      { tag: '[BUILD]',  rest: 'thank you page',               s: '✓'  },
      { tag: '[BUILD]',  rest: 'email sequence (7 steps)',     s: '✓'  },
      { tag: '[INTG]',   rest: 'ActiveCampaign linked',        s: '✓'  },
      { tag: '[TEST]',   rest: 'A/B variants: 2 created',      s: '✓'  },
      { tag: '[DEPLOY]', rest: 'funnel live',                  s: '✓'  },
      { tag: '[DONE]',   rest: 'conv. rate: +34%',            type: 'done' },
    ],
  },
  {
    id: '03', task: 'automate',
    lines: [
      { text: '> kjah agent run --task automate',  type: 'cmd' },
      { tag: '[INIT]',   rest: 'auditing manual workflows',    s: 'ok' },
      { tag: '[SCAN]',   rest: '8 automatable tasks found',    s: '✓'  },
      { tag: '[BUILD]',  rest: 'lead → CRM flow',              s: '✓'  },
      { tag: '[BUILD]',  rest: 'follow-up sequences',          s: '✓'  },
      { tag: '[INTG]',   rest: 'Zapier: 12 zaps created',      s: '✓'  },
      { tag: '[INTG]',   rest: 'Notion + Slack linked',        s: '✓'  },
      { tag: '[DEPLOY]', rest: 'workflows active',             s: '✓'  },
      { tag: '[DONE]',   rest: '14 hrs/week saved',           type: 'done' },
    ],
  },
  {
    id: '04', task: 'launch',
    lines: [
      { text: '> kjah agent run --task launch',    type: 'cmd' },
      { tag: '[CHECK]',  rest: 'SEO meta tags',                s: '✓'  },
      { tag: '[CHECK]',  rest: 'page speed: 98/100',           s: '✓'  },
      { tag: '[CHECK]',  rest: 'mobile responsive',            s: '✓'  },
      { tag: '[CHECK]',  rest: 'forms + tracking live',        s: '✓'  },
      { tag: '[CHECK]',  rest: 'analytics connected',          s: '✓'  },
      { tag: '[DEPLOY]', rest: 'domain configured',            s: '✓'  },
      { tag: '[DEPLOY]', rest: 'SSL active',                   s: '✓'  },
      { tag: '[DONE]',   rest: 'LIVE ●  all systems go',      type: 'done' },
    ],
  },
];

const PANELS = [
  { seq: 0, start: 0 },
  { seq: 2, start: 3 },
  { seq: 1, start: 6 },
  { seq: 3, start: 2 },
  { seq: 1, start: 5 },
  { seq: 0, start: 4 },
];

function Panel({ seq: initSeq, start }) {
  const [seqIdx, setSeqIdx] = useState(initSeq % sequences.length);
  const [visible, setVisible] = useState(start);
  const agent = sequences[seqIdx];

  useEffect(() => {
    if (visible >= agent.lines.length) {
      const t = setTimeout(() => {
        setSeqIdx((s) => (s + 1) % sequences.length);
        setVisible(0);
      }, 3000);
      return () => clearTimeout(t);
    }
    const line = agent.lines[visible];
    const delay = line.type === 'cmd' ? 420 : 130;
    const t = setTimeout(() => setVisible((v) => v + 1), delay);
    return () => clearTimeout(t);
  }, [visible, agent]);

  return (
    <div className={styles.panel}>
      {agent.lines.slice(0, visible).map((line, i) => {
        if (line.type === 'cmd') return (
          <div key={i} className={styles.lineCmd}>{line.text}</div>
        );
        if (line.type === 'done') return (
          <div key={i} className={styles.lineDone}>
            <span className={styles.tagDone}>{line.tag}</span>
            <span className={styles.restDone}>{line.rest}</span>
          </div>
        );
        return (
          <div key={i} className={styles.line}>
            <span className={styles.tag}>{line.tag}</span>
            <span className={styles.rest}>{line.rest}</span>
            {line.s && <span className={styles.ok}>{line.s}</span>}
          </div>
        );
      })}
      <span className={styles.cursor} />
    </div>
  );
}

export default function TerminalBackground() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.grid}>
        {PANELS.map((p, i) => (
          <Panel key={i} seq={p.seq} start={p.start} />
        ))}
      </div>
      <div className={styles.fadeLeft} />
      <div className={styles.fadeRight} />
      <div className={styles.fadeTop} />
      <div className={styles.fadeBottom} />
    </div>
  );
}

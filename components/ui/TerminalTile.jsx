'use client';
import { useState, useEffect } from 'react';
import styles from './TerminalTile.module.css';

const tiles = [
  {
    id: '01', task: 'WEBSITE',
    lines: [
      { type: 'cmd',  text: '> kjah agent run --task website' },
      { tag: '[INIT]',   rest: 'parsing client brief',       s: 'ok' },
      { tag: '[BUILD]',  rest: 'page structure · 10 pages',  s: '✓'  },
      { tag: '[BUILD]',  rest: 'animations + effects',       s: '✓'  },
      { tag: '[BUILD]',  rest: 'mobile breakpoints',         s: '✓'  },
      { tag: '[DEPLOY]', rest: 'pushing to production',      s: '✓'  },
      { type: 'done', tag: '[DONE]', rest: 'load: 0.8s  ● LIVE' },
    ],
  },
  {
    id: '02', task: 'FUNNEL',
    lines: [
      { type: 'cmd',  text: '> kjah agent run --task funnel' },
      { tag: '[INIT]',   rest: 'mapping conversion path',    s: 'ok' },
      { tag: '[BUILD]',  rest: 'hero + opt-in page',         s: '✓'  },
      { tag: '[BUILD]',  rest: 'email sequence · 7 steps',   s: '✓'  },
      { tag: '[INTG]',   rest: 'ActiveCampaign linked',      s: '✓'  },
      { tag: '[DEPLOY]', rest: 'funnel live',                s: '✓'  },
      { type: 'done', tag: '[DONE]', rest: 'conv. rate: +34%' },
    ],
  },
  {
    id: '03', task: 'AUTOMATION',
    lines: [
      { type: 'cmd',  text: '> kjah agent run --task automate' },
      { tag: '[SCAN]',   rest: '8 automatable tasks found',  s: '✓'  },
      { tag: '[BUILD]',  rest: 'lead → CRM flow',            s: '✓'  },
      { tag: '[BUILD]',  rest: 'follow-up sequences',        s: '✓'  },
      { tag: '[INTG]',   rest: 'Zapier · 12 zaps created',   s: '✓'  },
      { tag: '[DEPLOY]', rest: 'workflows active',           s: '✓'  },
      { type: 'done', tag: '[DONE]', rest: '14 hrs / week saved' },
    ],
  },
  {
    id: '04', task: 'DEPLOY',
    lines: [
      { type: 'cmd',  text: '> kjah agent run --task launch' },
      { tag: '[CHECK]',  rest: 'page speed: 98/100',         s: '✓'  },
      { tag: '[CHECK]',  rest: 'mobile responsive',          s: '✓'  },
      { tag: '[CHECK]',  rest: 'forms + tracking live',      s: '✓'  },
      { tag: '[DEPLOY]', rest: 'domain + SSL configured',    s: '✓'  },
      { tag: '[DEPLOY]', rest: 'analytics connected',        s: '✓'  },
      { type: 'done', tag: '[DONE]', rest: '● LIVE  all systems go' },
    ],
  },
  {
    id: '05', task: 'CRM',
    lines: [
      { type: 'cmd',  text: '> kjah agent run --task crm' },
      { tag: '[INIT]',   rest: 'auditing contact data',      s: 'ok' },
      { tag: '[BUILD]',  rest: 'pipeline stages: 5',         s: '✓'  },
      { tag: '[BUILD]',  rest: 'lead scoring rules',         s: '✓'  },
      { tag: '[INTG]',   rest: 'HighLevel connected',        s: '✓'  },
      { tag: '[INTG]',   rest: 'form → CRM · 3 sources',    s: '✓'  },
      { type: 'done', tag: '[DONE]', rest: '350 contacts migrated' },
    ],
  },
  {
    id: '06', task: 'EMAIL',
    lines: [
      { type: 'cmd',  text: '> kjah agent run --task email' },
      { tag: '[INIT]',   rest: 'audience segmented',         s: 'ok' },
      { tag: '[BUILD]',  rest: 'welcome seq · 5 mails',      s: '✓'  },
      { tag: '[BUILD]',  rest: 're-engage · 3 mails',        s: '✓'  },
      { tag: '[INTG]',   rest: 'ActiveCampaign live',        s: '✓'  },
      { tag: '[TEST]',   rest: 'deliverability: 98%',        s: '✓'  },
      { type: 'done', tag: '[DONE]', rest: 'avg open rate: 42%' },
    ],
  },
];

function lineDelay(line) {
  const r = () => Math.random();
  if (line.type === 'cmd')                                      return 400  + r() * 500;   // 400–900ms  — typing the command
  if (line.type === 'done')                                     return 500  + r() * 400;   // 500–900ms  — final result
  if (line.tag?.includes('BUILD') || line.tag?.includes('DEPLOY')) return 1100 + r() * 1800; // 1.1–2.9s   — heavy work
  if (line.tag?.includes('INTG')  || line.tag?.includes('SCAN'))   return 800  + r() * 1200; // 0.8–2.0s   — integration
  return 600 + r() * 800;                                                                  // 0.6–1.4s   — init/check
}

export default function TerminalTile({ seqIndex = 0, startDelay = 0 }) {
  const tile   = tiles[seqIndex % tiles.length];
  const [visible, setVisible] = useState(0);
  const [ready,   setReady]   = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), startDelay);
    return () => clearTimeout(id);
  }, [startDelay]);

  useEffect(() => {
    if (!ready) return;
    if (visible >= tile.lines.length) {
      // Stay in done state 10–18 seconds before restarting
      const id = setTimeout(() => setVisible(0), 10000 + Math.random() * 8000);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setVisible(v => v + 1), lineDelay(tile.lines[visible]));
    return () => clearTimeout(id);
  }, [visible, ready, tile]);

  const done = visible >= tile.lines.length;

  return (
    <div className={styles.tile}>
      <div className={styles.header}>
        <span className={styles.label}>AGENT-{tile.id} // {tile.task}</span>
        <span className={`${styles.dot} ${done ? styles.dotDone : ''}`} />
      </div>
      <div className={styles.body}>
        {tile.lines.slice(0, visible).map((line, i) => {
          if (line.type === 'cmd') return (
            <div key={i} className={styles.cmd}>{line.text}</div>
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
        <div className={styles.cursorRow}>
          {done && <span className={styles.prompt}>{'>'}</span>}
          <span className={styles.cursor} />
        </div>
      </div>
    </div>
  );
}

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

function getLineText(line) {
  if (line.type === 'cmd') return line.text;
  if (line.type === 'done') return `${line.tag}  ${line.rest}`;
  return `${line.tag}  ${line.rest}${line.s ? `  ${line.s}` : ''}`;
}

// Per-character delay — cmd feels like human typing, output like streaming
function charDelay(line) {
  if (line.type === 'cmd') return 48 + Math.random() * 72; // 48–120ms
  return 16 + Math.random() * 24;                          // 16–40ms
}

// Pause after a line finishes typing — simulates actual work happening
function lineDelay(line) {
  if (line.type === 'cmd')                                      return 180 + Math.random() * 260;
  if (line.type === 'done')                                     return 280 + Math.random() * 280;
  if (line.tag?.includes('BUILD') || line.tag?.includes('DEPLOY')) return 700 + Math.random() * 1400;
  if (line.tag?.includes('INTG')  || line.tag?.includes('SCAN'))   return 500 + Math.random() * 900;
  return 280 + Math.random() * 480;
}

function CompletedLine({ line, i }) {
  if (line.type === 'cmd') return (
    <div key={i} className={styles.cmd}>{line.text}</div>
  );
  if (line.type === 'done') return (
    <div key={i} className={styles.lineDone}>
      <span className={styles.tagDone}>{line.tag}</span>
      <span className={styles.restDone}>&nbsp;&nbsp;{line.rest}</span>
    </div>
  );
  return (
    <div key={i} className={styles.line}>
      <span className={styles.tag}>{line.tag}</span>
      <span className={styles.rest}>&nbsp;&nbsp;{line.rest}</span>
      {line.s && <span className={styles.ok}>{line.s}</span>}
    </div>
  );
}

export default function TerminalTile({ seqIndex = 0, startDelay = 0 }) {
  const tile = tiles[seqIndex % tiles.length];
  const [done,   setDone]   = useState(0);
  const [typing, setTyping] = useState('');
  const [phase,  setPhase]  = useState('init');
  // Random blink offset so cursors across tiles are never in sync
  const [blinkDelay] = useState(() => `${-(Math.random() * 1.4).toFixed(2)}s`);

  const lineIdx = done;
  const line    = tile.lines[lineIdx];
  const full    = line ? getLineText(line) : '';
  const isDone  = phase === 'complete';

  // Initial start delay (first run only)
  useEffect(() => {
    if (phase !== 'init') return;
    const id = setTimeout(() => setPhase('typing'), startDelay);
    return () => clearTimeout(id);
  }, [phase, startDelay]);

  // Type one character at a time
  useEffect(() => {
    if (phase !== 'typing' || !line) return;
    if (typing.length >= full.length) { setPhase('pause'); return; }
    const id = setTimeout(
      () => setTyping(full.slice(0, typing.length + 1)),
      charDelay(line)
    );
    return () => clearTimeout(id);
  }, [phase, typing, full, line]);

  // Pause between lines (simulates actual work running)
  useEffect(() => {
    if (phase !== 'pause' || !line) return;
    const id = setTimeout(() => {
      const next = done + 1;
      setDone(next);
      setTyping('');
      setPhase(next >= tile.lines.length ? 'complete' : 'typing');
    }, lineDelay(line));
    return () => clearTimeout(id);
  }, [phase, line, done, tile.lines.length]);

  // Hold complete state, then restart
  useEffect(() => {
    if (phase !== 'complete') return;
    const id = setTimeout(() => {
      setDone(0);
      setTyping('');
      setPhase('typing'); // no startDelay on restart
    }, 10000 + Math.random() * 8000);
    return () => clearTimeout(id);
  }, [phase]);

  return (
    <div className={styles.tile}>
      <div className={styles.header}>
        <span className={styles.label}>AGENT-{tile.id} // {tile.task}</span>
        <span className={`${styles.dot} ${isDone ? styles.dotDone : ''}`} />
      </div>
      <div className={styles.body}>
        {tile.lines.slice(0, done).map((l, i) => (
          <CompletedLine key={i} line={l} i={i} />
        ))}
        {typing ? (
          <div className={styles.typingLine}>
            {typing}<span className={styles.cursor} style={{ animationDelay: blinkDelay }} />
          </div>
        ) : (
          <div className={styles.cursorRow}>
            {isDone && <span className={styles.prompt}>{'>'}</span>}
            <span className={styles.cursor} style={{ animationDelay: blinkDelay }} />
          </div>
        )}
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect, useRef } from 'react';
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

function charDelay(line) {
  if (line.type === 'cmd') return 48 + Math.random() * 72;
  return 16 + Math.random() * 24;
}

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

  // State only changes at line/cycle boundaries — not per character
  const [done,  setDone]  = useState(0);
  const [phase, setPhase] = useState('init');
  const [blinkDelay] = useState(() => `${-(Math.random() * 1.4).toFixed(2)}s`);

  // Refs for direct DOM updates during typing — avoids React re-renders per character
  const typingTextRef = useRef(null);
  const typingLineRef = useRef(null);
  const cursorRowRef  = useRef(null);

  const isDone = phase === 'complete';

  // Initial start delay
  useEffect(() => {
    if (phase !== 'init') return;
    const id = setTimeout(() => setPhase('typing'), startDelay);
    return () => clearTimeout(id);
  }, [phase, startDelay]);

  // Type one character at a time — direct DOM mutation, no setState per char
  useEffect(() => {
    if (phase !== 'typing') return;
    const line = tile.lines[done];
    if (!line) return;

    const full = getLineText(line);

    if (typingLineRef.current) typingLineRef.current.style.display = '';
    if (cursorRowRef.current)  cursorRowRef.current.style.display  = 'none';
    if (typingTextRef.current) typingTextRef.current.textContent   = '';

    let charCount = 0;
    let timerId;

    function typeNext() {
      charCount++;
      if (typingTextRef.current) typingTextRef.current.textContent = full.slice(0, charCount);
      if (charCount >= full.length) {
        setPhase('pause');
      } else {
        timerId = setTimeout(typeNext, charDelay(line));
      }
    }

    timerId = setTimeout(typeNext, charDelay(line));
    return () => clearTimeout(timerId);
  }, [phase, done, tile]);

  // Pause between lines
  useEffect(() => {
    if (phase !== 'pause') return;
    const line = tile.lines[done];
    if (!line) return;
    const id = setTimeout(() => {
      const next = done + 1;
      if (typingLineRef.current) typingLineRef.current.style.display = 'none';
      if (cursorRowRef.current)  cursorRowRef.current.style.display  = '';
      if (typingTextRef.current) typingTextRef.current.textContent   = '';
      setDone(next);
      setPhase(next >= tile.lines.length ? 'complete' : 'typing');
    }, lineDelay(line));
    return () => clearTimeout(id);
  }, [phase, done, tile]);

  // Hold complete state, then restart
  useEffect(() => {
    if (phase !== 'complete') return;
    const id = setTimeout(() => {
      setDone(0);
      setPhase('typing');
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
        <div ref={typingLineRef} className={styles.typingLine} style={{ display: 'none' }}>
          <span ref={typingTextRef} />
          <span className={styles.cursor} style={{ animationDelay: blinkDelay }} />
        </div>
        <div ref={cursorRowRef} className={styles.cursorRow}>
          {isDone && <span className={styles.prompt}>{'>'}</span>}
          <span className={styles.cursor} style={{ animationDelay: blinkDelay }} />
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import styles from './TerminalWindow.module.css';

const agents = [
  {
    id: '01', task: 'WEBSITE',
    lines: [
      { text: '> kjah agent run --task website',   type: 'cmd' },
      { tag: '[INIT]',   rest: 'parsing client brief',         s: 'ok'  },
      { tag: '[SCAN]',   rest: '12 pages discovered',          s: '✓'   },
      { tag: '[BUILD]',  rest: 'page structure',               s: '✓'   },
      { tag: '[BUILD]',  rest: 'animations + effects',         s: '✓'   },
      { tag: '[BUILD]',  rest: 'mobile breakpoints',           s: '✓'   },
      { tag: '[REVIEW]', rest: 'client approved',              s: '✓'   },
      { tag: '[DEPLOY]', rest: 'pushing to production',        s: '✓'   },
      { tag: '[DONE]',   rest: 'load: 0.8s  status: LIVE',    type: 'done' },
    ],
  },
  {
    id: '02', task: 'FUNNEL',
    lines: [
      { text: '> kjah agent run --task funnel',    type: 'cmd' },
      { tag: '[INIT]',   rest: 'mapping conversion path',      s: 'ok'  },
      { tag: '[BUILD]',  rest: 'hero + opt-in page',           s: '✓'   },
      { tag: '[BUILD]',  rest: 'thank you page',               s: '✓'   },
      { tag: '[BUILD]',  rest: 'email sequence (7 steps)',     s: '✓'   },
      { tag: '[INTG]',   rest: 'ActiveCampaign linked',        s: '✓'   },
      { tag: '[TEST]',   rest: 'A/B variants: 2 created',      s: '✓'   },
      { tag: '[DEPLOY]', rest: 'funnel live',                  s: '✓'   },
      { tag: '[DONE]',   rest: 'conv. rate: +34%',            type: 'done' },
    ],
  },
  {
    id: '03', task: 'AUTOMATION',
    lines: [
      { text: '> kjah agent run --task automate',  type: 'cmd' },
      { tag: '[INIT]',   rest: 'auditing manual workflows',    s: 'ok'  },
      { tag: '[SCAN]',   rest: '8 automatable tasks found',    s: '✓'   },
      { tag: '[BUILD]',  rest: 'lead → CRM flow',              s: '✓'   },
      { tag: '[BUILD]',  rest: 'follow-up sequences',          s: '✓'   },
      { tag: '[INTG]',   rest: 'Zapier: 12 zaps created',      s: '✓'   },
      { tag: '[INTG]',   rest: 'Notion + Slack linked',        s: '✓'   },
      { tag: '[DEPLOY]', rest: 'workflows active',             s: '✓'   },
      { tag: '[DONE]',   rest: '14 hrs/week saved',           type: 'done' },
    ],
  },
  {
    id: '04', task: 'DEPLOY',
    lines: [
      { text: '> kjah agent run --task launch',    type: 'cmd' },
      { tag: '[CHECK]',  rest: 'SEO meta tags',                s: '✓'   },
      { tag: '[CHECK]',  rest: 'page speed: 98/100',           s: '✓'   },
      { tag: '[CHECK]',  rest: 'mobile responsive',            s: '✓'   },
      { tag: '[CHECK]',  rest: 'forms + tracking live',        s: '✓'   },
      { tag: '[CHECK]',  rest: 'analytics connected',          s: '✓'   },
      { tag: '[DEPLOY]', rest: 'domain configured',            s: '✓'   },
      { tag: '[DEPLOY]', rest: 'SSL active',                   s: '✓'   },
      { tag: '[DONE]',   rest: 'LIVE ●  all systems go',      type: 'done' },
    ],
  },
];

/**
 * TerminalWindow
 *
 * Props:
 *   initialSeq  (number, 0-based) — which agent sequence to show; default 0.
 *                For the main foreground terminal omit this prop; it will
 *                cycle through all four agents automatically.
 *   initialLine (number) — how many lines are already "pre-revealed" when the
 *                component mounts (used for background blur terminals to make
 *                them look mid-execution). Default 0.
 *   cycle       (boolean) — whether to auto-advance to the next agent after
 *                each sequence completes. Default true when initialSeq is
 *                omitted, false when a specific sequence is pinned.
 */
export default function TerminalWindow({
  initialSeq,
  initialLine = 0,
}) {
  const isPinned = initialSeq !== undefined;
  const [seqIndex, setSeqIndex] = useState(isPinned ? initialSeq % agents.length : 0);
  const [visibleCount, setVisibleCount] = useState(initialLine);

  const agent = agents[seqIndex];

  useEffect(() => {
    if (visibleCount >= agent.lines.length) {
      // Sequence complete — pause then either advance or restart
      const id = setTimeout(() => {
        if (isPinned) {
          // Background terminal: restart same sequence from 0
          setVisibleCount(0);
        } else {
          // Foreground terminal: cycle to next agent
          setSeqIndex((s) => (s + 1) % agents.length);
          setVisibleCount(0);
        }
      }, 2800);
      return () => clearTimeout(id);
    }

    const line = agent.lines[visibleCount];
    const delay = line.type === 'cmd' ? 380 : 110;
    const id = setTimeout(() => setVisibleCount((c) => c + 1), delay);
    return () => clearTimeout(id);
  }, [visibleCount, agent, isPinned]);

  const done = visibleCount >= agent.lines.length;

  return (
    <div className={styles.terminal}>
      <div className={styles.header}>
        <span className={styles.dot} />
        <span className={styles.label}>BUILD-{agent.id} // {agent.task}</span>
      </div>
      <div className={styles.body}>
        {agent.lines.slice(0, visibleCount).map((line, i) => {
          if (line.type === 'cmd') {
            return (
              <div key={i} className={styles.lineCmd}>
                {line.text}
              </div>
            );
          }
          if (line.type === 'done') {
            return (
              <div key={i} className={`${styles.line} ${styles.lineDone}`}>
                <span className={styles.tagDone}>{line.tag}</span>
                <span className={styles.restDone}>{line.rest}</span>
              </div>
            );
          }
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

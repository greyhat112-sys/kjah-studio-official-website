import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'KJAH Studio — Websites, Funnels & Automation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 100px',
          position: 'relative',
        }}
      >
        {/* Cyan accent bar */}
        <div style={{ width: 48, height: 3, background: '#4DDFF0', marginBottom: 40 }} />

        {/* Studio label */}
        <div style={{
          color: '#4DDFF0', fontSize: 18, letterSpacing: '0.15em',
          textTransform: 'uppercase', marginBottom: 28, fontFamily: 'monospace',
        }}>
          KJAH STUDIO
        </div>

        {/* Headline */}
        <div style={{
          color: '#FFFFFF', fontSize: 76, fontWeight: 700,
          lineHeight: 1.05, marginBottom: 36,
        }}>
          Smart Websites.<br />Real Growth.
        </div>

        {/* Subline */}
        <div style={{ color: '#999999', fontSize: 26, lineHeight: 1.5, maxWidth: 680 }}>
          Premium websites, funnels & automation systems
          for businesses that want to grow online.
        </div>

        {/* Services tags */}
        <div style={{ display: 'flex', gap: 16, marginTop: 52 }}>
          {['Websites', 'Funnels', 'Automation', 'CRM'].map((tag) => (
            <div
              key={tag}
              style={{
                border: '1px solid #333333', borderRadius: 4,
                padding: '8px 18px', color: '#666666',
                fontSize: 14, letterSpacing: '0.08em',
                fontFamily: 'monospace', textTransform: 'uppercase',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{
          position: 'absolute', bottom: 60, right: 100,
          color: '#444444', fontSize: 16,
          letterSpacing: '0.08em', fontFamily: 'monospace',
        }}>
          kjahstudio.com
        </div>
      </div>
    ),
    { ...size }
  );
}

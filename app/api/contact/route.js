import { Resend } from 'resend';

const SUPABASE_URL = 'https://jczwufibjejzxnrlyjdz.supabase.co';

async function upsertProspect({ name, email, notes, tags }) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const userId = process.env.SUPABASE_OWNER_USER_ID;
  if (!key || !userId) {
    console.error('[contact] Supabase env vars missing — SUPABASE_SERVICE_ROLE_KEY:', !!key, 'SUPABASE_OWNER_USER_ID:', !!userId);
    return;
  }

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };

  // Skip insert if contact already exists
  const existing = await fetch(
    `${SUPABASE_URL}/rest/v1/prospects?email=eq.${encodeURIComponent(email)}&user_id=eq.${userId}&limit=1`,
    { headers: { ...headers, Accept: 'application/json' } }
  );
  const rows = await existing.json();
  if (Array.isArray(rows) && rows.length > 0) {
    console.log('[contact] Prospect already exists for', email, '— skipping insert');
    return;
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/prospects`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=minimal' },
    body: JSON.stringify({
      title: name,
      email,
      notes,
      stage: 'cold_lead',
      source: 'website',
      tags,
      user_id: userId,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('[contact] Supabase insert failed:', res.status, body);
  }
}

export async function POST(req) {
  const { name, email, message, website, type } = await req.json();

  const isAudit = type === 'audit';

  if (!name?.trim() || !email?.trim()) {
    return Response.json({ error: 'Name and email are required.' }, { status: 400 });
  }
  if (isAudit && !website?.trim()) {
    return Response.json({ error: 'A website URL is required.' }, { status: 400 });
  }
  if (!isAudit && !message?.trim()) {
    return Response.json({ error: 'All fields are required.' }, { status: 400 });
  }

  const n = name.trim();
  const e = email.trim();
  const m = message?.trim() || '';
  const w = website?.trim() || '';

  // Internal notification content
  const internalSubject = isAudit ? `New free audit request from ${n}` : `New message from ${n}`;
  const internalText = [
    `Name: ${n}`,
    `Email: ${e}`,
    w && `Website: ${w}`,
    '',
    m ? `Message:\n${m}` : (isAudit ? 'Message: (none — free audit request)' : ''),
  ].filter((line) => line !== false && line !== null).join('\n');

  // Prospect pipeline record
  const notes = isAudit
    ? `Free website audit request via website:\n\nWebsite: ${w}${m ? `\n\nMessage:\n${m}` : ''}`
    : `Inbound via website contact form:\n\n${m}`;
  const tags = isAudit ? ['inbound', 'audit-request'] : ['inbound'];

  // Auto-reply content
  const replySubject = isAudit ? "We've got your audit request — here's what happens next" : 'We got your message — talk soon';
  const replyText = isAudit
    ? `Hey ${n},

Thanks for requesting your free website audit — it's officially in our queue.

Over the next 1–2 business days, our team runs a thorough, hands-on review of ${w}. This isn't an automated scan that spits out a generic score — a real person goes through your site page by page, testing:

  • Conversion & funnel flow — where visitors hesitate or drop off, and why
  • Performance & Core Web Vitals — real load speed on real devices
  • Mobile experience & responsiveness across screen sizes
  • On-page SEO & technical health
  • Design, messaging & trust signals

That depth is exactly why it takes a couple of business days rather than a couple of minutes — we'd rather send you something genuinely useful than a throwaway score.

When it's ready, you'll get a clear, prioritized breakdown of what's working, what's quietly costing you leads, and the fastest wins to fix first — yours to keep, no strings attached.

Sit tight. We'll be in touch soon.

— The KJAH Studio Team`
    : `Hey ${n},\n\nThanks for reaching out. We've received your message and typically respond within 24 hours.\n\nIn the meantime, feel free to browse our work at kjahstudio.com.\n\n— The KJAH Studio Team`;
  const replyHtml = isAudit
    ? `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#0a0a0a;color:#e5e5e5;">
  <p style="font-size:13px;letter-spacing:0.1em;color:#4DDFF0;text-transform:uppercase;margin:0 0 24px;">KJAH Studio</p>
  <h1 style="font-size:22px;font-weight:600;margin:0 0 16px;color:#ffffff;">Your audit request is in — we're on it.</h1>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 16px;">Hey ${n},</p>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 20px;">Thanks for requesting your free website audit. It's officially in our queue, and here's exactly what happens next.</p>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 12px;">Over the next <strong style="color:#ffffff;">1–2 business days</strong>, our team runs a thorough, hands-on review of <strong style="color:#ffffff;">${w}</strong>. This isn't an automated scan that spits out a generic score — a real person goes through your site page by page, testing:</p>
  <ul style="list-style:none;padding:0;margin:0 0 20px;">
    <li style="font-size:14px;line-height:1.5;color:#e5e5e5;padding:6px 0 6px 22px;position:relative;"><span style="color:#4DDFF0;position:absolute;left:0;">✓</span> Conversion &amp; funnel flow — where visitors hesitate or drop off, and why</li>
    <li style="font-size:14px;line-height:1.5;color:#e5e5e5;padding:6px 0 6px 22px;position:relative;"><span style="color:#4DDFF0;position:absolute;left:0;">✓</span> Performance &amp; Core Web Vitals — real load speed on real devices</li>
    <li style="font-size:14px;line-height:1.5;color:#e5e5e5;padding:6px 0 6px 22px;position:relative;"><span style="color:#4DDFF0;position:absolute;left:0;">✓</span> Mobile experience &amp; responsiveness across screen sizes</li>
    <li style="font-size:14px;line-height:1.5;color:#e5e5e5;padding:6px 0 6px 22px;position:relative;"><span style="color:#4DDFF0;position:absolute;left:0;">✓</span> On-page SEO &amp; technical health</li>
    <li style="font-size:14px;line-height:1.5;color:#e5e5e5;padding:6px 0 6px 22px;position:relative;"><span style="color:#4DDFF0;position:absolute;left:0;">✓</span> Design, messaging &amp; trust signals</li>
  </ul>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 20px;">That depth is exactly why it takes a couple of business days rather than a couple of minutes — we'd rather send you something genuinely useful than a throwaway score.</p>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 32px;">When it's ready, you'll get a clear, prioritized breakdown of what's working, what's quietly costing you leads, and the fastest wins to fix first — yours to keep, no strings attached. Sit tight — we'll be in touch soon.</p>
  <p style="font-size:14px;color:#525252;border-top:1px solid #1f1f1f;padding-top:20px;margin:0;">— The KJAH Studio Team</p>
</div>`
    : `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#0a0a0a;color:#e5e5e5;">
  <p style="font-size:13px;letter-spacing:0.1em;color:#4DDFF0;text-transform:uppercase;margin:0 0 24px;">KJAH Studio</p>
  <h1 style="font-size:22px;font-weight:600;margin:0 0 16px;color:#ffffff;">We got your message.</h1>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 12px;">Hey ${n},</p>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 24px;">Thanks for reaching out. We've received your message and typically respond within <strong style="color:#ffffff;">24 hours</strong>.</p>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 32px;">In the meantime, feel free to browse our work at <a href="https://kjahstudio.com" style="color:#4DDFF0;text-decoration:none;">kjahstudio.com</a>.</p>
  <p style="font-size:14px;color:#525252;border-top:1px solid #1f1f1f;padding-top:20px;margin:0;">— The KJAH Studio Team</p>
</div>`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await Promise.all([
      resend.emails.send({
        from: 'KJAH Studio <hello@kjahstudio.com>',
        to: 'support@kjahstudio.com',
        replyTo: e,
        subject: internalSubject,
        text: internalText,
      }),
      resend.emails.send({
        from: 'KJAH Studio <hello@kjahstudio.com>',
        to: e,
        subject: replySubject,
        text: replyText,
        html: replyHtml,
      }),
      upsertProspect({ name: n, email: e, notes, tags }),
    ]);

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Failed to send. Please try again.' }, { status: 500 });
  }
}

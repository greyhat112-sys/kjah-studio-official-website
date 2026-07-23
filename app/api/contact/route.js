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
  const resend = new Resend(process.env.RESEND_API_KEY);
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
  const replySubject = isAudit ? 'Your free website audit is on the way' : 'We got your message — talk soon';
  const replyText = isAudit
    ? `Hey ${n},\n\nThanks for requesting a free website audit. We'll review ${w} and send over a personalized breakdown of what's working, what's costing you conversions, and the quickest wins — usually within 24-48 hours.\n\nWant to skip the wait? Book a free call at kjahstudio.com.\n\n— The KJAH Studio Team`
    : `Hey ${n},\n\nThanks for reaching out. We've received your message and typically respond within 24 hours.\n\nIn the meantime, feel free to browse our work at kjahstudio.com.\n\n— The KJAH Studio Team`;
  const replyHtml = isAudit
    ? `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#0a0a0a;color:#e5e5e5;">
  <p style="font-size:13px;letter-spacing:0.1em;color:#4DDFF0;text-transform:uppercase;margin:0 0 24px;">KJAH Studio</p>
  <h1 style="font-size:22px;font-weight:600;margin:0 0 16px;color:#ffffff;">Your free audit is on the way.</h1>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 12px;">Hey ${n},</p>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 24px;">Thanks for requesting a free website audit. We'll review <strong style="color:#ffffff;">${w}</strong> and send over a personalized breakdown of what's working, what's costing you conversions, and the quickest wins — usually within <strong style="color:#ffffff;">24-48 hours</strong>.</p>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 32px;">Want to skip the wait? <a href="https://kjahstudio.com" style="color:#4DDFF0;text-decoration:none;">Book a free call</a>.</p>
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

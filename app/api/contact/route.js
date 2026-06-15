import { Resend } from 'resend';

const SUPABASE_URL = 'https://jczwufibjejzxnrlyjdz.supabase.co';

async function upsertProspect(name, email, message) {
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
      notes: `Inbound via website contact form:\n\n${message}`,
      stage: 'cold_lead',
      source: 'website',
      tags: ['inbound'],
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
  const { name, email, message } = await req.json();

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return Response.json({ error: 'All fields are required.' }, { status: 400 });
  }

  const n = name.trim();
  const e = email.trim();
  const m = message.trim();

  try {
    await Promise.all([
      resend.emails.send({
        from: 'KJAH Studio <hello@kjahstudio.com>',
        to: 'support@kjahstudio.com',
        replyTo: e,
        subject: `New message from ${n}`,
        text: `Name: ${n}\nEmail: ${e}\n\nMessage:\n${m}`,
      }),
      resend.emails.send({
        from: 'KJAH Studio <hello@kjahstudio.com>',
        to: e,
        subject: "We got your message — talk soon",
        text: `Hey ${n},\n\nThanks for reaching out. We've received your message and typically respond within 24 hours.\n\nIn the meantime, feel free to browse our work at kjahstudio.com.\n\n— The KJAH Studio Team`,
        html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#0a0a0a;color:#e5e5e5;">
  <p style="font-size:13px;letter-spacing:0.1em;color:#4DDFF0;text-transform:uppercase;margin:0 0 24px;">KJAH Studio</p>
  <h1 style="font-size:22px;font-weight:600;margin:0 0 16px;color:#ffffff;">We got your message.</h1>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 12px;">Hey ${n},</p>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 24px;">Thanks for reaching out. We've received your message and typically respond within <strong style="color:#ffffff;">24 hours</strong>.</p>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 32px;">In the meantime, feel free to browse our work at <a href="https://kjahstudio.com" style="color:#4DDFF0;text-decoration:none;">kjahstudio.com</a>.</p>
  <p style="font-size:14px;color:#525252;border-top:1px solid #1f1f1f;padding-top:20px;margin:0;">— The KJAH Studio Team</p>
</div>`,
      }),
      upsertProspect(n, e, m),
    ]);

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Failed to send. Please try again.' }, { status: 500 });
  }
}

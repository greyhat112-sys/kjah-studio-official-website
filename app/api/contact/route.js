import { Resend } from 'resend';

export async function POST(req) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, message } = await req.json();

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return Response.json({ error: 'All fields are required.' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'KJAH Studio <hello@kjahstudio.com>',
      to: 'support@kjahstudio.com',
      replyTo: email.trim(),
      subject: `New message from ${name.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
    });

    await resend.emails.send({
      from: 'KJAH Studio <hello@kjahstudio.com>',
      to: email.trim(),
      subject: "We got your message — talk soon",
      text: `Hey ${name.trim()},\n\nThanks for reaching out. We've received your message and typically respond within 24 hours.\n\nIn the meantime, feel free to browse our work at kjahstudio.com.\n\n— The KJAH Studio Team`,
      html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#0a0a0a;color:#e5e5e5;">
  <p style="font-size:13px;letter-spacing:0.1em;color:#4DDFF0;text-transform:uppercase;margin:0 0 24px;">KJAH Studio</p>
  <h1 style="font-size:22px;font-weight:600;margin:0 0 16px;color:#ffffff;">We got your message.</h1>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 12px;">Hey ${name.trim()},</p>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 24px;">Thanks for reaching out. We've received your message and typically respond within <strong style="color:#ffffff;">24 hours</strong>.</p>
  <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 32px;">In the meantime, feel free to browse our work at <a href="https://kjahstudio.com" style="color:#4DDFF0;text-decoration:none;">kjahstudio.com</a>.</p>
  <p style="font-size:14px;color:#525252;border-top:1px solid #1f1f1f;padding-top:20px;margin:0;">— The KJAH Studio Team</p>
</div>`,
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Failed to send. Please try again.' }, { status: 500 });
  }
}

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
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Failed to send. Please try again.' }, { status: 500 });
  }
}

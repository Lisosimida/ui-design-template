import { Resend } from 'resend';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import site from '../../../config/site';

// On Cloudflare Workers, secrets are bound via `wrangler secret put` (or the
// dashboard) and only reachable through the Workers env, not process.env.
// process.env.RESEND_API_KEY is kept as a fallback for local `next start`/Node
// deployments that don't go through the Workers runtime.
async function getResendApiKey() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (env?.RESEND_API_KEY) return env.RESEND_API_KEY;
  } catch {
    // Not running under the Cloudflare adapter (e.g. plain `next build`/Node).
  }
  return process.env.RESEND_API_KEY;
}

export async function POST(request) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return Response.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }

  const apiKey = await getResendApiKey();
  if (!apiKey) {
    return Response.json({ error: 'Contact form is not configured yet.' }, { status: 503 });
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: 'Launchbase <onboarding@resend.dev>',
      to: site.contactEmail,
      replyTo: email,
      subject: `New message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error('[contact] Resend returned an error:', error);
      return Response.json({ error: 'Could not send your message. Please try again.' }, { status: 502 });
    }
  } catch (err) {
    console.error('[contact] Resend threw an exception:', err.message, 'cause:', err.cause);
    return Response.json({ error: 'Could not send your message. Please try again.' }, { status: 502 });
  }

  return Response.json({ ok: true });
}

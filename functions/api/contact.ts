// ---------------------------------------------------------------------------
// Cloudflare Pages Function — handles the booking / contact form.
// Path: POST /api/contact
//
// Setup (Cloudflare dashboard → Pages project → Settings → Environment vars):
//   RESEND_API_KEY   your Resend API key (free tier: 100 emails/day)
//   TO_EMAIL         where enquiries are delivered (e.g. hello@taketheleadservices.co.uk)
//   FROM_EMAIL       a verified Resend sender (e.g. website@taketheleadservices.co.uk)
//
// No key set yet? The function still accepts the submission and logs it,
// so the form keeps working while email delivery is being configured.
// ---------------------------------------------------------------------------

interface Env {
  RESEND_API_KEY?: string;
  TO_EMAIL?: string;
  FROM_EMAIL?: string;
}

type Payload = {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  dog?: string;
  message?: string;
  company?: string; // honeypot
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const esc = (s = "") =>
  s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] || c);

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: Payload;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  // Honeypot — silently succeed so bots don't learn anything.
  if (data.company && data.company.trim() !== "") {
    return json({ ok: true });
  }

  const name = (data.name || "").trim();
  const phone = (data.phone || "").trim();
  const email = (data.email || "").trim();

  if (!name || !phone || !email) {
    return json({ error: "Please provide your name, phone and email." }, 400);
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return json({ error: "Please provide a valid email address." }, 400);
  }

  const subject = `New booking enquiry — ${name}`;
  const lines = [
    ["Name", name],
    ["Phone", phone],
    ["Email", email],
    ["Service", data.service || "—"],
    ["Dog", data.dog || "—"],
    ["Message", data.message || "—"],
  ];
  const html = `
    <h2 style="font-family:sans-serif">New booking enquiry</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${lines
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 14px 6px 0;font-weight:bold;vertical-align:top">${k}</td><td style="padding:6px 0">${esc(
              String(v)
            )}</td></tr>`
        )
        .join("")}
    </table>`;
  const text = lines.map(([k, v]) => `${k}: ${v}`).join("\n");

  // If email isn't configured yet, accept the lead so the form still works.
  if (!env.RESEND_API_KEY || !env.TO_EMAIL || !env.FROM_EMAIL) {
    console.log("Contact form submission (email not configured):", text);
    return json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Take The Lead Website <${env.FROM_EMAIL}>`,
        to: [env.TO_EMAIL],
        reply_to: email,
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend error:", res.status, detail);
      return json({ error: "Email service error" }, 502);
    }
    return json({ ok: true, delivered: true });
  } catch (err) {
    console.error("Send failed:", err);
    return json({ error: "Failed to send" }, 500);
  }
};

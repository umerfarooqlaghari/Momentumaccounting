import nodemailer, { type Transporter } from "nodemailer";

// SMTP settings come from .env so the practice can use any UK/EU email provider (MA-006).
let transporter: Transporter | null = null;

export function emailConfigured() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.EMAIL_FROM);
}

function getTransport() {
  transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

export function fillTemplate(text: string, vars: Record<string, string | undefined>) {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => vars[k] ?? "");
}

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Minimal markdown → HTML for emails: paragraphs, **bold**, links, bullet lists. */
export function markdownToHtml(md: string) {
  return md
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split("\n");
      const inline = (s: string) =>
        escape(s)
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\[(.+?)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" style="color:#0a7475">$1</a>');
      if (lines.every((l) => /^\s*[-*] /.test(l)))
        return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*] /, ""))}</li>`).join("")}</ul>`;
      return `<p>${lines.map(inline).join("<br>")}</p>`;
    })
    .join("");
}

export function wrapHtml(inner: string, businessName = "Momentum Accounting") {
  return `<!doctype html><html><body style="margin:0;background:#faf9f7;font-family:Arial,Helvetica,sans-serif;color:#423e3b">
<div style="max-width:600px;margin:0 auto;padding:32px 20px">
<div style="border-top:4px solid #33cbcc;background:#fff;border-radius:12px;padding:32px;line-height:1.6;font-size:15px">${inner}</div>
<p style="font-size:12px;color:#6b6560;text-align:center;margin-top:20px">${escape(businessName)} · Building financial momentum for your business.</p>
</div></body></html>`;
}

export async function sendEmail(opts: { to: string | string[]; subject: string; markdown: string; replyTo?: string; unsubscribeUrl?: string }) {
  if (!emailConfigured()) {
    console.info(`[email] SMTP not configured — skipped "${opts.subject}" to ${opts.to}`);
    return { sent: false as const, reason: "not_configured" };
  }
  const footer = opts.unsubscribeUrl
    ? `<p style="font-size:12px;color:#6b6560">Don't want these emails? <a href="${opts.unsubscribeUrl}">Unsubscribe</a>.</p>`
    : "";
  await getTransport().sendMail({
    from: process.env.EMAIL_FROM,
    to: opts.to,
    replyTo: opts.replyTo,
    subject: opts.subject,
    text: opts.markdown,
    html: wrapHtml(markdownToHtml(opts.markdown) + footer),
    headers: opts.unsubscribeUrl ? { "List-Unsubscribe": `<${opts.unsubscribeUrl}>` } : undefined,
  });
  return { sent: true as const };
}

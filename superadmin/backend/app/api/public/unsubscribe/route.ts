import { handler } from "@/lib/handler";
import { verifyToken } from "@/lib/tokens";
import { Lead } from "@/models/Lead";

const page = (msg: string) =>
  new Response(
    `<!doctype html><meta name="viewport" content="width=device-width"><body style="font-family:Arial;background:#faf9f7;color:#423e3b;display:grid;place-items:center;min-height:90vh"><div style="max-width:420px;text-align:center"><h1 style="font-size:22px">${msg}</h1><p><a href="${process.env.FRONTEND_URL ?? "/"}" style="color:#0a7475">Back to Momentum Accounting</a></p></div>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );

export const GET = handler(async (request) => {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const payload = await verifyToken<{ leadId: string }>(token);
  if (!payload) return page("This unsubscribe link is invalid or has expired.");
  await Lead.updateOne(
    { _id: payload.leadId },
    { $set: { "consent.marketingOptIn": false, "nurture.stopped": true, "nurture.stoppedReason": "unsubscribed", "hqSync.status": "pending" } },
  );
  return page("You've been unsubscribed. You won't receive any more marketing emails from us.");
});
export const POST = GET; // one-click unsubscribe (RFC 8058)

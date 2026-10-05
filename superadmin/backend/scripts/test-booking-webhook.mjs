// Sends a signed Cal.com-style booking webhook to the backend, as if someone booked a call.
//   node scripts/test-booking-webhook.mjs someone@example.com "Their Name" [created|rescheduled|cancelled]
// Requires BOOKING_WEBHOOK_SECRET in .env (any value while testing) and a backend restart after setting it.
import { createHmac } from "node:crypto";

process.loadEnvFile?.(".env");
const [email = "booking-test@example.com", name = "Booking Tester", kind = "created"] = process.argv.slice(2);
const secret = process.env.BOOKING_WEBHOOK_SECRET;
if (!secret) {
  console.error("Set BOOKING_WEBHOOK_SECRET in .env and restart the backend first.");
  process.exit(1);
}
const start = new Date(Date.now() + 3 * 86_400_000);
start.setHours(10, 0, 0, 0);
const body = JSON.stringify({
  triggerEvent: `BOOKING_${kind.toUpperCase()}`,
  payload: {
    uid: `test-${Date.now()}`,
    startTime: start.toISOString(),
    attendees: [{ name, email }],
    responses: { notes: { value: "Booked from the test script" } },
    metadata: { utm_source: "test", utm_campaign: "booking-test" },
  },
});
const signature = createHmac("sha256", secret).update(body).digest("hex");
const api = process.env.PUBLIC_API_URL ?? "http://localhost:4000";
const res = await fetch(`${api}/api/webhooks/booking`, {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-cal-signature-256": signature },
  body,
});
console.log(res.status, await res.text());

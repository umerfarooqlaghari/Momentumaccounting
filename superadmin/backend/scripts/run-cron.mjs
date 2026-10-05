// Runs a scheduled job now, the same way the host's cron will in production.
//   node scripts/run-cron.mjs hq-sync | nurture | retention
process.loadEnvFile?.(".env");
const job = process.argv[2];
if (!["hq-sync", "nurture", "retention"].includes(job)) {
  console.error("Usage: node scripts/run-cron.mjs hq-sync | nurture | retention");
  process.exit(1);
}
const api = process.env.PUBLIC_API_URL ?? "http://localhost:4000";
const res = await fetch(`${api}/api/cron/${job}`, { headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` } });
console.log(job, res.status, await res.text());

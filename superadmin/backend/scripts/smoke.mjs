// End-to-end smoke test against a running backend (MA-081).
//   node scripts/smoke.mjs [apiUrl]
// Creates a lead, checks de-duplication, admin access and CSV export, then deletes the test lead.
process.loadEnvFile?.(".env");
const api = process.argv[2] ?? "http://localhost:4000";
const email = `smoke-${Date.now()}@example.com`;
let failed = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "✔" : "✘"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failed++;
};
const post = (path, body, headers = {}) =>
  fetch(`${api}${path}`, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });

const health = await (await fetch(`${api}/api/health`)).json();
check("health + database", health.ok && health.db === "connected", JSON.stringify(health));

const lead = { type: "enquiry", name: "Smoke Test", email, legalStructure: "Limited company", turnover: "£500k–£1m", consent: { privacyAccepted: true } };
const r1 = await post("/api/leads", lead);
const b1 = await r1.json();
check("lead created", r1.status === 201, `status ${r1.status}`);
const r2 = await post("/api/leads", { ...lead, type: "quiz", answers: { quizScore: "80%" } });
check("returning prospect de-duplicated", (await r2.json()).duplicate === true);
check("invalid lead rejected", (await post("/api/leads", { type: "enquiry", email: "x" })).status === 422);

const login = await post("/api/auth/login", { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
const { token } = await login.json();
check("admin login", !!token, `status ${login.status}`);
const auth = { Authorization: `Bearer ${token}` };
const detail = await (await fetch(`${api}/api/admin/leads/${b1.id}`, { headers: auth })).json();
check("lead visible in admin with 2 activities and ideal score", detail.item?.activity?.length === 2 && detail.item?.score === "ideal");
const csv = await (await fetch(`${api}/api/admin/leads/export?q=${encodeURIComponent(email)}`, { headers: auth })).text();
check("CSV export contains lead", csv.includes(email));
check("admin requires auth", (await fetch(`${api}/api/admin/leads`)).status === 401);
const site = await (await fetch(`${api}/api/public/site`)).json();
check("public content feed", site.services?.length > 0 && !("notificationEmails" in (site.settings ?? {})));

const del = await fetch(`${api}/api/admin/leads/${b1.id}`, { method: "DELETE", headers: auth });
check("test lead erased", del.status === 200);

console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
process.exit(failed ? 1 : 0);

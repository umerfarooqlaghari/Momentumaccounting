// Fake Momentum HQ for testing lead sync locally.
//   node scripts/mock-hq.mjs          → accepts leads on http://localhost:4100/leads
//   node scripts/mock-hq.mjs --fail   → rejects every lead with 503 (simulates HQ being down)
// Set MOMENTUM_HQ_API_URL=http://localhost:4100/leads and MOMENTUM_HQ_API_KEY=test-key in .env, then restart the backend.
import http from "node:http";

const fail = process.argv.includes("--fail");
let count = 0;

http
  .createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      const lead = JSON.parse(body || "{}");
      if (fail) {
        console.log(`✘ rejected ${lead.email} (simulated outage)`);
        res.writeHead(503).end();
        return;
      }
      count++;
      console.log(`✔ HQ received lead #${count}: ${lead.name} <${lead.email}> status=${lead.status} score=${lead.score}`);
      console.log(`  auth=${req.headers.authorization} idempotency=${req.headers["idempotency-key"]}`);
      res.writeHead(201, { "Content-Type": "application/json" }).end(JSON.stringify({ id: `HQ-${count}` }));
    });
  })
  .listen(4100, () => console.log(`Mock Momentum HQ on http://localhost:4100/leads ${fail ? "(failing)" : ""}`));

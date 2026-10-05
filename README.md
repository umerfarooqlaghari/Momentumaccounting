# Momentum Accounting

| Folder | What it is | Port |
|---|---|---|
| `frontend/` | Public website (Next.js 16 + TypeScript + Tailwind 4) | 3000 |
| `superadmin/` | Superadmin panel — content management and leads console | 3001 |
| `superadmin/backend/` | Backend API — Next.js route handlers + MongoDB (Mongoose) | 4000 |

## Run locally

```bash
# 1. Backend (needs superadmin/backend/.env — see .env.example)
cd superadmin/backend && npm install && npm run seed && npm run dev

# 2. Website
cd frontend && npm install && npm run dev        # http://localhost:3000

# 3. Superadmin
cd superadmin && npm install && npm run dev      # http://localhost:3001
```

`npm run seed` fills an empty database with the initial content and creates the owner login (printed once).

## Useful commands

| Where | Command | What it does |
|---|---|---|
| backend | `npm run smoke` | End-to-end checks against the running API |
| frontend | `npm test` | Salary/dividend calculator unit tests |
| frontend | `npm run snapshot` | Save current content as the website's offline fallback |
| backend | `npm run mock-hq` | Fake Momentum HQ on :4100 (`-- --fail` simulates an outage) |
| backend | `npm run test:booking -- email "Name"` | Send a signed test booking webhook |
| backend | `npm run cron -- hq-sync\|nurture\|retention` | Run a scheduled job now |

## Docs

- [Architecture](docs/architecture.md)
- [Deploy to Vercel](docs/deploy-vercel.md)
- [Handover, hosting & operations](docs/handover.md)
- [Momentum HQ integration spec](docs/momentum-hq-integration-spec.md)
- [Superadmin training guide](docs/training-guide.md)
- [Manual testing guide](docs/manual-testing-guide.md)
- [QA plan & launch runbook](docs/launch-runbook.md)
- [Brand extension proposal](docs/brand-extension-proposal.md)
- [Marketing strategy](docs/marketing-strategy.md)
- [Tender response template](docs/tender-response-template.md)
- [Needed from the practice](docs/needs-from-ben.md)
- [Build tickets](TICKETS.md)

# Deploying to Vercel

The repository holds three apps, deployed as **three Vercel projects** from the same GitHub repo:

| Vercel project | Root Directory | Final domain |
|---|---|---|
| `momentum-api` | `superadmin/backend` | `api.momentumaccounting.uk` |
| `momentum-website` | `frontend` | `momentumaccounting.uk` |
| `momentum-admin` | `superadmin` | `admin.momentumaccounting.uk` |

**Deploy in this order: API → website → admin.** The website reads its content from the API while it builds.

---

## 0. Before you start

### Plan
- Vercel **Hobby** (free) is for personal, non-commercial use only, and only allows cron jobs **once a day**. Fine for a test deployment.
- For the live business site use **Vercel Pro**, on an account/team **owned by Momentum Accounting** (prospectus §1.4). Pro runs the 10-minute HQ retry job.
- On **Hobby**, edit `superadmin/backend/vercel.json` before deploying: change the `hq-sync` and `nurture` schedules to daily (e.g. `"0 6 * * *"`), or delete the `crons` block and use a free external scheduler (cron-job.org) instead. With more frequent schedules the deploy is rejected.

### Push the latest code
```bash
cd Momentumaccounting
git add -A
git commit -m "chore: Vercel config, upload limit, docs"
git push origin main
```

### MongoDB Atlas
1. **Network Access → Add IP Address → `0.0.0.0/0`** (Allow access from anywhere). Vercel's servers don't have fixed IP addresses. The database stays protected by its username and password.
2. **Rotate the database password** (Database Access → Edit user → Edit password). The current one has been shared in chat. Update it in your local `superadmin/backend/.env` too.
3. **Use a separate production database.** Same cluster, different name, so test data never mixes with live leads:
   `mongodb+srv://<user>:<password>@cluster0.rfksws2.mongodb.net/momentum_prod?retryWrites=true&w=majority`
4. **Seed it once** from your computer:
   - In `superadmin/backend/.env`, temporarily change `MONGODB_URI` to the `momentum_prod` URI and clear `ADMIN_PASSWORD=` (a strong password is then generated).
   - Run `cd superadmin/backend && npm run seed` and **save the owner password it prints**.
   - Change `MONGODB_URI` in `.env` back to your development database.
5. For launch, move to a paid Atlas cluster in the **London (eu-west-2)** region with backups, in Momentum's Atlas organisation.

### Generate production secrets
Run each command once and keep the output somewhere safe (password manager):
```bash
openssl rand -base64 48   # → JWT_SECRET
openssl rand -hex 24      # → REVALIDATE_SECRET
openssl rand -hex 24      # → CRON_SECRET
```

---

## 1. API project (`superadmin/backend`)

1. vercel.com → **Add New… → Project** → import `umerfarooqlaghari/Momentumaccounting`
2. **Project Name:** `momentum-api`
3. **Root Directory:** click *Edit* → choose `superadmin/backend`
4. **Framework Preset:** Next.js (auto-detected). Leave the build settings as they are.
5. **Environment Variables:**

| Name | Value |
|---|---|
| `MONGODB_URI` | production URI from step 0 (`…/momentum_prod?…`) |
| `JWT_SECRET` | generated |
| `REVALIDATE_SECRET` | generated |
| `CRON_SECRET` | generated (Vercel Cron sends it automatically) |
| `PUBLIC_API_URL` | `https://momentum-api.vercel.app` (your project's URL) |
| `FRONTEND_URL` | leave blank for now (step 4) |
| `SUPERADMIN_URL` | leave blank for now (step 4) |
| `ALLOWED_ORIGINS` | leave blank for now (step 4) |
| `EMAIL_FROM` | `Momentum Accounting <enquiries@momentumaccounting.uk>` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | when the practice's email account is ready |
| `MOMENTUM_HQ_API_URL`, `MOMENTUM_HQ_API_KEY` | when HQ details arrive |
| `BOOKING_WEBHOOK_SECRET` | when Cal.com is set up |
| `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | when Google Cloud is set up |

`ADMIN_EMAIL` / `ADMIN_PASSWORD` are **not** needed on Vercel; they're only used by the seed script.

6. **Deploy.** When it finishes, open `https://<api-url>/api/health`
   - **Expected:** `{"ok":true,"db":"connected"}`
7. **Settings → Functions → Function Region:** check that it shows **London (lhr1)**. `vercel.json` sets this, so UK data stays in the UK (§9).

---

## 2. Website project (`frontend`)

1. **Add New… → Project** → same repository
2. **Project Name:** `momentum-website` · **Root Directory:** `frontend`
3. **Environment Variables:**

| Name | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://momentum-api.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | `https://momentum-website.vercel.app` (your project's URL) |
| `REVALIDATE_SECRET` | **same value** as in the API project |
| `NEXT_PUBLIC_NOINDEX` | `true` (keeps Google out until launch) |

4. **Deploy** → open the URL → the home page shows the real content (Charles English review, phone number, etc.)

`NEXT_PUBLIC_…` values are built into the site. **After changing any of them, redeploy** (Deployments → ⋯ → Redeploy).

---

## 3. Admin project (`superadmin`)

1. **Add New… → Project** → same repository
2. **Project Name:** `momentum-admin` · **Root Directory:** `superadmin`
3. **Environment Variables:**

| Name | Value |
|---|---|
| `BACKEND_URL` | `https://momentum-api.vercel.app` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://momentum-api.vercel.app` |
| `NEXT_PUBLIC_WEBSITE_URL` | `https://momentum-website.vercel.app` |

4. **Deploy.**

---

## 4. Connect them (API environment variables)

API project → **Settings → Environment Variables**, fill the three blanks:

| Name | Value |
|---|---|
| `FRONTEND_URL` | `https://momentum-website.vercel.app` |
| `SUPERADMIN_URL` | `https://momentum-admin.vercel.app` |
| `ALLOWED_ORIGINS` | `https://momentum-website.vercel.app,https://momentum-admin.vercel.app` |

Then **Deployments → latest → ⋯ → Redeploy**. Environment variable changes only apply after a redeploy.

---

## 5. Test the live deployment

- [ ] `https://<api>/api/health` → connected
- [ ] Admin URL → login with the owner password from the production seed → dashboard
- [ ] Website → Contact → submit a test enquiry → it appears in admin **Leads**
- [ ] Admin → edit a service → the open website tab updates (within ~15 seconds on Vercel)
- [ ] Admin → Media library → upload an image under 4 MB → use it on a team member → shows on About
- [ ] API project → **Settings → Cron Jobs** lists the three jobs. After one runs, **Logs** shows a `200`
- [ ] Run the automated checks against production from your computer:
  `cd superadmin/backend && node scripts/smoke.mjs https://momentum-api.vercel.app`
  (uses `ADMIN_EMAIL`/`ADMIN_PASSWORD` from your local `.env`, so put the production owner login there temporarily)
- [ ] Erase the test lead afterwards
- [ ] Work through `docs/manual-testing-guide.md` on the live URLs

---

## 6. Launch with the real domain

Do this on launch day (see `docs/launch-runbook.md`). The domain currently points to the WordPress site, so the DNS change is the go-live moment.

1. **Domains** (Settings → Domains in each project):
   - website: `momentumaccounting.uk` and `www.momentumaccounting.uk` (set `www` to redirect to the apex)
   - admin: `admin.momentumaccounting.uk`
   - API: `api.momentumaccounting.uk`
2. Vercel shows the DNS records to add (an `A` record for the apex, `CNAME`s for the subdomains). Add them at the domain registrar. SSL certificates are issued automatically.
3. **Update the environment variables to the real domains:**
   - API: `PUBLIC_API_URL=https://api.momentumaccounting.uk`, `FRONTEND_URL=https://momentumaccounting.uk`, `SUPERADMIN_URL=https://admin.momentumaccounting.uk`, `ALLOWED_ORIGINS=https://momentumaccounting.uk,https://www.momentumaccounting.uk,https://admin.momentumaccounting.uk`
   - Website: `NEXT_PUBLIC_API_URL=https://api.momentumaccounting.uk`, `NEXT_PUBLIC_SITE_URL=https://momentumaccounting.uk`, and **delete `NEXT_PUBLIC_NOINDEX`**
   - Admin: `BACKEND_URL` and `NEXT_PUBLIC_BACKEND_URL=https://api.momentumaccounting.uk`, `NEXT_PUBLIC_WEBSITE_URL=https://momentumaccounting.uk`
4. **Redeploy all three** (API first).
5. Google Search Console → submit `https://momentumaccounting.uk/sitemap.xml`.
6. If you configure Cal.com, use `https://api.momentumaccounting.uk/api/webhooks/booking` as the webhook URL.

---

## Everyday use after setup

- **Push to `main` → all three projects redeploy automatically.** Other branches get preview URLs.
  - In each project, set `NEXT_PUBLIC_NOINDEX=true` for the **Preview** environment too, so preview sites are never indexed.
- To skip rebuilding an app whose folder didn't change: Project → Settings → Git → **Ignored Build Step** → `git diff HEAD^ HEAD --quiet -- .`
- Logs: each project → **Logs** (filter by `/api/leads` to watch lead submissions).

## How Vercel differs from running locally

| Area | On Vercel |
|---|---|
| Uploads | Max **4 MB** per file (Vercel's request limit is 4.5 MB). Compress large photos/PDFs first |
| Live website updates | Within ~1–15 seconds. The live connection reconnects every 5 minutes, which is normal |
| Background work | Emails and HQ sync run after the response, using Vercel's `after()` support |
| Scheduled jobs | Run by Vercel Cron from `superadmin/backend/vercel.json` (Pro for every-10-minute jobs) |
| Region | London (`lhr1`) for all three projects |

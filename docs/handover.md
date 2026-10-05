# Handover, hosting & operations

## 1. Accounts — all in Momentum Accounting Ltd's name (§1.4)

| Account | Purpose | Status |
|---|---|---|
| Domain registrar (momentumaccounting.uk) | DNS | ☐ Confirm owner |
| Hosting (e.g. Vercel Pro / Render / Railway, EU region) | 3 apps | ☐ |
| MongoDB Atlas (UK/EU region) | Database, media, backups | ☐ Move cluster to practice's Atlas org, region `eu-west-2` London |
| Email / SMTP (Microsoft 365, Postmark EU or Brevo) | Notifications, acknowledgements, nurture | ☐ |
| Cal.com | Online booking | ☐ |
| Google Analytics 4, Tag IDs, Search Console | Analytics | ☐ |
| Google Business Profile | Local SEO, reviews | ☐ |
| Google Cloud (Places API key) | Live Google reviews | ☐ |
| Google Ads, Meta Business, LinkedIn Campaign Manager, TikTok Ads | Advertising and conversion tags | ☐ |
| GitHub organisation | Source code | ☐ Transfer repository |
| Figma | Design source files | ☐ Transfer |

## 2. Environment variables

**superadmin/backend/.env**

| Variable | What it is |
|---|---|
| `MONGODB_URI` | Atlas connection string |
| `PUBLIC_API_URL`, `FRONTEND_URL`, `SUPERADMIN_URL` | Public URLs of each app |
| `ALLOWED_ORIGINS` | Website + superadmin origins allowed by CORS |
| `JWT_SECRET` | Signs admin sessions, download and unsubscribe links (48+ random characters) |
| `REVALIDATE_SECRET` | Shared with the website so edits go live immediately |
| `CRON_SECRET` | Protects `/api/cron/*` |
| `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD` | First owner account (used once by `npm run seed`) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | Outgoing email |
| `MOMENTUM_HQ_API_URL`, `MOMENTUM_HQ_API_KEY` | Momentum HQ lead intake (see `momentum-hq-integration-spec.md`) |
| `BOOKING_WEBHOOK_SECRET` | Cal.com webhook signing secret |
| `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | Live Google rating |

**frontend/.env**: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, `REVALIDATE_SECRET`, and `NEXT_PUBLIC_NOINDEX=true` on staging.
**superadmin/.env**: `BACKEND_URL`, `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_WEBSITE_URL`.

## 3. Deployment (suggested)

| App | Domain |
|---|---|
| frontend | `momentumaccounting.uk` (+ `www` → apex redirect) |
| superadmin | `admin.momentumaccounting.uk` (optionally IP- or SSO-restricted) |
| backend | `api.momentumaccounting.uk` |

Each app: `npm ci && npm run build && npm start`. Node 24. TLS certificates are issued automatically by the host.

**Scheduled jobs** (host cron, every 10 minutes; retention daily), each with `Authorization: Bearer $CRON_SECRET`:
```
GET https://api.momentumaccounting.uk/api/cron/hq-sync
GET https://api.momentumaccounting.uk/api/cron/nurture
GET https://api.momentumaccounting.uk/api/cron/retention
```

**Cal.com set-up:** event "Introductory call"; webhook → `https://api.momentumaccounting.uk/api/webhooks/booking` with events Created/Rescheduled/Cancelled and a secret (= `BOOKING_WEBHOOK_SECRET`); after-booking redirect → `https://momentumaccounting.uk/thank-you?type=booking`. Paste the booking page URL into superadmin → Site settings.

## 4. Backups and security

- Atlas: enable continuous cloud backup (point-in-time restore), keeping at least 30 days.
- Restore test: restore a snapshot to a temporary cluster, point a staging backend at it, and run `npm run smoke`.
- Dependencies: enable Dependabot on the GitHub repository; CI runs lint, type checks, tests and builds.
- Error monitoring: add Sentry (EU region) to each app if required.
- Rotate `JWT_SECRET`, `CRON_SECRET` and the database password if any are exposed.

## 5. Routine tasks

| Task | Where |
|---|---|
| Edit any page text, services, team, reviews, blog | Superadmin → Content |
| Upload photos or PDFs | Superadmin → Media library (images need alt text) |
| Add a campaign page | Superadmin → Campaign landing pages → lives at `/lp/<slug>` |
| Update tax rates each April | Superadmin → Calculator tax rates (tick "verified") |
| Add tracking IDs | Superadmin → Site settings |
| Fix a broken old link | Superadmin → 404 log → add a Redirect |
| Monthly report | Superadmin → Monthly figures (enter ad spend and GA4 visitors) → Reports |
| Delete a person's data (GDPR) | Superadmin → Leads → lead → Erase |
| Refresh the website's offline fallback | `cd frontend && npm run snapshot` |

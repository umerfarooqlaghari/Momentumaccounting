# Architecture

```
                 ┌──────────────────────────────┐
 Visitors ─────▶ │ frontend (Next.js, :3000)     │──── reads content (cached, tag "content")
                 │ public website                │──── posts leads ───────────────┐
                 └──────────────────────────────┘                                 │
                                ▲ revalidate on edit                               ▼
                 ┌──────────────────────────────┐   bearer token   ┌────────────────────────────┐
 Practice team ▶ │ superadmin (Next.js, :3001)   │ ───────────────▶ │ superadmin/backend (:4000)  │
                 │ CMS + leads console           │  (server bridge) │ Next.js route handlers      │
                 └──────────────────────────────┘                  │ MongoDB (Atlas, UK/EU)      │
                                                                   │ GridFS media                │
 Cal.com ── webhook ──────────────────────────────────────────────▶│ /api/webhooks/booking       │
 Host cron ── /api/cron/* ────────────────────────────────────────▶│ HQ retry · nurture · GDPR   │
                                                                   └──────┬──────────────┬───────┘
                                                                          │ leads        │ email (SMTP)
                                                                          ▼              ▼
                                                                    Momentum HQ     prospects + team
```

## Apps

| App | Path | Role |
|---|---|---|
| Website | `frontend/` | Public site. Server-rendered/static pages; reads all content from `GET /api/public/site` with a 5-minute cache and instant refresh when superadmin saves. Falls back to `lib/fallback-data.json` if the API is down. |
| Superadmin | `superadmin/` | Admin UI. Logs in via the backend; keeps the token in an httpOnly cookie and calls the backend through its own `/api/backend/*` bridge, so the browser never sees the token. |
| Backend | `superadmin/backend/` | API only. MongoDB via Mongoose, files in GridFS, JWT auth, lead pipeline, Momentum HQ sync, emails, scheduled jobs. |

## Content model

All editable content types are declared once in `superadmin/backend/lib/resources.ts`. That single definition produces:
- the Mongoose model (`lib/models.ts`)
- the admin API (`/api/admin/content/<type>`), with revision history and restore
- the public feed (`/api/public/site`, published items only)
- the superadmin forms (rendered from `/api/admin/schema`)

To add a field: add it to the resource definition, then use it in the website. No other changes are needed.

## Lead pipeline (prospectus §6)

1. Website form → `POST /api/leads` (validated with zod, honeypot, rate-limited).
2. Matched by email: a returning prospect updates the existing lead and adds an activity entry.
3. Scored against the ideal client profile (Ltd + £100k–£5m = `ideal`).
4. Stored in MongoDB **first**, so nothing is lost.
5. After the response: push to Momentum HQ, notify the team, acknowledge the prospect.
6. Failed HQ pushes are retried with exponential backoff by `/api/cron/hq-sync`.
7. Bookings arrive through the signed Cal.com webhook; the status becomes `call_booked` and follow-up emails stop.
8. Prospects who opted in to marketing get the nurture sequence (`/api/cron/nurture`) until they book, change status or unsubscribe.

## Licences and ownership (prospectus §1.4)

Every dependency is open source (MIT, Apache-2.0, ISC or OFL for fonts). There are no paid themes, page builders or supplier-held licences. All accounts are created in Momentum Accounting Ltd's name; see `handover.md`.

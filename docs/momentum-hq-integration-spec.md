# Momentum HQ — lead intake specification

For whoever maintains Momentum HQ (prospectus §6, ticket MA-080). The website backend is already built to this contract; HQ needs one endpoint.

## Endpoint

`POST {MOMENTUM_HQ_API_URL}` (for example `https://hq.momentumaccounting.uk/api/website-leads`)

Headers:
- `Authorization: Bearer {MOMENTUM_HQ_API_KEY}`
- `Content-Type: application/json`
- `Idempotency-Key: {websiteLeadId}-{updatedAtMillis}`. The same key may arrive more than once on retry; treat it as one operation.

## Body

```json
{
  "websiteLeadId": "6ac39dbefb1e75f88eea6961",
  "name": "Jane Smith",
  "email": "jane@example.co.uk",
  "phone": "07700 900123",
  "businessName": "Acme Ltd",
  "legalStructure": "Limited company",
  "turnover": "£500k–£1m",
  "services": ["Full monthly package"],
  "currentAccountant": "Smith & Co",
  "heardAbout": "Google search",
  "message": "…",
  "score": "ideal",
  "status": "new",
  "firstSource": { "pageUrl": "…", "referrer": "…", "utmSource": "google", "utmMedium": "cpc", "utmCampaign": "launch", "gclid": "…" },
  "activity": [
    { "type": "enquiry", "answers": { "intent": "enquiry" }, "attribution": { "pageUrl": "…" }, "at": "2026-10-05T12:53:18.766Z" }
  ],
  "consent": { "privacyAccepted": true, "marketingOptIn": false, "wordingVersion": "2026-10-v1", "at": "…" },
  "booking": { "uid": "…", "startTime": "…", "status": "BOOKING_CREATED" },
  "createdAt": "…",
  "updatedAt": "…"
}
```

`activity[].type` is one of `enquiry | quote | quiz | booking | download | calculator | landing_page`.
`status` is one of `new | contacted | call_booked | proposal_sent | won | lost` (the §6.1 pipeline).

## Expected behaviour in HQ

1. **Upsert** by `websiteLeadId`, falling back to `email` (case-insensitive) for duplicate checking. A returning prospect updates the existing record.
2. Store all fields, including the full `activity` list (form answers, source page, UTM).
3. Respond `200`/`201` with `{ "id": "<HQ record id>" }` within 10 seconds.
4. Any non-2xx response or a timeout is retried automatically with exponential backoff (1, 2, 4 … minutes, capped at 6 hours, up to 10 attempts). Leads are never lost: they stay in the website database and can be re-sent from superadmin.
5. Pipeline stages, team notifications and the client record are managed in HQ. Superadmin also mirrors the pipeline status for reporting.

## Optional: HQ → website status updates

If HQ should drive reporting (e.g. mark leads Won), call:
`PATCH https://api.momentumaccounting.uk/api/admin/leads/{websiteLeadId}` with `{ "status": "won" }` and a service-account bearer token. Ask the website developer to issue a dedicated "leads" role account.

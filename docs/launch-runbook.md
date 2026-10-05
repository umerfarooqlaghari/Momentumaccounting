# QA plan and launch runbook

## QA checklist (MA-164)

**Functional**
- [ ] Every page loads; no 404s from internal links
- [ ] Enquiry form (3 steps), call request, quiz, calculator and download each create a lead (check Superadmin → Leads)
- [ ] Same email submitted twice → one lead with two activities
- [ ] Team notification and prospect acknowledgement emails arrive (SMTP configured)
- [ ] Cal.com booking → lead status "Call booked"; redirect to `/thank-you?type=booking`
- [ ] Lead reaches Momentum HQ; with HQ offline the lead stays "pending" and syncs on retry
- [ ] An edit in superadmin appears on the website within a minute
- [ ] Old URLs redirect (Superadmin → Redirects); 404s appear in the 404 log
- [ ] `npm run smoke` passes against production

**Tracking (with and without consent)**
- [ ] No GA, Ads or pixel requests before consent (DevTools → Network)
- [ ] After "Accept all": GA4 DebugView shows `generate_lead`, `quiz_complete`, `download`, `calculator_use`, `book_call`, `click_to_call`
- [ ] Google Ads Tag Assistant shows the lead conversion

**Quality**
- [ ] Lighthouse mobile ≥ 90 performance, 100 accessibility on home, service, contact
- [ ] axe DevTools: zero serious issues; keyboard-only run through the forms; VoiceOver/NVDA spot check
- [ ] Real devices: iPhone Safari, Android Chrome; desktop Chrome, Safari, Firefox, Edge
- [ ] Rich Results Test: AccountingService, FAQ, Article, Breadcrumb valid

## Launch day (MA-166)

1. A day before: lower the DNS TTL to 300s. Take a full backup of the WordPress site and hand it to the practice.
2. Confirm production env vars, `NEXT_PUBLIC_NOINDEX` **unset**, cron jobs scheduled, Atlas backups on.
3. Run `npm run seed` only if the production database is empty; then change the owner password.
4. Point the DNS apex and `www` at the website host; `admin.` and `api.` at their hosts.
5. Smoke test: home, a service page, the enquiry form, the quiz, `/commercial-accounting/` redirect.
6. Search Console: verify the domain and submit `https://momentumaccounting.uk/sitemap.xml`.
7. **Rollback:** point DNS back to the WordPress host (kept live for 30 days).

## First month (MA-167)

Daily: the 404 log, the Leads and HQ sync status on the dashboard, and Search Console coverage. Weekly: Core Web Vitals field data, form conversion rate.

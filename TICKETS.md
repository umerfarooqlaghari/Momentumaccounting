# Momentum Accounting — Website Build Tickets

Source: *Momentum Accounting Website Tender Prospectus v1.0 (Oct 2026)*. Each ticket cites the prospectus section it satisfies (`§`).

**Apps in this repo**
- `frontend` — public marketing website (momentumaccounting.uk)
- `superadmin` — content management + lead/admin console used by the practice team (satisfies §4.1 "edit without developer help")
- `api` / backend — shared data layer (DB, lead pipeline, email). Location TBD in EP0.

**Priority:** P0 = launch blocker · P1 = required by prospectus · P2 = "ideas to consider" / nice to have

**Ticket format:** ID · Title · App · Priority · § · Description · Acceptance criteria

## Status (5 Oct 2026)

| Epic | Status | Notes |
|---|---|---|
| EP0 Foundations | ✅ Built | Next.js ×3, MongoDB Atlas, CI (`.github/workflows/ci.yml`), honeypot + rate limiting, SMTP-ready email. Booking tool: Cal.com/Calendly embed + webhook ready |
| EP1 Brand & design | ✅ Built · ⏳ approval | Tokens, motion system, hero, brand proposal (`docs/brand-extension-proposal.md`). Needs official logo files + sign-off |
| EP2 Layout & components | ✅ Built | Header/mega-menu, footer, sticky mobile CTA, social embeds (consent-gated), thank-you pages, 404 |
| EP3 Pages | ✅ Built | All pages incl. sectors, case studies, local pages, campaign landing pages, legal pages |
| EP4 Lead generation | ✅ Built | Enquiry form, scoring, booking, quiz, calculator, downloads, live Google reviews, nurture emails, exit intent, click-to-call tracking |
| EP5 Lead capture & HQ | ✅ Website side built + tested with a mock HQ | HQ endpoint per `docs/momentum-hq-integration-spec.md` (needs NDA details) |
| EP6 Superadmin | ✅ Built | Auth/roles, dashboard, CMS for every content type with history/restore, media library, leads console, reports, redirects, users |
| EP7 SEO | ✅ Built | Metadata, schema, sitemap, robots, local pages, redirects incl. old WordPress URLs, OG image |
| EP8 Performance & a11y | ✅ Built · ⏳ audit | Static/ISR, reduced motion, accessible forms. Run the Lighthouse/axe/device checks in `docs/launch-runbook.md` |
| EP9 Compliance | ✅ Built · ⏳ approval | Consent banner (no tracking before consent), separate opt-in, UK/EU storage, retention job, export/erase. Legal wording needs approval |
| EP10 Analytics | ✅ Built · ⏳ IDs | GA4/Ads/Meta/LinkedIn/TikTok loaders + events; reports + monthly report. Needs account IDs |
| EP11 Hosting & ownership | 📄 Documented | `docs/handover.md` — accounts must be created in the practice's name |
| EP12 Launch | 📄 Documented | `docs/launch-runbook.md`; content migrated from the current site |
| EP13 Handover | 📄 Documented | Training guide, handover docs; live training session to schedule |
| EP14 Marketing | 📄 Draft | `docs/marketing-strategy.md` — fill in benchmark assumptions |
| EP15 Tender | 📄 Template | `docs/tender-response-template.md` — add prices and portfolio |

Items that only the practice can provide are listed in `docs/needs-from-ben.md`.

---

## Epic index

| Epic | Name | Tickets |
|---|---|---|
| EP0 | Foundations & architecture | MA-001 – MA-008 |
| EP1 | Brand & design system | MA-010 – MA-016 |
| EP2 | Global layout & shared components | MA-020 – MA-028 |
| EP3 | Public pages | MA-030 – MA-049 |
| EP4 | Lead generation features | MA-050 – MA-062 |
| EP5 | Lead capture & Momentum HQ integration | MA-070 – MA-081 |
| EP6 | Superadmin (CMS & lead console) | MA-090 – MA-106 |
| EP7 | SEO | MA-110 – MA-118 |
| EP8 | Performance, responsive & accessibility | MA-120 – MA-126 |
| EP9 | Compliance & data protection (UK GDPR) | MA-130 – MA-137 |
| EP10 | Analytics & reporting | MA-140 – MA-147 |
| EP11 | Hosting, security & ownership | MA-150 – MA-157 |
| EP12 | Content migration, QA & launch | MA-160 – MA-168 |
| EP13 | Handover, training & support | MA-170 – MA-175 |
| EP14 | Marketing strategy (post-launch) | MA-180 – MA-184 |
| EP15 | Tender / quote deliverables | MA-190 – MA-199 |

---

## EP0 — Foundations & architecture

### MA-001 · Decide and document the technical architecture
**App:** all · **P0** · §1.4, §4.1, §11.1(2)
Decide the backend (e.g. Postgres + Prisma/Drizzle, or a self-hosted open-source headless CMS), how `frontend` reads content, and how `superadmin` writes it. Every dependency must be open-source or licensed in Momentum's name, so nothing encumbers ownership.
- [ ] Architecture doc in `/docs/architecture.md` (apps, DB, email provider, booking tool, hosting, data flow diagram)
- [ ] Dependency list with each licence type; no proprietary or supplier-held licences
- [ ] Platform rationale written up (reused in MA-191)

### MA-002 · Monorepo setup
**App:** all · **P0**
- [ ] Shared workspace (npm/pnpm workspaces) with `frontend`, `superadmin` and a shared `packages/` (ui, types, db, config)
- [ ] Shared TypeScript, ESLint and Prettier config
- [ ] Root scripts: `dev`, `build`, `lint`, `typecheck`, `test`
- [ ] README with local setup steps

### MA-003 · Database and data models
**App:** backend · **P0** · §4, §6
Models: `Page`, `Service`, `Sector`, `TeamMember`, `Review`, `CaseStudy`, `BlogPost`, `Category`, `Media`, `LandingPage`, `LeadMagnet`, `Quiz`/`QuizQuestion`/`QuizResult`, `Lead`, `LeadEvent`, `Redirect`, `SiteSettings`, `AdminUser`.
- [ ] Schema plus migrations
- [ ] Seed script with placeholder content
- [ ] DB hosted in UK/EEA (§9)

### MA-004 · Environments
**App:** all · **P0**
- [ ] Local, staging and production environments
- [ ] `.env.example` for each app; secrets kept out of git
- [ ] Staging password-protected and `noindex`

### MA-005 · CI pipeline
**App:** all · **P1**
- [ ] On PR: lint, typecheck, build, tests
- [ ] Lighthouse CI on key pages (budgets from MA-120)
- [ ] Automated accessibility check (axe) on key pages

### MA-006 · Transactional email provider
**App:** backend · **P0** · §5.1, §6.1
- [ ] Provider chosen with EU/UK data processing and a DPA (e.g. Postmark, Resend EU, Brevo)
- [ ] Account in Momentum's name; SPF, DKIM and DMARC set on momentumaccounting.uk
- [ ] Reusable branded email template

### MA-007 · Booking tool selection
**App:** frontend · **P0** · §1.5, §5.1
- [ ] Choose a booking tool (e.g. Cal.com, which is self-hostable and open source, or Calendly) with its account in Momentum's name
- [ ] Supports confirmations, reminders and webhooks (for MA-073)
- [ ] Introductory call event type set up with qualifying questions

### MA-008 · Spam and abuse protection
**App:** backend · **P0**
- [ ] Bot protection on all forms (e.g. Cloudflare Turnstile or a honeypot plus timing check)
- [ ] Rate limiting on lead API endpoints
- [ ] Server-side validation (zod) shared with the client

---

## EP1 — Brand & design system

### MA-010 · Brand extension proposal
**App:** design · **P0** · §2.2
Propose supporting colours, typography, photography style, iconography and motion principles for client approval.
- [ ] Moodboard and style tiles delivered
- [ ] Client sign-off recorded

### MA-011 · Design tokens
**App:** packages/ui · **P0** · §2.2, §8
- [ ] Teal `#33CBCC` (primary) and charcoal `#423E3B` (secondary) as Tailwind v4 theme tokens
- [ ] Supporting palette, neutrals and semantic colours (success, error)
- [ ] All text/background pairs pass WCAG 2.2 AA contrast. Teal on white fails for body text, so define an accessible darker teal for text and links
- [ ] Type scale, spacing, radii, shadows

### MA-012 · Typography and web fonts
**App:** packages/ui · **P1** · §2.2, §8
- [ ] Fonts self-hosted via `next/font`, with an open licence (OFL) for ownership
- [ ] `font-display: swap`; no layout shift

### MA-013 · Logo assets
**App:** frontend · **P0** · §2.2
- [ ] SVG full logo and SVG landscape logo, each in light and dark variants
- [ ] Favicon set, apple-touch-icon and web manifest

### MA-014 · Motion system: "forward movement and growth"
**App:** packages/ui · **P1** · §2.1
Animation language based on the rising chart line in the logo: line-draw reveals, upward motion, counters.
- [ ] Reusable motion primitives (scroll reveal, line draw, count-up, hover states)
- [ ] All motion respects `prefers-reduced-motion`
- [ ] No animation blocks LCP or causes CLS

### MA-015 · Hi-fi designs
**App:** design · **P0** · §2, §4
- [ ] Desktop and mobile designs for every page template in EP3
- [ ] Component library in Figma; source files owned by the client (§1.4)
- [ ] **Milestone: design sign-off** (§11.1(9))

### MA-016 · Signature "wow" hero
**App:** frontend · **P0** · §1.2, §2.1
Memorable first-second impression on the home page, such as an animated rising chart line that draws in with the headline.
- [ ] Hero renders meaningful content with no JS dependency for LCP
- [ ] Works on mobile and in reduced-motion mode (static fallback)

---

## EP2 — Global layout & shared components

### MA-020 · Header and navigation
**App:** frontend · **P0** · §2.1, §4, §5.1
- [ ] Logo, primary nav (Services, Who we help, Quarterly report, About, Reviews, Resources, Contact) and a "Book a call" button
- [ ] Mega-menu or dropdown for Services and Who we help
- [ ] Mobile menu: accessible, focus-trapped, closes on Esc
- [ ] Sticky header that shrinks on scroll

### MA-021 · Footer
**App:** frontend · **P0** · §1.5, §9
- [ ] Contact details, Ashford, Surrey address, opening hours
- [ ] Social links: Instagram, TikTok, LinkedIn, Facebook
- [ ] Links to privacy, cookies, terms and accessibility
- [ ] Company registration and professional body details (editable in settings)
- [ ] Footer CTA band

### MA-022 · Persistent CTA on every page
**App:** frontend · **P0** · §2.1, §5.1
- [ ] Every page template ends with a CTA section (book a call or get a quote)
- [ ] Sticky mobile CTA bar ("Book a call" / "Call us")
- [ ] CTA text and target editable per page in superadmin

### MA-023 · Social proof components
**App:** frontend · **P0** · §5.1
- [ ] Testimonial card, carousel and grid
- [ ] Google rating badge (data from MA-057)
- [ ] Logo strip / "trusted by" section (optional)
- [ ] Stats counters, e.g. "75+ limited company clients"

### MA-024 · Section/block component library
**App:** frontend · **P0** · §4
Reusable blocks: hero, feature grid, split media/text, steps/process, pricing/package, FAQ accordion, CTA band, testimonial, stats, team grid, blog cards.
- [ ] Each block driven by CMS data
- [ ] Each block accessible and responsive

### MA-025 · Forms component kit
**App:** packages/ui · **P0** · §5.1, §9
- [ ] Inputs, selects, radios, checkboxes, multi-step wrapper and progress indicator
- [ ] Inline validation with accessible error messages
- [ ] Consent checkbox component (MA-132)

### MA-026 · Social media embeds
**App:** frontend · **P1** · §1.5, §7.1
- [ ] Embed recent Instagram/TikTok posts (e.g. a "From Ben's feed" section)
- [ ] Embeds load only after marketing cookie consent, with a click-to-load placeholder otherwise
- [ ] Lazy-loaded so they don't affect Core Web Vitals

### MA-027 · 404 and error pages
**App:** frontend · **P1**
- [ ] Branded 404 with search, popular links and CTA
- [ ] 500 error page

### MA-028 · Thank-you / confirmation pages
**App:** frontend · **P0** · §5.1, §10
- [ ] Separate thank-you URLs per conversion type (enquiry, booking, download, quiz) for conversion tracking
- [ ] Each offers a next step (e.g. "Book your call now" after an enquiry)

---

## EP3 — Public pages

### MA-030 · Home page
**App:** frontend · **P0** · §4, §3.3
Sections, in order:
- [ ] Hero: who we help ("UK limited companies £100k–£5m") + tagline "Building financial momentum for your business" + primary CTA
- [ ] Problem/recognition section ("Is this you?") so busy directors recognise themselves
- [ ] What makes us different: quarterly accounts, tax position every quarter, no surprises, personal team
- [ ] Quarterly report teaser linking to MA-036
- [ ] Full monthly package overview
- [ ] Social proof: Google rating and testimonials
- [ ] How it works (switching steps)
- [ ] Lead magnet / quiz / calculator teaser
- [ ] Team teaser
- [ ] Latest resources
- [ ] Final CTA

### MA-031 · Services overview page
**App:** frontend · **P0** · §4, §1.1
- [ ] **The full monthly package presented as the main offer**
- [ ] Grid of all individual services linking to detail pages
- [ ] Monthly subscription explained ("one fixed monthly fee")
- [ ] FAQ and CTA

### MA-032 · Service detail page template
**App:** frontend · **P0** · §4, §3.2
Template covers: what it is, what you get, why Momentum, how it fits the package, FAQ, testimonial, CTA. Create one page for each service:
- [ ] Bookkeeping
- [ ] Quarterly management accounts (with quarterly report and business summary)
- [ ] Year-end accounts and corporation tax (within 3 months of year end)
- [ ] VAT
- [ ] Payroll
- [ ] Self assessment
- [ ] Tax planning
- [ ] Each page has `Service` schema and a unique meta (MA-111)

### MA-033 · Monthly package page
**App:** frontend · **P0** · §4, §3.1, §3.2
- [ ] Everything included in the subscription, in plain English
- [ ] Pricing approach shown, or "Get a quote" if prices aren't published (client decision)
- [ ] Comparison: "typical accountant vs Momentum"
- [ ] CTA to book a call or get a quote

### MA-034 · Who we help: overview page
**App:** frontend · **P0** · §3, §4
- [ ] Ideal client profile in visitor language: limited company directors, £100k–£5m turnover, growth ambitions
- [ ] Links to sector and stage pages

### MA-035 · Who we help: sector / business-stage page template
**App:** frontend · **P1** · §4
- [ ] CMS-driven template (sector name, pain points, how we help, relevant testimonial or case study, CTA)
- [ ] Initial pages to be confirmed with the client, e.g. "Growing to £1m", "Scaling to £5m", "Switching accountant", plus 2–4 sectors from the client base
- [ ] Each page targets local and sector SEO keywords

### MA-036 · Quarterly report showcase page
**App:** frontend · **P0** · §3.2, §4
Key selling point, so it needs a standout, interactive presentation.
- [ ] Interactive walkthrough of a sample or anonymised quarterly report and business summary (annotated pages, hotspots, scroll-driven reveal)
- [ ] Explains: performance monitoring, tax position each quarter, plain-English summary
- [ ] "Download a sample report" lead magnet (MA-055)
- [ ] CTA

### MA-037 · About page
**App:** frontend · **P0** · §4, §2.2
- [ ] Practice story, Ben as founder and director, values and approach
- [ ] "Personal relationship / above and beyond" message
- [ ] Team grid (MA-038)
- [ ] Office / Ashford, Surrey location

### MA-038 · Team profiles
**App:** frontend · **P0** · §4, §4.1
- [ ] Team grid of all 6 members with photo, role and short bio
- [ ] Optional individual profile pages or modal
- [ ] Fully editable in superadmin (MA-095)

### MA-039 · Reviews page
**App:** frontend · **P0** · §4, §5.1
- [ ] Live Google rating summary (MA-057)
- [ ] Testimonials grid, filterable by service or sector
- [ ] Optional video testimonials
- [ ] `Review` / `AggregateRating` schema where allowed by Google guidelines

### MA-040 · Case studies: list and detail template
**App:** frontend · **P1** · §4, §3.3
- [ ] List page with cards
- [ ] Detail page: client situation → what we did → results, plus a quote
- [ ] At least 3 case studies at launch (content from the client)

### MA-041 · Resources / blog: listing page
**App:** frontend · **P1** · §4
- [ ] Paginated list, category filter and search
- [ ] Featured post
- [ ] Inline newsletter or lead magnet CTA

### MA-042 · Blog post template
**App:** frontend · **P1** · §4
- [ ] Rich text, images, embeds and callouts
- [ ] Author (team member), date, read time, category
- [ ] Related posts, share buttons, in-content CTA
- [ ] `Article` schema

### MA-043 · Contact page
**App:** frontend · **P0** · §4, §5.1
- [ ] Enquiry form (MA-050)
- [ ] Embedded booking (MA-052)
- [ ] Phone, email, address, map (map loaded only after consent or click-to-load)
- [ ] Google Business Profile link

### MA-044 · Book a call page
**App:** frontend · **P0** · §5.1
- [ ] Dedicated page with the booking embed and qualifying questions
- [ ] What to expect on the call; reassurance and testimonials

### MA-045 · Get a quote page
**App:** frontend · **P1** · §5.1
- [ ] Multi-step quote request form (same qualifying fields as MA-050)

### MA-046 · Campaign landing page template
**App:** frontend · **P1** · §5.2, §7
- [ ] Minimal-nav template for paid search and social traffic
- [ ] Built from CMS blocks; create and edit in superadmin (MA-099)
- [ ] Preserves UTM parameters into lead capture
- [ ] `noindex` option

### MA-047 · Legal pages
**App:** frontend · **P0** · §9
- [ ] Privacy policy (updated for new site, tools, lead capture and HQ)
- [ ] Cookie policy listing every cookie and tool
- [ ] Terms of website use
- [ ] Accessibility statement (WCAG 2.2 AA)
- [ ] All editable in superadmin

### MA-048 · Tools hub page
**App:** frontend · **P2** · §5.2
- [ ] Index of quiz, calculators and downloadable guides

### MA-049 · Local landing pages
**App:** frontend · **P1** · §8
- [ ] "Accountants in Ashford, Surrey" plus nearby towns (e.g. Staines, Sunbury, Egham, Feltham; confirm list with client)
- [ ] Unique content per page (no doorway duplication), local testimonials, map, CTA

---

## EP4 — Lead generation features

### MA-050 · Enquiry form with qualifying questions
**App:** frontend · **P0** · §5.1
Quick, ideally multi-step, form capturing:
- [ ] Name, email, phone
- [ ] Business name
- [ ] Legal structure (Ltd / sole trader / partnership / LLP / other)
- [ ] Approximate turnover (bands: <£100k, £100k–£250k, £250k–£500k, £500k–£1m, £1m–£5m, £5m+)
- [ ] Services needed (multi-select)
- [ ] Current accountant (yes/no + name)
- [ ] How did you hear about us
- [ ] Message (optional)
- [ ] Consent wording + separate marketing opt-in (MA-132)
- [ ] Hidden: page URL, referrer, UTM params, gclid/fbclid (MA-074)
- [ ] Submits to lead API (MA-070) → thank-you page
- [ ] Completable on mobile in under 60 seconds

### MA-051 · Lead qualification scoring
**App:** backend · **P1** · §3, §5.1
- [ ] Score each lead against the ideal client (Ltd, £100k–£5m, full service) and tag it "Ideal / Possible / Not a fit"
- [ ] Score visible in the lead record and team notification

### MA-052 · Online booking integration
**App:** frontend · **P0** · §1.5, §5.1
- [ ] Booking widget embedded on Contact, Book a call and thank-you pages
- [ ] Automatic confirmation email and calendar invite to the prospect
- [ ] Automatic reminders (e.g. 24h and 1h)
- [ ] Booking creates or updates a lead with status "Call Booked" (MA-073)
- [ ] Prefill name and email when coming from the enquiry form

### MA-053 · Business health-check quiz (ScoreApp replacement)
**App:** frontend + backend · **P1** · §1.3, §5.2
Builds on the current "right accountant" ScoreApp quiz, rebuilt in-house so the client owns it.
- [ ] Multi-step quiz UI with progress bar and on-brand motion
- [ ] Scoring engine with weighted answers, overall score and category scores
- [ ] Email gate before the results page
- [ ] Personalised results page with recommendations and CTA to book a call
- [ ] Optional results email / PDF
- [ ] Questions, weights and result copy editable in superadmin (MA-100)
- [ ] Completion creates a lead with answers and score (MA-070)

### MA-054 · Salary and dividend calculator
**App:** frontend · **P1** · §5.2
- [ ] Inputs: company profit, other income, tax year
- [ ] Output: optimal salary/dividend split, take-home, personal and corporation tax
- [ ] Current UK tax-year rates stored as config and editable in superadmin, with an annual update process
- [ ] Headline result free; detailed breakdown or PDF in exchange for email (lead)
- [ ] Disclaimer ("illustrative, not advice")
- [ ] Unit tests against worked examples signed off by the practice

### MA-055 · Lead magnets: downloadable guides and sample quarterly report
**App:** frontend + backend · **P1** · §5.2
- [ ] Gated download form (name, email, business name, turnover band, consent)
- [ ] File delivered by email link, not public URL
- [ ] Download creates a lead (MA-070)
- [ ] Lead magnets managed in superadmin (MA-098)
- [ ] Launch assets: sample quarterly report + 1–2 guides (content from client)

### MA-056 · Additional director tools (optional)
**App:** frontend · **P2** · §5.2
- [ ] Shortlist with client, e.g. VAT registration checker, corporation tax estimator, "cost of a bad accountant" calculator

### MA-057 · Live Google reviews
**App:** backend + frontend · **P1** · §5.1
- [ ] Fetch rating and recent reviews via Google Places API (key in client's Google Cloud account)
- [ ] Cache server-side (e.g. daily) to protect performance and quotas
- [ ] Badge and review widget components; fallback to CMS testimonials if the API fails

### MA-058 · Follow-up email sequences
**App:** backend · **P1** · §5.2
- [ ] Sequence for "enquired but not booked": e.g. day 1, 3, 7, 14 emails with booking CTA
- [ ] Sequence for lead magnet / quiz / calculator leads (nurture)
- [ ] Sends only with marketing opt-in, or under a lawful basis confirmed with the client
- [ ] Stops automatically when a call is booked or status changes
- [ ] Unsubscribe link and suppression list
- [ ] Email content editable in superadmin, or the ESP account is in the client's name

### MA-059 · Exit-intent / scroll-triggered offer
**App:** frontend · **P2** · §5
- [ ] Non-intrusive offer (sample report or quiz) on desktop exit intent or deep scroll
- [ ] Frequency-capped and dismissible; accessible

### MA-060 · Click-to-call and WhatsApp (optional)
**App:** frontend · **P2** · §5.1
- [ ] Mobile tap-to-call tracked as a conversion

### MA-061 · Testimonials request flow (optional)
**App:** superadmin · **P2** · §5.1
- [ ] Button to send existing clients a Google review link

### MA-062 · A/B testing readiness
**App:** frontend · **P2** · §5
- [ ] Ability to swap hero, CTA copy and form variants via CMS for testing

---

## EP5 — Lead capture & Momentum HQ integration

> Momentum HQ stack details arrive under NDA. Until then, build against a documented interface (MA-080) and keep a local lead store, so nothing is lost.

### MA-070 · Unified lead ingestion API
**App:** backend · **P0** · §6.1
- [ ] One endpoint/service for all lead sources: `enquiry`, `quote`, `quiz`, `booking`, `download`, `calculator`, `landing_page`
- [ ] Validates, scores (MA-051), stores locally, then forwards to Momentum HQ
- [ ] Idempotency key per submission (no double leads on double-click)

### MA-071 · Lead data model
**App:** backend · **P0** · §6.1
- [ ] Contact fields, business fields, all form answers (JSON), lead type
- [ ] Source page URL, landing page, referrer
- [ ] UTM source/medium/campaign/term/content, gclid, fbclid
- [ ] Consent flags + timestamp + consent wording version
- [ ] Status, score, timestamps, HQ sync status, HQ record ID

### MA-072 · Duplicate detection and merge
**App:** backend · **P0** · §6.1
- [ ] Match on normalised email (and phone / business name as secondary)
- [ ] Returning prospect updates the existing record and appends a `LeadEvent` (new activity) instead of creating a new lead
- [ ] Same rule applied in HQ (MA-080)

### MA-073 · Booking webhook → lead
**App:** backend · **P0** · §6.1
- [ ] Booking tool webhook (created / rescheduled / cancelled) verified by signature
- [ ] Creates or updates the lead; status → "Call Booked"; stops nurture sequence

### MA-074 · Attribution capture (UTM / source)
**App:** frontend · **P0** · §6.1, §10
- [ ] Capture UTM params and click IDs on first landing; persist first-touch and last-touch for the session (respecting consent)
- [ ] Attach to every submission with the page URL

### MA-075 · Real-time push to Momentum HQ
**App:** backend · **P0** · §6.1
- [ ] Each new or updated lead sent to HQ immediately (API call or webhook, per NDA spec)
- [ ] Authenticated (API key / HMAC), TLS only (§9)

### MA-076 · Failure handling and retry queue
**App:** backend · **P0** · §6.1
- [ ] Lead is always saved locally first
- [ ] Failed HQ sync is retried with exponential backoff (durable queue / cron)
- [ ] Alert to admin after N failures; manual "resync" in superadmin
- [ ] Test: HQ offline → submissions succeed → leads arrive once HQ returns

### MA-077 · Instant team notification
**App:** backend · **P0** · §6.1
- [ ] Email (and optional Slack/Teams) to the team for each new lead, with key fields, score and a link to HQ
- [ ] Notification recipients configurable in superadmin

### MA-078 · Prospect auto-acknowledgement
**App:** backend · **P0** · §6.1
- [ ] Branded email to the prospect on every submission type: what happens next, booking link, contact details
- [ ] Template editable in superadmin

### MA-079 · Lead pipeline stages
**App:** HQ / superadmin · **P0** · §6.1
- [ ] Pipeline: **New → Contacted → Call Booked → Proposal Sent → Won → Lost**
- [ ] Status changes logged with timestamp and user
- [ ] Won/Lost feeds conversion-to-client reporting (MA-145)

### MA-080 · Momentum HQ lead capture module
**App:** Momentum HQ · **P0** · §6, §11.1(4)
Scope depends on the NDA review. Either build it, or deliver a spec to HQ's maintainer.
- [ ] Review the HQ stack under NDA
- [ ] Lead entity, intake endpoint, duplicate check, pipeline board/list, lead detail view, source/campaign reporting (in HQ)
- [ ] **If not building:** an integration spec doc (endpoint contract, payload schema, auth, idempotency, error codes, duplicate rules, pipeline statuses) for the HQ maintainer

### MA-081 · End-to-end lead capture tests
**App:** all · **P0** · §11.2
- [ ] Automated E2E (Playwright) for each lead source → stored locally → arrives in HQ → notification + acknowledgement sent
- [ ] Duplicate and HQ-outage scenarios covered
- [ ] Sign-off: "Working lead capture into Momentum HQ, tested end to end"

---

## EP6 — Superadmin (CMS & lead console)

### MA-090 · Admin authentication and roles
**App:** superadmin · **P0** · §4.1, §1.4
- [ ] Secure login (email + password + 2FA, or SSO with the practice's Microsoft/Google)
- [ ] Roles: Owner (Ben), Editor, Lead manager
- [ ] User management; Owner account belongs to Momentum

### MA-091 · Admin dashboard
**App:** superadmin · **P1**
- [ ] Summary: new leads this week, leads by source, HQ sync health, recent content edits

### MA-092 · Page content editor
**App:** superadmin · **P0** · §4.1
- [ ] Edit text, images and CTAs on every page (home, services, about, etc.)
- [ ] Block-based editing using the MA-024 blocks (add / reorder / remove)
- [ ] Draft, preview and publish; revision history and rollback
- [ ] Publishing triggers on-demand revalidation in `frontend`

### MA-093 · Media library
**App:** superadmin · **P0** · §4.1
- [ ] Upload, crop, alt text (required), automatic image optimisation
- [ ] Storage in UK/EEA, in Momentum's account

### MA-094 · Services and sectors manager
**App:** superadmin · **P0** · §4.1
- [ ] CRUD for services and "who we help" pages, including SEO fields

### MA-095 · Team profiles manager
**App:** superadmin · **P0** · §4.1
- [ ] Add, edit and reorder team members (photo, name, role, bio, LinkedIn, show/hide)

### MA-096 · Reviews and case studies manager
**App:** superadmin · **P0** · §4.1
- [ ] CRUD testimonials (quote, name, business, service tags, photo, featured)
- [ ] CRUD case studies

### MA-097 · Blog manager
**App:** superadmin · **P0** · §4.1
- [ ] Rich-text editor, categories, author, featured image, scheduled publishing, SEO fields

### MA-098 · Lead magnets manager
**App:** superadmin · **P1** · §5.2
- [ ] Upload guide or report files, title, description, cover image, landing copy

### MA-099 · Landing page builder
**App:** superadmin · **P1** · §5.2
- [ ] Create campaign landing pages from blocks, with custom slug, `noindex` toggle and form choice

### MA-100 · Quiz editor
**App:** superadmin · **P1** · §5.2
- [ ] Edit questions, answers, weights, score bands and result content

### MA-101 · Calculator settings
**App:** superadmin · **P1** · §5.2
- [ ] Edit tax rates and thresholds per tax year

### MA-102 · Leads console
**App:** superadmin · **P0** · §6.1, §10
- [ ] Leads list with filters (source, campaign, page, score, status, date) and CSV export
- [ ] Lead detail: all answers, attribution, timeline, HQ sync status, manual resync
- [ ] Note: HQ remains the system of record; this is a safety net and reporting view

### MA-103 · Redirects manager
**App:** superadmin · **P0** · §8
- [ ] CRUD 301 redirects; bulk CSV import (for the old WordPress URL map)
- [ ] 404 log to spot missing redirects

### MA-104 · Site settings
**App:** superadmin · **P0** · §4.1
- [ ] Contact details, opening hours, social links, notification recipients, default SEO, announcement bar, footer content

### MA-105 · SEO fields on all content
**App:** superadmin · **P0** · §8
- [ ] Meta title and description, OG image, canonical, `noindex`, with a search-result preview

### MA-106 · Email templates editor
**App:** superadmin · **P1** · §5.2, §6.1
- [ ] Edit acknowledgement, notification and nurture-sequence copy

---

## EP7 — SEO

### MA-110 · Information architecture and URL structure
**App:** frontend · **P0** · §8
- [ ] Clean, keyword-led URLs (`/services/bookkeeping`, `/who-we-help/...`, `/resources/...`)
- [ ] Logical heading hierarchy (one H1 per page)

### MA-111 · Metadata
**App:** frontend · **P0** · §8
- [ ] Per-page title, description, canonical and Open Graph/Twitter tags via Next.js metadata API
- [ ] Dynamic OG images

### MA-112 · Schema markup (JSON-LD)
**App:** frontend · **P0** · §8
- [ ] `AccountingService` / `LocalBusiness` (Ashford, Surrey address, geo, hours, areaServed, sameAs social profiles)
- [ ] `Organization`, `WebSite`, `BreadcrumbList`
- [ ] `Service`, `FAQPage`, `Article`, `Person` (team)
- [ ] Validated with Google Rich Results Test

### MA-113 · Local SEO
**App:** frontend · **P0** · §8, §1.5
- [ ] NAP (name, address, phone) consistent with Google Business Profile
- [ ] Local landing pages (MA-049)
- [ ] GBP linked to the site; UTM on the GBP website link

### MA-114 · Sitemap and robots
**App:** frontend · **P0** · §8
- [ ] Dynamic `sitemap.xml` including blog and CMS pages
- [ ] `robots.txt`; staging blocked

### MA-115 · Redirect map from current WordPress site
**App:** frontend · **P0** · §8, §1.3
- [ ] Crawl momentumaccounting.uk (Screaming Frog or similar) and export all URLs, including media and blog
- [ ] Map every URL to its new equivalent; import into MA-103
- [ ] Verify all return 301 to a 200 page post-launch

### MA-116 · SEO baseline and keyword research
**App:** marketing · **P1** · §8
- [ ] Capture current rankings, traffic and backlinks before launch
- [ ] Keyword map per page (services × local × sector)

### MA-117 · Internal linking
**App:** frontend · **P1** · §8
- [ ] Related services, related posts and breadcrumbs

### MA-118 · Launch content SEO
**App:** content · **P1** · §4
- [ ] 4–6 initial blog articles targeting director-level queries

---

## EP8 — Performance, responsive & accessibility

### MA-120 · Performance budgets / Core Web Vitals
**App:** frontend · **P0** · §8
- [ ] Targets (mobile, field data): LCP < 2.5s, INP < 200ms, CLS < 0.1; Lighthouse performance ≥ 90 on key pages
- [ ] Budgets enforced in CI (MA-005)

### MA-121 · Rendering strategy
**App:** frontend · **P0** · §8
- [ ] Static or ISR pages with on-demand revalidation from the CMS
- [ ] Server Components by default; client JS only for interactive parts (forms, quiz, calculator, animation)

### MA-122 · Image, video and font optimisation
**App:** frontend · **P0** · §8
- [ ] `next/image`, AVIF/WebP, responsive sizes, priority hero image
- [ ] Video lazy-loaded with poster images
- [ ] Third-party scripts deferred / consent-gated

### MA-123 · Animation performance
**App:** frontend · **P0** · §2.1, §8
- [ ] Animate transform and opacity only; no long tasks on scroll
- [ ] Animations tested on a mid-range Android device

### MA-124 · Responsive build and device testing
**App:** frontend · **P0** · §8, §5.1
- [ ] Mobile-first; tested at 360, 390, 768, 1024, 1280 and 1440+
- [ ] Real-device testing on iOS Safari, Android Chrome, desktop Chrome/Safari/Firefox/Edge
- [ ] Mobile journeys (enquiry, booking, quiz) are fast and simple

### MA-125 · WCAG 2.2 AA compliance
**App:** frontend + superadmin · **P0** · §8
- [ ] Keyboard navigation, visible focus (2.4.11 focus not obscured), skip link
- [ ] Target size ≥ 24×24px (2.5.8), no drag-only interactions (2.5.7)
- [ ] Accessible forms: labels, errors, no redundant entry (3.3.7), accessible authentication (3.3.8)
- [ ] Colour contrast, alt text, landmarks, ARIA where needed
- [ ] `prefers-reduced-motion` respected; no flashing content
- [ ] Manual screen reader test (VoiceOver + NVDA) and axe audit with zero serious issues

### MA-126 · Accessibility statement
**App:** frontend · **P1** · §8
- [ ] Published at `/accessibility` (see MA-047)

---

## EP9 — Compliance & data protection (UK GDPR)

### MA-130 · Data residency
**App:** backend · **P0** · §9
- [ ] DB, file storage, email provider and backups all in UK/EEA
- [ ] Data processing list (every processor + location) documented

### MA-131 · Cookie consent banner
**App:** frontend · **P0** · §9
- [ ] Granular categories: necessary, analytics, marketing
- [ ] **No non-essential cookies or tracking set until consent is given**
- [ ] Equal-prominence Accept and Reject buttons; easy to change later (footer link)
- [ ] Google Consent Mode v2 integration
- [ ] Consent logged

### MA-132 · Form consent wording
**App:** frontend · **P0** · §9
- [ ] Clear privacy notice text and link on every form
- [ ] **Separate, unticked opt-in for marketing emails**
- [ ] Wording version stored with each lead (MA-071)

### MA-133 · Privacy and cookie policies
**App:** content · **P0** · §9
- [ ] Rewritten for the new site, tools, booking, lead capture, HQ, email sequences and analytics (client to approve, ideally with their compliance adviser)

### MA-134 · Data retention and subject rights
**App:** backend · **P1** · §9
- [ ] Retention period for unconverted leads; automated deletion or anonymisation
- [ ] Admin tool to export or delete a person's data (SAR / erasure)

### MA-135 · Secure transmission
**App:** backend · **P0** · §9
- [ ] HTTPS everywhere, HSTS; authenticated and encrypted link to HQ
- [ ] Encryption at rest for lead data

### MA-136 · Security headers and hardening
**App:** frontend + superadmin · **P0** · §8
- [ ] CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy
- [ ] Superadmin not indexed; brute-force protection
- [ ] Dependency vulnerability scanning

### MA-137 · Professional obligations check
**App:** content · **P1** · §9
- [ ] Client confirms required regulatory/professional body disclosures appear on the site (e.g. footer, terms)

---

## EP10 — Analytics & reporting

### MA-140 · Google Analytics 4
**App:** frontend · **P0** · §10, §1.5
- [ ] GA4 property in Momentum's Google account
- [ ] Loaded via GTM or directly, gated by consent (MA-131)

### MA-141 · Conversion events
**App:** frontend · **P0** · §10
- [ ] Events: `generate_lead` (with lead_type), `book_call`, `quiz_complete`, `download`, `calculator_use`, `click_to_call`, `click_email`
- [ ] Marked as key events in GA4

### MA-142 · Google Search Console
**App:** — · **P0** · §10
- [ ] Domain property verified; sitemap submitted; linked to GA4

### MA-143 · Ad conversion tracking
**App:** frontend · **P0** · §1.5, §10
- [ ] Google Ads conversion tags + enhanced conversions (consent-aware)
- [ ] Meta Pixel / Conversions API, LinkedIn Insight Tag (and TikTok pixel if used), all consent-gated
- [ ] All ad accounts owned by Momentum

### MA-144 · Google Business Profile
**App:** — · **P1** · §1.5
- [ ] GBP verified, owned by Momentum, linked to the website with UTM-tagged URL

### MA-145 · Lead reporting by source / campaign / page
**App:** superadmin + HQ · **P0** · §10
- [ ] Reports in superadmin/HQ: leads by source, campaign, landing page, lead type, score, status
- [ ] Conversion to client (Won) rates per source

### MA-146 · Monthly report
**App:** superadmin / Looker Studio · **P1** · §10
- [ ] Monthly report: visitors, leads, cost per lead (ad spend ÷ leads), conversion to clients
- [ ] Automated (Looker Studio dashboard and/or emailed PDF), owned by the client

### MA-147 · Tracking QA
**App:** frontend · **P0** · §10
- [ ] Every conversion verified in GA4 DebugView and Ads Tag Assistant, with and without consent

---

## EP11 — Hosting, security & ownership

### MA-150 · Hosting setup in client's name
**App:** infra · **P0** · §1.4, §8
- [ ] Hosting account created by or transferred to Momentum (supplier gets delegated access only)
- [ ] Hosting region UK/EEA; location stated in the quote

### MA-151 · Domain and DNS
**App:** infra · **P0** · §1.4
- [ ] momentumaccounting.uk registrar confirmed in Momentum's name
- [ ] DNS plan for cutover (low TTL before launch); email records untouched

### MA-152 · SSL
**App:** infra · **P0** · §8
- [ ] Automatic TLS certs for apex, www and admin subdomain; www → apex (or vice versa) redirect

### MA-153 · Backups
**App:** infra · **P0** · §8
- [ ] Automated daily DB + media backups, retained for 30+ days, stored in UK/EEA
- [ ] Restore procedure documented and tested once

### MA-154 · Security updates and monitoring
**App:** infra · **P0** · §8
- [ ] Dependabot/Renovate for dependency updates
- [ ] Uptime monitoring and error tracking (e.g. Sentry EU region)

### MA-155 · Third-party account ownership audit
**App:** — · **P0** · §1.4
- [ ] Checklist confirming every account is in Momentum's name: domain, hosting, DB, storage, email provider, booking tool, GA4, GTM, Search Console, GBP, Google Ads, Meta, LinkedIn, TikTok, Google Cloud (Places API), error monitoring

### MA-156 · Licence and IP audit
**App:** all · **P0** · §1.4
- [ ] Final audit: no proprietary or supplier-licensed frameworks, themes, fonts, images or plugins
- [ ] Stock photos/video licensed to Momentum
- [ ] Git repo transferred to Momentum's GitHub organisation

### MA-157 · Admin subdomain
**App:** infra · **P1**
- [ ] `superadmin` deployed on e.g. `admin.momentumaccounting.uk`, `noindex`, optionally IP/SSO-restricted

---

## EP12 — Content migration, QA & launch

### MA-160 · Content audit of current site
**App:** content · **P0** · §1.3
- [ ] Inventory of existing pages, testimonials, quiz content, images and blog posts
- [ ] Decide keep / rewrite / drop for each

### MA-161 · Copywriting
**App:** content · **P0** · §2.1, §4.1
- [ ] Plain-English copy for all pages, written for directors (not accountants)
- [ ] Scope, and whether it's included or priced separately, confirmed in the quote (MA-196)

### MA-162 · Photography and video
**App:** content · **P1** · §4.1
- [ ] Team photos, office/brand photography, optional founder intro video
- [ ] Scope, and whether it's included or priced separately, confirmed in the quote

### MA-163 · Content entry
**App:** superadmin · **P0**
- [ ] All launch content entered via superadmin (this also proves §4.1 editability)

### MA-164 · QA test plan
**App:** all · **P0** · §11.1(9)
- [ ] Functional, cross-browser, device, form, tracking, accessibility, performance, SEO and redirect checks
- [ ] Bug triage and fix cycle

### MA-165 · User acceptance testing
**App:** all · **P0** · §11.1(9)
- [ ] Client reviews on staging; feedback rounds; **sign-off before launch**

### MA-166 · Launch runbook
**App:** infra · **P0** · §11.2
- [ ] Pre-launch checklist (redirects, analytics, consent, `noindex` removed, forms → HQ live, backups)
- [ ] DNS cutover, smoke tests, rollback plan
- [ ] Old WordPress site archived (full backup handed to client)

### MA-167 · Post-launch monitoring (first 2–4 weeks)
**App:** all · **P0** · §11.2
- [ ] Daily check of 404 log, Search Console coverage, lead flow, HQ sync, CWV field data

### MA-168 · Live at momentumaccounting.uk
**App:** — · **P0** · §11.2
- [ ] **Milestone: launch**

---

## EP13 — Handover, training & support

### MA-170 · Handover documentation
**App:** docs · **P0** · §1.4, §11.2
- [ ] Architecture, hosting, deployment, environment variables, account list, backup/restore, how to update tax rates, how to add pages, HQ integration spec

### MA-171 · Design source files
**App:** design · **P0** · §1.4, §11.2
- [ ] Figma files transferred to Momentum's team/account; exported assets folder

### MA-172 · Full admin access transfer
**App:** — · **P0** · §1.4, §11.2
- [ ] All credentials and owner roles handed to Momentum; supplier access reduced to a delegated role

### MA-173 · Training session
**App:** — · **P0** · §11.2
- [ ] Live session (recorded) on editing the site and managing leads
- [ ] Short written/video guides for common tasks

### MA-174 · Post-launch support period
**App:** — · **P0** · §11.2
- [ ] Defined support period (state its length in the quote), with response times and bug-fix scope

### MA-175 · Ongoing hosting, support and maintenance plan
**App:** — · **P1** · §11.1(8)
- [ ] Optional monthly plans (updates, monitoring, content help, CRO) with pricing

---

## EP14 — Marketing strategy (post-launch)

### MA-180 · Marketing strategy document
**App:** marketing · **P1** · §7.1
- [ ] Recommended mix: SEO, Google Ads (local "accountant Ashford" etc.), paid social (Meta/LinkedIn/TikTok), content marketing

### MA-181 · Budget options
**App:** marketing · **P1** · §7.1, §11.1(6)
- [ ] 2–3 monthly budget tiers, each with estimated traffic, leads, cost per lead and expected new clients (with assumptions stated)

### MA-182 · Founder social integration plan
**App:** marketing · **P1** · §7.1
- [ ] How Ben's Instagram/TikTok content drives traffic: bio links → landing pages with UTMs, content → blog repurposing, retargeting audiences

### MA-183 · Campaign management offer
**App:** marketing · **P1** · §7.1
- [ ] Ongoing management scope and fees, **shown separately from ad spend**

### MA-184 · Campaign launch setup
**App:** marketing · **P2** · §7
- [ ] First campaigns built (search + retargeting) with dedicated landing pages and conversion tracking

---

## EP15 — Tender / quote deliverables (§11.1)

> Needed to win the tender, before build starts.

- [ ] **MA-190** Creative approach + examples of comparable work (§11.1(1))
- [ ] **MA-191** Platform, hosting and technical approach with reasons (§11.1(2)); state hosting location (§8)
- [ ] **MA-192** Fixed price for design and build, **itemised by prospectus section** (§11.1(3))
- [ ] **MA-193** Fixed price for Momentum HQ lead capture, or a statement of dependencies (§11.1(4), §6)
- [ ] **MA-194** Lead generation approach with evidence: leads, conversion rates, CPL from past work (§5, §11.1(5))
- [ ] **MA-195** Marketing budget options + separate management fees (§7, §11.1(6))
- [ ] **MA-196** Copywriting / photography / video: included or priced separately (§4.1, §11.1(7))
- [ ] **MA-197** Hosting, support and maintenance options and pricing (§11.1(8))
- [ ] **MA-198** Timeline with milestones: discovery → design sign-off → build → testing/UAT → launch → support (§11.1(9))
- [ ] **MA-199** Written confirmation of IP and ownership terms in §1.4 (§11.1(10))

Submit to Ben, Founder and Director: ben@momentumaccounting.uk

---

## Suggested milestone order

1. **Discovery & tender** — EP15, MA-001, MA-160, MA-116
2. **Design** — EP1 → *design sign-off*
3. **Foundations** — EP0, EP11 (staging), MA-090
4. **Build** — EP2, EP3, EP6 in parallel; then EP4, EP5
5. **SEO / compliance / analytics** — EP7, EP9, EP10
6. **Content** — MA-161–MA-163
7. **QA & UAT** — EP8, MA-164, MA-165, MA-081 → *testing sign-off*
8. **Launch** — MA-166–MA-168
9. **Handover & support** — EP13
10. **Growth** — EP14

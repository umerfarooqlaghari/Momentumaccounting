# Manual testing guide

A step-by-step walkthrough of every website and superadmin feature. Work through the parts in order: Part 1 sets things up, Part 2 follows a lead from the website all the way to "Won".

Tick each box as you go. **Expected** says what you should see; if you see something else, note the step number.

---

## Part 0 — Setup (10 minutes)

### 0.1 Start the three apps
Open three terminals:

```bash
cd superadmin/backend && npm run dev     # API      → http://localhost:4000
cd frontend && npm run dev               # Website  → http://localhost:3000
cd superadmin && npm run dev             # Admin    → http://localhost:3001
```

- [ ] http://localhost:4000/api/health shows `{"ok":true,"db":"connected"}`

### 0.2 Sign in to superadmin
- [ ] Open http://localhost:3001 → you're sent to the login page
- [ ] Sign in with `ben@momentumaccounting.uk` and the password printed by `npm run seed`
- **Expected:** Dashboard with "Hello, Ben", four counters and a **System health** panel

### 0.3 Send test emails to yourself, not to Ben ⚠️
New-lead notifications go to the addresses in Site settings. Change them before testing:

- [ ] Superadmin → **Settings → Site settings** → *New-lead notification emails* → replace both with **your own email** → Save

To see emails without a real mail account, use a free test inbox:
1. Go to **https://ethereal.email** → *Create Ethereal Account* (or sign up for **Mailtrap** sandbox).
2. Copy the SMTP details into `superadmin/backend/.env`:
   ```
   SMTP_HOST=smtp.ethereal.email
   SMTP_PORT=587
   SMTP_USER=<from ethereal>
   SMTP_PASS=<from ethereal>
   ```
3. Restart the backend (Ctrl+C, `npm run dev`).
- [ ] Dashboard → System health now says **"Email sending is set up"**

Every email sent during testing appears in the Ethereal/Mailtrap inbox. Nothing reaches real people.

### 0.4 Use a private/incognito window for the website
This gives you a fresh visitor each time: cookie banner shown, no saved choices.

---

## Part 1 — The lead journey (start to finish)

### 1.1 Visitor arrives from an advert
- [ ] In a private window open:
  `http://localhost:3000/?utm_source=google&utm_medium=cpc&utm_campaign=test-launch`
- **Expected:** Home page with the animated hero; cookie banner bottom-left

### 1.2 Cookie consent
- [ ] Click **Manage** → three categories shown (Essential locked on, Analytics, Marketing)
- [ ] Click **Reject all** → banner closes
- [ ] Scroll to the footer → click **Cookie settings** → banner reopens with your choices
- [ ] Click **Accept all**
- **Expected:** Banner closes. With no tracking IDs set yet nothing loads; see 4.3 to test real tags.

### 1.3 Enquiry form (main lead)
- [ ] Go to **Contact** (footer link). The campaign from 1.1 is remembered for the whole visit.
- [ ] Step 1: press **Continue** without filling anything
  **Expected:** red error messages under each field
- [ ] Fill: Business name `Test Ltd`, **Limited company**, **£250k–£500k** → Continue
- [ ] Step 2: choose **Full monthly package**, accountant **Yes**, name `Old Accountant & Co`, heard about **Google search** → Continue
- [ ] Step 3: Name `Ali Test`, Email `ali.test@example.com`, phone, message
- [ ] Press **Send** without ticking the privacy box → **Expected:** error "Please confirm to continue"
- [ ] Tick the privacy box **and** the optional marketing box → **Send my enquiry**
- **Expected:** "Thanks, we've got your enquiry" page (`/thank-you?type=enquiry`)

### 1.4 Check the emails (if 0.3 done)
- [ ] **Team notification** in the test inbox: subject "New website lead: Ali Test (Test Ltd)", with all answers, **Fit: ideal**, source `google / cpc / test-launch`, and an "Open in superadmin" link
- [ ] **Acknowledgement** to `ali.test@example.com`: "Thanks for getting in touch, Ali" with a booking link

### 1.5 Lead in superadmin
- [ ] Superadmin → **Leads**
- **Expected:** `Ali Test` at the top with Turnover `£250k–£500k`, Source `google`, Type `enquiry`, Fit **ideal**, Status **new**, HQ **pending**
- [ ] Open the lead and check:
  - Contact & business: every answer you typed
  - **Source:** utmSource `google`, utmMedium `cpc`, utmCampaign `test-launch`, page URL, referrer
  - Marketing opt-in **Yes**, consent date and wording version
  - Activity: one **enquiry** entry
  - Follow-up emails: "next on <tomorrow's date>"
- [ ] Dashboard: "New leads this week" increased by 1; lead shown under Latest leads

### 1.6 Returning prospect (duplicate check)
- [ ] On the website open **Tools → Do you have the right accountant?**
- [ ] Answer all 8 questions (try the **Back** button once)
- [ ] On "Where should we send your results?" use the **same email** `ali.test@example.com`
- **Expected:** score ring, result title (e.g. "Room for improvement") and category bars
- [ ] Superadmin → Leads → **still only one** `Ali Test`
- [ ] Open it → Activity shows **enquiry + quiz**, with every quiz answer and the score

### 1.7 Lead fit scoring
Create two more leads from the Contact page:

| Email | Legal structure | Turnover | Expected fit |
|---|---|---|---|
| `fit.possible@example.com` | Sole trader | £500k–£1m | **possible** |
| `fit.no@example.com` | Sole trader | Under £100k | **not a fit** |

- [ ] Both appear in Leads with the right fit
- [ ] Leads → filter **Fit = Ideal** → only ideal leads remain

### 1.8 Work the pipeline
On `Ali Test`:
- [ ] Add a note "Called, left voicemail" → **Add note** → appears with your name and time
- [ ] Click **Contacted** → Status history shows `new → contacted`; Follow-up emails show **stopped (status_contacted)**
- [ ] Click **Call booked** → **Proposal sent** → **Won**
- [ ] Leads list: status badge **Won**; Dashboard "Won (30 days)" = 1

### 1.9 Booking (call booked through the calendar)
**Without a booking account** (simulate Cal.com):
1. Put any value in `superadmin/backend/.env`: `BOOKING_WEBHOOK_SECRET=test-secret` → restart the backend
2. Run:
   ```bash
   cd superadmin/backend
   npm run test:booking -- booking.person@example.com "Booking Person"
   ```
- [ ] Terminal prints `200 {"ok":true}`
- [ ] Superadmin → Leads: `Booking Person`, Status **call booked**, Type **booking**; inside: "Call booked for" date, follow-ups **stopped (booked)**
- [ ] Run it again with **your enquiry email** (`ali.test@example.com`) → that existing lead gets a booking activity (no duplicate)

**With a real Cal.com account:** Site settings → *Booking page URL* = your Cal.com link → Save → website **Book a call** shows the live calendar instead of the form. See `handover.md` for the webhook set-up.

- [ ] Website → Book a call **without** a booking URL: the call-request form appears with "When suits you for a call?"; submitting goes to "we'll be in touch to arrange your call"

### 1.10 Follow-up emails (nurture sequence)
1. Superadmin → **Lead generation → Email templates → nurture_1** → *Send after (days)* = `0` → Save
2. Website → Contact → submit a new lead `nurture.test@example.com` **with the marketing box ticked**
3. Run the job:
   ```bash
   cd superadmin/backend && npm run cron -- nurture
   ```
- [ ] Prints `"sent":1`; the test inbox has "What our clients get every quarter" with an **Unsubscribe** link
- [ ] Lead page: Follow-up emails "next on <date in 3 days>"
- [ ] Click **Unsubscribe** in the email → "You've been unsubscribed"; lead → Marketing opt-in **No**, follow-ups **stopped (unsubscribed)**
- [ ] A lead **without** the marketing box never gets follow-ups (run the job again → `"sent":0`)
- [ ] Set nurture_1 back to `1` day afterwards

### 1.11 Momentum HQ sync (with a fake HQ)
1. Terminal 4: `cd superadmin/backend && npm run mock-hq`
2. In `.env`: `MOMENTUM_HQ_API_URL=http://localhost:4100/leads` and `MOMENTUM_HQ_API_KEY=test-key` → restart the backend
- [ ] Dashboard: "Connected to Momentum HQ"
- [ ] Submit a new lead on the website → the mock-HQ terminal prints "HQ received lead…" within a second → lead badge **HQ: synced**
- [ ] Open an older pending lead → **Resend to HQ** → "Sent to Momentum HQ"

**HQ outage (no lead lost):**
1. Stop the mock (Ctrl+C) and start `npm run mock-hq -- --fail`
2. Submit a lead `hq.down@example.com`
- [ ] The visitor still sees the thank-you page; the lead is in superadmin with HQ **pending** and "Last error"
3. Stop the failing mock, start `npm run mock-hq` again, **wait 1 minute** (retries back off: 1, 2, 4… minutes), then run `npm run cron -- hq-sync`
- [ ] Prints `synced` ≥ 1; the lead becomes **HQ: synced**

Afterwards clear `MOMENTUM_HQ_API_URL` and `MOMENTUM_HQ_API_KEY` and restart.

### 1.12 Other lead sources
- [ ] **Calculator:** Tools → Salary & dividend calculator → change the profit (slider and box) → numbers update instantly → fill the form under "See the full breakdown" → **Suggested split** and **All as salary** tables appear → Leads shows type **calculator** with profit and suggested split
- [ ] **Download without file:** Guides → "The director's guide…" → submit → "We'll email … shortly" → lead type **download**
- [ ] **Download with file:** Superadmin → Downloads → *Sample quarterly report* → *File (PDF)* → Choose → upload any PDF → Save. Website → Guides → Sample quarterly report → submit → **Download** button works; email contains the link
- [ ] **Campaign landing page:** open `http://localhost:3000/lp/switch-accountant?utm_source=facebook&utm_campaign=switch` → header shows only the logo + Book a call → submit the form → lead type **landing_page**, source `facebook`
- [ ] **Spam protection:** submit the Contact form 11 times within a minute → the 11th shows the error message (rate limit)

### 1.13 Leads tools
- [ ] Leads → search `ali` → filters to that lead
- [ ] Filter by date range, type, status
- [ ] **Export CSV** → opens in Excel/Numbers with every column (source, consent, HQ status)
- [ ] Lead → **Export this person's data** → downloads a JSON file (GDPR access request)
- [ ] Lead → **Erase** → confirm → lead disappears (GDPR erasure, owners only)

### 1.14 Reports
1. Superadmin → **Tracking → Monthly figures → New month** → Month `2026-10`, Ad spend `500`, Visitors `1200` → Create
- [ ] **Reports** → monthly bar chart and table: visitors 1,200, leads, cost per lead (£500 ÷ leads), visitor→lead %, lead→client %
- [ ] "By source" shows `google`, `facebook`, `test`, `direct`; "By campaign", "By landing page", "By lead type" are filled
- [ ] Period selector 3 / 6 / 12 months

---

## Part 2 — Content editing (superadmin → website)

Keep the website open in one window and superadmin in another. **After every Save the website updates by itself within about a second.** No reload should be needed.

| # | Test | Where in superadmin | Expected on website |
|---|---|---|---|
| 2.1 | Change a service title, add an "included" item, add an FAQ | Content → Services → Bookkeeping | `/services/bookkeeping`, Services page, header mega-menu, footer |
| 2.2 | Untick **Published** on VAT | Services → VAT | VAT disappears everywhere; `/services/vat` shows 404. Re-tick → back |
| 2.3 | **History:** edit a service twice, then **Restore** the older version | Service page → History panel | Old text returns |
| 2.4 | **Delete** a FAQ, then restore it | FAQs → open one → Delete → back on the FAQs list open **Recently deleted** (bottom) → Restore | FAQ disappears, comes back after restore |
| 2.5 | Home hero text + SEO title | Page text & SEO → New page → Page `home` → Hero eyebrow / Hero text / SEO title (the big home headline is part of the design and stays fixed; other pages also accept Hero title) | Home hero changes; browser tab title changes |
| 2.6 | Phone, hours, announcement bar | Settings → Site settings | Footer + Contact page; announcement strip at top of every page (clear it afterwards) |
| 2.7 | Social links + featured posts | Site settings → TikTok URL; *Featured social posts* → add an Instagram post URL | TikTok icon in footer; "Tips from Ben" section on Home with a click-to-load placeholder (loads only after marketing consent) |
| 2.8 | Team member with photo | Team → New → upload a photo (**alt text required**) | About page → team grid with the photo |
| 2.9 | Review | Reviews → New → tick Featured | Home, Reviews page, service pages |
| 2.10 | Blog post | Blog posts → New → use `## Heading`, `- bullet`, `[link](/contact)`, a cover image | `/resources` list + category filter; article page renders headings/bullets/link |
| 2.11 | Case study | Case studies → New | `/case-studies` shows cards instead of the testimonial fallback; detail page with results + quote |
| 2.12 | Sector page | Who we help → New → Type `sector` | `/who-we-help` → Specialist sectors; Home sector chips |
| 2.13 | Local page | Local pages → New → Town `Windsor`, slug `windsor` | Footer "Areas we cover"; `/accountants/windsor` |
| 2.14 | Campaign page | Campaign landing pages → New | `/lp/<slug>`; hidden from Google when noindex is ticked (view page source: `noindex`) |
| 2.15 | Quiz | Health-check quiz → change a question, add an answer, change a result band | `/tools/health-check` uses the new questions and scoring |
| 2.16 | Calculator rates | Calculator tax rates → change Dividend basic rate; tick *verified* | Calculator results change; the "Rates awaiting review" warning disappears |
| 2.17 | Email template | Email templates → lead_acknowledgement → change subject | Next enquiry's acknowledgement uses the new subject |
| 2.18 | Validation | Services → New → Save empty | Error "Required: Title, URL slug, …" |
| 2.19 | Duplicate slug | Services → New with slug `vat` | Error "An item with that slug or key already exists" |

### Media library
- [ ] Upload an image without alt text → error "Alt text is required"
- [ ] Upload with alt text → appears in the grid; **ID** button copies its id
- [ ] Upload a PDF → shows a file icon
- [ ] Upload a 5 MB file → error "larger than 4 MB"
- [ ] Delete → confirm → removed

### Redirects and 404 log
- [ ] Website → visit `http://localhost:3000/old-pricing-page` → branded 404 page
- [ ] Superadmin → **Tracking → 404 log** → `/old-pricing-page` with a hit count
- [ ] **Settings → Redirects → New** → From `/old-pricing-page`, To `/monthly-package` → Save → visit the old URL again within a minute → lands on Monthly package
- [ ] Redirects → **Import CSV** → paste `/test-a,/about,true` and `/test-b,/contact,true` → "Imported 2"
- [ ] Old WordPress URLs: `/commercial-accounting/`, `/individuals/`, `/services/accounting-and-corporation-tax/`, `/blog` all land on the new pages

### Users and roles
- [ ] **Users → Add a user** → `editor.test@example.com`, role **Editor**, password ≥ 12 characters
- [ ] Add `leads.test@example.com` with role **Lead manager**
- [ ] Sign out → sign in as the editor → sidebar has **no Leads/Reports/Users**; opening `http://localhost:3001/leads` shows an error, not data
- [ ] Sign in as the lead manager → **only** Dashboard, Leads, Reports, Monthly figures; can't erase leads (Erase button hidden)
- [ ] As owner: **Disable** the editor → editor can no longer sign in
- [ ] **Set password** for a user → they sign in with the new one
- [ ] Wrong password 6 times for one account → "Too many attempts. Try again in 15 minutes."
- [ ] Sign out → visiting `http://localhost:3001/leads` sends you to login

---

## Part 3 — Website checks

### 3.1 Pages and navigation
Visit each from the header/footer and check text, animations and the closing call-to-action:
- [ ] Home · Services · each of the 7 service pages · Monthly package · Who we help (+ a stage page + a sector page)
- [ ] Quarterly report → click each tab (Performance / Cash / Tax position / Business summary)
- [ ] Tools hub · Health check · Calculator · Guides · About · Reviews · Case studies · Resources (+ category filter + an article)
- [ ] Contact · Book a call · Privacy · Cookie policy · Accessibility · a local page · `/lp/switch-accountant`
- [ ] Header **Services** dropdown opens on hover and with the keyboard (Tab)

### 3.2 Mobile (DevTools → device toolbar → iPhone 12, or a real phone)
- [ ] Menu button opens/closes the full-screen menu; Esc closes it
- [ ] Sticky bottom bar **Enquire / Book a call** on every page
- [ ] No sideways scrolling on any page
- [ ] Forms are comfortable to tap (large buttons, correct keyboards for email/phone)

### 3.3 Tracking (needs IDs — skip until Ben's accounts exist)
1. Site settings → GA4 ID `G-XXXXXXX` (any test property) → Save
2. Private window → website → DevTools → **Network**, filter `google`
- [ ] Before consent: **no** requests to googletagmanager / google-analytics
- [ ] After **Accept all**: `gtag/js` loads
- [ ] Submit a lead → GA4 **DebugView** shows `generate_lead`; quiz → `quiz_complete`; calculator → `calculator_use`; download → `download`; tap phone number → `click_to_call`
- [ ] Reject all → reload → nothing loads

### 3.4 Smaller features
- [ ] **Exit offer** (desktop): stay on Home for 15+ seconds, move the mouse up out of the window → "Before you go…" popup. Shows once per 14 days; to see it again, DevTools → Application → Local storage → delete `ma_exit_offer`
- [ ] **Reduced motion:** macOS System Settings → Accessibility → Display → *Reduce motion* → website shows everything with no animations
- [ ] **Keyboard only:** Tab through Contact → "Skip to content" link appears first; every control is reachable with a visible teal focus ring
- [ ] **Backend down:** stop the backend → website pages still load (offline fallback); submitting a form shows a friendly error. Start it again.
- [ ] `http://localhost:3000/sitemap.xml` lists every page; `/robots.txt` points to it
- [ ] Share preview image: `http://localhost:3000/opengraph-image`

---

## Part 4 — Automated checks (2 minutes)

```bash
cd superadmin/backend && npm run smoke        # 10 end-to-end API checks — all ✔
cd frontend && npm test                       # calculator tax maths — 5 pass
npm run cron -- retention                     # (backend) GDPR clean-up job runs
```

---

## Part 5 — Clean up after testing
- [ ] Erase every `@example.com` lead (Leads → search `example.com` → open → Erase)
- [ ] Site settings → put the notification emails back to `enquiries@momentumaccounting.uk` and `ben@momentumaccounting.uk`
- [ ] Clear test SMTP, HQ and booking values from `superadmin/backend/.env`; restart the backend
- [ ] Delete test users, test redirects, the `2026-10` monthly figure and any test content
- [ ] Email templates: nurture_1 back to 1 day

# Superadmin guide for the Momentum team

Sign in at **admin.momentumaccounting.uk** (locally http://localhost:3001). Changes go live on the website within a minute.

## Roles

| Role | Can do |
|---|---|
| Owner | Everything, including users and erasing leads |
| Editor | Website content, media, settings |
| Lead manager | Leads and reports |

## Leads

- **Leads** lists every enquiry, quiz, calculator, download and booking. Filter by status, fit, type or date. **Export CSV** downloads the current view.
- Open a lead to see every answer, where they came from (page, campaign) and their activity history.
- Move it through the pipeline: **New → Contacted → Call booked → Proposal sent → Won / Lost**. Changing the status stops automatic follow-up emails.
- Add **notes** for the team.
- **Fit** is calculated automatically: *ideal* = limited company with £100k–£5m turnover.
- **HQ** shows whether the lead has reached Momentum HQ. Use **Resend to HQ** if it failed.
- Data requests: **Export this person's data** (subject access) or **Erase** (right to be forgotten, owners only).

## Website content

| To change… | Go to |
|---|---|
| Hero text, closing call-to-action or SEO title of a page | Page text & SEO → New page → choose the page |
| Services, what's included, FAQs | Services |
| "Who we help" situations and specialist sectors | Who we help |
| Testimonials | Reviews (set "Featured" to show first) |
| Team photos and bios | Team |
| Blog posts | Blog posts. Write in Markdown: `## Heading`, `- bullet`, `**bold**`, `[link](/contact)` |
| Case studies | Case studies |
| Phone, email, hours, social links, announcement bar | Site settings |
| Quiz questions and scoring | Health-check quiz |
| Downloads (PDFs) | Downloads → attach the PDF |
| Campaign pages for ads | Campaign landing pages → `/lp/<slug>` |
| Local area pages | Local pages → `/accountants/<slug>` |

Tips: untick **Published** to hide something without deleting it. Every save keeps a **history**; use **Restore** to roll back.

## Images

Upload in **Media library**. Always add alt text describing the image (for blind visitors and Google). Use photos at least 1600px wide; the site optimises them automatically.

## Monthly report

At the start of each month, add a row in **Monthly figures** (ad spend, management fees, GA4 visitors). **Reports** then shows leads, cost per lead and conversion to clients by month, source, campaign and page.

## Each April

Update **Calculator tax rates** for the new tax year and tick **Rates verified by the practice**.

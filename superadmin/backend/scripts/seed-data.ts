// Initial content for MongoDB. Real practice details and testimonials are taken from the current
// momentumaccounting.uk site; everything is editable in superadmin afterwards.

export const settings = {
  businessName: "Momentum Accounting",
  legalName: "Momentum Accounting Ltd",
  tagline: "Building financial momentum for your business.",
  email: "enquiries@momentumaccounting.uk",
  phone: "020 3582 6426",
  hours: "Mon–Fri, 9:00am–5:00pm",
  streetAddress: "",
  locality: "Ashford",
  region: "Surrey",
  postcode: "",
  companyNumber: "",
  accreditation: "CPAA (Certified Public Accountants Association) registered and accredited",
  instagram: "https://www.instagram.com/ben_momentum",
  tiktok: "",
  linkedin: "https://www.linkedin.com/company/momentum-accounting",
  facebook: "https://www.facebook.com/profile.php?id=61557315509157",
  socialPosts: [],
  googleReviewsUrl: "",
  bookingUrl: "",
  announcement: "",
  notificationEmails: ["enquiries@momentumaccounting.uk", "ben@momentumaccounting.uk"],
  leadRetentionMonths: 24,
};

export const services = [
  {
    slug: "bookkeeping",
    title: "Bookkeeping",
    icon: "book",
    short: "Accurate, up-to-date books so you always know where you stand.",
    intro:
      "Your books are the foundation of everything else we do. We keep them accurate and current, so your quarterly accounts, tax position and decisions are built on numbers you can trust.",
    includes: [
      "Bank feeds reconciled and transactions categorised",
      "Sales and purchase ledgers kept tidy",
      "Cloud accounting software set up and managed",
      "Receipts and invoices captured digitally",
      "Queries handled by a named person who knows your business",
    ],
    why: "Most accountants only look at your books once a year. We keep them current every month, which is why we can tell you your position every quarter.",
    faqs: [
      { q: "Which accounting software do you use?", a: "We work with the leading cloud platforms and will recommend the best fit for your business. If you already use one, we can usually keep it." },
      { q: "Do I need to change how I record expenses?", a: "We'll set up a simple routine that suits you, typically snapping receipts on your phone. We take care of the rest." },
    ],
  },
  {
    slug: "quarterly-management-accounts",
    title: "Quarterly management accounts",
    icon: "chart",
    short: "A clear quarterly report and business summary, in plain English.",
    intro:
      "Every quarter you receive a full set of management accounts plus our standout quarterly report and business summary. It explains how your business is performing, what has changed and what it means for you.",
    includes: [
      "Profit and loss, balance sheet and cash position",
      "A plain-English business summary",
      "Key trends compared with previous quarters",
      "Your personal and business tax position",
      "A review conversation if you'd like one",
    ],
    why: "Four times a year you get a clear picture of your business, not once a year when it's too late to act.",
    faqs: [
      { q: "What does the quarterly report look like?", a: "Take a look at our quarterly report page for a walkthrough of a sample report." },
      { q: "Is this included in the monthly fee?", a: "Yes. Quarterly accounts and the report are a core part of the full monthly package." },
    ],
  },
  {
    slug: "year-end-accounts-corporation-tax",
    title: "Year-end accounts & corporation tax",
    icon: "calendar",
    short: "Filed within three months of your year end. No last-minute panic.",
    intro:
      "Because your books and quarterly accounts are already up to date, your year-end accounts and corporation tax return are prepared quickly and filed within three months of your year end.",
    includes: [
      "Statutory accounts prepared and filed with Companies House",
      "Corporation tax computation and CT600 filed with HMRC",
      "Tax reliefs and allowances reviewed",
      "Clear explanation of what you owe and when",
    ],
    why: "No surprises. You'll already know your tax position from your quarterly accounts long before the bill is due.",
    faqs: [{ q: "Why within three months?", a: "Filing early gives you certainty and time to plan payments. Your deadlines are later, but there's no reason to wait." }],
  },
  {
    slug: "vat",
    title: "VAT",
    icon: "receipt",
    short: "VAT returns prepared, checked and filed under Making Tax Digital.",
    intro: "We prepare and file your VAT returns under Making Tax Digital, and help you choose the right VAT scheme for your business.",
    includes: ["VAT registration where needed", "Quarterly VAT returns prepared and filed", "Advice on the right VAT scheme", "Help with HMRC queries"],
    why: "VAT is reviewed alongside your books, so returns are accurate and on time, with no separate scramble each quarter.",
    faqs: [{ q: "Do I need to register for VAT?", a: "It depends on your taxable turnover and the kind of business you run. We'll check and advise as part of your onboarding." }],
  },
  {
    slug: "payroll",
    title: "Payroll",
    icon: "users",
    short: "Payroll, payslips, RTI and pensions, handled every month.",
    intro: "From a single director's salary to a growing team, we run your payroll accurately and on time, including RTI submissions and workplace pension duties.",
    includes: ["Monthly payroll and payslips", "RTI submissions to HMRC", "Auto-enrolment pension administration", "P60s, P11Ds and starters and leavers"],
    why: "Payroll is joined up with your bookkeeping and tax planning, so salaries are set efficiently and recorded correctly.",
    faqs: [{ q: "Can you take over payroll mid-year?", a: "Yes. We'll handle the handover from your current provider so nothing is missed." }],
  },
  {
    slug: "self-assessment",
    title: "Self assessment",
    icon: "user",
    short: "Personal tax returns for directors, done properly and early.",
    intro:
      "As a director your personal tax is closely linked to your company. We prepare your self assessment return with full knowledge of your salary, dividends and other income, including property income and capital gains.",
    includes: ["Personal tax return prepared and filed", "Dividend and salary income reconciled", "Property income and capital gains", "Payments on account explained", "Reminders well ahead of deadlines"],
    why: "We already know your personal tax position from your quarterly accounts, so January holds no surprises.",
    faqs: [{ q: "Can you do my partner's return too?", a: "Yes, we can look after household returns where it makes sense." }],
  },
  {
    slug: "tax-planning",
    title: "Tax planning",
    icon: "compass",
    short: "Proactive planning so you keep more of what you earn.",
    intro:
      "Tax planning isn't a once-a-year conversation. We review your position every quarter and plan ahead: how to pay yourself, when to invest, property, capital gains and inheritance tax.",
    includes: ["Salary and dividend planning", "Reliefs and allowances reviewed every quarter", "Planning for growth, investment and exit", "Capital gains and inheritance tax advice"],
    why: "Because we see your numbers every quarter, we can spot opportunities while there's still time to act on them.",
    faqs: [{ q: "Is tax planning included?", a: "Ongoing tax planning is part of the full monthly package." }],
  },
].map((s, i) => ({ ...s, order: i, published: true }));

const stages = [
  {
    slug: "growing-limited-companies",
    title: "Growing limited companies",
    icon: "trending",
    short: "Turnover between £100k and £1m and ready for the next stage.",
    pains: ["You only see your real numbers once a year", "Tax bills arrive as a surprise", "You're making growth decisions on gut feel"],
    help: ["Quarterly accounts and a plain-English report", "Your tax position every quarter", "Planning conversations before decisions, not after"],
  },
  {
    slug: "scaling-to-5-million",
    title: "Scaling towards £5m",
    icon: "rocket",
    short: "Established businesses building towards £5m turnover.",
    pains: ["Your finance needs have outgrown your accountant", "You need clearer reporting for the team or the bank", "Payroll, VAT and tax are getting more complex"],
    help: ["Management accounts you can actually use", "Joined-up payroll, VAT and tax", "A team that scales with you"],
  },
  {
    slug: "switching-accountant",
    title: "Switching accountant",
    icon: "switch",
    short: "Unhappy with slow replies, surprise bills or once-a-year contact?",
    pains: ["Emails take days to get a reply", "You don't know what you'll owe until it's too late", "You feel like just another number"],
    help: ["We handle the switch with your current accountant", "A named team who know your business", "One fixed monthly fee, no surprise invoices"],
  },
  {
    slug: "new-limited-companies",
    title: "New limited companies",
    icon: "building",
    short: "Starting out as a limited company and want to get it right from day one.",
    pains: ["Not sure how to pay yourself tax-efficiently", "Unsure what you need to file and when", "Want good habits from the start"],
    help: ["Set-up of software, payroll and VAT", "Clear salary and dividend plan", "All deadlines handled for you"],
  },
].map((a) => ({ ...a, kind: "stage" }));

// Specialist sectors listed on the current website.
const sectors = [
  {
    slug: "film-and-media",
    title: "Film & media",
    icon: "film",
    short: "Production companies, freelancers' limited companies and creative agencies.",
    pains: ["Project-based income makes cash flow hard to predict", "Unsure which reliefs apply to your productions", "Mixing personal and company spending on kit"],
    help: ["Quarterly view of profit by project", "Advice on reliefs and allowable costs", "Clear rules for equipment and expenses"],
  },
  {
    slug: "construction",
    title: "Construction",
    icon: "hardhat",
    short: "Contractors and trades running limited companies.",
    pains: ["CIS deductions and refunds are confusing", "Materials and labour costs squeeze margins", "VAT domestic reverse charge rules"],
    help: ["CIS returns and refunds handled", "Job and margin visibility every quarter", "VAT reverse charge set up correctly"],
  },
  {
    slug: "it-and-technology",
    title: "IT & technology",
    icon: "laptop",
    short: "IT contractors, consultancies and software businesses.",
    pains: ["IR35 status and how to pay yourself", "Growing from contractor to consultancy", "Claiming the right expenses and equipment"],
    help: ["Salary and dividend planning every quarter", "Support as you grow and hire", "R&D and capital allowances reviewed"],
  },
  {
    slug: "consultancy",
    title: "Consultancy",
    icon: "briefcase",
    short: "Independent consultants and growing consultancy firms.",
    pains: ["Lumpy income from retainers and projects", "Pension and tax planning as a director", "Little time for admin"],
    help: ["Cash and tax position every quarter", "Director pay and pension planning", "Bookkeeping taken off your plate"],
  },
  {
    slug: "aviation",
    title: "Aviation",
    icon: "plane",
    short: "Pilots, crew and aviation service companies.",
    pains: ["Irregular schedules and overseas work", "Training and licence costs", "Complex expenses and allowances"],
    help: ["Clear treatment of training and allowances", "Personal and company tax joined up", "A team that understands the industry"],
  },
  {
    slug: "health-and-fitness",
    title: "Health & fitness",
    icon: "heart",
    short: "Personal trainers, studios, gyms and wellness businesses.",
    pains: ["Memberships and class income to reconcile", "Staff and freelance instructor payroll", "Growing to a second site"],
    help: ["Bookkeeping that matches your booking systems", "Payroll and contractor checks", "Quarterly numbers to plan your next step"],
  },
].map((a) => ({ ...a, kind: "sector" }));

export const audiences = [...stages, ...sectors].map((a, i) => ({ ...a, order: i, published: true }));

export const testimonials = [
  {
    quote:
      "Ben Keville is an absolute joy to have as an accountant, he goes way above any expectations and nothing is too much for him. I could not recommend him and his company enough - you will not be disappointed!",
    name: "Charles English",
    company: "CJE Construction Ltd",
    role: "Director",
    rating: 5,
    featured: true,
  },
  {
    quote:
      "Mr Benjamin Keville is an outstanding accountant with a great wealth of knowledge. For someone like myself who is new to managing a business, he went the extra mile to help me understand everything I needed to know and every step of the process. I would recommend his company to all.",
    name: "Daniel Moore",
    company: "The Pine Prodigy Ltd",
    role: "Director",
    rating: 5,
    featured: false,
  },
  {
    quote: "Ben is a fantastic accountant with a personal and unique touch - which is hard to come by these days! Highly recommend to all.",
    name: "Zoe Scaddan",
    company: "SCAD Productions Ltd",
    role: "Director",
    rating: 5,
    featured: false,
  },
].map((t, i) => ({ ...t, order: i, published: true }));

export const team = [
  {
    name: "Ben Keville",
    role: "Founder & Director",
    bio: "Ben founded Momentum to give growing businesses the clarity and personal service he felt was missing from traditional accounting. Clients say he goes above and beyond, and nothing is too much trouble.",
    order: 0,
    published: true,
  },
];

export const faqs = [
  { q: "How does the monthly fee work?", a: "You pay one fixed monthly subscription that covers the full service. The fee is agreed up front based on the size and needs of your business, so there are no surprise invoices." },
  { q: "Who do you work with?", a: "Mainly UK limited companies with turnover between £100k and £5m whose directors want to understand their numbers and grow." },
  { q: "How hard is it to switch accountant?", a: "Not hard at all. We contact your current accountant, collect everything we need and handle the handover for you." },
  { q: "Do I have to be local to Ashford?", a: "No. We're based in Ashford, Surrey and work with businesses across Surrey, London and the rest of the UK, meeting in person or online." },
  { q: "What happens on the introductory call?", a: "A relaxed 20–30 minute conversation about your business, what you need and whether we're the right fit. No obligation." },
].map((f, i) => ({ ...f, order: i, published: true }));

export const posts = [
  {
    slug: "why-quarterly-accounts-matter",
    title: "Why quarterly accounts matter for growing businesses",
    excerpt: "Once-a-year accounts tell you what happened. Quarterly accounts let you do something about it.",
    category: "Growth",
    date: new Date("2026-09-15"),
    readMins: 4,
    body: `Most small businesses see their real numbers once a year, months after the year has ended. By then, the opportunities to change the outcome have passed.

## Decisions need current numbers

Hiring, pricing, investing and how you pay yourself are all decisions that depend on how the business is performing now, not eighteen months ago.

## No more tax surprises

With accounts every quarter, your tax position is calculated as you go. You know what's coming and can plan for it.

## Spot trends early

Comparing quarter to quarter shows margin changes, cash pressure and growth early enough to act.`,
  },
  {
    slug: "paying-yourself-as-a-director",
    title: "Paying yourself as a director: the basics",
    excerpt: "Salary, dividends or both? The right mix depends on your circumstances. Here's how to think about it.",
    category: "Tax",
    date: new Date("2026-08-28"),
    readMins: 5,
    body: `As a director of a limited company you can usually pay yourself through a combination of salary and dividends. Each is taxed differently.

## Salary

Salary is paid through payroll and is a business expense. Setting it at the right level can protect your state pension record and be tax-efficient.

## Dividends

Dividends are paid from profits after corporation tax and are taxed differently in your hands. They can only be paid when the company has enough retained profit.

## Review it regularly

Tax rates, thresholds and your own circumstances change. We review your mix every quarter so it stays right for you. Try our [salary and dividend calculator](/tools/salary-dividend-calculator) for a quick illustration.`,
  },
  {
    slug: "switching-accountant-checklist",
    title: "Switching accountant? A simple checklist",
    excerpt: "Changing accountant is easier than most people think. Here's what happens and when.",
    category: "Guides",
    date: new Date("2026-08-10"),
    readMins: 3,
    body: `Many business owners stay with an accountant they're unhappy with because switching sounds complicated. It isn't.

## 1. Choose your new accountant

Look for clear pricing, regular contact and someone who explains things in plain English.

## 2. Let them handle the handover

Your new accountant requests the information they need from your old one through a standard professional clearance process.

## 3. Get set up

Software, bank feeds and HMRC authorisations are set up, and you're introduced to your new team.`,
  },
].map((p) => ({ ...p, author: "Momentum Accounting", published: true }));

export const locations = [
  {
    town: "Ashford",
    slug: "ashford",
    intro: "Our home. Momentum Accounting is based in Ashford, Surrey, and many of our clients are businesses right here in town and the surrounding villages.",
    body: `## Your local accountant in Ashford

Being local means we can meet you in person when it helps, and we understand the businesses that make up the area, from trades and construction firms to consultants and creative companies.

## What Ashford businesses get from us

- Quarterly management accounts and a plain-English report
- Your tax position every quarter, so there are no surprises
- Year-end accounts and corporation tax filed within three months
- One fixed monthly fee`,
  },
  {
    town: "Staines-upon-Thames",
    slug: "staines-upon-thames",
    intro: "Accountants for limited companies in Staines-upon-Thames, a few minutes from our Ashford base.",
    body: `## Supporting Staines businesses

Staines is home to a busy mix of offices, retailers and service businesses. Whether you're a growing limited company or switching from an accountant you only hear from once a year, we can help.

## Meet in person or online

We're close enough to sit down with you when it matters, and just as happy to work entirely online.`,
  },
  {
    town: "Sunbury-on-Thames",
    slug: "sunbury-on-thames",
    intro: "Modern accounting for Sunbury-on-Thames limited companies, with your numbers every quarter.",
    body: `## Clarity for Sunbury directors

Directors in Sunbury tell us the same thing: they want to know where they stand before the year end, not after. That's exactly what our quarterly accounts and business summary provide.

## A personal service

You'll have a small team who know your business, reply quickly and explain things in plain English.`,
  },
  {
    town: "Egham",
    slug: "egham",
    intro: "Accounting and tax for growing limited companies in Egham and Englefield Green.",
    body: `## Helping Egham businesses grow

From consultancies to technology firms, we help Egham businesses understand their numbers and plan for growth with quarterly reporting and proactive tax planning.

## Switching is simple

We handle the handover from your current accountant, so there's nothing complicated for you to do.`,
  },
  {
    town: "Feltham",
    slug: "feltham",
    intro: "Accountants for Feltham limited companies and contractors, close to Heathrow and our Ashford office.",
    body: `## Accounting for Feltham businesses

Many Feltham businesses work around Heathrow, in aviation, logistics and trades. We understand irregular income, CIS and the expenses that come with it.

## One fixed monthly fee

Bookkeeping, quarterly accounts, year-end, VAT, payroll and tax, all for one agreed monthly price.`,
  },
].map((l, i) => ({ ...l, order: i, published: true }));

export const landingPages = [
  {
    slug: "switch-accountant",
    headline: "Only hear from your accountant once a year?",
    subheadline: "Switch to quarterly accounts, your tax position every quarter and a team that replies. We handle the move for you.",
    bullets: ["Free introductory call", "We handle the handover from your current accountant", "One fixed monthly fee, no surprises"],
    formIntent: "call-request",
    noindex: true,
    published: true,
  },
];

export const leadMagnets = [
  {
    slug: "sample-quarterly-report",
    title: "Sample quarterly report",
    description: "See exactly what our clients receive every quarter: management accounts, a plain-English business summary and their tax position.",
    bullets: ["Anonymised real-world example", "Performance, cash and tax sections", "The written business summary"],
    order: 0,
    published: true,
  },
  {
    slug: "director-pay-guide",
    title: "The director's guide to paying yourself",
    description: "A practical guide to salary, dividends and pensions for limited company directors.",
    bullets: ["Salary vs dividends explained", "Key dates and thresholds", "Common mistakes to avoid"],
    order: 1,
    published: true,
  },
];

const answers = (pairs: [string, number][]) => pairs.map(([label, score]) => ({ label, score }));

// Rebuild of the "Do you have the right accountant?" quiz previously on ScoreApp.
export const quiz = {
  title: "Do you have the right accountant?",
  intro: "Answer eight quick questions to see how well your current accountant is supporting your business. It takes under a minute.",
  questions: [
    { question: "How often do you receive management accounts?", category: "Visibility", answers: answers([["Every quarter or more often", 10], ["Twice a year", 6], ["Only at year end", 2], ["Never", 0]]) },
    { question: "Do you know roughly how much tax you'll owe this year?", category: "Tax", answers: answers([["Yes, to the nearest pound", 10], ["A rough idea", 5], ["No idea until the bill arrives", 0]]) },
    { question: "How quickly does your accountant usually reply?", category: "Service", answers: answers([["The same day", 10], ["Within a couple of days", 7], ["Within a week", 3], ["Longer, or I have to chase", 0]]) },
    { question: "When are your year-end accounts usually filed?", category: "Service", answers: answers([["Within three months of year end", 10], ["Within six months", 7], ["Close to the deadline", 3], ["Late, or we've had penalties", 0]]) },
    { question: "Has your accountant suggested ways to save tax in the last year?", category: "Tax", answers: answers([["Yes, several times", 10], ["Once", 6], ["No", 0]]) },
    { question: "Do you understand your accounts when you receive them?", category: "Visibility", answers: answers([["Yes, completely", 10], ["Mostly", 6], ["Not really", 2]]) },
    { question: "How do you pay for your accountant?", category: "Service", answers: answers([["A fixed monthly fee", 10], ["A fixed annual fee", 6], ["Hourly or unexpected invoices", 2]]) },
    { question: "Does your accountant understand your goals for growth?", category: "Growth", answers: answers([["Yes, we plan together", 10], ["Somewhat", 5], ["No", 0]]) },
  ],
  bands: [
    { min: 0, max: 49, title: "Time for a change", text: "Your accountant isn't giving you the visibility or support a growing business needs. A quarterly service with your tax position every quarter would make a big difference." },
    { min: 50, max: 79, title: "Room for improvement", text: "Some things are working, but there are gaps, usually around regular reporting and proactive tax planning. Let's talk about what better could look like." },
    { min: 80, max: 100, title: "You're in good hands", text: "Your accountant is doing a good job. If you're planning significant growth, it's still worth checking you'll have the support you need." },
  ],
};

// 2026/27 figures. MUST be checked and signed off by the practice before launch (MA-054).
export const calculator = {
  taxYear: "2026/27",
  verified: false,
  personalAllowance: 12570,
  basicRateBand: 37700,
  additionalRateThreshold: 125140,
  basicRate: 20,
  higherRate: 40,
  additionalRate: 45,
  dividendAllowance: 500,
  dividendBasicRate: 10.75,
  dividendHigherRate: 35.75,
  dividendAdditionalRate: 39.35,
  employeeNiThreshold: 12570,
  employeeNiUpperLimit: 50270,
  employeeNiRate: 8,
  employeeNiUpperRate: 2,
  employerNiThreshold: 5000,
  employerNiRate: 15,
  ctSmallProfitsRate: 19,
  ctMainRate: 25,
  ctLowerLimit: 50000,
  ctUpperLimit: 250000,
};

export const emailTemplates = [
  {
    key: "lead_acknowledgement",
    subject: "Thanks for getting in touch, {{name}}",
    body: `Hi {{name}},

Thanks for contacting Momentum Accounting. We've received your details and a member of the team will be in touch, usually within one working day.

If you'd like to speak sooner, you can book a free introductory call here: [Book a call]({{bookingUrl}})

Kind regards,
**The Momentum Accounting team**`,
    delayDays: 0,
  },
  {
    key: "team_notification",
    subject: "New website lead: {{name}} ({{businessName}})",
    body: `A new lead has come in from the website.

{{leadSummary}}

[Open in superadmin]({{adminLeadUrl}})`,
    delayDays: 0,
  },
  {
    key: "download_delivery",
    subject: "Your download from Momentum Accounting",
    body: `Hi {{name}},

Thanks for your interest. Here's your download: [Download now]({{downloadUrl}})

The link works for 7 days. If you have any questions, just reply to this email, or [book a free call]({{bookingUrl}}).

Kind regards,
**The Momentum Accounting team**`,
    delayDays: 0,
  },
  {
    key: "nurture_1",
    subject: "What our clients get every quarter",
    body: `Hi {{name}},

Most business owners only see their numbers once a year. Our clients get a quarterly report and business summary, plus their tax position, four times a year.

Want to see how that would work for {{businessName}}? [Book a free 20-minute call]({{bookingUrl}}).

**The Momentum Accounting team**`,
    delayDays: 1,
  },
  {
    key: "nurture_2",
    subject: "No more surprise tax bills",
    body: `Hi {{name}},

"There are no unwanted surprises for our clients." It's the promise we're proudest of. Because we prepare accounts every quarter, you always know your personal and business tax position.

[Book your introductory call]({{bookingUrl}})

**The Momentum Accounting team**`,
    delayDays: 3,
  },
  {
    key: "nurture_3",
    subject: "Switching accountant is easier than you think",
    body: `Hi {{name}},

If you're with another accountant, we handle the handover for you: professional clearance, software and HMRC authorisations. You don't need to do anything complicated.

[Talk to us about switching]({{bookingUrl}})

**The Momentum Accounting team**`,
    delayDays: 4,
  },
  {
    key: "nurture_4",
    subject: "Shall we have a quick chat?",
    body: `Hi {{name}},

Just checking in. If now isn't the right time, no problem at all. If you'd like a no-obligation chat about your business, you can [pick a time here]({{bookingUrl}}).

**The Momentum Accounting team**`,
    delayDays: 7,
  },
].map((t) => ({ ...t, active: true }));

// Old WordPress URLs → new pages (MA-115). Unchanged paths (/about/, /contact/ …) are handled by the
// website's trailing-slash normalisation.
export const redirects = [
  { from: "/services/accounting-and-corporation-tax", to: "/services/year-end-accounts-corporation-tax", permanent: true },
  { from: "/commercial-accounting", to: "/monthly-package", permanent: true },
  { from: "/individuals", to: "/services/self-assessment", permanent: true },
  { from: "/blog", to: "/resources", permanent: true },
];

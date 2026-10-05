// Every editable content type is defined once here. The definition drives the
// Mongoose model, the admin + public API and the superadmin forms (via /api/admin/schema).

export type Role = "owner" | "editor" | "leads";

export type Field = {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "markdown"
    | "number"
    | "boolean"
    | "select"
    | "list" // string[]
    | "image" // media id
    | "file" // media id
    | "date"
    | "objectList"; // array of objects described by `fields`
  required?: boolean;
  options?: string[];
  fields?: Field[];
  help?: string;
  default?: unknown;
};

export type Resource = {
  key: string;
  label: string;
  singular: string;
  group: "Content" | "Lead generation" | "Settings" | "Tracking";
  roles: Role[];
  fields: Field[];
  singleton?: boolean;
  /** Field used for public lookups and URLs */
  slugField?: string;
  /** Field shown as the title in admin lists */
  titleField: string;
  /** Columns shown in admin lists */
  listFields?: string[];
  sort?: Record<string, 1 | -1>;
  /** Exposed (published items only, where applicable) through /api/public/site */
  public?: boolean;
  readOnly?: boolean;
  /** Changes trigger revalidation of the public website */
  revalidates?: boolean;
};

const ICONS = ["book", "chart", "calendar", "receipt", "users", "user", "compass", "rocket", "trending", "switch", "building", "briefcase", "film", "hardhat", "laptop", "plane", "heart", "home"];

const published: Field = { name: "published", label: "Published", type: "boolean", default: true };
const order: Field = { name: "order", label: "Order", type: "number", default: 0, help: "Lower numbers appear first" };
const seo: Field[] = [
  { name: "seoTitle", label: "SEO title", type: "text", help: "Shown in Google results. Leave blank to use the page title." },
  { name: "seoDescription", label: "SEO description", type: "textarea", help: "About 150 characters." },
];
const faqField: Field = {
  name: "faqs",
  label: "FAQs",
  type: "objectList",
  fields: [
    { name: "q", label: "Question", type: "text", required: true },
    { name: "a", label: "Answer", type: "textarea", required: true },
  ],
};

export const resources: Resource[] = [
  {
    key: "services",
    label: "Services",
    singular: "Service",
    group: "Content",
    roles: ["owner", "editor"],
    slugField: "slug",
    titleField: "title",
    listFields: ["title", "slug", "published"],
    sort: { order: 1 },
    public: true,
    revalidates: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true, help: "e.g. bookkeeping → /services/bookkeeping" },
      { name: "icon", label: "Icon", type: "select", options: ICONS, default: "book" },
      { name: "short", label: "Short description", type: "textarea", required: true },
      { name: "intro", label: "Introduction", type: "textarea", required: true },
      { name: "includes", label: "What's included", type: "list" },
      { name: "why", label: "Why Momentum", type: "textarea" },
      faqField,
      order,
      published,
      ...seo,
    ],
  },
  {
    key: "audiences",
    label: "Who we help",
    singular: "Audience page",
    group: "Content",
    roles: ["owner", "editor"],
    slugField: "slug",
    titleField: "title",
    listFields: ["title", "kind", "published"],
    sort: { order: 1 },
    public: true,
    revalidates: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "kind", label: "Type", type: "select", options: ["stage", "sector"], default: "stage" },
      { name: "icon", label: "Icon", type: "select", options: ICONS, default: "trending" },
      { name: "short", label: "Short description", type: "textarea", required: true },
      { name: "pains", label: "Pain points (\"Sound familiar?\")", type: "list" },
      { name: "help", label: "How we help", type: "list" },
      order,
      published,
      ...seo,
    ],
  },
  {
    key: "testimonials",
    label: "Reviews",
    singular: "Review",
    group: "Content",
    roles: ["owner", "editor"],
    titleField: "name",
    listFields: ["name", "company", "featured", "published"],
    sort: { order: 1 },
    public: true,
    revalidates: true,
    fields: [
      { name: "quote", label: "Quote", type: "textarea", required: true },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "company", label: "Company", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "service", label: "Related service slug", type: "text", help: "Shows this review on that service page" },
      { name: "rating", label: "Star rating", type: "number", default: 5 },
      { name: "photo", label: "Photo", type: "image" },
      { name: "featured", label: "Featured", type: "boolean", default: false },
      order,
      published,
    ],
  },
  {
    key: "caseStudies",
    label: "Case studies",
    singular: "Case study",
    group: "Content",
    roles: ["owner", "editor"],
    slugField: "slug",
    titleField: "title",
    listFields: ["title", "client", "published"],
    sort: { order: 1 },
    public: true,
    revalidates: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "client", label: "Client / business", type: "text" },
      { name: "sector", label: "Sector", type: "text" },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "challenge", label: "The challenge", type: "markdown" },
      { name: "solution", label: "What we did", type: "markdown" },
      { name: "results", label: "Results", type: "list" },
      { name: "quote", label: "Client quote", type: "textarea" },
      { name: "quoteName", label: "Quote attribution", type: "text" },
      { name: "image", label: "Image", type: "image" },
      order,
      published,
      ...seo,
    ],
  },
  {
    key: "posts",
    label: "Blog posts",
    singular: "Post",
    group: "Content",
    roles: ["owner", "editor"],
    slugField: "slug",
    titleField: "title",
    listFields: ["title", "category", "date", "published"],
    sort: { date: -1 },
    public: true,
    revalidates: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
      { name: "category", label: "Category", type: "select", options: ["Growth", "Tax", "Guides", "News"], default: "Guides" },
      { name: "date", label: "Publish date", type: "date", required: true },
      { name: "author", label: "Author", type: "text", default: "Momentum Accounting" },
      { name: "readMins", label: "Read time (minutes)", type: "number", default: 4 },
      { name: "cover", label: "Cover image", type: "image" },
      { name: "body", label: "Article", type: "markdown", required: true, help: "Markdown: ## for headings, - for bullet points" },
      published,
      ...seo,
    ],
  },
  {
    key: "team",
    label: "Team",
    singular: "Team member",
    group: "Content",
    roles: ["owner", "editor"],
    titleField: "name",
    listFields: ["name", "role", "published"],
    sort: { order: 1 },
    public: true,
    revalidates: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "photo", label: "Photo", type: "image" },
      { name: "linkedin", label: "LinkedIn URL", type: "text" },
      order,
      published,
    ],
  },
  {
    key: "faqs",
    label: "FAQs",
    singular: "FAQ",
    group: "Content",
    roles: ["owner", "editor"],
    titleField: "q",
    listFields: ["q", "published"],
    sort: { order: 1 },
    public: true,
    revalidates: true,
    fields: [
      { name: "q", label: "Question", type: "text", required: true },
      { name: "a", label: "Answer", type: "textarea", required: true },
      order,
      published,
    ],
  },
  {
    key: "pages",
    label: "Page text & SEO",
    singular: "Page",
    group: "Content",
    roles: ["owner", "editor"],
    slugField: "key",
    titleField: "key",
    listFields: ["key", "heroTitle"],
    sort: { key: 1 },
    public: true,
    revalidates: true,
    fields: [
      {
        name: "key",
        label: "Page",
        type: "select",
        required: true,
        options: ["home", "services", "monthly-package", "who-we-help", "quarterly-report", "about", "reviews", "case-studies", "resources", "contact", "book-a-call", "tools", "guides"],
      },
      { name: "heroEyebrow", label: "Hero eyebrow", type: "text" },
      { name: "heroTitle", label: "Hero title", type: "text" },
      { name: "heroText", label: "Hero text", type: "textarea" },
      { name: "ctaTitle", label: "Closing call-to-action title", type: "text" },
      { name: "ctaText", label: "Closing call-to-action text", type: "textarea" },
      { name: "ogImage", label: "Social share image", type: "image" },
      ...seo,
    ],
  },
  {
    key: "locations",
    label: "Local pages",
    singular: "Local page",
    group: "Content",
    roles: ["owner", "editor"],
    slugField: "slug",
    titleField: "town",
    listFields: ["town", "slug", "published"],
    sort: { order: 1 },
    public: true,
    revalidates: true,
    fields: [
      { name: "town", label: "Town", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true, help: "e.g. staines → /accountants/staines" },
      { name: "intro", label: "Introduction", type: "textarea", required: true },
      { name: "body", label: "Page content", type: "markdown", help: "Unique local content — avoid copying between towns" },
      order,
      published,
      ...seo,
    ],
  },
  {
    key: "landingPages",
    label: "Campaign landing pages",
    singular: "Landing page",
    group: "Lead generation",
    roles: ["owner", "editor"],
    slugField: "slug",
    titleField: "headline",
    listFields: ["headline", "slug", "published"],
    public: true,
    revalidates: true,
    fields: [
      { name: "slug", label: "URL slug", type: "text", required: true, help: "Page lives at /lp/<slug>" },
      { name: "headline", label: "Headline", type: "text", required: true },
      { name: "subheadline", label: "Subheadline", type: "textarea" },
      { name: "bullets", label: "Key points", type: "list" },
      { name: "formIntent", label: "Form", type: "select", options: ["enquiry", "call-request"], default: "call-request" },
      { name: "noindex", label: "Hide from Google (noindex)", type: "boolean", default: true },
      published,
    ],
  },
  {
    key: "leadMagnets",
    label: "Downloads",
    singular: "Download",
    group: "Lead generation",
    roles: ["owner", "editor"],
    slugField: "slug",
    titleField: "title",
    listFields: ["title", "slug", "published"],
    sort: { order: 1 },
    public: true,
    revalidates: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "bullets", label: "What's inside", type: "list" },
      { name: "cover", label: "Cover image", type: "image" },
      { name: "file", label: "File (PDF)", type: "file", help: "Sent to the visitor by email link — never public" },
      order,
      published,
    ],
  },
  {
    key: "quiz",
    label: "Health-check quiz",
    singular: "Quiz",
    group: "Lead generation",
    roles: ["owner", "editor"],
    singleton: true,
    titleField: "title",
    public: true,
    revalidates: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "intro", label: "Introduction", type: "textarea" },
      {
        name: "questions",
        label: "Questions",
        type: "objectList",
        fields: [
          { name: "question", label: "Question", type: "text", required: true },
          { name: "category", label: "Category", type: "select", options: ["Visibility", "Tax", "Service", "Growth"] },
          {
            name: "answers",
            label: "Answers",
            type: "objectList",
            fields: [
              { name: "label", label: "Answer", type: "text", required: true },
              { name: "score", label: "Score (0–10)", type: "number", required: true },
            ],
          },
        ],
      },
      {
        name: "bands",
        label: "Result bands",
        type: "objectList",
        help: "Matched on percentage score",
        fields: [
          { name: "min", label: "From %", type: "number", required: true },
          { name: "max", label: "To %", type: "number", required: true },
          { name: "title", label: "Result title", type: "text", required: true },
          { name: "text", label: "Result text", type: "textarea", required: true },
        ],
      },
    ],
  },
  {
    key: "calculator",
    label: "Calculator tax rates",
    singular: "Tax rates",
    group: "Lead generation",
    roles: ["owner", "editor"],
    singleton: true,
    titleField: "taxYear",
    public: true,
    revalidates: true,
    fields: [
      { name: "taxYear", label: "Tax year", type: "text", required: true },
      { name: "verified", label: "Rates verified by the practice", type: "boolean", default: false },
      { name: "personalAllowance", label: "Personal allowance (£)", type: "number", required: true },
      { name: "basicRateBand", label: "Basic rate band (£)", type: "number", required: true },
      { name: "additionalRateThreshold", label: "Additional rate threshold (£)", type: "number", required: true },
      { name: "basicRate", label: "Income tax basic rate (%)", type: "number", required: true },
      { name: "higherRate", label: "Income tax higher rate (%)", type: "number", required: true },
      { name: "additionalRate", label: "Income tax additional rate (%)", type: "number", required: true },
      { name: "dividendAllowance", label: "Dividend allowance (£)", type: "number", required: true },
      { name: "dividendBasicRate", label: "Dividend basic rate (%)", type: "number", required: true },
      { name: "dividendHigherRate", label: "Dividend higher rate (%)", type: "number", required: true },
      { name: "dividendAdditionalRate", label: "Dividend additional rate (%)", type: "number", required: true },
      { name: "employeeNiThreshold", label: "Employee NI primary threshold (£)", type: "number", required: true },
      { name: "employeeNiUpperLimit", label: "Employee NI upper earnings limit (£)", type: "number", required: true },
      { name: "employeeNiRate", label: "Employee NI main rate (%)", type: "number", required: true },
      { name: "employeeNiUpperRate", label: "Employee NI rate above UEL (%)", type: "number", required: true },
      { name: "employerNiThreshold", label: "Employer NI secondary threshold (£)", type: "number", required: true },
      { name: "employerNiRate", label: "Employer NI rate (%)", type: "number", required: true },
      { name: "ctSmallProfitsRate", label: "Corporation tax small profits rate (%)", type: "number", required: true },
      { name: "ctMainRate", label: "Corporation tax main rate (%)", type: "number", required: true },
      { name: "ctLowerLimit", label: "CT lower limit (£)", type: "number", required: true },
      { name: "ctUpperLimit", label: "CT upper limit (£)", type: "number", required: true },
    ],
  },
  {
    key: "emailTemplates",
    label: "Email templates",
    singular: "Email template",
    group: "Lead generation",
    roles: ["owner", "editor"],
    slugField: "key",
    titleField: "key",
    listFields: ["key", "subject", "active"],
    sort: { key: 1 },
    fields: [
      {
        name: "key",
        label: "Template",
        type: "select",
        required: true,
        options: ["lead_acknowledgement", "team_notification", "download_delivery", "nurture_1", "nurture_2", "nurture_3", "nurture_4"],
      },
      { name: "subject", label: "Subject", type: "text", required: true },
      {
        name: "body",
        label: "Body",
        type: "markdown",
        required: true,
        help: "Placeholders: {{name}}, {{businessName}}, {{bookingUrl}}, {{downloadUrl}}, {{leadSummary}}, {{adminLeadUrl}}",
      },
      { name: "delayDays", label: "Send after (days) — nurture only", type: "number", default: 0 },
      { name: "active", label: "Active", type: "boolean", default: true },
    ],
  },
  {
    key: "settings",
    label: "Site settings",
    singular: "Settings",
    group: "Settings",
    roles: ["owner", "editor"],
    singleton: true,
    titleField: "businessName",
    public: true,
    revalidates: true,
    fields: [
      { name: "businessName", label: "Business name", type: "text", default: "Momentum Accounting" },
      { name: "legalName", label: "Legal name", type: "text", default: "Momentum Accounting Ltd" },
      { name: "tagline", label: "Tagline", type: "text", default: "Building financial momentum for your business." },
      { name: "email", label: "Enquiries email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "hours", label: "Opening hours", type: "text" },
      { name: "streetAddress", label: "Street address", type: "text" },
      { name: "locality", label: "Town", type: "text", default: "Ashford" },
      { name: "region", label: "County", type: "text", default: "Surrey" },
      { name: "postcode", label: "Postcode", type: "text" },
      { name: "companyNumber", label: "Company registration number", type: "text" },
      { name: "accreditation", label: "Professional accreditation", type: "text" },
      { name: "instagram", label: "Instagram URL", type: "text" },
      { name: "tiktok", label: "TikTok URL", type: "text" },
      { name: "linkedin", label: "LinkedIn URL", type: "text" },
      { name: "facebook", label: "Facebook URL", type: "text" },
      { name: "socialPosts", label: "Featured social posts", type: "list", help: "Instagram or TikTok post URLs to embed on the site" },
      { name: "googleReviewsUrl", label: "Google reviews link", type: "text" },
      { name: "bookingUrl", label: "Booking page URL (Cal.com / Calendly)", type: "text", help: "When set, the Book a call page shows the live calendar" },
      { name: "announcement", label: "Announcement bar text", type: "text" },
      { name: "ga4Id", label: "Google Analytics 4 ID (G-…)", type: "text" },
      { name: "googleAdsId", label: "Google Ads ID (AW-…)", type: "text" },
      { name: "googleAdsLeadLabel", label: "Google Ads lead conversion label", type: "text" },
      { name: "metaPixelId", label: "Meta Pixel ID", type: "text" },
      { name: "linkedinPartnerId", label: "LinkedIn Insight partner ID", type: "text" },
      { name: "tiktokPixelId", label: "TikTok Pixel ID", type: "text" },
      { name: "notificationEmails", label: "New-lead notification emails", type: "list" },
      { name: "leadRetentionMonths", label: "Delete unconverted leads after (months)", type: "number", default: 24 },
    ],
  },
  {
    key: "redirects",
    label: "Redirects",
    singular: "Redirect",
    group: "Settings",
    roles: ["owner", "editor"],
    titleField: "from",
    listFields: ["from", "to", "permanent"],
    sort: { from: 1 },
    revalidates: false,
    fields: [
      { name: "from", label: "From path", type: "text", required: true, help: "e.g. /old-page" },
      { name: "to", label: "To path or URL", type: "text", required: true },
      { name: "permanent", label: "Permanent (301)", type: "boolean", default: true },
    ],
  },
  {
    key: "notFoundLogs",
    label: "404 log",
    singular: "404 entry",
    group: "Tracking",
    roles: ["owner", "editor"],
    titleField: "path",
    listFields: ["path", "count", "lastSeen"],
    sort: { count: -1 },
    readOnly: true,
    fields: [
      { name: "path", label: "Path", type: "text" },
      { name: "count", label: "Hits", type: "number" },
      { name: "lastSeen", label: "Last seen", type: "date" },
      { name: "referrer", label: "Last referrer", type: "text" },
    ],
  },
  {
    key: "monthlyMetrics",
    label: "Monthly figures",
    singular: "Month",
    group: "Tracking",
    roles: ["owner", "leads"],
    titleField: "month",
    listFields: ["month", "adSpend", "visitors"],
    sort: { month: -1 },
    fields: [
      { name: "month", label: "Month (YYYY-MM)", type: "text", required: true },
      { name: "adSpend", label: "Advertising spend (£)", type: "number", default: 0 },
      { name: "managementFee", label: "Campaign management fee (£)", type: "number", default: 0 },
      { name: "visitors", label: "Website visitors (from GA4)", type: "number", default: 0 },
      { name: "notes", label: "Notes", type: "textarea" },
    ],
  },
];

export function getResource(key: string) {
  return resources.find((r) => r.key === key);
}

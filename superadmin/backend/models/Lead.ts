import { Schema, model, models, type InferSchemaType } from "mongoose";

// Pipeline stages from prospectus §6.1
export const LEAD_STATUSES = ["new", "contacted", "call_booked", "proposal_sent", "won", "lost"] as const;

export const LEAD_TYPES = [
  "enquiry",
  "quote",
  "quiz",
  "booking",
  "download",
  "calculator",
  "landing_page",
] as const;

const attributionSchema = new Schema(
  {
    pageUrl: String,
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    utmTerm: String,
    utmContent: String,
    gclid: String,
    fbclid: String,
  },
  { _id: false },
);

const activitySchema = new Schema(
  {
    type: { type: String, enum: LEAD_TYPES, required: true },
    answers: { type: Schema.Types.Mixed, default: {} },
    attribution: attributionSchema,
    at: { type: Date, default: Date.now },
  },
  { _id: false },
);

const leadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    phone: { type: String, trim: true },
    businessName: { type: String, trim: true },
    legalStructure: String,
    turnover: String,
    services: [String],
    currentAccountant: String,
    heardAbout: String,
    message: String,

    score: { type: String, enum: ["ideal", "possible", "not_a_fit"], default: "possible" },
    status: { type: String, enum: LEAD_STATUSES, default: "new", index: true },

    // First touch is kept for attribution; every later submission is appended to activity.
    firstSource: attributionSchema,
    activity: [activitySchema],

    consent: {
      privacyAccepted: { type: Boolean, required: true },
      marketingOptIn: { type: Boolean, default: false },
      wordingVersion: String,
      at: Date,
    },

    notes: [{ text: String, by: String, at: { type: Date, default: Date.now } }],
    statusHistory: [{ from: String, to: String, by: String, at: { type: Date, default: Date.now } }],

    booking: { uid: String, startTime: Date, status: String },

    // Follow-up email sequence for prospects who enquire but don't book (§5.2).
    nurture: {
      step: { type: Number, default: 0 },
      nextAt: { type: Date, index: true },
      stopped: { type: Boolean, default: false },
      stoppedReason: String,
    },

    hqSync: {
      status: { type: String, enum: ["pending", "synced", "failed"], default: "pending", index: true },
      hqId: String,
      attempts: { type: Number, default: 0 },
      lastError: String,
      lastAttemptAt: Date,
    },
  },
  { timestamps: true },
);

export type LeadDoc = InferSchemaType<typeof leadSchema>;

export const Lead = models.Lead || model("Lead", leadSchema);

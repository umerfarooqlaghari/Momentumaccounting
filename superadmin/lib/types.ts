export type Role = "owner" | "editor" | "leads";

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "markdown" | "number" | "boolean" | "select" | "list" | "image" | "file" | "date" | "objectList";
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
  group: string;
  roles: Role[];
  fields: Field[];
  singleton?: boolean;
  slugField?: string;
  titleField: string;
  listFields?: string[];
  readOnly?: boolean;
};

export type Doc = Record<string, unknown> & { _id: string; createdAt?: string; updatedAt?: string };

export type Lead = Doc & {
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  legalStructure?: string;
  turnover?: string;
  services?: string[];
  currentAccountant?: string;
  heardAbout?: string;
  message?: string;
  score: "ideal" | "possible" | "not_a_fit";
  status: string;
  firstSource?: Record<string, string>;
  activity: { type: string; answers?: Record<string, unknown>; attribution?: Record<string, string>; at: string }[];
  consent?: { privacyAccepted: boolean; marketingOptIn: boolean; wordingVersion?: string; at?: string };
  notes?: { text: string; by: string; at: string }[];
  statusHistory?: { from: string; to: string; by: string; at: string }[];
  nurture?: { step: number; nextAt?: string; stopped?: boolean; stoppedReason?: string };
  booking?: { startTime?: string; status?: string };
  hqSync?: { status: string; attempts?: number; lastError?: string; lastAttemptAt?: string };
};

export const STATUSES = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "call_booked", label: "Call booked" },
  { key: "proposal_sent", label: "Proposal sent" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
] as const;

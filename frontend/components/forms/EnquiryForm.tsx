"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { submitLead } from "@/lib/leads";
import { track } from "@/lib/analytics";
import { ConsentFields } from "./ConsentFields";

// Qualifying questions from prospectus §5.1.
const LEGAL_STRUCTURES = ["Limited company", "Sole trader", "Partnership / LLP", "Not trading yet", "Other"];
const TURNOVER_BANDS = ["Under £100k", "£100k–£250k", "£250k–£500k", "£500k–£1m", "£1m–£5m", "Over £5m"];
const SERVICES = [
  "Full monthly package",
  "Bookkeeping",
  "Quarterly management accounts",
  "Year-end & corporation tax",
  "VAT",
  "Payroll",
  "Self assessment",
  "Tax planning",
];
const HEARD_ABOUT = ["Google search", "Recommendation / referral", "Instagram", "TikTok", "LinkedIn", "Facebook", "Other"];

type FormState = {
  businessName: string;
  legalStructure: string;
  turnover: string;
  services: string[];
  hasAccountant: string;
  currentAccountant: string;
  heardAbout: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredTime: string;
  privacyAccepted: boolean;
  marketingOptIn: boolean;
  website: string; // honeypot
};

const initial: FormState = {
  businessName: "",
  legalStructure: "",
  turnover: "",
  services: [],
  hasAccountant: "",
  currentAccountant: "",
  heardAbout: "",
  name: "",
  email: "",
  phone: "",
  message: "",
  preferredTime: "",
  privacyAccepted: false,
  marketingOptIn: false,
  website: "",
};

const STEPS = ["Your business", "What you need", "Your details"];

export function EnquiryForm({
  intent = "enquiry",
  source,
  contactEmail,
  initialServices = [],
}: {
  intent?: "enquiry" | "call-request";
  /** Set on campaign landing pages so the lead is typed as "landing_page" */
  source?: string;
  contactEmail?: string;
  initialServices?: string[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>({ ...initial, services: initialServices });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (s: number) => {
    const e: typeof errors = {};
    if (s === 0) {
      if (!data.businessName.trim()) e.businessName = "Please enter your business name";
      if (!data.legalStructure) e.legalStructure = "Please choose one";
      if (!data.turnover) e.turnover = "Please choose a turnover band";
    }
    if (s === 1) {
      if (data.services.length === 0) e.services = "Choose at least one";
      if (!data.hasAccountant) e.hasAccountant = "Please choose one";
    }
    if (s === 2) {
      if (data.name.trim().length < 2) e.name = "Please enter your name";
      if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Please enter a valid email address";
      if (!data.privacyAccepted) e.privacyAccepted = "Please confirm to continue";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => validate(step) && setStep((s) => s + 1);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (step < STEPS.length - 1) return next();
    if (!validate(step)) return;
    setSubmitting(true);
    setServerError("");
    try {
      await submitLead({
        type: source ? "landing_page" : "enquiry",
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        businessName: data.businessName,
        legalStructure: data.legalStructure,
        turnover: data.turnover,
        services: data.services,
        currentAccountant: data.hasAccountant === "Yes" ? data.currentAccountant || "Yes" : "No",
        heardAbout: data.heardAbout || undefined,
        message: data.message || undefined,
        answers: { intent, preferredTime: data.preferredTime || undefined, landingPage: source },
        marketingOptIn: data.marketingOptIn,
        website: data.website,
      });
      track("generate_lead", { lead_type: intent, form: source ?? intent });
      router.push(`/thank-you?type=${intent}`);
    } catch {
      setServerError(
        `Sorry, something went wrong sending your details. Please try again${contactEmail ? `, or email us at ${contactEmail}` : ""}.`,
      );
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="rounded-[28px] border border-charcoal/10 bg-white p-6 shadow-[0_40px_80px_-40px_rgb(34_32_30/0.35)] sm:p-9">
      {/* Progress */}
      <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Form progress">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined}>
            <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
              <div
                className={`h-full rounded-full bg-teal transition-all duration-500 ${i <= step ? "w-full" : "w-0"}`}
              />
            </div>
            <p className={`mt-2 text-xs font-semibold sm:text-sm ${i === step ? "text-charcoal-900" : "text-muted"}`}>
              <span className="sr-only">Step {i + 1}: </span>
              {label}
            </p>
          </li>
        ))}
      </ol>

      <div key={step} className="animate-[fade-in_0.4s_ease] space-y-6">
        {step === 0 && (
          <>
            <Field label="Business name" error={errors.businessName} id="businessName">
              <input
                id="businessName"
                autoComplete="organization"
                value={data.businessName}
                onChange={(e) => set("businessName", e.target.value)}
                className={inputCls(errors.businessName)}
              />
            </Field>
            <Choice
              legend="Legal structure"
              options={LEGAL_STRUCTURES}
              value={data.legalStructure}
              onChange={(v) => set("legalStructure", v)}
              error={errors.legalStructure}
            />
            <Choice
              legend="Approximate annual turnover"
              options={TURNOVER_BANDS}
              value={data.turnover}
              onChange={(v) => set("turnover", v)}
              error={errors.turnover}
            />
          </>
        )}

        {step === 1 && (
          <>
            <fieldset>
              <legend className="mb-3 font-semibold text-charcoal-900">Which services do you need?</legend>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((s) => {
                  const on = data.services.includes(s);
                  return (
                    <label
                      key={s}
                      className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-[15px] font-medium transition-all has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-teal ${
                        on ? "border-teal bg-teal-50 text-charcoal-900" : "border-charcoal/15 hover:border-charcoal/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={on}
                        onChange={() =>
                          set("services", on ? data.services.filter((x) => x !== s) : [...data.services, s])
                        }
                      />
                      {on && <Check aria-hidden className="size-4 text-teal-ink" />}
                      {s}
                    </label>
                  );
                })}
              </div>
              {errors.services && <ErrorText>{errors.services}</ErrorText>}
            </fieldset>
            <Choice
              legend="Do you currently have an accountant?"
              options={["Yes", "No"]}
              value={data.hasAccountant}
              onChange={(v) => set("hasAccountant", v)}
              error={errors.hasAccountant}
            />
            {data.hasAccountant === "Yes" && (
              <Field label="Who is your current accountant? (optional)" id="currentAccountant">
                <input
                  id="currentAccountant"
                  value={data.currentAccountant}
                  onChange={(e) => set("currentAccountant", e.target.value)}
                  className={inputCls()}
                />
              </Field>
            )}
            <Field label="How did you hear about us? (optional)" id="heardAbout">
              <select
                id="heardAbout"
                value={data.heardAbout}
                onChange={(e) => set("heardAbout", e.target.value)}
                className={inputCls()}
              >
                <option value="">Select…</option>
                {HEARD_ABOUT.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Your name" error={errors.name} id="name">
                <input
                  id="name"
                  autoComplete="name"
                  value={data.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={inputCls(errors.name)}
                />
              </Field>
              <Field label="Email" error={errors.email} id="email">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={inputCls(errors.email)}
                />
              </Field>
            </div>
            <Field label="Phone (optional)" id="phone">
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={data.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={inputCls()}
              />
            </Field>
            {intent === "call-request" && (
              <Field label="When suits you for a call? (optional)" id="preferredTime">
                <select
                  id="preferredTime"
                  value={data.preferredTime}
                  onChange={(e) => set("preferredTime", e.target.value)}
                  className={inputCls()}
                >
                  <option value="">Any time</option>
                  <option>Weekday mornings</option>
                  <option>Weekday afternoons</option>
                  <option>Early evening</option>
                </select>
              </Field>
            )}
            <Field label="Anything else we should know? (optional)" id="message">
              <textarea
                id="message"
                rows={3}
                value={data.message}
                onChange={(e) => set("message", e.target.value)}
                className={inputCls()}
              />
            </Field>

            {/* Honeypot (hidden from people and assistive tech) */}
            <div className="hidden" aria-hidden>
              <label>
                Website
                <input tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} />
              </label>
            </div>

            <ConsentFields
              privacy={data.privacyAccepted}
              marketing={data.marketingOptIn}
              onPrivacy={(v) => set("privacyAccepted", v)}
              onMarketing={(v) => set("marketingOptIn", v)}
              error={errors.privacyAccepted}
            />
          </>
        )}
      </div>

      {serverError && (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 text-[15px] text-red-800">
          {serverError}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 font-semibold text-charcoal hover:bg-stone-100"
          >
            <ArrowLeft aria-hidden className="size-4" /> Back
          </button>
        ) : (
          <span className="text-sm text-muted">Takes about a minute</span>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-teal px-7 font-semibold text-charcoal-900 shadow-[0_8px_24px_-8px_rgb(51_203_204/0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#2ab8b9] disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin" /> Sending…
            </>
          ) : step < STEPS.length - 1 ? (
            <>
              Continue <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </>
          ) : (
            <>
              {intent === "call-request" ? "Request my call" : "Send my enquiry"}
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function inputCls(error?: string) {
  return `block w-full min-h-12 rounded-xl border bg-white px-4 py-3 text-[16px] text-charcoal-900 transition-colors outline-none focus:border-teal-ink focus:ring-4 focus:ring-teal/20 ${
    error ? "border-red-600" : "border-charcoal/20"
  }`;
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-semibold text-charcoal-900">
        {label}
      </label>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function Choice({
  legend,
  options,
  value,
  onChange,
  error,
}: {
  legend: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-3 font-semibold text-charcoal-900">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o}
            className={`flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-[15px] font-medium transition-all has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-teal ${
              value === o ? "border-teal bg-teal text-charcoal-900" : "border-charcoal/15 hover:border-charcoal/40"
            }`}
          >
            <input type="radio" className="sr-only" name={legend} checked={value === o} onChange={() => onChange(o)} />
            {o}
          </label>
        ))}
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </fieldset>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-2 text-sm font-medium text-red-700">
      {children}
    </p>
  );
}

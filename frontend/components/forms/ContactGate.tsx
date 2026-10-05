"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { submitLead, type LeadType } from "@/lib/leads";
import { ConsentFields } from "./ConsentFields";

const TURNOVER_BANDS = ["Under £100k", "£100k–£250k", "£250k–£500k", "£500k–£1m", "£1m–£5m", "Over £5m"];

const inputCls =
  "block w-full min-h-12 rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-[16px] text-charcoal-900 outline-none transition focus:border-teal-ink focus:ring-4 focus:ring-teal/20";

/** Short contact form used to unlock quiz results, calculator breakdowns and downloads. */
export function ContactGate({
  type,
  answers,
  submitLabel,
  onDone,
  dark = false,
}: {
  type: LeadType;
  answers: Record<string, unknown>;
  submitLabel: string;
  onDone: (result: { downloadUrl?: string }) => void;
  dark?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [turnover, setTurnover] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Please enter a valid email address";
    if (!privacy) errs.privacy = "Please confirm to continue";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    setServerError("");
    try {
      const res = await submitLead({ type, name, email, businessName: businessName || undefined, turnover: turnover || undefined, answers, marketingOptIn: marketing, website });
      onDone(res);
    } catch {
      setServerError("Sorry, something went wrong. Please try again.");
      setBusy(false);
    }
  };

  const label = `mb-2 block font-semibold ${dark ? "text-white" : "text-charcoal-900"}`;

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${type}-name`} className={label}>Your name</label>
          <input id={`${type}-name`} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} aria-invalid={!!errors.name} />
          {errors.name && <p role="alert" className="mt-1.5 text-sm font-medium text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor={`${type}-email`} className={label}>Email</label>
          <input id={`${type}-email`} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} aria-invalid={!!errors.email} />
          {errors.email && <p role="alert" className="mt-1.5 text-sm font-medium text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor={`${type}-biz`} className={label}>Business name (optional)</label>
          <input id={`${type}-biz`} autoComplete="organization" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label htmlFor={`${type}-turnover`} className={label}>Turnover (optional)</label>
          <select id={`${type}-turnover`} value={turnover} onChange={(e) => setTurnover(e.target.value)} className={inputCls}>
            <option value="">Select…</option>
            {TURNOVER_BANDS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="hidden" aria-hidden>
        <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <ConsentFields privacy={privacy} marketing={marketing} onPrivacy={setPrivacy} onMarketing={setMarketing} error={errors.privacy} />
      {serverError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{serverError}</p>}
      <button type="submit" disabled={busy} className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-teal px-7 font-semibold text-charcoal-900 shadow-[0_8px_24px_-8px_rgb(51_203_204/0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#2ab8b9] disabled:opacity-60">
        {busy ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
        {submitLabel}
        {!busy && <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />}
      </button>
    </form>
  );
}

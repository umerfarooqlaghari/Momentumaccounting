"use client";

import { useState } from "react";
import { BarChart3, Wallet, Landmark, FileText } from "lucide-react";

// Interactive walkthrough of a sample quarterly report (§3.2, §4). All figures are illustrative.
const tabs = [
  {
    id: "performance",
    label: "Performance",
    icon: BarChart3,
    title: "How the business performed",
    text: "Revenue, gross margin and profit for the quarter, compared with the previous quarter and the same period last year.",
  },
  {
    id: "cash",
    label: "Cash",
    icon: Wallet,
    title: "Where the cash went",
    text: "Cash in, cash out and what's set aside for upcoming VAT, PAYE and tax bills, so you know what's genuinely available.",
  },
  {
    id: "tax",
    label: "Tax position",
    icon: Landmark,
    title: "Your tax position, every quarter",
    text: "Corporation tax building up in the business and your personal tax on salary and dividends. Calculated as you go, so there are no surprises.",
  },
  {
    id: "summary",
    label: "Business summary",
    icon: FileText,
    title: "What it all means, in plain English",
    text: "A short written summary from your accountant: what went well, what to watch and what we recommend next.",
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ReportExplorer() {
  const [active, setActive] = useState<TabId>("performance");
  const current = tabs.find((t) => t.id === active)!;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-center">
      <div>
        <div role="tablist" aria-label="Quarterly report sections" className="grid gap-2">
          {tabs.map((t) => {
            const selected = t.id === active;
            return (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`panel-${t.id}`}
                onClick={() => setActive(t.id)}
                className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${
                  selected
                    ? "border-teal bg-white shadow-[0_20px_40px_-24px_rgb(10_116_117/0.45)]"
                    : "border-transparent hover:bg-white/60"
                }`}
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-xl transition-colors ${
                    selected ? "bg-teal text-charcoal-900" : "bg-white text-teal-ink"
                  }`}
                >
                  <t.icon aria-hidden className="size-5" />
                </span>
                <span>
                  <span className="block font-bold text-charcoal-900">{t.label}</span>
                  {selected && <span className="mt-1 block text-[15px] leading-relaxed text-muted">{t.text}</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="relative rounded-[28px] border border-charcoal/10 bg-white p-6 shadow-[0_40px_80px_-40px_rgb(34_32_30/0.4)] sm:p-8"
      >
        <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Sample Ltd · Q3 report</p>
            <p className="mt-1 text-lg font-bold text-charcoal-900">{current.title}</p>
          </div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-ink">Sample</span>
        </div>
        <div key={active} className="animate-[fade-in_0.5s_ease] pt-6">
          {active === "performance" && <PerformancePanel />}
          {active === "cash" && <CashPanel />}
          {active === "tax" && <TaxPanel />}
          {active === "summary" && <SummaryPanel />}
        </div>
      </div>
    </div>
  );
}

function PerformancePanel() {
  const quarters = [
    { q: "Q4", rev: 52, profit: 30 },
    { q: "Q1", rev: 60, profit: 34 },
    { q: "Q2", rev: 70, profit: 41 },
    { q: "Q3", rev: 84, profit: 52 },
  ];
  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        <Kpi label="Revenue" value="£412k" delta="+14%" />
        <Kpi label="Gross margin" value="41%" delta="+3pt" />
        <Kpi label="Net profit" value="£88k" delta="+18%" />
      </div>
      <div className="mt-6 flex h-48 items-end gap-4 rounded-2xl bg-stone-50 p-5">
        {quarters.map((d, i) => (
          <div key={d.q} className="flex h-full flex-1 flex-col justify-end gap-2">
            <div className="flex h-full items-end gap-1.5">
              <div
                className="animate-grow-y flex-1 origin-bottom rounded-t-md bg-teal"
                style={{ height: `${d.rev}%`, animationDelay: `${i * 100}ms` }}
              />
              <div
                className="animate-grow-y flex-1 origin-bottom rounded-t-md bg-charcoal"
                style={{ height: `${d.profit}%`, animationDelay: `${i * 100 + 60}ms` }}
              />
            </div>
            <p className="text-center text-xs font-semibold text-muted">{d.q}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-5 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-teal" /> Revenue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-charcoal" /> Profit
        </span>
      </div>
    </div>
  );
}

function CashPanel() {
  const rows = [
    { label: "Opening cash", value: "£74,000" },
    { label: "Cash in from customers", value: "+£398,500" },
    { label: "Cash out to suppliers & staff", value: "−£376,500" },
    { label: "Closing cash", value: "£96,000", bold: true },
    { label: "Set aside for VAT & PAYE", value: "−£31,200" },
    { label: "Available to the business", value: "£64,800", bold: true, accent: true },
  ];
  return (
    <ul className="divide-y divide-charcoal/10">
      {rows.map((r) => (
        <li key={r.label} className={`flex justify-between py-3.5 ${r.bold ? "font-bold text-charcoal-900" : "text-muted"}`}>
          <span>{r.label}</span>
          <span className={`tabular-nums ${r.accent ? "text-teal-ink" : ""}`}>{r.value}</span>
        </li>
      ))}
    </ul>
  );
}

function TaxPanel() {
  const items = [
    { label: "Corporation tax (year to date)", value: "£21,400", pct: 62 },
    { label: "Your personal tax on dividends", value: "£6,850", pct: 40 },
    { label: "VAT due next quarter", value: "£18,900", pct: 75 },
  ];
  return (
    <div className="space-y-6">
      {items.map((it, i) => (
        <div key={it.label}>
          <div className="flex justify-between text-[15px]">
            <span className="text-muted">{it.label}</span>
            <span className="font-bold text-charcoal-900 tabular-nums">{it.value}</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full origin-left animate-[grow-x_1s_cubic-bezier(0.22,1,0.36,1)_both] rounded-full bg-gradient-to-r from-teal-ink to-teal"
              style={{ width: `${it.pct}%`, animationDelay: `${i * 120}ms` }}
            />
          </div>
        </div>
      ))}
      <p className="rounded-2xl bg-teal-50 p-4 text-[15px] text-charcoal">
        <strong>No surprises:</strong> these amounts are already set aside in your cash forecast.
      </p>
    </div>
  );
}

function SummaryPanel() {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-charcoal">
      <p>
        <strong className="text-charcoal-900">What went well.</strong> Revenue grew 14% on last quarter, driven by the new
        maintenance contracts. The price increase in July lifted gross margin by three points.
      </p>
      <p>
        <strong className="text-charcoal-900">What to watch.</strong> Debtor days crept up to 41. Two larger invoices are
        overdue, and we suggest chasing them before month end.
      </p>
      <p>
        <strong className="text-charcoal-900">What we recommend.</strong> With profits ahead of plan, there&apos;s room for a
        further dividend this quarter while staying within the basic-rate band. We&apos;ll discuss this on our review call.
      </p>
    </div>
  );
}

function Kpi({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="rounded-2xl bg-stone-50 p-3 sm:p-4">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-charcoal-900 sm:text-xl">{value}</p>
      <p className="text-xs font-semibold text-teal-ink">{delta}</p>
    </div>
  );
}

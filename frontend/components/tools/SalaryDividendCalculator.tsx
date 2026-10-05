"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { ContactGate } from "@/components/forms/ContactGate";
import { track } from "@/lib/analytics";
import { optimise, type Scenario } from "@/lib/calculator";
import type { TaxRates } from "@/lib/types";

const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
const inputCls =
  "block w-full min-h-12 rounded-xl border border-charcoal/20 bg-white pl-8 pr-4 py-3 text-lg font-semibold text-charcoal-900 outline-none transition focus:border-teal-ink focus:ring-4 focus:ring-teal/20";

function Breakdown({ s, label }: { s: Scenario; label: string }) {
  const rows = [
    ["Salary", s.salary],
    ["Dividends", s.dividends],
    ["Corporation tax", -s.corporationTax],
    ["Employer's NI", -s.employerNi],
    ["Your NI", -s.employeeNi],
    ["Your income tax", -s.incomeTax],
  ] as const;
  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white p-6">
      <p className="text-sm font-semibold tracking-wide text-muted uppercase">{label}</p>
      <dl className="mt-3 divide-y divide-charcoal/5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between py-2 text-[15px]">
            <dt className="text-muted">{k}</dt>
            <dd className="font-semibold text-charcoal-900 tabular-nums">{Math.abs(v) < 1 ? "£0" : v < 0 ? `−${gbp(-v)}` : gbp(v)}</dd>
          </div>
        ))}
        <div className="flex justify-between py-3 text-lg font-extrabold text-charcoal-900">
          <dt>Take-home</dt>
          <dd className="tabular-nums">{gbp(s.takeHome)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function SalaryDividendCalculator({ rates }: { rates: TaxRates }) {
  const [profit, setProfit] = useState(80000);
  const [other, setOther] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const result = useMemo(() => optimise(Math.max(0, profit), Math.max(0, other), rates), [profit, other, rates]);
  const best = result.best;
  const saving = best && result.allSalary ? best.takeHome - result.allSalary.takeHome : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-6 rounded-[28px] border border-charcoal/10 bg-white p-6 sm:p-8">
        <div>
          <label htmlFor="profit" className="mb-2 block font-semibold text-charcoal-900">
            Company profit before your salary
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-lg font-semibold text-muted">£</span>
            <input id="profit" type="number" inputMode="numeric" min={0} step={1000} value={profit} onChange={(e) => setProfit(Number(e.target.value))} className={inputCls} />
          </div>
          <input type="range" aria-label="Company profit" min={0} max={300000} step={1000} value={Math.min(profit, 300000)} onChange={(e) => setProfit(Number(e.target.value))} className="mt-4 w-full accent-teal-ink" />
        </div>
        <div>
          <label htmlFor="other" className="mb-2 block font-semibold text-charcoal-900">
            Your other taxable income (optional)
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-4 -translate-y-1/2 text-lg font-semibold text-muted">£</span>
            <input id="other" type="number" inputMode="numeric" min={0} step={1000} value={other} onChange={(e) => setOther(Number(e.target.value))} className={inputCls} />
          </div>
          <p className="mt-1.5 text-sm text-muted">e.g. rental income or another job</p>
        </div>
        <p className="rounded-2xl bg-stone-50 p-4 text-sm leading-relaxed text-muted">
          Based on {rates.taxYear} rates for England, Wales and Northern Ireland. Assumes a sole-director company with no employment
          allowance, a full-year accounting period, no pension contributions and all profit paid out. Illustration only, not
          personal advice.
        </p>
        {!rates.verified && (
          <p className="flex gap-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
            <AlertTriangle aria-hidden className="size-5 shrink-0" /> Rates awaiting review by our team.
          </p>
        )}
      </div>

      <div className="space-y-6">
        {best ? (
          <div className="relative isolate overflow-hidden rounded-[28px] bg-charcoal-900 p-8 text-white" aria-live="polite">
            <div className="absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-teal/25 blur-3xl" aria-hidden />
            <p className="text-sm font-semibold tracking-wide text-teal uppercase">A tax-efficient split</p>
            <div className="mt-5 grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-white/60">Salary</p>
                <p className="text-3xl font-extrabold tabular-nums sm:text-4xl">{gbp(best.salary)}</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Dividends</p>
                <p className="text-3xl font-extrabold tabular-nums sm:text-4xl">{gbp(best.dividends)}</p>
              </div>
            </div>
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-sm text-white/60">Estimated take-home</p>
              <p className="text-5xl font-extrabold text-teal tabular-nums">{gbp(best.takeHome)}</p>
              {saving > 50 && <p className="mt-2 text-white/75">That&apos;s about {gbp(saving)} more than taking it all as salary.</p>}
            </div>
          </div>
        ) : (
          <p className="rounded-2xl bg-stone-100 p-6 text-muted">Enter your company profit to see a result.</p>
        )}

        {best && !unlocked && (
          <div className="rounded-[28px] border border-charcoal/10 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-charcoal-900">See the full breakdown</h2>
            <p className="mt-1 text-muted">Every tax line, compared with taking it all as salary. We&apos;ll also email you a copy.</p>
            <div className="mt-6">
              <ContactGate
                type="calculator"
                submitLabel="Show full breakdown"
                answers={{ profit, otherIncome: other, suggestedSalary: Math.round(best.salary), suggestedDividends: Math.round(best.dividends), estimatedTakeHome: Math.round(best.takeHome), taxYear: rates.taxYear }}
                onDone={() => {
                  track("calculator_use", { profit });
                  setUnlocked(true);
                }}
              />
            </div>
          </div>
        )}

        {best && unlocked && (
          <div className="grid animate-[fade-in_0.5s_ease] gap-4 sm:grid-cols-2">
            <Breakdown s={best} label="Suggested split" />
            {result.allSalary && <Breakdown s={result.allSalary} label="All as salary" />}
            <div className="rounded-2xl bg-teal-50 p-6 sm:col-span-2">
              <p className="font-semibold text-charcoal-900">Want this reviewed for your actual circumstances?</p>
              <p className="mt-1 text-muted">We review every client&apos;s salary and dividend mix every quarter.</p>
              <Link href="/book-a-call" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-charcoal-900 px-5 font-semibold text-white">
                Book a free call
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

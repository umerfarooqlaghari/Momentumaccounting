"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, ErrorBox, PageHeader, Spinner, inputCls } from "@/components/ui";

type Row = { key: string; leads: number; ideal: number; won: number };
type Monthly = {
  month: string;
  visitors: number | null;
  leads: number;
  idealLeads: number;
  won: number;
  adSpend: number;
  costPerLead: number | null;
  conversionRate: number;
  visitorToLead: number | null;
};
type Report = { total: number; byStatus: Record<string, number>; bySource: Row[]; byCampaign: Row[]; byPage: Row[]; byType: Row[]; monthly: Monthly[] };

const money = (n: number | null) => (n === null ? "—" : `£${n.toLocaleString("en-GB", { maximumFractionDigits: 2 })}`);
const monthName = (m: string) => new Date(`${m}-01`).toLocaleDateString("en-GB", { month: "short", year: "numeric" });

// Single-series horizontal bars: one hue, values in text ink, table semantics kept.
function Breakdown({ title, rows }: { title: string; rows: Row[] }) {
  const max = Math.max(1, ...rows.map((r) => r.leads));
  return (
    <Card className="p-6">
      <h2 className="mb-4 font-bold">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted">No data yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="sr-only">
            <tr>
              <th>{title}</th>
              <th>Leads</th>
              <th>Ideal</th>
              <th>Won</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} title={`${r.key}: ${r.leads} leads, ${r.ideal} ideal, ${r.won} won`} className="group">
                <td className="w-2/5 truncate py-1.5 pr-3 text-charcoal-900">{r.key}</td>
                <td className="w-2/5 py-1.5">
                  <div className="h-2.5 rounded-r-[4px] bg-teal-ink transition-opacity group-hover:opacity-80" style={{ width: `${(r.leads / max) * 100}%` }} aria-hidden />
                </td>
                <td className="py-1.5 pl-3 text-right font-semibold tabular-nums">{r.leads}</td>
                <td className="py-1.5 pl-3 text-right text-xs text-muted tabular-nums">{r.ideal} ideal · {r.won} won</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

export default function ReportsPage() {
  const [months, setMonths] = useState(6);
  const [r, setR] = useState<Report | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Report>(`admin/reports?months=${months}`).then(setR).catch((e) => setError(e.message));
  }, [months]);

  if (error) return <ErrorBox message={error} />;
  if (!r) return <Spinner />;

  const max = Math.max(1, ...r.monthly.map((m) => m.leads));

  return (
    <>
      <PageHeader
        title="Reports"
        description="Leads by source, campaign and page, plus the monthly report."
        actions={
          <select aria-label="Period" value={months} onChange={(e) => setMonths(Number(e.target.value))} className={inputCls}>
            <option value={3}>Last 3 months</option>
            <option value={6}>Last 6 months</option>
            <option value={12}>Last 12 months</option>
          </select>
        }
      />

      <Card className="mb-6 p-6">
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="font-bold">Monthly report</h2>
          <Link href="/content/monthlyMetrics" className="text-sm font-semibold text-teal-ink hover:underline">
            Enter ad spend & visitors
          </Link>
        </div>
        <p className="mb-5 text-sm text-muted">Leads per month. Cost per lead uses ad spend and management fees entered under Monthly figures.</p>
        {r.monthly.length > 0 && (
          <div className="mb-6 flex h-40 items-end gap-2 border-b border-charcoal/15" role="img" aria-label={`Leads per month: ${r.monthly.map((m) => `${monthName(m.month)} ${m.leads}`).join(", ")}`}>
            {r.monthly.map((m) => (
              <div key={m.month} className="group relative flex h-full flex-1 flex-col justify-end">
                <span className="mb-1 text-center text-xs font-semibold text-charcoal-900 tabular-nums">{m.leads}</span>
                <div className="mx-auto w-full max-w-12 rounded-t-[4px] bg-teal-ink transition-opacity group-hover:opacity-80" style={{ height: `${(m.leads / max) * 80}%` }} title={`${monthName(m.month)}: ${m.leads} leads`} />
              </div>
            ))}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-charcoal/10 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="py-2 pr-4">Month</th>
                <th className="py-2 pr-4 text-right">Visitors</th>
                <th className="py-2 pr-4 text-right">Leads</th>
                <th className="py-2 pr-4 text-right">Ideal</th>
                <th className="py-2 pr-4 text-right">Visitor → lead</th>
                <th className="py-2 pr-4 text-right">Ad spend</th>
                <th className="py-2 pr-4 text-right">Cost per lead</th>
                <th className="py-2 pr-4 text-right">Won</th>
                <th className="py-2 text-right">Lead → client</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5 tabular-nums">
              {r.monthly.map((m) => (
                <tr key={m.month}>
                  <td className="py-2 pr-4 font-semibold">{monthName(m.month)}</td>
                  <td className="py-2 pr-4 text-right">{m.visitors ?? "—"}</td>
                  <td className="py-2 pr-4 text-right">{m.leads}</td>
                  <td className="py-2 pr-4 text-right">{m.idealLeads}</td>
                  <td className="py-2 pr-4 text-right">{m.visitorToLead === null ? "—" : `${m.visitorToLead}%`}</td>
                  <td className="py-2 pr-4 text-right">{money(m.adSpend)}</td>
                  <td className="py-2 pr-4 text-right">{money(m.costPerLead)}</td>
                  <td className="py-2 pr-4 text-right">{m.won}</td>
                  <td className="py-2 text-right">{m.conversionRate}%</td>
                </tr>
              ))}
              {r.monthly.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-muted">No leads in this period.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Breakdown title="By source" rows={r.bySource} />
        <Breakdown title="By campaign" rows={r.byCampaign} />
        <Breakdown title="By landing page" rows={r.byPage} />
        <Breakdown title="By lead type" rows={r.byType} />
      </div>
    </>
  );
}

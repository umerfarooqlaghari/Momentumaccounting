"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { api } from "@/lib/api";
import { STATUSES, type Lead } from "@/lib/types";
import { Badge, Card, ErrorBox, PageHeader, Spinner, formatDate, inputCls } from "@/components/ui";

export default function LeadsPage() {
  const [filters, setFilters] = useState({ q: "", status: "", score: "", type: "", hq: "", from: "", to: "" });
  const [data, setData] = useState<{ items: Lead[]; total: number } | null>(null);
  const [error, setError] = useState("");

  const qs = useMemo(() => new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString(), [filters]);

  useEffect(() => {
    const t = setTimeout(() => {
      api<{ items: Lead[]; total: number }>(`admin/leads?limit=200&${qs}`).then(setData).catch((e) => setError(e.message));
    }, filters.q ? 250 : 0);
    return () => clearTimeout(t);
  }, [qs, filters.q]);

  const set = (k: keyof typeof filters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFilters((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <PageHeader
        title="Leads"
        description="Every enquiry, quiz, download and booking from the website."
        actions={
          <a href={`/api/backend/admin/leads/export?${qs}`} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-charcoal/15 bg-white px-4 text-sm font-semibold hover:border-charcoal/40">
            <Download className="size-4" /> Export CSV
          </a>
        }
      />
      <Card className="mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <div className="relative sm:col-span-2 lg:col-span-1 xl:col-span-2">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input aria-label="Search leads" placeholder="Name, email or business" value={filters.q} onChange={set("q")} className={`${inputCls} pl-9`} />
        </div>
        <select aria-label="Status" value={filters.status} onChange={set("status")} className={inputCls}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
        <select aria-label="Fit" value={filters.score} onChange={set("score")} className={inputCls}>
          <option value="">Any fit</option>
          <option value="ideal">Ideal</option>
          <option value="possible">Possible</option>
          <option value="not_a_fit">Not a fit</option>
        </select>
        <select aria-label="Lead type" value={filters.type} onChange={set("type")} className={inputCls}>
          <option value="">Any type</option>
          {["enquiry", "quiz", "booking", "download", "calculator", "landing_page"].map((t) => (
            <option key={t} value={t}>{t.replace("_", " ")}</option>
          ))}
        </select>
        <input aria-label="From date" type="date" value={filters.from} onChange={set("from")} className={inputCls} />
        <input aria-label="To date" type="date" value={filters.to} onChange={set("to")} className={inputCls} />
      </Card>

      {error ? (
        <ErrorBox message={error} />
      ) : !data ? (
        <Spinner />
      ) : (
        <>
          <p className="mb-2 text-sm text-muted">{data.total} leads</p>
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-charcoal/10 text-xs tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-5 py-3">Lead</th>
                  <th className="px-5 py-3">Turnover</th>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Fit</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">HQ</th>
                  <th className="px-5 py-3">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {data.items.map((l) => (
                  <tr key={l._id} className="hover:bg-stone-50">
                    <td className="px-5 py-3">
                      <Link href={`/leads/${l._id}`} className="font-semibold text-charcoal-900 hover:text-teal-ink">{l.name}</Link>
                      <span className="block text-xs text-muted">{l.businessName ?? l.email}</span>
                    </td>
                    <td className="px-5 py-3">{l.turnover ?? "—"}</td>
                    <td className="px-5 py-3">{l.firstSource?.utmSource ?? "direct"}</td>
                    <td className="px-5 py-3">{[...new Set(l.activity?.map((a) => a.type))].join(", ")}</td>
                    <td className="px-5 py-3"><Badge value={l.score} /></td>
                    <td className="px-5 py-3"><Badge value={l.status} label={STATUSES.find((s) => s.key === l.status)?.label} /></td>
                    <td className="px-5 py-3"><Badge value={l.hqSync?.status ?? "pending"} /></td>
                    <td className="px-5 py-3 whitespace-nowrap">{formatDate(l.createdAt, true)}</td>
                  </tr>
                ))}
                {data.items.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-muted">No leads match these filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </>
  );
}

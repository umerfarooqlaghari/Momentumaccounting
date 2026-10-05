"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { useAdmin } from "@/components/AdminShell";
import { Badge, Button, Card, ErrorBox, PageHeader, Spinner, formatDate } from "@/components/ui";

type Dash = {
  stats: { newThisWeek: number; newThisMonth: number; openLeads: number; wonThisMonth: number };
  health: { hqConfigured: boolean; hqPending: number; hqFailed: number; emailConfigured: boolean; websiteUpdates: { ok: boolean; detail?: string } };
  recentLeads: { _id: string; name: string; businessName?: string; score: string; status: string; createdAt: string }[];
  recentEdits: { _id: string; resource: string; action: string; by: string; createdAt: string }[];
};

export default function Dashboard() {
  const { user } = useAdmin();
  const [d, setD] = useState<Dash | null>(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState("");
  const refreshWebsite = async () => {
    setRefreshing(true);
    setRefreshMsg("");
    try {
      await api("admin/revalidate", { method: "POST" });
      setRefreshMsg("Website refreshed with the latest content.");
    } catch (e) {
      setRefreshMsg((e as Error).message);
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    api<Dash>("admin/dashboard").then(setD).catch((e) => setError(e.message));
  }, []);

  if (error) return <ErrorBox message={error} />;
  if (!d) return <Spinner />;

  const tiles = [
    { label: "New leads this week", value: d.stats.newThisWeek },
    { label: "New leads (30 days)", value: d.stats.newThisMonth },
    { label: "Open in pipeline", value: d.stats.openLeads },
    { label: "Won (30 days)", value: d.stats.wonThisMonth },
  ];
  const checks = [
    {
      ok: d.health.websiteUpdates.ok,
      text: d.health.websiteUpdates.ok ? "Edits update the website instantly" : `Website isn't receiving updates: ${d.health.websiteUpdates.detail}`,
    },
    { ok: d.health.emailConfigured, text: d.health.emailConfigured ? "Email sending is set up" : "Email sending is not set up (SMTP in backend .env)" },
    { ok: d.health.hqConfigured, text: d.health.hqConfigured ? "Connected to Momentum HQ" : "Momentum HQ connection not configured — leads are stored safely here until it is" },
    { ok: d.health.hqFailed === 0, text: d.health.hqFailed ? `${d.health.hqFailed} ${d.health.hqFailed === 1 ? "lead" : "leads"} failed to reach Momentum HQ` : `${d.health.hqPending} ${d.health.hqPending === 1 ? "lead" : "leads"} waiting to sync to HQ` },
  ];

  return (
    <>
      <PageHeader title={`Hello, ${user.name.split(" ")[0]}`} description="Here's what's happening on the website." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((t) => (
          <Card key={t.label} className="p-5">
            <p className="text-sm text-muted">{t.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-charcoal-900 tabular-nums">{t.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Latest leads</h2>
            <Link href="/leads" className="text-sm font-semibold text-teal-ink hover:underline">
              All leads
            </Link>
          </div>
          {d.recentLeads.length === 0 ? (
            <p className="text-sm text-muted">No leads yet.</p>
          ) : (
            <ul className="divide-y divide-charcoal/5">
              {d.recentLeads.map((l) => (
                <li key={l._id}>
                  <Link href={`/leads/${l._id}`} className="flex items-center justify-between gap-3 py-3 hover:text-teal-ink">
                    <span>
                      <span className="block font-semibold">{l.name}</span>
                      <span className="text-sm text-muted">
                        {l.businessName ?? "—"} · {formatDate(l.createdAt, true)}
                      </span>
                    </span>
                    <span className="flex gap-1.5">
                      <Badge value={l.score} />
                      <Badge value={l.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 font-bold">System health</h2>
            <ul className="space-y-3 text-sm">
              {checks.map((c) => (
                <li key={c.text} className="flex gap-2.5">
                  {c.ok ? <CheckCircle2 className="size-5 shrink-0 text-emerald-600" /> : <AlertTriangle className="size-5 shrink-0 text-amber-600" />}
                  {c.text}
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t border-charcoal/10 pt-4">
              <Button variant="ghost" onClick={refreshWebsite} loading={refreshing}>
                <RefreshCw className="size-4" /> Refresh website now
              </Button>
              {refreshMsg && <p className="mt-2 text-sm">{refreshMsg}</p>}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="mb-4 font-bold">Recent edits</h2>
            {d.recentEdits.length === 0 ? (
              <p className="text-sm text-muted">No edits yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {d.recentEdits.map((e) => (
                  <li key={e._id}>
                    <span className="font-medium">{e.resource}</span> {e.action}d by {e.by}
                    <span className="block text-xs text-muted">{formatDate(e.createdAt, true)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

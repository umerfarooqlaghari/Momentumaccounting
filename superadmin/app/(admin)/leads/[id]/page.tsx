"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, RefreshCw, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { STATUSES, type Lead } from "@/lib/types";
import { useAdmin } from "@/components/AdminShell";
import { Badge, Button, Card, ErrorBox, PageHeader, Spinner, formatDate, inputCls } from "@/components/ui";

const label = (k: string) => k.replace(/([A-Z])/g, " $1").replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

function Row({ k, v }: { k: string; v: unknown }) {
  if (v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length)) return null;
  return (
    <div className="grid grid-cols-[150px_1fr] gap-3 py-2 text-sm">
      <dt className="text-muted">{label(k)}</dt>
      <dd className="break-words text-charcoal-900">{Array.isArray(v) ? v.join(", ") : typeof v === "object" ? JSON.stringify(v) : String(v)}</dd>
    </div>
  );
}

export default function LeadPage({ params }: PageProps<"/leads/[id]">) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAdmin();
  const [lead, setLead] = useState<Lead | null>(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState("");
  const [confirmErase, setConfirmErase] = useState(false);

  useEffect(() => {
    api<{ item: Lead }>(`admin/leads/${id}`).then((d) => setLead(d.item)).catch((e) => setError(e.message));
  }, [id]);

  const patch = async (body: { status?: string; note?: string }, key: string) => {
    setBusy(key);
    try {
      const { item } = await api<{ item: Lead }>(`admin/leads/${id}`, { method: "PATCH", json: body });
      setLead(item);
      if (body.note) setNote("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  };

  const resync = async () => {
    setBusy("sync");
    setMsg("");
    try {
      await api(`admin/leads/${id}/resync`, { method: "POST" });
      setMsg("Sent to Momentum HQ");
      const d = await api<{ item: Lead }>(`admin/leads/${id}`);
      setLead(d.item);
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy("");
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(lead, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `lead-${lead?.email}.json`;
    a.click();
  };

  const erase = async () => {
    await api(`admin/leads/${id}`, { method: "DELETE" });
    router.push("/leads");
  };

  if (error) return <ErrorBox message={error} />;
  if (!lead) return <Spinner />;

  return (
    <>
      <Link href="/leads" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-charcoal-900">
        <ArrowLeft className="size-4" /> Leads
      </Link>
      <PageHeader title={lead.name} description={`${lead.businessName ?? ""} · received ${formatDate(lead.createdAt, true)}`} actions={<><Badge value={lead.score} /><Badge value={lead.hqSync?.status ?? "pending"} label={`HQ: ${lead.hqSync?.status ?? "pending"}`} /></>} />

      <Card className="mb-6 p-5">
        <p className="mb-3 text-sm font-semibold">Pipeline</p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => patch({ status: s.key }, s.key)}
              disabled={!!busy}
              aria-pressed={lead.status === s.key}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                lead.status === s.key ? "border-teal bg-teal text-charcoal-900" : "border-charcoal/15 bg-white hover:border-charcoal/40"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-2 font-bold">Contact & business</h2>
            <dl className="divide-y divide-charcoal/5">
              <Row k="email" v={lead.email} />
              <Row k="phone" v={lead.phone} />
              <Row k="businessName" v={lead.businessName} />
              <Row k="legalStructure" v={lead.legalStructure} />
              <Row k="turnover" v={lead.turnover} />
              <Row k="services" v={lead.services} />
              <Row k="currentAccountant" v={lead.currentAccountant} />
              <Row k="heardAbout" v={lead.heardAbout} />
              <Row k="message" v={lead.message} />
              <Row k="marketingOptIn" v={lead.consent?.marketingOptIn ? "Yes" : "No"} />
              <Row k="consentGiven" v={lead.consent?.at ? `${formatDate(lead.consent.at, true)} (wording ${lead.consent.wordingVersion ?? "—"})` : undefined} />
              {lead.booking?.startTime && <Row k="callBookedFor" v={formatDate(lead.booking.startTime, true)} />}
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="mb-2 font-bold">Source</h2>
            <dl className="divide-y divide-charcoal/5">
              {Object.entries(lead.firstSource ?? {}).map(([k, v]) => <Row key={k} k={k} v={v} />)}
              {!lead.firstSource && <p className="text-sm text-muted">Direct visit</p>}
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 font-bold">Activity</h2>
            <ol className="space-y-4">
              {[...lead.activity].reverse().map((a, i) => (
                <li key={i} className="rounded-xl bg-stone-50 p-4">
                  <p className="flex items-center justify-between text-sm">
                    <Badge value={a.type} />
                    <span className="text-muted">{formatDate(a.at, true)}</span>
                  </p>
                  <dl className="mt-2">
                    {Object.entries(a.answers ?? {}).filter(([, v]) => typeof v !== "object").map(([k, v]) => <Row key={k} k={k} v={v} />)}
                    {a.attribution?.pageUrl && <Row k="page" v={a.attribution.pageUrl} />}
                  </dl>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-3 font-bold">Notes</h2>
            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} aria-label="Add a note" placeholder="Add a note…" className={inputCls} />
            <Button className="mt-2" onClick={() => patch({ note }, "note")} loading={busy === "note"} disabled={!note.trim()}>
              Add note
            </Button>
            <ul className="mt-5 space-y-3">
              {[...(lead.notes ?? [])].reverse().map((n, i) => (
                <li key={i} className="border-l-2 border-teal pl-3 text-sm">
                  <p className="whitespace-pre-wrap">{n.text}</p>
                  <p className="mt-1 text-xs text-muted">{n.by} · {formatDate(n.at, true)}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 font-bold">Status history</h2>
            <ul className="space-y-2 text-sm">
              {[...(lead.statusHistory ?? [])].reverse().map((h, i) => (
                <li key={i}>
                  {h.from} → <strong>{h.to}</strong>
                  <span className="block text-xs text-muted">{h.by} · {formatDate(h.at, true)}</span>
                </li>
              ))}
              {!lead.statusHistory?.length && <li className="text-muted">No changes yet.</li>}
            </ul>
            <p className="mt-4 text-xs text-muted">
              Follow-up emails: {lead.nurture?.stopped ? `stopped (${lead.nurture.stoppedReason ?? "—"})` : lead.nurture?.nextAt ? `next on ${formatDate(lead.nurture.nextAt)}` : "none scheduled"}
            </p>
          </Card>

          <Card className="space-y-3 p-6">
            <h2 className="font-bold">Momentum HQ</h2>
            <p className="text-sm text-muted">
              Status: {lead.hqSync?.status} · attempts {lead.hqSync?.attempts ?? 0}
              {lead.hqSync?.lastError && <span className="block text-red-700">Last error: {lead.hqSync.lastError}</span>}
            </p>
            <Button variant="ghost" onClick={resync} loading={busy === "sync"}>
              <RefreshCw className="size-4" /> Resend to HQ
            </Button>
            {msg && <p className="text-sm">{msg}</p>}
          </Card>

          <Card className="space-y-3 p-6">
            <h2 className="font-bold">Data protection</h2>
            <Button variant="ghost" onClick={exportJson}>
              <Download className="size-4" /> Export this person&apos;s data
            </Button>
            {user.role === "owner" &&
              (confirmErase ? (
                <div className="space-y-2 rounded-xl bg-red-50 p-3 text-sm">
                  <p>Permanently delete this lead? This can&apos;t be undone.</p>
                  <div className="flex gap-2">
                    <Button variant="danger" onClick={erase}>Yes, erase</Button>
                    <Button variant="ghost" onClick={() => setConfirmErase(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Button variant="danger" onClick={() => setConfirmErase(true)}>
                  <Trash2 className="size-4" /> Erase (right to be forgotten)
                </Button>
              ))}
          </Card>
        </div>
      </div>
    </>
  );
}

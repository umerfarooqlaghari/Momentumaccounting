"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { Plus, RotateCcw, Search, Trash2, Upload } from "lucide-react";
import { api } from "@/lib/api";
import type { Doc } from "@/lib/types";
import { useResource } from "@/components/AdminShell";
import { ResourceForm } from "@/components/ResourceForm";
import { Badge, Button, Card, ErrorBox, LinkButton, PageHeader, Spinner, formatDate, inputCls } from "@/components/ui";

function cellValue(v: unknown) {
  if (typeof v === "boolean") return <Badge value={String(v)} label={v ? "Yes" : "No"} />;
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) return formatDate(v);
  if (Array.isArray(v)) return `${v.length} items`;
  return String(v ?? "—");
}

export default function ResourcePage({ params }: PageProps<"/content/[resource]">) {
  const { resource: key } = use(params);
  const resource = useResource(key);
  const [items, setItems] = useState<Doc[] | null>(null);
  const [single, setSingle] = useState<Doc | null | undefined>(undefined);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    if (!resource) return;
    if (resource.singleton) {
      api<{ item: Doc | null }>(`admin/content/${key}`).then((d) => setSingle(d.item)).catch((e) => setError(e.message));
    } else {
      api<{ items: Doc[] }>(`admin/content/${key}?limit=200${q ? `&q=${encodeURIComponent(q)}` : ""}`)
        .then((d) => setItems(d.items))
        .catch((e) => setError(e.message));
    }
  }, [resource, key, q]);

  useEffect(() => {
    const t = setTimeout(load, q ? 250 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  if (!resource) return <ErrorBox message="You don't have access to this section." />;
  if (error) return <ErrorBox message={error} />;

  if (resource.singleton) {
    if (single === undefined) return <Spinner />;
    return (
      <>
        <PageHeader title={resource.label} />
        <ResourceForm resource={resource} initial={single} />
      </>
    );
  }

  const cols = resource.listFields ?? [resource.titleField];

  return (
    <>
      <PageHeader
        title={resource.label}
        actions={!resource.readOnly && <LinkButton href={`/content/${key}/new`}><Plus className="size-4" /> New {resource.singular.toLowerCase()}</LinkButton>}
      />
      {key === "redirects" && <RedirectImport onDone={load} />}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <input aria-label="Search" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className={`${inputCls} pl-9`} />
      </div>
      {!items ? (
        <Spinner />
      ) : items.length === 0 ? (
        <Card className="p-10 text-center text-muted">Nothing here yet.</Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-charcoal/10 text-xs tracking-wide text-muted uppercase">
              <tr>
                {cols.map((c) => (
                  <th key={c} className="px-5 py-3 font-semibold">
                    {resource.fields.find((f) => f.name === c)?.label ?? c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-stone-50">
                  {cols.map((c, i) => (
                    <td key={c} className="px-5 py-3">
                      {i === 0 ? (
                        <Link href={`/content/${key}/${item._id}`} className="font-semibold text-charcoal-900 hover:text-teal-ink">
                          {cellValue(item[c])}
                        </Link>
                      ) : (
                        cellValue(item[c])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {!resource.readOnly && <RecentlyDeleted resourceKey={key} onRestored={load} />}
    </>
  );
}

type Deleted = { _id: string; title: string; by: string; createdAt: string };

function RecentlyDeleted({ resourceKey, onRestored }: { resourceKey: string; onRestored: () => void }) {
  const [items, setItems] = useState<Deleted[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    api<{ items: Deleted[] }>(`admin/content/${resourceKey}/deleted`).then((d) => setItems(d.items)).catch(() => setItems([]));
  }, [resourceKey]);
  useEffect(load, [load]);

  if (!items.length) return null;

  const restore = async (revId: string) => {
    setBusy(revId);
    try {
      await api(`admin/revisions/${revId}/restore`, { method: "POST" });
      load();
      onRestored();
    } finally {
      setBusy(null);
    }
  };

  return (
    <details className="mt-8">
      <summary className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-muted hover:text-charcoal-900">
        <Trash2 className="size-4" /> Recently deleted ({items.length})
      </summary>
      <Card className="mt-3 divide-y divide-charcoal/5">
        {items.map((d) => (
          <div key={d._id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
            <span>
              <span className="font-semibold">{d.title}</span>
              <span className="block text-xs text-muted">
                deleted by {d.by} · {formatDate(d.createdAt, true)}
              </span>
            </span>
            <Button variant="ghost" onClick={() => restore(d._id)} loading={busy === d._id}>
              <RotateCcw className="size-4" /> Restore
            </Button>
          </div>
        ))}
      </Card>
    </details>
  );
}

function RedirectImport({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [csv, setCsv] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setBusy(true);
    try {
      const r = await api<{ imported: number; errors: string[] }>("admin/redirects/import", { method: "POST", json: { csv } });
      setResult(`Imported ${r.imported}.${r.errors.length ? ` Problems: ${r.errors.join("; ")}` : ""}`);
      onDone();
    } catch (e) {
      setResult((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  if (!open)
    return (
      <Button variant="ghost" className="mb-4" onClick={() => setOpen(true)}>
        <Upload className="size-4" /> Import CSV
      </Button>
    );
  return (
    <Card className="mb-6 space-y-3 p-5">
      <p className="text-sm text-muted">One redirect per line: <code>from,to,permanent</code> — e.g. <code>/old-page,/services,true</code></p>
      <textarea rows={6} value={csv} onChange={(e) => setCsv(e.target.value)} className={`${inputCls} font-mono text-sm`} aria-label="Redirects CSV" />
      <div className="flex items-center gap-3">
        <Button onClick={submit} loading={busy}>Import</Button>
        {result && <span className="text-sm">{result}</span>}
      </div>
    </Card>
  );
}

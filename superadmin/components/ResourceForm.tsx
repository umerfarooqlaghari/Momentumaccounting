"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, History, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import type { Doc, Resource } from "@/lib/types";
import { FieldRow, emptyFor } from "./FieldInput";
import { Button, Card, ErrorBox, formatDate } from "./ui";

type Revision = { _id: string; action: string; by: string; createdAt: string };

export function ResourceForm({ resource, initial }: { resource: Resource; initial: Doc | null }) {
  const router = useRouter();
  const [data, setData] = useState<Record<string, unknown>>(() => ({ ...emptyFor(resource.fields), ...(initial ?? {}) }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [websiteWarning, setWebsiteWarning] = useState("");
  const [revisions, setRevisions] = useState<Revision[] | null>(null);
  const isNew = !initial?._id;

  const loadRevisions = () => {
    if (initial?._id) api<{ revisions: Revision[] }>(`admin/content/${resource.key}/${initial._id}/revisions`).then((d) => setRevisions(d.revisions));
  };
  useEffect(loadRevisions, [initial?._id, resource.key]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    setWebsiteWarning("");
    type SaveResult = { item: Doc; website?: { ok: boolean; detail?: string } };
    try {
      let res: SaveResult;
      if (resource.singleton) {
        res = await api<SaveResult>(`admin/content/${resource.key}`, { method: "PUT", json: data });
      } else if (isNew) {
        res = await api<SaveResult>(`admin/content/${resource.key}`, { method: "POST", json: data });
        router.replace(`/content/${resource.key}/${res.item._id}`);
        return;
      } else {
        res = await api<SaveResult>(`admin/content/${resource.key}/${initial!._id}`, { method: "PUT", json: data });
      }
      if (res.website && !res.website.ok) setWebsiteWarning(res.website.detail ?? "The website could not be refreshed.");
      setSaved(true);
      loadRevisions();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const [confirmDelete, setConfirmDelete] = useState(false);
  const remove = async () => {
    await api(`admin/content/${resource.key}/${initial!._id}`, { method: "DELETE" });
    router.push(`/content/${resource.key}`);
  };

  const restore = async (revId: string) => {
    await api(`admin/revisions/${revId}/restore`, { method: "POST" });
    window.location.reload();
  };

  const readOnly = resource.readOnly;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
      <form onSubmit={save}>
        <Card className="space-y-6 p-6 sm:p-8">
          {resource.fields.map((f) => (
            <FieldRow key={f.name} field={f} id={`f-${f.name}`} value={data[f.name]} onChange={(v) => setData((d) => ({ ...d, [f.name]: v }))} />
          ))}
        </Card>
        {!readOnly && (
          <div className="sticky bottom-0 mt-4 flex flex-wrap items-center gap-3 border-t border-charcoal/10 bg-stone-50/95 py-4 backdrop-blur">
            <Button type="submit" loading={saving}>
              {isNew && !resource.singleton ? `Create ${resource.singular.toLowerCase()}` : "Save changes"}
            </Button>
            {saved && (
              <span role="status" className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="size-4" /> {websiteWarning ? "Saved" : "Saved — live on the website now"}
              </span>
            )}
            {error && <ErrorBox message={error} />}
            {websiteWarning && (
              <p role="alert" className="w-full rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                Saved, but the website wasn&apos;t refreshed: {websiteWarning} It will still update within 5 minutes.
              </p>
            )}
          </div>
        )}
      </form>

      {!isNew && (
        <aside className="space-y-4">
          <Card className="p-5">
            <p className="text-xs text-muted">Last updated</p>
            <p className="font-semibold">{formatDate(initial?.updatedAt, true)}</p>
            {!resource.singleton && !readOnly && (
              <div className="mt-4">
                {confirmDelete ? (
                  <div className="space-y-2">
                    <p className="text-sm">Delete this {resource.singular.toLowerCase()}? You can restore it later from “Recently deleted” at the bottom of the list.</p>
                    <div className="flex gap-2">
                      <Button type="button" variant="danger" onClick={remove}>
                        Yes, delete
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button type="button" variant="danger" onClick={() => setConfirmDelete(true)}>
                    <Trash2 className="size-4" /> Delete
                  </Button>
                )}
              </div>
            )}
          </Card>
          {!readOnly && (
            <Card className="p-5">
              <p className="mb-3 flex items-center gap-2 font-semibold">
                <History className="size-4" /> History
              </p>
              {revisions?.length ? (
                <ul className="space-y-3 text-sm">
                  {revisions.map((r) => (
                    <li key={r._id} className="flex items-start justify-between gap-2">
                      <span>
                        <span className="block">{formatDate(r.createdAt, true)}</span>
                        <span className="text-xs text-muted">
                          before {r.action} by {r.by}
                        </span>
                      </span>
                      <button type="button" onClick={() => restore(r._id)} className="shrink-0 text-xs font-semibold text-teal-ink hover:underline">
                        Restore
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted">No earlier versions yet.</p>
              )}
            </Card>
          )}
        </aside>
      )}
    </div>
  );
}

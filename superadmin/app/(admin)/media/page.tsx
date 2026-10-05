"use client";

import { useEffect, useState } from "react";
import { Copy, FileText, Trash2 } from "lucide-react";
import { api, mediaUrl } from "@/lib/api";
import { UploadForm, type MediaItem } from "@/components/MediaPicker";
import { Card, ErrorBox, PageHeader, Spinner, formatDate } from "@/components/ui";

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<string | null>(null);

  const load = () => api<{ items: MediaItem[] }>("admin/media").then((d) => setItems(d.items)).catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    await api(`admin/media/${id}`, { method: "DELETE" });
    setConfirm(null);
    load();
  };

  return (
    <>
      <PageHeader title="Media library" description="Images for team, reviews and blog posts, and PDFs for downloads. Stored in your own database." />
      <Card className="mb-6 p-5">
        <UploadForm accept="image/*,application/pdf" onUploaded={() => load()} />
      </Card>
      {error && <ErrorBox message={error} />}
      {!items ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((m) => (
            <Card key={m._id} className="overflow-hidden">
              {m.contentType?.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl(m._id)} alt={m.alt} className="aspect-square w-full bg-stone-100 object-cover" />
              ) : (
                <div className="grid aspect-square place-items-center bg-stone-100">
                  <FileText className="size-10 text-muted" />
                </div>
              )}
              <div className="p-3 text-xs">
                <p className="truncate font-semibold">{m.filename}</p>
                <p className="text-muted">{formatDate(m.uploadDate)} · {Math.round((m.length ?? 0) / 1024)} KB</p>
                <div className="mt-2 flex gap-1">
                  <button type="button" onClick={() => navigator.clipboard.writeText(m._id)} className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-stone-100" title="Copy media ID">
                    <Copy className="size-3.5" /> ID
                  </button>
                  {confirm === m._id ? (
                    <button type="button" onClick={() => remove(m._id)} className="rounded-md bg-red-50 px-2 py-1 font-semibold text-red-700">
                      Confirm delete
                    </button>
                  ) : (
                    <button type="button" onClick={() => setConfirm(m._id)} className="flex items-center gap-1 rounded-md px-2 py-1 text-red-700 hover:bg-red-50">
                      <Trash2 className="size-3.5" /> Delete
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {items.length === 0 && <p className="col-span-full text-muted">No files uploaded yet.</p>}
        </div>
      )}
    </>
  );
}

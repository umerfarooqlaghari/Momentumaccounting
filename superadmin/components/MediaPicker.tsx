"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { api, mediaUrl } from "@/lib/api";
import { Button, ErrorBox, inputCls } from "./ui";

export type MediaItem = { _id: string; filename: string; contentType: string; alt: string; length?: number; uploadDate?: string };

export function UploadForm({ accept, onUploaded }: { accept: string; onUploaded: (m: MediaItem) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return setError("Choose a file first");
    setBusy(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("alt", alt);
    try {
      const { item } = await api<{ item: MediaItem }>("admin/media", { method: "POST", body: fd });
      onUploaded(item);
      setAlt("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-dashed border-charcoal/20 bg-stone-50 p-4">
      <input ref={fileRef} type="file" accept={accept} className="block w-full text-sm" />
      {accept.includes("image") && (
        <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Alt text — describe the image (required)" className={inputCls} />
      )}
      {error && <ErrorBox message={error} />}
      <Button type="button" onClick={upload} loading={busy} variant="dark">
        <Upload className="size-4" /> Upload
      </Button>
    </div>
  );
}

function PickerModal({ kind, onPick, onClose }: { kind: "image" | "file"; onPick: (m: MediaItem) => void; onClose: () => void }) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  useEffect(() => {
    api<{ items: MediaItem[] }>("admin/media").then((d) =>
      setItems(d.items.filter((m) => (kind === "image" ? m.contentType?.startsWith("image/") : m.contentType === "application/pdf"))),
    );
  }, [kind]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal-900/60 p-4" role="dialog" aria-modal="true" aria-label="Choose media">
      <div className="max-h-[85dvh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Choose {kind === "image" ? "an image" : "a file"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-9 place-items-center rounded-lg hover:bg-stone-100">
            <X className="size-5" />
          </button>
        </div>
        <UploadForm accept={kind === "image" ? "image/*" : "application/pdf"} onUploaded={onPick} />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items?.map((m) => (
            <button key={m._id} type="button" onClick={() => onPick(m)} className="group overflow-hidden rounded-xl border border-charcoal/10 text-left hover:border-teal">
              {m.contentType?.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl(m._id)} alt={m.alt} className="aspect-square w-full bg-stone-100 object-cover" />
              ) : (
                <div className="grid aspect-square place-items-center bg-stone-100">
                  <FileText className="size-8 text-muted" />
                </div>
              )}
              <p className="truncate p-2 text-xs">{m.filename}</p>
            </button>
          ))}
          {items?.length === 0 && <p className="col-span-full text-sm text-muted">Nothing uploaded yet.</p>}
        </div>
      </div>
    </div>
  );
}

export function MediaField({ kind, value, onChange }: { kind: "image" | "file"; value?: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-3">
      {value ? (
        kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaUrl(value)} alt="" className="size-20 rounded-xl border border-charcoal/10 object-cover" />
        ) : (
          <span className="flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-2 text-sm">
            <FileText className="size-4" /> File attached
          </span>
        )
      ) : (
        <span className="text-sm text-muted">None</span>
      )}
      <Button type="button" variant="ghost" onClick={() => setOpen(true)}>
        {value ? "Change" : "Choose"}
      </Button>
      {value && (
        <Button type="button" variant="ghost" onClick={() => onChange("")}>
          Remove
        </Button>
      )}
      {open && (
        <PickerModal
          kind={kind}
          onClose={() => setOpen(false)}
          onPick={(m) => {
            onChange(m._id);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { Field } from "@/lib/types";
import { MediaField } from "./MediaPicker";
import { inputCls } from "./ui";

type Obj = Record<string, unknown>;

export function emptyFor(fields: Field[]): Obj {
  return Object.fromEntries(
    fields.map((f) => [f.name, f.default ?? (f.type === "list" || f.type === "objectList" ? [] : f.type === "boolean" ? false : "")]),
  );
}

function move<T>(arr: T[], i: number, dir: -1 | 1) {
  const next = [...arr];
  const j = i + dir;
  if (j < 0 || j >= next.length) return next;
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

export function FieldInput({ field, value, onChange, id }: { field: Field; value: unknown; onChange: (v: unknown) => void; id: string }) {
  switch (field.type) {
    case "textarea":
      return <textarea id={id} rows={3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
    case "markdown":
      return <textarea id={id} rows={12} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={`${inputCls} font-mono text-sm`} />;
    case "number":
      return <input id={id} type="number" step="any" value={value === undefined || value === null ? "" : String(value)} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} className={`${inputCls} max-w-xs`} />;
    case "date":
      return <input id={id} type="date" value={value ? String(value).slice(0, 10) : ""} onChange={(e) => onChange(e.target.value)} className={`${inputCls} max-w-xs`} />;
    case "boolean":
      return (
        <label className="inline-flex cursor-pointer items-center gap-3">
          <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="size-5 accent-[#0a7475]" />
          <span className="text-sm text-muted">{value ? "Yes" : "No"}</span>
        </label>
      );
    case "select":
      return (
        <select id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={`${inputCls} max-w-sm`}>
          <option value="">—</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "image":
    case "file":
      return <MediaField kind={field.type} value={value as string} onChange={onChange} />;
    case "list": {
      const items = (Array.isArray(value) ? value : []) as string[];
      return (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input aria-label={`${field.label} ${i + 1}`} value={item} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} className={inputCls} />
              <IconBtn label="Move up" onClick={() => onChange(move(items, i, -1))}>
                <ArrowUp className="size-4" />
              </IconBtn>
              <IconBtn label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))}>
                <Trash2 className="size-4" />
              </IconBtn>
            </div>
          ))}
          <AddBtn onClick={() => onChange([...items, ""])}>Add item</AddBtn>
        </div>
      );
    }
    case "objectList": {
      const items = (Array.isArray(value) ? value : []) as Obj[];
      const sub = field.fields ?? [];
      return (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl border border-charcoal/10 bg-stone-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-muted uppercase">
                  {field.label} #{i + 1}
                </span>
                <div className="flex gap-1">
                  <IconBtn label="Move up" onClick={() => onChange(move(items, i, -1))}>
                    <ArrowUp className="size-4" />
                  </IconBtn>
                  <IconBtn label="Move down" onClick={() => onChange(move(items, i, 1))}>
                    <ArrowDown className="size-4" />
                  </IconBtn>
                  <IconBtn label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))}>
                    <Trash2 className="size-4" />
                  </IconBtn>
                </div>
              </div>
              <div className="space-y-4">
                {sub.map((sf) => (
                  <FieldRow key={sf.name} field={sf} id={`${id}-${i}-${sf.name}`} value={item[sf.name]} onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, [sf.name]: v } : x)))} />
                ))}
              </div>
            </div>
          ))}
          <AddBtn onClick={() => onChange([...items, emptyFor(sub)])}>Add {field.label.toLowerCase().replace(/s$/, "")}</AddBtn>
        </div>
      );
    }
    default:
      return <input id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
  }
}

export function FieldRow({ field, value, onChange, id }: { field: Field; value: unknown; onChange: (v: unknown) => void; id: string }) {
  const labelled = !["list", "objectList", "image", "file"].includes(field.type);
  const Label = labelled ? "label" : "p";
  return (
    <div>
      <Label {...(labelled ? { htmlFor: id } : {})} className="mb-1.5 block text-sm font-semibold text-charcoal-900">
        {field.label}
        {field.required && <span className="text-red-600"> *</span>}
      </Label>
      <FieldInput field={field} value={value} onChange={onChange} id={id} />
      {field.help && <p className="mt-1.5 text-xs text-muted">{field.help}</p>}
    </div>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="grid size-10 shrink-0 place-items-center rounded-lg border border-charcoal/10 bg-white text-muted hover:text-charcoal-900">
      {children}
    </button>
  );
}

function AddBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-teal-ink hover:bg-teal-50">
      <Plus className="size-4" /> {children}
    </button>
  );
}

import { HttpError, type Session } from "./auth";
import { getResource, type Field, type Resource } from "./resources";
import { modelFor, Revision } from "./models";
import { revalidateWebsite } from "./revalidate";
import { bumpContentVersion } from "./content-events";

export function resourceOr404(key: string) {
  const r = getResource(key);
  if (!r) throw new HttpError(404, "Unknown content type");
  return r;
}

/** Keeps only defined fields and coerces simple types, so the admin can't write arbitrary keys. */
export function clean(fields: Field[], input: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (!(f.name in input)) continue;
    const v = input[f.name];
    if (f.type === "objectList") {
      out[f.name] = Array.isArray(v) ? v.map((item) => clean(f.fields ?? [], (item ?? {}) as Record<string, unknown>)) : [];
    } else if (f.type === "list") {
      out[f.name] = Array.isArray(v) ? v.map(String).map((s) => s.trim()).filter(Boolean) : [];
    } else if (f.type === "number") {
      out[f.name] = v === "" || v === null || v === undefined ? undefined : Number(v);
    } else if (f.type === "boolean") {
      out[f.name] = Boolean(v);
    } else if (f.type === "date") {
      out[f.name] = v ? new Date(String(v)) : undefined;
    } else {
      out[f.name] = v === null || v === undefined ? "" : String(v);
    }
  }
  return out;
}

function checkRequired(fields: Field[], data: Record<string, unknown>) {
  const missing = fields.filter((f) => f.required && (data[f.name] === undefined || data[f.name] === ""));
  if (missing.length) throw new HttpError(422, `Required: ${missing.map((f) => f.label).join(", ")}`);
}

export async function afterChange(resource: Resource) {
  if (!resource.revalidates) return;
  // Order matters: expire the website cache first, then tell open tabs to refresh.
  await revalidateWebsite();
  await bumpContentVersion();
}

export async function snapshot(resource: Resource, doc: { _id: unknown; toObject?: () => unknown }, action: "update" | "delete", session: Session) {
  await Revision.create({
    resource: resource.key,
    docId: String(doc._id),
    action,
    data: doc.toObject ? doc.toObject() : doc,
    by: session.email,
  });
}

export async function createItem(resource: Resource, body: Record<string, unknown>) {
  const data = clean(resource.fields, body);
  checkRequired(resource.fields, data);
  const doc = await modelFor(resource).create(data);
  await afterChange(resource);
  return doc;
}

export async function updateItem(resource: Resource, id: string | null, body: Record<string, unknown>, session: Session) {
  const Model = modelFor(resource);
  const doc = id ? await Model.findById(id) : await Model.findOne();
  if (!doc) {
    if (resource.singleton) return createItem(resource, body);
    throw new HttpError(404, "Not found");
  }
  const data = clean(resource.fields, body);
  checkRequired(resource.fields, { ...(doc.toObject() as Record<string, unknown>), ...data });
  await snapshot(resource, doc, "update", session);
  doc.set(data);
  await doc.save();
  await afterChange(resource);
  return doc;
}

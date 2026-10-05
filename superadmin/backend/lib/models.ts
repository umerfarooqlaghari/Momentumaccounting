import mongoose, { Schema, model, models, type Model } from "mongoose";
import { resources, type Field, type Resource } from "./resources";

function fieldType(f: Field): unknown {
  switch (f.type) {
    case "number":
      return { type: Number, default: f.default };
    case "boolean":
      return { type: Boolean, default: f.default ?? false };
    case "date":
      return { type: Date };
    case "list":
      return { type: [String], default: [] };
    case "objectList":
      return { type: [buildSchema(f.fields ?? [], false)], default: [] };
    case "select":
      return { type: String, enum: [...(f.options ?? []), "", null], default: f.default };
    default:
      return { type: String, trim: true, default: f.default };
  }
}

function buildSchema(fields: Field[], root: boolean) {
  const def: Record<string, unknown> = {};
  for (const f of fields) def[f.name] = fieldType(f);
  return new Schema(def, root ? { timestamps: true, strict: true } : { _id: false });
}

const cache = new Map<string, Model<unknown>>();

export function modelFor(resource: Resource): Model<unknown> {
  const existing = cache.get(resource.key);
  if (existing) return existing;
  const name = `R_${resource.key}`;
  const schema = buildSchema(resource.fields, true);
  if (resource.slugField) schema.index({ [resource.slugField]: 1 }, { unique: true, sparse: true });
  const m = (models[name] as Model<unknown>) || model(name, schema, resource.key);
  cache.set(resource.key, m);
  return m;
}

export function allModels() {
  return resources.map((r) => [r, modelFor(r)] as const);
}

// Snapshot of a document before every change, so edits can be rolled back (MA-092).
const revisionSchema = new Schema(
  {
    resource: { type: String, index: true },
    docId: { type: String, index: true },
    action: { type: String, enum: ["update", "delete"] },
    data: Schema.Types.Mixed,
    by: String,
  },
  { timestamps: true },
);
export const Revision = models.Revision || model("Revision", revisionSchema);

const adminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["owner", "editor", "leads"], default: "editor" },
    active: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true },
);
export const AdminUser = models.AdminUser || model("AdminUser", adminUserSchema);

// Small key/value cache (e.g. Google reviews) so external APIs aren't hit on every request.
const cacheSchema = new Schema({ key: { type: String, unique: true }, value: Schema.Types.Mixed, expiresAt: Date });
export const CacheEntry = models.CacheEntry || model("CacheEntry", cacheSchema);

export { mongoose };

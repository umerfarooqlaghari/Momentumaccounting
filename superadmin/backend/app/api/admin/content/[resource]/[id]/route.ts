import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { HttpError, requireRole } from "@/lib/auth";
import { modelFor } from "@/lib/models";
import { afterChange, resourceOr404, snapshot, updateItem } from "@/lib/content-service";

export const OPTIONS = preflight;

export const GET = handler(async (request, { resource: key, id }) => {
  const resource = resourceOr404(key);
  await requireRole(request, resource.roles);
  const item = await modelFor(resource).findById(id).lean();
  if (!item) throw new HttpError(404, "Not found");
  return json(request, { item });
});

export const PUT = handler(async (request, { resource: key, id }) => {
  const resource = resourceOr404(key);
  const session = await requireRole(request, resource.roles);
  if (resource.readOnly) throw new HttpError(405, "This list is read-only");
  const doc = await updateItem(resource, id, await request.json(), session);
  return json(request, { item: doc });
});

export const DELETE = handler(async (request, { resource: key, id }) => {
  const resource = resourceOr404(key);
  const session = await requireRole(request, resource.roles);
  const doc = await modelFor(resource).findById(id);
  if (!doc) throw new HttpError(404, "Not found");
  await snapshot(resource, doc, "delete", session);
  await doc.deleteOne();
  await afterChange(resource);
  return json(request, { ok: true });
});

import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { HttpError, requireRole } from "@/lib/auth";
import { modelFor } from "@/lib/models";
import { createItem, resourceOr404, updateItem } from "@/lib/content-service";

export const OPTIONS = preflight;

export const GET = handler(async (request, { resource: key }) => {
  const resource = resourceOr404(key);
  await requireRole(request, resource.roles);
  const Model = modelFor(resource);

  if (resource.singleton) return json(request, { item: await Model.findOne().lean() });

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get("limit") ?? 50)));
  const filter = q ? { [resource.titleField]: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } } : {};
  const [items, total] = await Promise.all([
    Model.find(filter)
      .sort(resource.sort ?? { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Model.countDocuments(filter),
  ]);
  return json(request, { items, total, page, limit });
});

export const POST = handler(async (request, { resource: key }) => {
  const resource = resourceOr404(key);
  await requireRole(request, resource.roles);
  if (resource.readOnly) throw new HttpError(405, "This list is read-only");
  if (resource.singleton) throw new HttpError(405, "Use PUT for settings");
  const doc = await createItem(resource, await request.json());
  return json(request, { item: doc }, 201);
});

// Singletons (settings, quiz, calculator) are saved with PUT on the collection URL.
export const PUT = handler(async (request, { resource: key }) => {
  const resource = resourceOr404(key);
  const session = await requireRole(request, resource.roles);
  if (!resource.singleton) throw new HttpError(405, "PUT is only for singletons");
  const doc = await updateItem(resource, null, await request.json(), session);
  return json(request, { item: doc });
});

import { json } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { requireRole } from "@/lib/auth";
import { modelFor, Revision } from "@/lib/models";
import { resourceOr404 } from "@/lib/content-service";

// Items deleted from this content type that haven't been restored, newest first.
export const GET = handler(async (request, { resource: key }) => {
  const resource = resourceOr404(key);
  await requireRole(request, resource.roles);
  const deletions = await Revision.find({ resource: key, action: "delete" })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean<{ _id: unknown; docId: string; data: Record<string, unknown>; by: string; createdAt: Date }[]>();

  const seen = new Set<string>();
  const latest = deletions.filter((d) => !seen.has(d.docId) && seen.add(d.docId));
  const stillExisting = new Set(
    (await modelFor(resource).find({ _id: { $in: latest.map((d) => d.docId) } }).select("_id").lean()).map((d) => String(d._id)),
  );

  const items = latest
    .filter((d) => !stillExisting.has(d.docId))
    .slice(0, 30)
    .map((d) => ({ _id: d._id, docId: d.docId, title: String(d.data?.[resource.titleField] ?? "Untitled"), by: d.by, createdAt: d.createdAt }));
  return json(request, { items });
});

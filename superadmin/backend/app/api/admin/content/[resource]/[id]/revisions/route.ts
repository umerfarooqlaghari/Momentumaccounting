import { json } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { requireRole } from "@/lib/auth";
import { Revision } from "@/lib/models";
import { resourceOr404 } from "@/lib/content-service";

export const GET = handler(async (request, { resource: key, id }) => {
  const resource = resourceOr404(key);
  await requireRole(request, resource.roles);
  const revisions = await Revision.find({ resource: key, docId: id }).sort({ createdAt: -1 }).limit(30).lean();
  return json(request, { revisions });
});

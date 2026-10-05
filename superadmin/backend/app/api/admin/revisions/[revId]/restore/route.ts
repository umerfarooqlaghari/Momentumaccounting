import { json } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { HttpError, requireRole } from "@/lib/auth";
import { modelFor, Revision } from "@/lib/models";
import { afterChange, resourceOr404, snapshot } from "@/lib/content-service";

// Restores a document (including a deleted one) to the state saved in a revision.
export const POST = handler(async (request, { revId }) => {
  const rev = await Revision.findById(revId).lean<{ resource: string; docId: string; data: Record<string, unknown> }>();
  if (!rev) throw new HttpError(404, "Revision not found");
  const resource = resourceOr404(rev.resource);
  const session = await requireRole(request, resource.roles);
  const Model = modelFor(resource);
  const current = await Model.findById(rev.docId);
  if (current) await snapshot(resource, current, "update", session);
  const data: Record<string, unknown> = { ...rev.data };
  for (const k of ["createdAt", "updatedAt", "__v"]) delete data[k];
  await Model.replaceOne({ _id: data._id }, data, { upsert: true });
  await afterChange(resource);
  return json(request, { ok: true, id: rev.docId });
});

import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { HttpError, requireRole } from "@/lib/auth";
import { bucket, toObjectId } from "@/lib/media";

export const OPTIONS = preflight;

export const DELETE = handler(async (request, { id }) => {
  await requireRole(request, ["owner", "editor"]);
  const oid = toObjectId(id);
  if (!oid) throw new HttpError(404, "Not found");
  await bucket().delete(oid);
  return json(request, { ok: true });
});

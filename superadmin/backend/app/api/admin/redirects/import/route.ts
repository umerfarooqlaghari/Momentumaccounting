import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { HttpError, requireRole } from "@/lib/auth";
import { getResource } from "@/lib/resources";
import { modelFor } from "@/lib/models";

export const OPTIONS = preflight;

// Bulk import of "from,to[,permanent]" lines — used for the old WordPress URL map (MA-115).
export const POST = handler(async (request) => {
  await requireRole(request, ["owner", "editor"]);
  const { csv } = (await request.json()) as { csv?: string };
  if (!csv?.trim()) throw new HttpError(422, "Paste CSV with from,to columns");
  const Model = modelFor(getResource("redirects")!);
  let imported = 0;
  const errors: string[] = [];
  for (const [i, raw] of csv.trim().split(/\r?\n/).entries()) {
    const [from, to, permanent] = raw.split(",").map((s) => s?.trim());
    if (!from || from.toLowerCase() === "from") continue;
    if (!from.startsWith("/") || !to) {
      errors.push(`Line ${i + 1}: "from" must start with / and "to" is required`);
      continue;
    }
    await Model.updateOne({ from }, { from, to, permanent: permanent !== "false" }, { upsert: true });
    imported++;
  }
  return json(request, { imported, errors });
});

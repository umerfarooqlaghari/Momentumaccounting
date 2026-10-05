import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { resources } from "@/lib/resources";
import { modelFor } from "@/lib/models";

export const OPTIONS = preflight;

// Everything the public website renders, in one cached request. Only published items are returned,
// and private settings (notification emails etc.) are stripped.
const PRIVATE_SETTINGS = ["notificationEmails", "leadRetentionMonths"];

export const GET = handler(async (request) => {
  const out: Record<string, unknown> = {};
  await Promise.all(
    resources
      .filter((r) => r.public)
      .map(async (r) => {
        const Model = modelFor(r);
        const hasPublished = r.fields.some((f) => f.name === "published");
        if (r.singleton) {
          const doc = (await Model.findOne().lean()) as Record<string, unknown> | null;
          if (doc && r.key === "settings") for (const k of PRIVATE_SETTINGS) delete doc[k];
          out[r.key] = doc;
        } else {
          out[r.key] = await Model.find(hasPublished ? { published: true } : {})
            .sort(r.sort ?? { createdAt: 1 })
            .select("-__v")
            .lean();
        }
      }),
  );
  return json(request, out);
});

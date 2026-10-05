import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { getResource } from "@/lib/resources";
import { modelFor } from "@/lib/models";

export const OPTIONS = preflight;

export const GET = handler(async (request) => {
  const items = await modelFor(getResource("redirects")!).find().select("from to permanent -_id").lean();
  return json(request, { items });
});

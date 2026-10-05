import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { requireRole } from "@/lib/auth";
import { revalidateWebsite } from "@/lib/revalidate";
import { bumpContentVersion } from "@/lib/content-events";

export const OPTIONS = preflight;

// Pushes current content to the website now and reports whether the website accepted it.
// Used by the dashboard's "Website updates" health check and its "Refresh website now" button.
export const POST = handler(async (request) => {
  await requireRole(request, ["owner", "editor"]);
  const result = await revalidateWebsite();
  if (result.ok) await bumpContentVersion();
  return json(request, result, result.ok ? 200 : 502);
});

import { json } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { requireRole } from "@/lib/auth";

export const GET = handler(async (request) => {
  const session = await requireRole(request, ["owner", "editor", "leads"]);
  return json(request, { user: session });
});

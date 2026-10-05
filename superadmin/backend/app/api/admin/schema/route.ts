import { json } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { requireRole } from "@/lib/auth";
import { resources } from "@/lib/resources";

// Superadmin renders its navigation and forms from these definitions.
export const GET = handler(async (request) => {
  const session = await requireRole(request, ["owner", "editor", "leads"]);
  const visible = resources.filter((r) => session.role === "owner" || r.roles.includes(session.role));
  return json(request, { resources: visible, role: session.role });
});

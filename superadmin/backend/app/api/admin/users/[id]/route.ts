import bcrypt from "bcryptjs";
import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { HttpError, requireRole } from "@/lib/auth";
import { AdminUser } from "@/lib/models";

export const OPTIONS = preflight;

export const PUT = handler(async (request, { id }) => {
  const session = await requireRole(request, ["owner"]);
  const body = (await request.json()) as { name?: string; role?: string; active?: boolean; password?: string };
  const user = await AdminUser.findById(id);
  if (!user) throw new HttpError(404, "Not found");
  if (String(user._id) === session.sub && (body.role && body.role !== "owner" || body.active === false)) {
    throw new HttpError(422, "You can't demote or deactivate your own account");
  }
  if (body.name) user.name = body.name;
  if (body.role) user.role = body.role;
  if (typeof body.active === "boolean") user.active = body.active;
  if (body.password) {
    if (body.password.length < 12) throw new HttpError(422, "Password must be at least 12 characters");
    user.passwordHash = await bcrypt.hash(body.password, 12);
  }
  await user.save();
  return json(request, { ok: true });
});

export const DELETE = handler(async (request, { id }) => {
  const session = await requireRole(request, ["owner"]);
  if (id === session.sub) throw new HttpError(422, "You can't delete your own account");
  await AdminUser.findByIdAndDelete(id);
  return json(request, { ok: true });
});

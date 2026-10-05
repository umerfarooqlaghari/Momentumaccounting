import bcrypt from "bcryptjs";
import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { HttpError, requireRole } from "@/lib/auth";
import { AdminUser } from "@/lib/models";

export const OPTIONS = preflight;

export const GET = handler(async (request) => {
  await requireRole(request, ["owner"]);
  const users = await AdminUser.find().select("-passwordHash").sort({ createdAt: 1 }).lean();
  return json(request, { items: users });
});

export const POST = handler(async (request) => {
  await requireRole(request, ["owner"]);
  const { email, name, password, role } = (await request.json()) as Record<string, string>;
  if (!email || !name || !password) throw new HttpError(422, "Name, email and password are required");
  if (password.length < 12) throw new HttpError(422, "Password must be at least 12 characters");
  const user = await AdminUser.create({ email, name, role, passwordHash: await bcrypt.hash(password, 12) });
  const { passwordHash, ...safe } = user.toObject();
  void passwordHash;
  return json(request, { item: safe }, 201);
});

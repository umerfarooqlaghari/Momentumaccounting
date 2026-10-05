import bcrypt from "bcryptjs";
import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { signSession } from "@/lib/auth";
import { AdminUser } from "@/lib/models";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const OPTIONS = preflight;

export const POST = handler(async (request) => {
  const { email, password } = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
  if (!email || !password) return json(request, { error: "Email and password are required" }, 400);

  // Brute-force protection per IP and per account.
  const ok = rateLimit(`login:${clientIp(request)}`, 10, 15 * 60_000) && rateLimit(`login:${email.toLowerCase()}`, 5, 15 * 60_000);
  if (!ok) return json(request, { error: "Too many attempts. Try again in 15 minutes." }, 429);

  const user = await AdminUser.findOne({ email: email.toLowerCase(), active: true });
  const valid = user && (await bcrypt.compare(password, user.passwordHash));
  if (!valid) return json(request, { error: "Incorrect email or password" }, 401);

  user.lastLoginAt = new Date();
  await user.save();
  const session = { sub: String(user._id), email: user.email, name: user.name, role: user.role };
  return json(request, { token: await signSession(session), user: session });
});

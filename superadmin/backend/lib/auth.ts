import { SignJWT, jwtVerify } from "jose";
import type { Role } from "./resources";

export type Session = { sub: string; email: string; name: string; role: Role };

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error("JWT_SECRET must be set (32+ characters)");
  return new TextEncoder().encode(s);
}

export async function signSession(session: Session) {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret());
}

export async function getSession(request: Request): Promise<Session | null> {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Throws 401/403 unless the request carries a valid session with one of the roles. Owners can do everything. */
export async function requireRole(request: Request, roles: Role[]) {
  const session = await getSession(request);
  if (!session) throw new HttpError(401, "Not signed in");
  if (session.role !== "owner" && !roles.includes(session.role)) throw new HttpError(403, "Not allowed");
  return session;
}

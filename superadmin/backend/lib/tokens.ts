import { SignJWT, jwtVerify } from "jose";

// Signed, expiring links for downloads and unsubscribes (no guessable public URLs).
const key = () => new TextEncoder().encode(process.env.JWT_SECRET ?? "");

export async function signToken(payload: Record<string, string>, expires: string) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(expires).sign(key());
}

export async function verifyToken<T>(token: string): Promise<T | null> {
  try {
    return (await jwtVerify(token, key())).payload as T;
  } catch {
    return null;
  }
}

export function publicApiUrl() {
  return process.env.PUBLIC_API_URL ?? "http://localhost:4000";
}

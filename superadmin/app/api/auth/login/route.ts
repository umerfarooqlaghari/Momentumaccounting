import { NextResponse } from "next/server";
import { SESSION_COOKIE, backendUrl } from "@/lib/session";

// Exchanges email + password for a backend token and keeps it in an httpOnly cookie,
// so browser JavaScript never sees the token.
export async function POST(request: Request) {
  const body = await request.text();
  const res = await fetch(`${backendUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Forwarded-For": request.headers.get("x-forwarded-for") ?? "" },
    body,
  }).catch(() => null);
  if (!res) return NextResponse.json({ error: "Can't reach the backend. Is it running?" }, { status: 502 });

  const data = (await res.json()) as { token?: string; user?: unknown; error?: string };
  if (!res.ok || !data.token) return NextResponse.json({ error: data.error ?? "Login failed" }, { status: res.status });

  const response = NextResponse.json({ user: data.user });
  response.cookies.set(SESSION_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
  return response;
}

import { NextResponse } from "next/server";
import { SESSION_COOKIE, backendUrl, unreachableMessage } from "@/lib/session";

// Exchanges email + password for a backend token and keeps it in an httpOnly cookie,
// so browser JavaScript never sees the token.
export async function POST(request: Request) {
  const body = await request.text();
  let res: Response;
  try {
    res = await fetch(`${backendUrl()}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": request.headers.get("x-forwarded-for") ?? "" },
      body,
    });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: unreachableMessage(err) }, { status: 502 });
  }
  if (!res.headers.get("content-type")?.includes("json")) {
    return NextResponse.json({ error: `The backend at ${backendUrl()} returned an unexpected response (${res.status}). Check BACKEND_URL.` }, { status: 502 });
  }

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

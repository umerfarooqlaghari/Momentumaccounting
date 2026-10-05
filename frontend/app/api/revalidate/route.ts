import { revalidateTag } from "next/cache";

// Called by the backend after content is edited in superadmin.
//   POST /api/revalidate          → expire cached content now
//   POST /api/revalidate?check=1  → only verify the secret (used by the superadmin health check)
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  const sent = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!secret) return Response.json({ error: "REVALIDATE_SECRET is not set on the website" }, { status: 503 });
  if (sent !== secret) return Response.json({ error: "Unauthorised" }, { status: 401 });

  if (new URL(request.url).searchParams.get("check")) return Response.json({ ok: true, checked: true });

  // expire: 0 → the very next request renders fresh content (no stale-while-revalidate),
  // so an edit in superadmin shows up as soon as open tabs refresh.
  revalidateTag("content", { expire: 0 });
  return Response.json({ revalidated: true });
}

import { revalidateTag } from "next/cache";

// Called by the backend after content is edited in superadmin.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }
  // expire: 0 → the very next request renders fresh content (no stale-while-revalidate),
  // so an edit in superadmin shows up as soon as open tabs refresh.
  revalidateTag("content", { expire: 0 });
  return Response.json({ revalidated: true });
}

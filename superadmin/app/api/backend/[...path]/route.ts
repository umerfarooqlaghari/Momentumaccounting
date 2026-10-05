import { cookies } from "next/headers";
import { SESSION_COOKIE, backendUrl, unreachableMessage } from "@/lib/session";

// Same-origin bridge to the backend: attaches the session token from the httpOnly cookie.
async function forward(request: Request, ctx: RouteContext<"/api/backend/[...path]">) {
  const { path } = await ctx.params;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return Response.json({ error: "Not signed in" }, { status: 401 });

  const url = new URL(request.url);
  const target = `${backendUrl()}/api/${path.map(encodeURIComponent).join("/")}${url.search}`;
  const headers = new Headers({ Authorization: `Bearer ${token}` });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  let res: Response;
  try {
    res = await fetch(target, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
    });
  } catch (err) {
    console.error("[backend bridge]", err);
    return Response.json({ error: unreachableMessage(err) }, { status: 502 });
  }

  const out = new Headers();
  for (const h of ["content-type", "content-disposition"]) {
    const v = res.headers.get(h);
    if (v) out.set(h, v);
  }
  return new Response(res.body, { status: res.status, headers: out });
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };

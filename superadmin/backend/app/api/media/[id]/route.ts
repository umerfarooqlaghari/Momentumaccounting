import { Readable } from "node:stream";
import { handler } from "@/lib/handler";
import { findFile, streamFile } from "@/lib/media";

// Public images (team photos, covers). PDFs are only served through signed download links.
export const GET = handler(async (_request, { id }) => {
  const file = await findFile(id);
  const type = file?.metadata?.contentType as string | undefined;
  if (!file || !type?.startsWith("image/")) return new Response("Not found", { status: 404 });
  return new Response(Readable.toWeb(streamFile(id)) as ReadableStream, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      ...(type === "image/svg+xml" ? { "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'" } : {}),
    },
  });
});

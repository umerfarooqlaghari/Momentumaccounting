import { Readable } from "node:stream";
import { handler } from "@/lib/handler";
import { findFile, streamFile } from "@/lib/media";
import { verifyToken } from "@/lib/tokens";

// Lead-magnet downloads only work through a signed link that expires after 7 days.
export const GET = handler(async (request) => {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const payload = await verifyToken<{ file: string; slug: string }>(token);
  if (!payload) return new Response("This download link has expired. Please request it again on our website.", { status: 410 });
  const file = await findFile(payload.file);
  if (!file) return new Response("File not found", { status: 404 });
  return new Response(Readable.toWeb(streamFile(payload.file)) as ReadableStream, {
    headers: {
      "Content-Type": file.metadata?.contentType ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${file.filename.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
});

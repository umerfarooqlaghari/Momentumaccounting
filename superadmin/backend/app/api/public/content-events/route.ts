import { connectDB } from "@/lib/db";
import { corsHeaders, preflight } from "@/lib/cors";
import { contentEvents, getContentVersion } from "@/lib/content-events";

export const OPTIONS = preflight;

// Serverless hosts (Vercel) end long requests; the browser's EventSource reconnects automatically
// and the "ready" version check catches anything saved while it was reconnecting.
export const maxDuration = 300;

// Server-Sent Events stream for the public website. Sends the current content version on connect,
// then a "content" event whenever superadmin saves something that appears on the website.
export async function GET(request: Request) {
  await connectDB();
  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream({
    async start(controller) {
      let last = await getContentVersion();
      const send = (event: string, data: string) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
        } catch {
          cleanup();
        }
      };
      const onContent = (version: string) => {
        if (version === last) return;
        last = version;
        send("content", version);
      };

      send("ready", last);
      contentEvents.on("content", onContent);
      // Picks up changes saved on another server instance.
      const poll = setInterval(async () => {
        try {
          onContent(await getContentVersion());
        } catch {}
      }, 5_000);
      // Keeps proxies from closing an idle connection.
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          cleanup();
        }
      }, 25_000);

      cleanup = () => {
        contentEvents.off("content", onContent);
        clearInterval(poll);
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch {}
      };
      request.signal.addEventListener("abort", cleanup);
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders(request),
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/site";

// Listens for content changes from superadmin and refreshes the page data in place
// (no full reload — scroll position and anything typed into forms are kept).
export function LiveContent() {
  const router = useRouter();

  useEffect(() => {
    let baseline: string | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const source = new EventSource(`${apiUrl}/api/public/content-events`);

    const refresh = () => {
      // Small debounce so a burst of saves causes one refresh.
      clearTimeout(timer);
      timer = setTimeout(() => router.refresh(), 300);
    };

    source.addEventListener("ready", (e) => {
      const version = (e as MessageEvent<string>).data;
      // After a reconnect, refresh if something changed while we were disconnected.
      if (baseline !== null && version !== baseline) refresh();
      baseline = version;
    });
    source.addEventListener("content", (e) => {
      baseline = (e as MessageEvent<string>).data;
      refresh();
    });

    return () => {
      clearTimeout(timer);
      source.close();
    };
  }, [router]);

  return null;
}

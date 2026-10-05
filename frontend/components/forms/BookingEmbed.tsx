"use client";

import { useSyncExternalStore } from "react";
import { getAttribution } from "@/lib/attribution";

function buildSrc(url: string) {
  try {
    const u = new URL(url);
    const a = getAttribution();
    if (u.hostname.includes("calendly.com")) {
      u.searchParams.set("embed_domain", window.location.hostname);
      u.searchParams.set("embed_type", "Inline");
      if (a.utmSource) u.searchParams.set("utm_source", a.utmSource);
      if (a.utmCampaign) u.searchParams.set("utm_campaign", a.utmCampaign);
    } else {
      u.searchParams.set("embed", "true");
      if (a.utmSource) u.searchParams.set("metadata[utm_source]", a.utmSource);
      if (a.utmCampaign) u.searchParams.set("metadata[utm_campaign]", a.utmCampaign);
    }
    return u.toString();
  } catch {
    return "";
  }
}

const noop = () => () => {};

// Embeds the practice's booking calendar (Cal.com or Calendly) and passes campaign data through,
// so the booking webhook can attribute the lead (MA-052 / MA-073).
export function BookingEmbed({ url }: { url: string }) {
  // Built on the client only, because it needs the visitor's session attribution.
  const src = useSyncExternalStore(noop, () => buildSrc(url), () => "");

  return (
    <div className="overflow-hidden rounded-[28px] border border-charcoal/10 bg-white shadow-[0_40px_80px_-40px_rgb(34_32_30/0.35)]">
      {src ? (
        <iframe src={src} title="Book an introductory call" className="h-[760px] w-full" loading="lazy" />
      ) : (
        <div className="grid h-[400px] place-items-center text-muted">Loading calendar…</div>
      )}
    </div>
  );
}

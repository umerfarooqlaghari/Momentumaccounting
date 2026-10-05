"use client";

import { Play } from "lucide-react";
import { readConsent, saveConsent, useConsent } from "@/lib/consent";

function embedUrl(url: string) {
  const ig = url.match(/instagram\.com\/(?:p|reel)\/([\w-]+)/);
  if (ig) return { src: `https://www.instagram.com/p/${ig[1]}/embed`, network: "Instagram" };
  const tt = url.match(/tiktok\.com\/.*\/video\/(\d+)/);
  if (tt) return { src: `https://www.tiktok.com/embed/v2/${tt[1]}`, network: "TikTok" };
  return null;
}

// Founder's Instagram/TikTok posts (§1.5, §7.1). Embeds set third-party cookies, so they load only with
// marketing consent — otherwise a click-to-load placeholder is shown.
export function SocialFeed({ posts }: { posts: string[] }) {
  const allowed = !!useConsent()?.marketing;

  const items = posts.map(embedUrl).filter((x): x is NonNullable<ReturnType<typeof embedUrl>> => !!x).slice(0, 3);
  if (!items.length) return null;

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((item) =>
        allowed ? (
          <iframe key={item.src} src={item.src} title={`${item.network} post`} loading="lazy" className="h-[560px] w-full rounded-3xl border border-charcoal/10 bg-white" />
        ) : (
          <div key={item.src} className="grid h-[420px] place-items-center rounded-3xl border border-dashed border-charcoal/20 bg-white p-8 text-center">
            <div>
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-teal-50 text-teal-ink">
                <Play aria-hidden className="size-6" />
              </span>
              <p className="mt-4 font-semibold text-charcoal-900">{item.network} post</p>
              <p className="mt-1 text-sm text-muted">Loading this post lets {item.network} set cookies.</p>
              <button onClick={() => saveConsent(readConsent()?.analytics ?? false, true)} className="mt-5 min-h-11 rounded-full bg-charcoal-900 px-5 text-sm font-semibold text-white">
                Allow and show posts
              </button>
            </div>
          </div>
        ),
      )}
    </div>
  );
}

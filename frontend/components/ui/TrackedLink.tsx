"use client";

import { track, type TrackEvent } from "@/lib/analytics";

// Phone and email links that count as conversions (click_to_call / click_email).
export function TrackedLink({ href, event, className, children, ariaLabel }: { href: string; event: TrackEvent; className?: string; children: React.ReactNode; ariaLabel?: string }) {
  return (
    <a href={href} onClick={() => track(event)} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}

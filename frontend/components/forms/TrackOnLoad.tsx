"use client";

import { useEffect } from "react";
import { track, type TrackEvent } from "@/lib/analytics";

export function TrackOnLoad({ event, params }: { event: TrackEvent; params?: Record<string, unknown> }) {
  useEffect(() => {
    track(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
  return null;
}

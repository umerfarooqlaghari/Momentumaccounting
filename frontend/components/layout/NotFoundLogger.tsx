"use client";

import { useEffect } from "react";
import { apiUrl } from "@/lib/site";

// Reports 404s to the backend so missing redirects show up in superadmin → 404 log.
export function NotFoundLogger() {
  useEffect(() => {
    fetch(`${apiUrl}/api/public/not-found`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname, referrer: document.referrer }),
      keepalive: true,
    }).catch(() => {});
  }, []);
  return null;
}

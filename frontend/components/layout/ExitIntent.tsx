"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ClipboardCheck, X } from "lucide-react";

const KEY = "ma_exit_offer";
const SKIP = ["/lp/", "/contact", "/book-a-call", "/tools", "/thank-you", "/guides/"];

// A single, dismissible offer when a desktop visitor heads for the address bar. Shown at most once per 14 days.
export function ExitIntent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (SKIP.some((p) => pathname.startsWith(p)) || !window.matchMedia("(pointer: fine)").matches) return;
    try {
      const last = Number(localStorage.getItem(KEY) ?? 0);
      if (Date.now() - last < 14 * 86_400_000) return;
    } catch {
      return;
    }
    const armedAt = Date.now();
    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 0 || e.relatedTarget || Date.now() - armedAt < 15_000) return;
      setOpen(true);
      try {
        localStorage.setItem(KEY, String(Date.now()));
      } catch {}
      document.removeEventListener("mouseout", onLeave);
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-charcoal-900/50 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div role="dialog" aria-modal="true" aria-labelledby="exit-title" onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md animate-[fade-in_0.35s_ease] rounded-[28px] bg-white p-8 text-center shadow-2xl">
        <button ref={closeRef} onClick={() => setOpen(false)} aria-label="Close" className="absolute top-4 right-4 grid size-10 place-items-center rounded-full hover:bg-stone-100">
          <X className="size-5" />
        </button>
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-teal text-charcoal-900">
          <ClipboardCheck aria-hidden className="size-7" />
        </span>
        <h2 id="exit-title" className="mt-5 text-2xl font-extrabold text-charcoal-900">
          Before you go…
        </h2>
        <p className="mt-2 text-muted">Is your accountant really helping your business grow? Find out in 60 seconds.</p>
        <Link href="/tools/health-check" onClick={() => setOpen(false)} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-teal px-6 font-semibold text-charcoal-900 hover:bg-[#2ab8b9]">
          Take the free health check
        </Link>
      </div>
    </div>
  );
}

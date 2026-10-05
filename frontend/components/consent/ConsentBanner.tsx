"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { OPEN_SETTINGS_EVENT, readConsent, saveConsent, useConsent } from "@/lib/consent";

// UK GDPR / PECR: nothing non-essential runs until the visitor chooses. Accept and reject are equally prominent.
export function ConsentBanner() {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const reopen = () => {
      const c = readConsent();
      setAnalytics(c?.analytics ?? false);
      setMarketing(c?.marketing ?? false);
      setManage(true);
      setReopened(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  const open = reopened || consent === null;
  if (!open) return null;

  const choose = (a: boolean, m: boolean) => {
    saveConsent(a, m);
    setReopened(false);
    setManage(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[60] mx-auto max-w-xl animate-[fade-in_0.4s_ease] rounded-3xl border border-charcoal/10 bg-white p-6 shadow-[0_30px_80px_-20px_rgb(34_32_30/0.45)] sm:bottom-5 sm:left-5 sm:mx-0"
    >
      <div className="flex items-start gap-4">
        <span className="hidden size-11 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-ink sm:grid">
          <Cookie aria-hidden className="size-5" />
        </span>
        <div className="flex-1">
          <h2 id="cookie-title" className="font-bold text-charcoal-900">
            Cookies on this website
          </h2>
          <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
            We use essential cookies to make the site work. With your permission we&apos;d also like to use analytics and
            marketing cookies to understand how the site is used and measure our advertising.{" "}
            <Link href="/cookie-policy" className="font-semibold text-teal-ink underline underline-offset-2">
              Cookie policy
            </Link>
          </p>

          {manage && (
            <div className="mt-4 space-y-3 rounded-2xl bg-stone-50 p-4 text-[15px]">
              <label className="flex items-start gap-3 opacity-70">
                <input type="checkbox" checked disabled className="mt-1 size-5 accent-teal-ink" />
                <span>
                  <strong className="text-charcoal-900">Essential</strong> — always on. Remembers your cookie choice.
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1 size-5 accent-teal-ink" />
                <span>
                  <strong className="text-charcoal-900">Analytics</strong> — Google Analytics, to see which pages help visitors.
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 size-5 accent-teal-ink" />
                <span>
                  <strong className="text-charcoal-900">Marketing</strong> — Google Ads, Meta, LinkedIn and TikTok, to measure
                  adverts. Also enables embedded social media posts.
                </span>
              </label>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {manage ? (
              <button onClick={() => choose(analytics, marketing)} className="min-h-11 rounded-full bg-charcoal-900 px-5 text-sm font-semibold text-white">
                Save choices
              </button>
            ) : (
              <button onClick={() => setManage(true)} className="min-h-11 rounded-full px-4 text-sm font-semibold text-charcoal underline underline-offset-4">
                Manage
              </button>
            )}
            <button onClick={() => choose(false, false)} className="min-h-11 rounded-full border border-charcoal/20 px-5 text-sm font-semibold text-charcoal-900 hover:border-charcoal/50">
              Reject all
            </button>
            <button onClick={() => choose(true, true)} className="min-h-11 rounded-full bg-teal px-5 text-sm font-semibold text-charcoal-900 hover:bg-[#2ab8b9]">
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))} className={className}>
      Cookie settings
    </button>
  );
}

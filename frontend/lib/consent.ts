"use client";

import { useSyncExternalStore } from "react";

export type Consent = { analytics: boolean; marketing: boolean; at: string; v: number };
const KEY = "ma_consent";
const VERSION = 1;
export const CONSENT_EVENT = "ma:consent";
export const OPEN_SETTINGS_EVENT = "ma:open-cookie-settings";

export function readConsent(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) ?? "null") as Consent | null;
    return c && c.v === VERSION ? c : null;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean, marketing: boolean) {
  const c: Consent = { analytics, marketing, at: new Date().toISOString(), v: VERSION };
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {}
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: c }));
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

// ── React binding ────────────────────────────────────────────────────────────

function subscribe(cb: () => void) {
  window.addEventListener(CONSENT_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CONSENT_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function rawSnapshot() {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

/**
 * Current consent. `undefined` while server-rendering (unknown), `null` when the visitor hasn't chosen yet.
 */
export function useConsent(): Consent | null | undefined {
  const raw = useSyncExternalStore(subscribe, rawSnapshot, () => "ssr");
  if (raw === "ssr") return undefined;
  return readConsent();
}

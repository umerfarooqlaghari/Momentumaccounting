import { EventEmitter } from "node:events";
import { CacheEntry } from "./models";

// Tells open website tabs that content changed, so they refresh without a reload.
// In-process events give instant delivery; the version stored in MongoDB lets every server
// instance (and reconnecting browsers) catch changes made on another instance.
const globalForEvents = globalThis as unknown as { contentEvents?: EventEmitter };
export const contentEvents = (globalForEvents.contentEvents ??= new EventEmitter().setMaxListeners(0));

const KEY = "content-version";

export async function getContentVersion(): Promise<string> {
  const doc = (await CacheEntry.findOne({ key: KEY }).lean()) as { value?: string } | null;
  return doc?.value ?? "0";
}

export async function bumpContentVersion() {
  const version = String(Date.now());
  await CacheEntry.updateOne({ key: KEY }, { value: version }, { upsert: true });
  contentEvents.emit("content", version);
  return version;
}

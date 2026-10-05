// Saves the current published content from the backend as the website's offline fallback.
// Run after major content changes:  npm run snapshot
import { writeFileSync } from "node:fs";

const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const res = await fetch(`${api}/api/public/site`);
if (!res.ok) throw new Error(`Backend responded ${res.status}`);
const data = await res.json();
writeFileSync(new URL("../lib/fallback-data.json", import.meta.url), JSON.stringify(data, null, 2) + "\n");
console.log("Saved lib/fallback-data.json:", Object.keys(data).join(", "));

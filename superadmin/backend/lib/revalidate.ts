// Tells the public website to refresh its cached content after an edit in superadmin.
export async function revalidateWebsite() {
  const url = process.env.FRONTEND_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;
  try {
    await fetch(`${url}/api/revalidate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}` },
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.warn("[revalidate] website did not respond", (err as Error).message);
  }
}

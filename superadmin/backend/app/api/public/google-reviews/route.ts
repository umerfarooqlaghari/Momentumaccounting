import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { CacheEntry } from "@/lib/models";

export const OPTIONS = preflight;

type Reviews = {
  rating: number;
  count: number;
  url?: string;
  reviews: { author: string; rating: number; text: string; time: string; photo?: string }[];
};

// Live Google rating via the Places API (New), cached for 12 hours (MA-057).
// Requires GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in .env (both in the practice's Google account).
export const GET = handler(async (request) => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return json(request, { available: false });

  const cached = (await CacheEntry.findOne({ key: "google-reviews" }).lean()) as { value: Reviews; expiresAt: Date } | null;
  if (cached && new Date(cached.expiresAt) > new Date()) return json(request, { available: true, ...cached.value });

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Places API ${res.status}`);
    const data = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: { rating: number; text?: { text: string }; relativePublishTimeDescription: string; authorAttribution?: { displayName: string; photoUri?: string } }[];
    };
    const value: Reviews = {
      rating: data.rating ?? 0,
      count: data.userRatingCount ?? 0,
      url: data.googleMapsUri,
      reviews: (data.reviews ?? []).map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google user",
        photo: r.authorAttribution?.photoUri,
        rating: r.rating,
        text: r.text?.text ?? "",
        time: r.relativePublishTimeDescription,
      })),
    };
    await CacheEntry.updateOne(
      { key: "google-reviews" },
      { value, expiresAt: new Date(Date.now() + 12 * 3600_000) },
      { upsert: true },
    );
    return json(request, { available: true, ...value });
  } catch (err) {
    console.warn("[google-reviews]", (err as Error).message);
    if (cached) return json(request, { available: true, stale: true, ...cached.value });
    return json(request, { available: false });
  }
});

import type { Metadata } from "next";
import { Star } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { TestimonialGrid } from "@/components/sections/Testimonials";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getGoogleReviews, getPageText, getSite } from "@/lib/data";

const DEFAULTS = {
  heroEyebrow: "Reviews",
  heroTitle: "Don't just take our word for it",
  heroText: "Almost all of our new clients come from referrals. Here's what business owners say about working with us.",
  seoTitle: "Client reviews",
  seoDescription: "What business owners say about working with Momentum Accounting.",
  ctaTitle: "Become our next success story",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getPageText("reviews", DEFAULTS);
  return { title: t.seoTitle, description: t.seoDescription };
}

export default async function ReviewsPage() {
  const [{ testimonials, settings }, google, t] = await Promise.all([getSite(), getGoogleReviews(), getPageText("reviews", DEFAULTS)]);
  const googleUrl = google.url || settings.googleReviewsUrl;

  return (
    <>
      <PageHero eyebrow={t.heroEyebrow} title={t.heroTitle} text={t.heroText} crumbs={[{ label: "Reviews" }]} />

      <section className="pb-20 sm:pb-28">
        <Container>
          {(google.available || googleUrl) && (
            <Reveal className="mb-12 flex flex-col items-start gap-6 rounded-3xl border border-charcoal/10 bg-white p-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <span className="grid size-16 place-items-center rounded-2xl bg-teal-50 text-2xl font-extrabold text-teal-ink" aria-hidden>
                  G
                </span>
                <div>
                  <p className="font-semibold text-muted">Google reviews</p>
                  {google.available && google.rating ? (
                    <p className="flex items-center gap-2 text-2xl font-extrabold text-charcoal-900">
                      {google.rating.toFixed(1)}
                      <span className="flex text-teal" role="img" aria-label={`${google.rating.toFixed(1)} out of 5 stars`}>
                        {Array.from({ length: Math.round(google.rating) }).map((_, i) => (
                          <Star key={i} aria-hidden className="size-5 fill-current" />
                        ))}
                      </span>
                      <span className="text-base font-medium text-muted">from {google.count} reviews</span>
                    </p>
                  ) : (
                    <p className="text-lg font-bold text-charcoal-900">See what clients say on Google</p>
                  )}
                </div>
              </div>
              {googleUrl && (
                <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-ink underline underline-offset-4">
                  Read our reviews on Google
                </a>
              )}
            </Reveal>
          )}
          <TestimonialGrid items={testimonials} />
          {google.available && google.reviews && google.reviews.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-extrabold text-charcoal-900">Latest on Google</h2>
              <div className="mt-8">
                <TestimonialGrid items={google.reviews.map((r) => ({ quote: r.text, name: r.author, role: r.time, rating: r.rating }))} />
              </div>
            </div>
          )}
        </Container>
      </section>

      <CtaBand title={t.ctaTitle} text={t.ctaText} />
    </>
  );
}

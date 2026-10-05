import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { TestimonialGrid } from "@/components/sections/Testimonials";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { getPageText, getSite } from "@/lib/data";

const DEFAULTS = {
  heroEyebrow: "Case studies",
  heroTitle: "Businesses building momentum",
  heroText: "Short stories from the directors we work with: where they started, what we changed and what it meant for them.",
  seoTitle: "Client case studies",
  seoDescription: "How Momentum Accounting helps growing limited companies with quarterly accounts, tax planning and a personal service.",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getPageText("case-studies", DEFAULTS);
  return { title: t.seoTitle, description: t.seoDescription };
}

export default async function CaseStudiesPage() {
  const { caseStudies, testimonials } = await getSite();
  const t = await getPageText("case-studies", DEFAULTS);

  return (
    <>
      <PageHero eyebrow={t.heroEyebrow} title={t.heroTitle} text={t.heroText} crumbs={[{ label: "Case studies" }]} />
      <section className="pb-20 sm:pb-28">
        <Container>
          {caseStudies.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {caseStudies.map((c, i) => (
                <Reveal key={c.slug} delay={(i % 2) * 100}>
                  <Link href={`/case-studies/${c.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-charcoal/10 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                    {c.image && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <MediaImage id={c.image} alt="" sizes="(min-width: 768px) 50vw, 100vw" className="transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-8">
                      {c.sector && <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-ink">{c.sector}</span>}
                      <h2 className="mt-4 text-2xl font-bold text-charcoal-900 group-hover:text-teal-ink">{c.title}</h2>
                      <p className="mt-3 flex-1 leading-relaxed text-muted">{c.summary}</p>
                      <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-teal-ink">
                        Read the story <ArrowUpRight aria-hidden className="size-4" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <>
              <p className="mb-10 max-w-2xl text-lg text-muted">Full case studies are on their way. In the meantime, here&apos;s what our clients say.</p>
              <TestimonialGrid items={testimonials} />
            </>
          )}
        </Container>
      </section>
      <CtaBand title={t.ctaTitle ?? "Could your business be next?"} text={t.ctaText} />
    </>
  );
}

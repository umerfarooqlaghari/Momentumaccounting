import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Quote } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/Container";
import { Markdown } from "@/components/ui/Markdown";
import { MediaImage } from "@/components/ui/MediaImage";
import { Reveal } from "@/components/ui/Reveal";
import { getSite } from "@/lib/data";

export async function generateStaticParams() {
  const { caseStudies } = await getSite();
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = (await getSite()).caseStudies.find((x) => x.slug === slug);
  if (!c) return {};
  return { title: c.seoTitle || c.title, description: c.seoDescription || c.summary };
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const c = (await getSite()).caseStudies.find((x) => x.slug === slug);
  if (!c) notFound();

  return (
    <>
      <PageHero eyebrow={[c.client, c.sector].filter(Boolean).join(" · ") || "Case study"} title={c.title} text={c.summary} crumbs={[{ label: "Case studies", href: "/case-studies" }, { label: c.title }]} />
      <section className="pb-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="max-w-2xl space-y-12">
            {c.image && (
              <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
                <MediaImage id={c.image} alt="" sizes="(min-width: 1024px) 672px, 100vw" priority />
              </div>
            )}
            {c.challenge && (
              <div>
                <h2 className="mb-4 text-2xl font-extrabold text-charcoal-900">The challenge</h2>
                <Markdown>{c.challenge}</Markdown>
              </div>
            )}
            {c.solution && (
              <div>
                <h2 className="mb-4 text-2xl font-extrabold text-charcoal-900">What we did</h2>
                <Markdown>{c.solution}</Markdown>
              </div>
            )}
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {c.results.length > 0 && (
              <Reveal className="rounded-3xl bg-charcoal-900 p-8 text-white">
                <h2 className="text-sm font-semibold tracking-wide text-teal uppercase">Results</h2>
                <ul className="mt-5 space-y-3">
                  {c.results.map((r) => (
                    <li key={r} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-teal text-charcoal-900">
                        <Check aria-hidden className="size-3.5" strokeWidth={3} />
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            {c.quote && (
              <Reveal delay={100} className="rounded-3xl border border-charcoal/10 bg-white p-8">
                <Quote aria-hidden className="size-8 text-teal-100" />
                <blockquote className="mt-4 text-lg leading-relaxed text-charcoal-900">“{c.quote}”</blockquote>
                {c.quoteName && <p className="mt-4 font-semibold">{c.quoteName}</p>}
              </Reveal>
            )}
          </aside>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}

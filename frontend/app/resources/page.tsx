import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getPageText, getSite } from "@/lib/data";

const DEFAULTS = {
  heroEyebrow: "Resources",
  heroTitle: "Guides and insights for business owners",
  heroText: "Practical, jargon-free articles on tax, growth and running a limited company.",
  seoTitle: "Resources for business owners",
  seoDescription: "Practical guides and articles on tax, growth and running a limited company.",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getPageText("resources", DEFAULTS);
  return { title: t.seoTitle, description: t.seoDescription };
}

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function ResourcesPage({ searchParams }: PageProps<"/resources">) {
  const { posts } = await getSite();
  const t = await getPageText("resources", DEFAULTS);
  const { category } = await searchParams;
  const categories = [...new Set(posts.map((p) => p.category))];
  const filtered = typeof category === "string" ? posts.filter((p) => p.category === category) : posts;
  const [featured, ...rest] = filtered;

  return (
    <>
      <PageHero eyebrow={t.heroEyebrow} title={t.heroTitle} text={t.heroText} crumbs={[{ label: "Resources" }]} />

      <section className="pb-20 sm:pb-28">
        <Container>
          {categories.length > 1 && (
            <nav aria-label="Categories" className="mb-8 flex flex-wrap gap-2">
              {[undefined, ...categories].map((c) => {
                const active = c === category || (!c && !category);
                return (
                  <Link
                    key={c ?? "all"}
                    href={c ? `/resources?category=${encodeURIComponent(c)}` : "/resources"}
                    aria-current={active ? "page" : undefined}
                    className={`min-h-11 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${active ? "border-charcoal-900 bg-charcoal-900 text-white" : "border-charcoal/15 bg-white hover:border-charcoal/40"}`}
                  >
                    {c ?? "All"}
                  </Link>
                );
              })}
            </nav>
          )}

          {!featured ? (
            <p className="text-muted">No articles in this category yet.</p>
          ) : (
            <>
              <Reveal>
                <Link href={`/resources/${featured.slug}`} className="group relative isolate grid overflow-hidden rounded-[32px] bg-charcoal-900 p-8 text-white sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
                  <div className="absolute -right-24 -bottom-24 -z-10 size-96 rounded-full bg-teal/25 blur-3xl transition-transform duration-700 group-hover:scale-110" aria-hidden />
                  <div>
                    <span className="rounded-full bg-teal px-3 py-1 text-xs font-bold text-charcoal-900">Featured · {featured.category}</span>
                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">{featured.title}</h2>
                    <p className="mt-4 max-w-xl text-lg text-white/70">{featured.excerpt}</p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 font-semibold text-teal lg:justify-self-end">
                    Read article <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {rest.map((p, i) => (
                  <Reveal key={p.slug} delay={(i % 2) * 100}>
                    <Link href={`/resources/${p.slug}`} className="group flex h-full flex-col rounded-3xl border border-charcoal/10 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                      <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-ink">{p.category}</span>
                      <h2 className="mt-5 text-2xl leading-snug font-bold text-charcoal-900 group-hover:text-teal-ink">{p.title}</h2>
                      <p className="mt-3 flex-1 leading-relaxed text-muted">{p.excerpt}</p>
                      <p className="mt-6 text-sm text-muted">
                        {fmt(p.date)} · {p.readMins ?? 4} min read
                      </p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>

      <CtaBand title={t.ctaTitle} text={t.ctaText} />
    </>
  );
}

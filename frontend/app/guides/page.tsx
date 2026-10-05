import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileDown } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getPageText, getSite } from "@/lib/data";

const DEFAULTS = {
  heroEyebrow: "Free guides",
  heroTitle: "Downloads for directors",
  heroText: "Practical guides and a real example of our quarterly report. Free to download.",
  seoTitle: "Free guides for limited company directors",
  seoDescription: "Download a sample quarterly report and practical guides for limited company directors.",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getPageText("guides", DEFAULTS);
  return { title: t.seoTitle, description: t.seoDescription };
}

export default async function GuidesPage() {
  const { leadMagnets } = await getSite();
  const t = await getPageText("guides", DEFAULTS);
  return (
    <>
      <PageHero eyebrow={t.heroEyebrow} title={t.heroTitle} text={t.heroText} crumbs={[{ label: "Guides" }]} />
      <section className="pb-20 sm:pb-28">
        <Container className="grid gap-5 md:grid-cols-2">
          {leadMagnets.map((m, i) => (
            <Reveal key={m.slug} delay={(i % 2) * 100}>
              <Link href={`/guides/${m.slug}`} className="group flex h-full gap-6 rounded-3xl border border-charcoal/10 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-ink">
                  <FileDown aria-hidden className="size-7" />
                </span>
                <span>
                  <span className="text-2xl font-bold text-charcoal-900 group-hover:text-teal-ink">{m.title}</span>
                  <span className="mt-2 block leading-relaxed text-muted">{m.description}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-teal-ink">
                    Get it free <ArrowUpRight aria-hidden className="size-4" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </Container>
      </section>
      <CtaBand title={t.ctaTitle} text={t.ctaText} />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, X } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { TestimonialGrid } from "@/components/sections/Testimonials";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { getSite } from "@/lib/data";

export async function generateStaticParams() {
  return (await getSite()).audiences.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/who-we-help/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = (await getSite()).audiences.find((x) => x.slug === slug);
  if (!a) return {};
  return { title: a.seoTitle || `Accountants for ${a.title.toLowerCase()}`, description: a.seoDescription || a.short };
}

export default async function AudiencePage({ params }: PageProps<"/who-we-help/[slug]">) {
  const { slug } = await params;
  const { audiences, testimonials } = await getSite();
  const a = audiences.find((x) => x.slug === slug);
  if (!a) notFound();

  return (
    <>
      <PageHero
        eyebrow={a.kind === "sector" ? "Specialist sector" : "Who we help"}
        title={a.kind === "sector" ? `Accountants for ${a.title.toLowerCase()} businesses` : a.title}
        text={a.short}
        crumbs={[{ label: "Who we help", href: "/who-we-help" }, { label: a.title }]}
      >
        <Button href="/book-a-call">Book an introductory call</Button>
      </PageHero>

      <section className="pb-20 sm:pb-28">
        <Container className="grid gap-6 lg:grid-cols-2">
          <Reveal className="rounded-3xl border border-charcoal/10 bg-white p-8 sm:p-10">
            <h2 className="text-2xl font-extrabold text-charcoal-900">Sound familiar?</h2>
            <ul className="mt-6 space-y-4">
              {a.pains.map((p) => (
                <li key={p} className="flex items-start gap-3 text-lg">
                  <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-red-50 text-red-700">
                    <X aria-hidden className="size-3.5" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="rounded-3xl bg-charcoal-900 p-8 text-white sm:p-10">
            <h2 className="text-2xl font-extrabold">How we help</h2>
            <ul className="mt-6 space-y-4">
              {a.help.map((h) => (
                <li key={h} className="flex items-start gap-3 text-lg">
                  <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-teal text-charcoal-900">
                    <Check aria-hidden className="size-3.5" strokeWidth={3} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {testimonials.length > 0 && (
        <section className="bg-white py-20 sm:py-28">
          <Container>
            <h2 className="text-3xl font-extrabold text-charcoal-900 sm:text-4xl">What our clients say</h2>
            <div className="mt-10">
              <TestimonialGrid items={testimonials.slice(0, 3)} />
            </div>
          </Container>
        </section>
      )}

      <CtaBand />
    </>
  );
}

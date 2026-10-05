import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, FileText } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { DownloadGate } from "@/components/tools/DownloadGate";
import { Container } from "@/components/ui/Container";
import { MediaImage } from "@/components/ui/MediaImage";
import { getSite } from "@/lib/data";

export async function generateStaticParams() {
  return (await getSite()).leadMagnets.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const m = (await getSite()).leadMagnets.find((x) => x.slug === slug);
  return m ? { title: m.title, description: m.description } : {};
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const m = (await getSite()).leadMagnets.find((x) => x.slug === slug);
  if (!m) notFound();

  return (
    <>
      <PageHero eyebrow="Free download" title={m.title} text={m.description} crumbs={[{ label: "Guides", href: "/guides" }, { label: m.title }]} />
      <section className="pb-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[28px] bg-gradient-to-br from-teal-100 to-teal-50">
              {m.cover ? <MediaImage id={m.cover} alt={`Cover of ${m.title}`} sizes="(min-width: 1024px) 40vw, 100vw" /> : <FileText aria-hidden className="size-24 text-teal-ink" />}
            </div>
            {m.bullets.length > 0 && (
              <ul className="mt-8 space-y-3">
                {m.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-lg">
                    <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-teal text-charcoal-900">
                      <Check aria-hidden className="size-3.5" strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <DownloadGate slug={m.slug} title={m.title} />
        </Container>
      </section>
    </>
  );
}

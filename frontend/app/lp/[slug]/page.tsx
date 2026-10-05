import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { TestimonialCard } from "@/components/sections/Testimonials";
import { Container } from "@/components/ui/Container";
import { getSite } from "@/lib/data";

export async function generateStaticParams() {
  return (await getSite()).landingPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lp/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getSite()).landingPages.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.headline, description: p.subheadline, robots: p.noindex ? { index: false, follow: false } : undefined };
}

// Focused campaign page for paid and social traffic (MA-046): one message, one form.
export default async function LandingPage({ params }: PageProps<"/lp/[slug]">) {
  const { slug } = await params;
  const { landingPages, testimonials, settings } = await getSite();
  const p = landingPages.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 sm:pt-40">
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" aria-hidden />
      <div className="absolute -top-40 right-[-10%] -z-10 size-[560px] rounded-full bg-teal/25 blur-[120px]" aria-hidden />
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-charcoal-900 text-balance sm:text-5xl lg:text-6xl">{p.headline}</h1>
          {p.subheadline && <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">{p.subheadline}</p>}
          <ul className="mt-8 space-y-3">
            {p.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-lg font-medium">
                <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-teal text-charcoal-900">
                  <Check aria-hidden className="size-3.5" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          {testimonials[0] && (
            <div className="mt-10">
              <TestimonialCard t={testimonials[0]} />
            </div>
          )}
        </div>
        <EnquiryForm intent={p.formIntent} source={p.slug} contactEmail={settings.email} />
      </Container>
    </section>
  );
}

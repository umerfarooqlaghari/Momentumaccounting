import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Faq, FaqJsonLd } from "@/components/sections/Faq";
import { TestimonialCard } from "@/components/sections/Testimonials";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSite } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export async function generateStaticParams() {
  return (await getSite()).services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = (await getSite()).services.find((x) => x.slug === slug);
  if (!s) return {};
  return { title: s.seoTitle || `${s.title} for limited companies`, description: s.seoDescription || `${s.short} ${s.intro}`.slice(0, 160) };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const { services, testimonials, settings } = await getSite();
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const testimonial = testimonials.find((t) => t.service === slug) ?? testimonials[0];
  const others = services.filter((s) => s.slug !== slug);

  return (
    <>
      <PageHero eyebrow="Services" title={service.title} text={service.intro} crumbs={[{ label: "Services", href: "/services" }, { label: service.title }]}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/book-a-call">Book an introductory call</Button>
          <Button href="/monthly-package" variant="ghost">
            Part of the monthly package
          </Button>
        </div>
      </PageHero>

      <section className="pb-20 sm:pb-28">
        <Container className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="rounded-3xl border border-charcoal/10 bg-white p-8 sm:p-10">
            <span className="grid size-14 place-items-center rounded-2xl bg-teal-50 text-teal-ink">
              <Icon name={service.icon} className="size-7" />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold text-charcoal-900 sm:text-3xl">What&apos;s included</h2>
            <ul className="mt-6 space-y-4">
              {service.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-lg text-charcoal">
                  <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-teal text-charcoal-900">
                    <Check aria-hidden className="size-3.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="grid gap-8">
            {service.why && (
              <Reveal delay={100} className="rounded-3xl bg-charcoal-900 p-8 text-white">
                <p className="text-sm font-semibold tracking-wide text-teal uppercase">Why Momentum</p>
                <p className="mt-4 text-xl leading-relaxed font-semibold">{service.why}</p>
              </Reveal>
            )}
            {testimonial && (
              <Reveal delay={200}>
                <TestimonialCard t={testimonial} />
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      {service.faqs.length > 0 && (
        <section className="bg-white py-20 sm:py-28">
          <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="text-3xl font-extrabold text-charcoal-900 sm:text-4xl">Questions about {service.title.toLowerCase()}</h2>
              <p className="mt-4 text-lg text-muted">Can&apos;t see your question? Ask us. We reply quickly.</p>
              <Button href="/contact" variant="ghost" className="mt-6">
                Ask a question
              </Button>
            </div>
            <Faq items={service.faqs} />
          </Container>
          <FaqJsonLd items={service.faqs} />
        </section>
      )}

      <section className="py-20 sm:py-24">
        <Container>
          <h2 className="text-2xl font-extrabold text-charcoal-900">Other services</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="group flex items-center justify-between rounded-2xl border border-charcoal/10 bg-white p-5 font-semibold text-charcoal-900 transition-all hover:border-teal">
                <span className="flex items-center gap-3">
                  <Icon name={s.icon} className="size-5 text-teal-ink" />
                  {s.title}
                </span>
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.intro,
          url: `${siteUrl}/services/${service.slug}`,
          provider: { "@type": "AccountingService", name: settings.legalName, url: siteUrl },
          areaServed: "United Kingdom",
        }}
      />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { TestimonialGrid } from "@/components/sections/Testimonials";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Markdown } from "@/components/ui/Markdown";
import { getSite } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export async function generateStaticParams() {
  return (await getSite()).locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/accountants/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const l = (await getSite()).locations.find((x) => x.slug === slug);
  if (!l) return {};
  return { title: l.seoTitle || `Accountants in ${l.town} for limited companies`, description: l.seoDescription || l.intro };
}

// Local SEO landing pages (MA-049), each with its own content managed in superadmin.
export default async function LocationPage({ params }: PageProps<"/accountants/[slug]">) {
  const { slug } = await params;
  const { locations, services, testimonials, settings } = await getSite();
  const l = locations.find((x) => x.slug === slug);
  if (!l) notFound();

  return (
    <>
      <PageHero eyebrow={`Accountants in ${l.town}`} title={`Accountants for growing ${l.town} businesses`} text={l.intro} crumbs={[{ label: `Accountants in ${l.town}` }]}>
        <Button href="/book-a-call">Book a free introductory call</Button>
      </PageHero>
      {l.body && (
        <section className="pb-16">
          <Container className="max-w-3xl">
            <Markdown>{l.body}</Markdown>
          </Container>
        </section>
      )}
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <h2 className="mb-10 text-3xl font-extrabold text-charcoal-900 sm:text-4xl">Our services in {l.town}</h2>
          <ServiceGrid services={services} />
        </Container>
      </section>
      {testimonials.length > 0 && (
        <section className="py-20 sm:py-28">
          <Container>
            <h2 className="mb-10 text-3xl font-extrabold text-charcoal-900 sm:text-4xl">What local business owners say</h2>
            <TestimonialGrid items={testimonials.slice(0, 3)} />
          </Container>
        </section>
      )}
      <CtaBand title={`Looking for an accountant in ${l.town}?`} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AccountingService",
          name: `${settings.businessName} — ${l.town}`,
          url: `${siteUrl}/accountants/${l.slug}`,
          areaServed: { "@type": "City", name: l.town },
          parentOrganization: { "@id": `${siteUrl}/#organization` },
          telephone: settings.phone,
        }}
      />
    </>
  );
}

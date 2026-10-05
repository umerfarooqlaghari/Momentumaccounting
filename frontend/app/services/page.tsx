import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { Faq, FaqJsonLd } from "@/components/sections/Faq";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { getPageText, getSite } from "@/lib/data";
import { packageIncludes } from "@/lib/static-content";

const DEFAULTS = {
  heroEyebrow: "Services",
  heroTitle: "One team. One monthly fee. Everything handled.",
  heroText:
    "Each service is available on its own, but most clients choose the full monthly package so everything is joined up and nothing slips through the cracks.",
  seoTitle: "Accounting services for limited companies",
  seoDescription:
    "Bookkeeping, quarterly management accounts, year-end accounts, corporation tax, VAT, payroll, self assessment and tax planning, all in one fixed monthly package.",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getPageText("services", DEFAULTS);
  return { title: t.seoTitle, description: t.seoDescription };
}

export default async function ServicesPage() {
  const { services, faqs } = await getSite();
  const t = await getPageText("services", DEFAULTS);
  return (
    <>
      <PageHero eyebrow={t.heroEyebrow} title={t.heroTitle} text={t.heroText} crumbs={[{ label: "Services" }]}>
        <Button href="/book-a-call">Book an introductory call</Button>
      </PageHero>

      <section className="pb-20 sm:pb-28">
        <Container>
          <ServiceGrid services={services} />
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="The full monthly package"
            title="Why most clients choose the full package"
            text="When one team does your books, quarterly accounts, payroll, VAT and tax, everything connects. That's how we can give you your tax position every quarter, with no surprises at year end."
          />
          <Reveal>
            <ul className="grid gap-3 rounded-3xl bg-charcoal-900 p-8 text-white sm:grid-cols-2">
              {packageIncludes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-teal text-charcoal-900">
                    <Check aria-hidden className="size-3.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Button href="/monthly-package" variant="ghost" className="mt-6">
              See the monthly package
            </Button>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="max-w-4xl">
          <SectionHeading title="Frequently asked questions" align="center" />
          <div className="mt-10">
            <Faq items={faqs} />
          </div>
        </Container>
        <FaqJsonLd items={faqs} />
      </section>

      <CtaBand title={t.ctaTitle} text={t.ctaText} />
    </>
  );
}

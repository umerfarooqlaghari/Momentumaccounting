import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Steps } from "@/components/sections/Steps";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { packageIncludes } from "@/lib/static-content";
import { getPageText } from "@/lib/data";

const DEFAULTS = {
  seoTitle: "The full monthly accounting package",
  seoDescription:
    "Bookkeeping, quarterly accounts and report, year-end, corporation tax, VAT, payroll, self assessment and tax planning, all for one fixed monthly fee.",
  ctaTitle: "Get your fixed monthly price",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getPageText("monthly-package", DEFAULTS);
  return { title: t.seoTitle, description: t.seoDescription };
}

const comparison = [
  { label: "Contact with your accountant", typical: "Once a year", us: "Every quarter, and whenever you need us" },
  { label: "Management accounts", typical: "Rarely, or extra cost", us: "Every quarter, included" },
  { label: "Tax position", typical: "Found out at year end", us: "Updated every quarter" },
  { label: "Year-end accounts", typical: "Close to the deadline", us: "Within three months" },
  { label: "Fees", typical: "Hourly or surprise invoices", us: "One fixed monthly fee" },
  { label: "Explanations", typical: "Jargon", us: "Plain English, with a written summary" },
];

export default async function MonthlyPackagePage() {
  const t = await getPageText("monthly-package", DEFAULTS);
  return (
    <>
      <PageHero
        eyebrow="The monthly package"
        title={
          <>
            Everything handled. <span className="text-gradient">One fixed monthly fee.</span>
          </>
        }
        text="Our full service for growing limited companies. Every part of your accounting and tax is joined up, delivered by one team and paid for with a single monthly subscription."
        crumbs={[{ label: "Services", href: "/services" }, { label: "Monthly package" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/book-a-call">Get your fixed monthly price</Button>
          <Button href="/quarterly-report" variant="ghost">
            See the quarterly report
          </Button>
        </div>
      </PageHero>

      <section className="pb-20 sm:pb-28">
        <Container>
          <Reveal className="relative isolate overflow-hidden rounded-[32px] bg-charcoal-900 p-8 text-white sm:p-14">
            <div className="absolute -top-32 -right-32 -z-10 size-96 rounded-full bg-teal/25 blur-3xl" aria-hidden />
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold tracking-wide text-teal uppercase">What&apos;s included</p>
                <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">The complete service</h2>
                <p className="mt-4 text-white/70">
                  Your monthly fee is agreed up front based on the size and needs of your business. No hourly billing and no
                  surprise invoices.
                </p>
                <Button href="/book-a-call" className="mt-8">
                  Get a quote
                </Button>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {packageIncludes.map((item, i) => (
                  <Reveal as="li" key={item} delay={i * 50} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-4">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-teal text-charcoal-900">
                      <Check aria-hidden className="size-4" strokeWidth={3} />
                    </span>
                    <span className="font-medium">{item}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Compare" title="A typical accountant vs Momentum" align="center" />
          <Reveal className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-3xl border border-charcoal/10 text-left">
              <thead>
                <tr>
                  <th scope="col" className="bg-stone-50 p-5 text-sm font-semibold text-muted"></th>
                  <th scope="col" className="bg-stone-50 p-5 text-sm font-semibold text-muted">Typical accountant</th>
                  <th scope="col" className="bg-charcoal-900 p-5 text-sm font-semibold text-teal">Momentum</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="border-t border-charcoal/10 p-5 font-semibold text-charcoal-900">{row.label}</th>
                    <td className="border-t border-charcoal/10 p-5 text-muted">
                      <span className="flex items-center gap-2">
                        <X aria-hidden className="size-4 shrink-0 text-red-600" />
                        {row.typical}
                      </span>
                    </td>
                    <td className="border-t border-charcoal/10 bg-teal-50/60 p-5 font-medium text-charcoal-900">
                      <span className="flex items-center gap-2">
                        <Check aria-hidden className="size-4 shrink-0 text-teal-ink" strokeWidth={3} />
                        {row.us}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Getting started" title="From first call to full momentum" align="center" />
          <div className="mt-16">
            <Steps />
          </div>
        </Container>
      </section>

      <CtaBand title={t.ctaTitle} text={t.ctaText} />
    </>
  );
}

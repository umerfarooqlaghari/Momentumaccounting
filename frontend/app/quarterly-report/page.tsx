import type { Metadata } from "next";
import { Eye, Landmark, MessageCircle, Repeat } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { ReportExplorer } from "@/components/sections/ReportExplorer";
import { CtaBand } from "@/components/sections/CtaBand";
import { TestimonialCard } from "@/components/sections/Testimonials";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { getPageText, getSite } from "@/lib/data";

const DEFAULTS = {
  seoTitle: "The quarterly report and business summary",
  seoDescription:
    "Every quarter, Momentum clients receive management accounts, a plain-English business summary and their tax position. Explore a sample report.",
  ctaTitle: "Want a report like this every quarter?",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getPageText("quarterly-report", DEFAULTS);
  return { title: t.seoTitle, description: t.seoDescription };
}

const benefits = [
  { icon: Eye, title: "See how you're really doing", text: "Performance, margins and cash, every quarter, compared with previous periods." },
  { icon: Landmark, title: "Know your tax position", text: "Business and personal tax calculated as you go, with no year-end surprises." },
  { icon: MessageCircle, title: "Plain English, not jargon", text: "A written summary from your accountant explaining what it all means." },
  { icon: Repeat, title: "Four times a year", text: "Regular check-ins give you time to act, not just a record of what happened." },
];

export default async function QuarterlyReportPage() {
  const { testimonials } = await getSite();
  const t = await getPageText("quarterly-report", DEFAULTS);
  return (
    <>
      <PageHero
        eyebrow="The quarterly report"
        title={
          <>
            The report that makes your numbers <span className="text-gradient">make sense</span>
          </>
        }
        text="Most accountants send a set of accounts once a year. Every quarter, we send a clear report and business summary showing how your business is doing, your tax position and what to do next."
        crumbs={[{ label: "Quarterly report" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/book-a-call">Get this for your business</Button>
          <Button href="/guides/sample-quarterly-report" variant="ghost" arrow={false}>
            Download a sample report
          </Button>
        </div>
      </PageHero>

      <section className="bg-teal-50/60 py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Interactive tour"
            title="Explore a sample report"
            text="Click through each section. Figures are illustrative and based on an anonymised sample."
          />
          <div className="mt-12">
            <ReportExplorer />
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Why it matters" title="What the quarterly report gives you" align="center" />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 90} className="rounded-3xl border border-charcoal/10 bg-white p-7">
                <span className="grid size-12 place-items-center rounded-2xl bg-teal-50 text-teal-ink">
                  <b.icon aria-hidden className="size-6" />
                </span>
                <h3 className="mt-6 text-xl font-bold text-charcoal-900">{b.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{b.text}</p>
              </Reveal>
            ))}
          </div>
          {testimonials[0] && (
            <Reveal className="mx-auto mt-14 max-w-2xl">
              <TestimonialCard t={testimonials[0]} featured />
            </Reveal>
          )}
        </Container>
      </section>

      <CtaBand title={t.ctaTitle} text={t.ctaText} />
    </>
  );
}

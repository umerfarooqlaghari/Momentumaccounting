import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building, PoundSterling, UserRound, Repeat } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { getPageText, getSite } from "@/lib/data";
import type { Audience } from "@/lib/types";

const DEFAULTS = {
  heroEyebrow: "Who we help",
  heroTitle: "For directors who want to know their numbers and grow",
  heroText: "We do our best work with ambitious limited companies that have outgrown once-a-year accounting.",
  seoTitle: "Who we help",
  seoDescription: "Accountants for UK limited companies turning over £100k to £5m. Directors who want to understand their numbers, avoid tax surprises and grow.",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getPageText("who-we-help", DEFAULTS);
  return { title: t.seoTitle, description: t.seoDescription };
}

const profile = [
  { icon: Building, label: "Business type", value: "UK limited companies and growing small businesses" },
  { icon: PoundSterling, label: "Turnover", value: "£100k to £5m, with most clients between £100k and £1m" },
  { icon: UserRound, label: "Who we work with", value: "Company directors and business owners" },
  { icon: Repeat, label: "How it works", value: "The full service for one fixed monthly fee" },
];

function AudienceCards({ items }: { items: Audience[] }) {
  return (
    <div className="mt-12 grid gap-5 md:grid-cols-2">
      {items.map((a, i) => (
        <Reveal key={a.slug} delay={(i % 2) * 100}>
          <Link href={`/who-we-help/${a.slug}`} className="group flex h-full gap-6 rounded-3xl bg-stone-50 p-8 transition-all duration-500 hover:-translate-y-1 hover:bg-charcoal-900 hover:text-white">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white text-teal-ink transition-colors group-hover:bg-teal group-hover:text-charcoal-900">
              <Icon name={a.icon} className="size-7" />
            </span>
            <span className="flex-1">
              <span className="flex items-center justify-between gap-4 text-2xl font-bold">
                {a.title}
                <ArrowUpRight aria-hidden className="size-6 shrink-0 text-teal-ink transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-teal" />
              </span>
              <span className="mt-2 block text-muted transition-colors group-hover:text-white/65">{a.short}</span>
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export default async function WhoWeHelpPage() {
  const { audiences } = await getSite();
  const t = await getPageText("who-we-help", DEFAULTS);
  const stages = audiences.filter((a) => a.kind !== "sector");
  const sectors = audiences.filter((a) => a.kind === "sector");

  return (
    <>
      <PageHero eyebrow={t.heroEyebrow} title={t.heroTitle} text={t.heroText} crumbs={[{ label: "Who we help" }]}>
        <Button href="/book-a-call">See if we&apos;re a fit</Button>
      </PageHero>

      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {profile.map((p, i) => (
              <Reveal key={p.label} delay={i * 90} className="rounded-3xl border border-charcoal/10 bg-white p-7">
                <p.icon aria-hidden className="size-7 text-teal-ink" />
                <p className="mt-5 text-sm font-semibold tracking-wide text-muted uppercase">{p.label}</p>
                <p className="mt-2 text-lg font-bold text-charcoal-900">{p.value}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Find your situation" title="How we help businesses like yours" />
          <AudienceCards items={stages} />
        </Container>
      </section>

      {sectors.length > 0 && (
        <section className="py-20 sm:py-28">
          <Container>
            <SectionHeading
              eyebrow="Specialist sectors"
              title="Industries we know inside out"
              text="We have a large number of clients in these sectors. If yours is different, we'll be equally pleased to work with you."
            />
            <AudienceCards items={sectors} />
          </Container>
        </section>
      )}

      <CtaBand title={t.ctaTitle} text={t.ctaText} />
    </>
  );
}

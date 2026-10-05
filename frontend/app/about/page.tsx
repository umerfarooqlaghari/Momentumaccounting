import type { Metadata } from "next";
import { BadgeCheck, Heart, MessageSquare, Target, TrendingUp } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { LogoMark } from "@/components/ui/Logo";
import { MediaImage } from "@/components/ui/MediaImage";
import { getPageText, getSite } from "@/lib/data";

const DEFAULTS = {
  heroEyebrow: "About us",
  heroTitle: "A modern practice with a personal touch",
  heroText:
    "Momentum Accounting is based in Ashford, Surrey. We act for over 75 limited companies and many other small businesses, all on a simple monthly subscription.",
  seoTitle: "About us",
  seoDescription: "Momentum Accounting is a modern, personal accounting practice in Ashford, Surrey, led by founder Ben Keville.",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getPageText("about", DEFAULTS);
  return { title: t.seoTitle, description: t.seoDescription };
}

const values = [
  { icon: Target, title: "No surprises", text: "Clients always know their tax position. That's a promise, not a slogan." },
  { icon: MessageSquare, title: "Plain English", text: "We explain things clearly and talk to you like a business owner, not an accountant." },
  { icon: Heart, title: "Above and beyond", text: "A small team that cares, and the reason almost all our new clients come by referral." },
  { icon: TrendingUp, title: "Built for growth", text: "We help you understand your numbers so you can make confident decisions." },
];

export default async function AboutPage() {
  const { team, settings } = await getSite();
  const t = await getPageText("about", DEFAULTS);

  return (
    <>
      <PageHero eyebrow={t.heroEyebrow} title={t.heroTitle} text={t.heroText} crumbs={[{ label: "About" }]} />

      <section className="pb-20 sm:pb-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative isolate overflow-hidden rounded-[32px] bg-charcoal-900 p-10 text-white sm:p-14">
            <div className="absolute -right-20 -bottom-20 -z-10 size-80 rounded-full bg-teal/30 blur-3xl" aria-hidden />
            <LogoMark className="h-16 w-auto text-white" />
            <p className="mt-8 text-2xl leading-snug font-bold sm:text-3xl">
              “Our goal is to take away the stress of running your company&apos;s finances, so you can focus on what you do
              best: running your business.”
            </p>
            <p className="mt-6 text-white/60">Our mission at {settings.businessName}</p>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Our story"
              title="Why Momentum exists"
              text="Too many business owners only see their numbers once a year and find out what tax they owe when the bill arrives. We set up Momentum to do things differently: up-to-date books, quarterly accounts with a clear report, your tax position every quarter and a team that genuinely understands each client."
            />
            {settings.accreditation && (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-ink">
                <BadgeCheck aria-hidden className="size-4" /> {settings.accreditation}
              </p>
            )}
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { to: 75, suffix: "+", label: "Ltd company clients" },
                { to: 6, suffix: "", label: "People in the team" },
                { to: 3, suffix: " mo", label: "To file year-end" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-4xl font-extrabold text-teal-ink">
                    <CountUp to={s.to} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="What we stand for" title="Our values" align="center" />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 90} className="rounded-3xl bg-stone-50 p-7">
                <v.icon aria-hidden className="size-8 text-teal-ink" />
                <h3 className="mt-5 text-xl font-bold text-charcoal-900">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="The team" title="The people behind your numbers" text="A team of six who get to know you and your business." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={(i % 3) * 90} className="group overflow-hidden rounded-3xl border border-charcoal/10 bg-white">
                <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-gradient-to-br from-teal-100 to-teal-50">
                  {m.photo ? (
                    <MediaImage id={m.photo} alt={`${m.name}, ${m.role}`} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <span className="text-6xl font-extrabold text-teal-ink" aria-hidden>
                      {m.name[0]}
                    </span>
                  )}
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-bold text-charcoal-900">{m.name}</h3>
                  <p className="text-sm font-semibold text-teal-ink">{m.role}</p>
                  {m.bio && <p className="mt-3 leading-relaxed text-muted">{m.bio}</p>}
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-teal-ink underline underline-offset-4">
                      LinkedIn
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand title={t.ctaTitle} text={t.ctaText} />
    </>
  );
}

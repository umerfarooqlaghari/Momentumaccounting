import Link from "next/link";
import { ArrowUpRight, Calculator, CalendarClock, ClipboardCheck, FileBarChart2, FileDown, HeartHandshake, Landmark } from "lucide-react";
import { HomeHero } from "@/components/sections/HomeHero";
import { Marquee } from "@/components/sections/Marquee";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { Steps } from "@/components/sections/Steps";
import { TestimonialGrid } from "@/components/sections/Testimonials";
import { Faq, FaqJsonLd } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";
import { ReportExplorer } from "@/components/sections/ReportExplorer";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getPageText, getSite } from "@/lib/data";
import { SocialFeed } from "@/components/sections/SocialFeed";
import type { Metadata } from "next";

const DEFAULTS = {
  heroEyebrow: "Accountants for growing limited companies · Ashford, Surrey",
  heroText:
    "Quarterly accounts, your tax position every quarter and a team that genuinely knows your business, all for one fixed monthly fee. No surprises.",
  ctaTitle: "Ready to build some momentum?",
  ctaText: "Book a free, no-obligation introductory call. We'll talk about your business, what you need and whether we're the right fit.",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getPageText("home", {});
  return { ...(t.seoTitle ? { title: { absolute: t.seoTitle } } : {}), ...(t.seoDescription ? { description: t.seoDescription } : {}) };
}

const differences = [
  {
    icon: FileBarChart2,
    title: "A quarterly report you'll actually read",
    text: "Management accounts every quarter, plus a plain-English business summary that tells you what the numbers mean.",
  },
  {
    icon: Landmark,
    title: "Your tax position, every quarter",
    text: "Personal and business tax calculated with every set of quarterly accounts. You always know what's coming.",
  },
  {
    icon: CalendarClock,
    title: "Year-end done in three months",
    text: "Accounts and corporation tax filed within three months of your year end, not at the last minute.",
  },
  {
    icon: HeartHandshake,
    title: "People who genuinely know you",
    text: "A small, personal team that goes above and beyond. It's what our clients mention most in their reviews.",
  },
];

export default async function Home() {
  const { settings, services, audiences, faqs, posts, testimonials } = await getSite();
  const t = await getPageText("home", DEFAULTS);
  const stages = audiences.filter((a) => a.kind !== "sector");

  return (
    <>
      <HomeHero eyebrow={t.heroEyebrow!} text={t.heroText!} tagline={settings.tagline} />
      <Marquee />

      {/* Recognition */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            eyebrow="Sound familiar?"
            title="Your business is growing. Your accountant isn't keeping up."
            text="Most small businesses only see their real numbers once a year, months after it's too late to act. Tax bills arrive as a surprise, and getting a straight answer takes days."
          />
          <ul className="grid gap-4 self-end">
            {[
              "You only hear from your accountant at year end",
              "You don't know what tax you'll owe until the bill arrives",
              "You're making growth decisions on gut feel",
              "Reports are full of jargon, if you get them at all",
            ].map((p, i) => (
              <Reveal as="li" key={p} delay={i * 90}>
                <div className="flex items-center gap-4 rounded-2xl border border-charcoal/10 bg-white p-5 text-lg font-medium text-charcoal-900">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-red-50 text-sm font-bold text-red-700" aria-hidden>
                    ✕
                  </span>
                  {p}
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Difference */}
      <section className="relative isolate overflow-hidden bg-charcoal-900 py-20 text-white sm:py-28">
        <div className="bg-grid-dark absolute inset-0 -z-10" aria-hidden />
        <div className="absolute top-0 right-0 -z-10 size-[500px] rounded-full bg-teal/20 blur-[140px]" aria-hidden />
        <Container>
          <SectionHeading
            dark
            eyebrow="The Momentum difference"
            title={
              <>
                Clarity every quarter. <span className="text-teal">No surprises.</span>
              </>
            }
            text="We do the full job, from bookkeeping to tax planning, and keep you informed every step of the way."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {differences.map((d, i) => (
              <Reveal key={d.title} delay={i * 100}>
                <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-teal/50 hover:bg-white/[0.07]">
                  <span className="grid size-12 place-items-center rounded-2xl bg-teal text-charcoal-900 transition-transform duration-500 group-hover:-rotate-6">
                    <d.icon aria-hidden className="size-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold">{d.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/65">{d.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid gap-8 border-t border-white/10 pt-12 sm:grid-cols-3">
            {[
              { to: 75, suffix: "+", label: "limited company clients" },
              { to: 4, suffix: "×", label: "reports a year, not one" },
              { to: 3, suffix: " months", label: "to file your year-end" },
            ].map((s) => (
              <Reveal key={s.label}>
                <p className="text-5xl font-extrabold tracking-tight text-teal sm:text-6xl">
                  <CountUp to={s.to} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-white/65">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Quarterly report showcase */}
      <section className="bg-teal-50/60 py-20 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="The quarterly report"
              title="Your business, explained in plain English. Four times a year."
              text="Explore a sample report. Every client gets one each quarter, with their tax position included."
            />
            <Button href="/quarterly-report" variant="ghost" className="shrink-0 bg-white">
              Take the full tour
            </Button>
          </div>
          <div className="mt-14">
            <ReportExplorer />
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="What we do"
            title="Everything your business needs, in one monthly package"
            text="Bookkeeping, quarterly accounts, year-end, tax, VAT and payroll, joined up and handled by one team."
          />
          <div className="mt-14">
            <ServiceGrid services={services} />
          </div>
        </Container>
      </section>

      {/* Who we help */}
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Who we help"
            title="Built for directors of growing limited companies"
            text="We work best with UK limited companies turning over £100k to £5m whose owners want to understand their numbers and grow."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stages.map((a, i) => (
              <Reveal key={a.slug} delay={i * 90}>
                <Link
                  href={`/who-we-help/${a.slug}`}
                  className="group flex h-full flex-col rounded-3xl bg-stone-50 p-7 transition-all duration-500 hover:-translate-y-1 hover:bg-charcoal-900 hover:text-white"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-white text-teal-ink transition-colors group-hover:bg-teal group-hover:text-charcoal-900">
                    <Icon name={a.icon} />
                  </span>
                  <h3 className="mt-6 text-xl font-bold">{a.title}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-muted transition-colors group-hover:text-white/65">{a.short}</p>
                  <ArrowUpRight aria-hidden className="mt-6 size-5 text-teal-ink transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-teal" />
                </Link>
              </Reveal>
            ))}
          </div>
          {audiences.some((a) => a.kind === "sector") && (
            <Reveal className="mt-10 flex flex-wrap items-center gap-3">
              <span className="mr-2 text-sm font-semibold tracking-wide text-muted uppercase">Specialist sectors</span>
              {audiences
                .filter((a) => a.kind === "sector")
                .map((a) => (
                  <Link key={a.slug} href={`/who-we-help/${a.slug}`} className="flex min-h-11 items-center gap-2 rounded-full border border-charcoal/15 bg-white px-4 text-[15px] font-medium transition-colors hover:border-teal hover:text-teal-ink">
                    <Icon name={a.icon} className="size-4 text-teal-ink" />
                    {a.title}
                  </Link>
                ))}
            </Reveal>
          )}
        </Container>
      </section>

      {/* Reviews */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="Reviews" title="What our clients say" text="In their own words, from the business owners we work with." />
            <Button href="/reviews" variant="ghost" className="shrink-0">
              Read all reviews
            </Button>
          </div>
          <div className="mt-14">
            <TestimonialGrid items={testimonials.slice(0, 3)} />
          </div>
        </Container>
      </section>

      {/* Free tools / lead magnets */}
      <section className="bg-charcoal-900 py-20 text-white sm:py-28">
        <Container>
          <SectionHeading dark eyebrow="Free tools" title="Get a quick answer in under a minute" text="Practical tools for directors. No jargon, no obligation." />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              { href: "/tools/health-check", icon: ClipboardCheck, title: "Do you have the right accountant?", text: "Eight quick questions and an instant score for how well your accountant supports you." },
              { href: "/tools/salary-dividend-calculator", icon: Calculator, title: "Salary & dividend calculator", text: "See a tax-efficient way to pay yourself from your company this tax year." },
              { href: "/guides/sample-quarterly-report", icon: FileDown, title: "Sample quarterly report", text: "Download an example of the report every client receives each quarter." },
            ].map((tool, i) => (
              <Reveal key={tool.href} delay={i * 100}>
                <Link href={tool.href} className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-teal/60 hover:bg-white/[0.08]">
                  <span className="grid size-12 place-items-center rounded-2xl bg-teal text-charcoal-900 transition-transform duration-500 group-hover:-rotate-6">
                    <tool.icon aria-hidden className="size-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold">{tool.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-white/65">{tool.text}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-teal">
                    Try it free <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Switching to Momentum is simple"
            text="We handle the hard parts, including the handover from your current accountant."
            align="center"
          />
          <div className="mt-16">
            <Steps />
          </div>
        </Container>
      </section>

      {settings.socialPosts && settings.socialPosts.length > 0 && (
        <section className="bg-white py-20 sm:py-28">
          <Container>
            <SectionHeading eyebrow="On social" title="Tips from Ben, every week" text="Follow along for practical advice for business owners." />
            <div className="mt-12">
              <SocialFeed posts={settings.socialPosts} />
            </div>
          </Container>
        </section>
      )}

      {/* Resources */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="Resources" title="Useful reading for business owners" />
            <Button href="/resources" variant="ghost" className="shrink-0">
              All resources
            </Button>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {posts.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <Link href={`/resources/${p.slug}`} className="group flex h-full flex-col rounded-3xl border border-charcoal/10 bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                  <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-ink">{p.category}</span>
                  <h3 className="mt-5 text-xl leading-snug font-bold text-charcoal-900 group-hover:text-teal-ink">{p.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">{p.excerpt}</p>
                  <p className="mt-6 text-sm text-muted">{p.readMins ?? 4} min read</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="FAQs" title="Questions business owners ask us" />
          <Reveal>
            <Faq items={faqs} />
          </Reveal>
        </Container>
        <FaqJsonLd items={faqs} />
      </section>

      <CtaBand title={t.ctaTitle} text={t.ctaText} />
    </>
  );
}

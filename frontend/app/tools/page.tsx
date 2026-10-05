import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Calculator, ClipboardCheck, FileDown } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getPageText, getSite } from "@/lib/data";

const DEFAULTS = {
  heroEyebrow: "Free tools",
  heroTitle: "Quick answers for busy directors",
  heroText: "Free, practical tools to check your accountant, plan how you pay yourself and see what great reporting looks like.",
  seoTitle: "Free tools for limited company directors",
  seoDescription: "Take our accountant health check, try the salary and dividend calculator or download a sample quarterly report.",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getPageText("tools", DEFAULTS);
  return { title: t.seoTitle, description: t.seoDescription };
}

export default async function ToolsPage() {
  const { leadMagnets } = await getSite();
  const t = await getPageText("tools", DEFAULTS);
  const tools = [
    { href: "/tools/health-check", icon: ClipboardCheck, title: "Do you have the right accountant?", text: "Eight quick questions and an instant score." },
    { href: "/tools/salary-dividend-calculator", icon: Calculator, title: "Salary & dividend calculator", text: "A tax-efficient way to pay yourself this tax year." },
    ...leadMagnets.map((m) => ({ href: `/guides/${m.slug}`, icon: FileDown, title: m.title, text: m.description })),
  ];

  return (
    <>
      <PageHero eyebrow={t.heroEyebrow} title={t.heroTitle} text={t.heroText} crumbs={[{ label: "Tools" }]} />
      <section className="pb-20 sm:pb-28">
        <Container className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, i) => (
            <Reveal key={tool.href} delay={(i % 3) * 100}>
              <Link href={tool.href} className="group flex h-full flex-col rounded-3xl border border-charcoal/10 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:border-teal/50 hover:shadow-xl">
                <span className="grid size-12 place-items-center rounded-2xl bg-teal-50 text-teal-ink transition-colors group-hover:bg-teal group-hover:text-charcoal-900">
                  <tool.icon aria-hidden className="size-6" />
                </span>
                <h2 className="mt-6 text-xl font-bold text-charcoal-900">{tool.title}</h2>
                <p className="mt-2 flex-1 leading-relaxed text-muted">{tool.text}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-teal-ink">
                  Get started <ArrowUpRight aria-hidden className="size-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </Container>
      </section>
      <CtaBand title={t.ctaTitle} text={t.ctaText} />
    </>
  );
}

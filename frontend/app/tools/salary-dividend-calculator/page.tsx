import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { SalaryDividendCalculator } from "@/components/tools/SalaryDividendCalculator";
import { Container } from "@/components/ui/Container";
import { getSite } from "@/lib/data";

export const metadata: Metadata = {
  title: "Salary and dividend calculator for directors",
  description: "See a tax-efficient split of salary and dividends for your limited company this tax year.",
};

export default async function CalculatorPage() {
  const { calculator } = await getSite();
  if (!calculator) notFound();
  return (
    <>
      <PageHero
        eyebrow="Free calculator"
        title="How should you pay yourself?"
        text={`Enter your company's profit to see a tax-efficient mix of salary and dividends for ${calculator.taxYear}.`}
        crumbs={[{ label: "Tools", href: "/tools" }, { label: "Salary & dividend calculator" }]}
      />
      <section className="pb-24">
        <Container>
          <SalaryDividendCalculator rates={calculator} />
        </Container>
      </section>
    </>
  );
}

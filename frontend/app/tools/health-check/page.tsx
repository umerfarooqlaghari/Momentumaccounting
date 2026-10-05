import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { HealthCheckQuiz } from "@/components/tools/HealthCheckQuiz";
import { Container } from "@/components/ui/Container";
import { getSite } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const { quiz } = await getSite();
  return { title: quiz?.title ?? "Accountant health check", description: quiz?.intro };
}

export default async function HealthCheckPage() {
  const { quiz } = await getSite();
  if (!quiz?.questions?.length) notFound();
  return (
    <>
      <PageHero eyebrow="Free health check" title={quiz.title} text={quiz.intro} crumbs={[{ label: "Tools", href: "/tools" }, { label: "Health check" }]} />
      <section className="pb-24">
        <Container className="max-w-3xl">
          <HealthCheckQuiz quiz={quiz} />
        </Container>
      </section>
    </>
  );
}

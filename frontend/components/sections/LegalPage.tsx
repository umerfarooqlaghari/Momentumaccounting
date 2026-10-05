import { PageHero } from "./PageHero";
import { Container } from "@/components/ui/Container";
import { CtaBand } from "./CtaBand";

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; text: React.ReactNode }[];
}) {
  return (
    <>
      <PageHero title={title} text={`Last updated ${updated}`} crumbs={[{ label: title }]} />
      <section className="pb-24">
        <Container className="max-w-3xl">
          {/* TODO(MA-133): final wording to be approved by the practice before launch. */}
          <div className="space-y-8 text-lg leading-relaxed text-charcoal">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="mb-3 text-2xl font-extrabold text-charcoal-900">{s.heading}</h2>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <CtaBand title="Questions about your business?" text="Our team is happy to help. Book a free, no-obligation introductory call." />
    </>
  );
}

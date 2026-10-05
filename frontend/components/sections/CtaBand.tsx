import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

// Closing call to action used at the bottom of every page (§2.1, §5.1).
export function CtaBand({
  title = "Ready to build some momentum?",
  text = "Book a free, no-obligation introductory call. We'll talk about your business, what you need and whether we're the right fit.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal className="relative isolate overflow-hidden rounded-[32px] bg-charcoal-900 px-6 py-14 text-center sm:px-16 sm:py-20">
          <div className="bg-grid-dark absolute inset-0 -z-10" aria-hidden />
          <div className="absolute -bottom-40 left-1/2 -z-10 size-[520px] -translate-x-1/2 rounded-full bg-teal/30 blur-[110px]" aria-hidden />
          <svg className="absolute inset-x-0 bottom-0 -z-10 h-1/2 w-full" viewBox="0 0 800 200" preserveAspectRatio="none" aria-hidden>
            <path d="M0 190 L160 130 L220 160 L380 80 L440 110 L800 0" fill="none" stroke="#33CBCC" strokeOpacity="0.35" strokeWidth="2" />
          </svg>
          <h2 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-white text-balance sm:text-5xl">{title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">{text}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/book-a-call">Book your introductory call</Button>
            <Button href="/contact" variant="light">
              Ask us a question
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ReportCard } from "./ReportCard";

export function HomeHero({ eyebrow, text, tagline }: { eyebrow: string; text: string; tagline: string }) {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 lg:pb-28">
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" aria-hidden />
      <div className="absolute -top-40 right-[-10%] -z-10 size-[620px] rounded-full bg-teal/25 blur-[120px]" aria-hidden />

      {/* The rising chart line from the logo, drawn across the hero */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] w-full"
        viewBox="0 0 1440 500"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M-20 470 L240 380 L340 420 L560 280 L660 330 L900 180 L1000 220 L1460 20"
          fill="none"
          stroke="#33CBCC"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeDasharray="2200"
          strokeDashoffset="2200"
          className="animate-draw opacity-25"
        />
      </svg>

      <Container className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-white/70 px-4 py-1.5 text-sm font-medium text-charcoal backdrop-blur">
            <Sparkles aria-hidden className="size-4 text-teal-ink" />
            {eyebrow}
          </p>
          <h1 className="mt-6 text-[2.75rem] leading-[1.02] font-extrabold tracking-tight text-charcoal-900 text-balance sm:text-6xl lg:text-7xl">
            Know your numbers.{" "}
            <span className="relative whitespace-nowrap">
              <span className="text-gradient">Build momentum.</span>
            </span>
          </h1>
          <p className="mt-5 text-lg font-semibold text-teal-ink sm:text-xl">{tagline}</p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{text}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/book-a-call">Book a free introductory call</Button>
            <Button href="/quarterly-report" variant="ghost">
              See the quarterly report
            </Button>
          </div>
          <ul className="mt-10 grid gap-3 text-[15px] font-medium text-charcoal sm:grid-cols-3">
            {[
              { icon: CheckCircle2, text: "One fixed monthly fee" },
              { icon: ShieldCheck, text: "Tax position every quarter" },
              { icon: CheckCircle2, text: "Year-end filed in 3 months" },
            ].map(({ icon: I, text }) => (
              <li key={text} className="flex items-center gap-2">
                <I aria-hidden className="size-5 shrink-0 text-teal-ink" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <ReportCard />
        </div>
      </Container>
    </section>
  );
}

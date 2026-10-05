import { Reveal } from "@/components/ui/Reveal";
import { steps } from "@/lib/static-content";

export function Steps() {
  return (
    <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="absolute top-7 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-teal/0 via-teal to-teal/0 lg:block" aria-hidden />
      {steps.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 120} className="relative">
          <span className="relative grid size-14 place-items-center rounded-2xl bg-charcoal-900 text-lg font-extrabold text-teal shadow-lg">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-5 text-xl font-bold text-charcoal-900">{s.title}</h3>
          <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}

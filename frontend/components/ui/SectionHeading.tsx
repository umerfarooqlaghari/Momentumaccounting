import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  dark = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <Reveal className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p
          className={`mb-4 inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase ${dark ? "text-teal" : "text-teal-ink"}`}
        >
          <span className="h-px w-6 bg-current" aria-hidden />
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-3xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl ${dark ? "text-white" : "text-charcoal-900"}`}
      >
        {title}
      </h2>
      {text && (
        <p className={`mt-5 text-lg leading-relaxed text-pretty ${dark ? "text-white/70" : "text-muted"}`}>{text}</p>
      )}
    </Reveal>
  );
}

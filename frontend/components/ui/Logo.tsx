import Link from "next/link";

// Recreation of the Momentum mark (M beneath a rising teal chart line).
// TODO: swap in the official SVG logo files from the practice.
export function LogoMark({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 52" className={className} aria-hidden>
      <path d="M2 38 L14 18 L19 29 L27 13 L31 22 L62 2 L42 30 L36 18 Z" fill="#33CBCC" />
      <path
        d="M16 50 L27 24 Q29 20 33 20 Q36 20 37 24 L40 34 L46 23 Q48 20 51 20 Q55 20 55 25 L56 50 L49 50 L48.5 33 L42 46 Q41 48 39 48 Q37 48 36 46 L31.5 33 L24 50 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="Momentum Accounting home">
      <LogoMark
        className={`h-9 w-auto transition-transform duration-500 group-hover:-translate-y-0.5 ${dark ? "text-white" : "text-charcoal"}`}
      />
      <span className={`leading-none font-extrabold tracking-tight ${dark ? "text-white" : "text-charcoal"}`}>
        <span className="block text-[15px] italic">MOMENTUM</span>
        <span className="block text-[11px] tracking-[0.18em] italic opacity-80">ACCOUNTING</span>
      </span>
    </Link>
  );
}

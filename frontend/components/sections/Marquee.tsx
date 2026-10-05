const items = [
  "Bookkeeping",
  "Quarterly management accounts",
  "Year-end accounts",
  "Corporation tax",
  "VAT",
  "Payroll",
  "Self assessment",
  "Tax planning",
];

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-charcoal/10 bg-white py-5" aria-hidden>
      <div className="animate-marquee flex w-max gap-10">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-10 text-lg font-bold whitespace-nowrap text-charcoal/80">
            {t}
            <svg viewBox="0 0 20 14" className="h-3.5 w-5 text-teal">
              <path d="M0 13 L7 5 L10 9 L20 0" fill="none" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white" />
    </div>
  );
}

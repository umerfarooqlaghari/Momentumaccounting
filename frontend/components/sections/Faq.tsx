import { Plus } from "lucide-react";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-charcoal/10 rounded-3xl border border-charcoal/10 bg-white">
      {items.map((f) => (
        <details key={f.q} className="group px-6 sm:px-8">
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-lg font-semibold text-charcoal-900">
            {f.q}
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-ink transition-transform duration-300 group-open:rotate-45">
              <Plus aria-hidden className="size-4" />
            </span>
          </summary>
          <p className="-mt-2 pb-6 leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
  );
}

import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { Testimonial } from "@/lib/types";
import { MediaImage } from "@/components/ui/MediaImage";

export function TestimonialCard({ t, featured = false }: { t: Testimonial; featured?: boolean }) {
  return (
    <figure
      className={`flex h-full flex-col rounded-3xl p-7 transition-transform duration-500 hover:-translate-y-1 ${
        featured ? "bg-charcoal-900 text-white" : "border border-charcoal/10 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5 text-teal" role="img" aria-label={`${t.rating ?? 5} out of 5 stars`}>
          {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
            <Star key={i} aria-hidden className="size-4 fill-current" />
          ))}
        </div>
        <Quote aria-hidden className={`size-8 ${featured ? "text-teal/40" : "text-teal-100"}`} />
      </div>
      <blockquote className={`mt-5 flex-1 text-lg leading-relaxed ${featured ? "text-white" : "text-charcoal-900"}`}>
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-teal text-sm font-bold text-charcoal-900">
          {t.photo ? (
            <MediaImage id={t.photo} alt="" sizes="44px" />
          ) : (
            t.name
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
          )}
        </span>
        <span>
          <span className="block font-semibold">{t.name}</span>
          <span className={`block text-sm ${featured ? "text-white/60" : "text-muted"}`}>{[t.role, t.company].filter(Boolean).join(", ")}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialGrid({ items }: { items: Testimonial[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((t, i) => (
        <Reveal key={t._id ?? i} delay={i * 100} className={i === 0 && items.length > 3 ? "lg:row-span-2" : ""}>
          <TestimonialCard t={t} featured={i === 0} />
        </Reveal>
      ))}
    </div>
  );
}

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import type { Service } from "@/lib/types";

export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Reveal className="sm:col-span-2 lg:col-span-1 lg:row-span-2">
        <Link
          href="/monthly-package"
          className="group relative flex h-full min-h-72 flex-col justify-between overflow-hidden rounded-3xl bg-charcoal-900 p-8 text-white"
        >
          <div className="absolute -right-24 -bottom-24 size-72 rounded-full bg-teal/30 blur-3xl transition-transform duration-700 group-hover:scale-125" aria-hidden />
          <div className="relative">
            <span className="rounded-full bg-teal px-3 py-1 text-xs font-bold text-charcoal-900">Main offer</span>
            <h3 className="mt-6 text-3xl font-extrabold tracking-tight">The full monthly package</h3>
            <p className="mt-4 text-white/70">
              Every service on this page, joined up and delivered by one team, for a single fixed monthly fee.
            </p>
          </div>
          <span className="relative mt-8 inline-flex items-center gap-2 font-semibold text-teal">
            See what&apos;s included
            <ArrowUpRight aria-hidden className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </Link>
      </Reveal>
      {services.map((s, i) => (
        <Reveal key={s.slug} delay={(i % 3) * 90}>
          <Link
            href={`/services/${s.slug}`}
            className="group flex h-full flex-col rounded-3xl border border-charcoal/10 bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:border-teal/50 hover:shadow-[0_24px_50px_-24px_rgb(10_116_117/0.35)]"
          >
            <div className="flex items-start justify-between">
              <span className="grid size-12 place-items-center rounded-2xl bg-teal-50 text-teal-ink transition-colors duration-500 group-hover:bg-teal group-hover:text-charcoal-900">
                <Icon name={s.icon} />
              </span>
              <ArrowUpRight aria-hidden className="size-5 text-charcoal/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal-ink" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-charcoal-900">{s.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{s.short}</p>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

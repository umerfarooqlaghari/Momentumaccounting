import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { siteUrl } from "@/lib/site";

export function PageHero({
  eyebrow,
  title,
  text,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: string;
  crumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" aria-hidden />
      <div className="absolute -top-48 left-1/2 -z-10 size-[560px] -translate-x-1/2 rounded-full bg-teal/20 blur-[120px]" aria-hidden />
      <svg className="absolute right-0 bottom-0 -z-10 hidden h-48 w-[40%] md:block" viewBox="0 0 400 160" preserveAspectRatio="none" aria-hidden>
        <path
          d="M0 150 L90 100 L130 120 L230 60 L270 80 L400 6"
          fill="none"
          stroke="#33CBCC"
          strokeWidth="3"
          strokeDasharray="700"
          strokeDashoffset="700"
          className="animate-draw opacity-50"
        />
      </svg>
      {crumbs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [{ label: "Home", href: "/" }, ...crumbs].map((c, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: c.label,
                ...(c.href ? { item: `${siteUrl}${c.href}` } : {}),
              })),
            }).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <Container>
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
              <li>
                <Link href="/" className="hover:text-teal-ink">
                  Home
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  <ChevronRight aria-hidden className="size-3.5" />
                  {c.href ? (
                    <Link href={c.href} className="hover:text-teal-ink">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-medium text-charcoal">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="max-w-4xl">
          {eyebrow && <p className="mb-4 text-sm font-semibold tracking-wide text-teal-ink uppercase">{eyebrow}</p>}
          <h1 className="text-4xl leading-[1.05] font-extrabold tracking-tight text-charcoal-900 text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {text && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{text}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </Container>
    </section>
  );
}

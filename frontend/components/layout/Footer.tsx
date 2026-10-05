import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { SocialIcon, type SocialKey } from "@/components/ui/SocialIcons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { CookieSettingsButton } from "@/components/consent/ConsentBanner";
import { getSite } from "@/lib/data";
import { telHref } from "@/lib/site";

export async function Footer() {
  const { settings: s, services, audiences, locations } = await getSite();
  const social = (["instagram", "tiktok", "linkedin", "facebook"] as SocialKey[]).filter((k) => s[k]);

  const columns = [
    {
      title: "Services",
      links: [{ label: "Monthly package", href: "/monthly-package" }, ...services.map((x) => ({ label: x.title, href: `/services/${x.slug}` }))],
    },
    {
      title: "Who we help",
      links: audiences.map((a) => ({ label: a.title, href: `/who-we-help/${a.slug}` })),
    },
    {
      title: "Practice",
      links: [
        { label: "About us", href: "/about" },
        { label: "Quarterly report", href: "/quarterly-report" },
        { label: "Reviews", href: "/reviews" },
        { label: "Case studies", href: "/case-studies" },
        { label: "Free tools", href: "/tools" },
        { label: "Guides", href: "/guides" },
        { label: "Resources", href: "/resources" },
        { label: "Contact", href: "/contact" },
        { label: "Book a call", href: "/book-a-call" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-charcoal-900 text-white/70">
      <div className="bg-grid-dark absolute inset-0 opacity-60" aria-hidden />
      <Container className="relative pt-16 pb-28 sm:pb-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2.2fr]">
          <div>
            <Logo dark />
            <p className="mt-5 max-w-sm text-lg font-semibold text-white">{s.tagline}</p>
            <ul className="mt-6 space-y-3 text-[15px]">
              <li className="flex items-start gap-3">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-teal" />
                {[s.streetAddress, s.locality, s.region, s.postcode].filter(Boolean).join(", ")}
              </li>
              {s.phone && (
                <li>
                  <TrackedLink href={telHref(s.phone)} event="click_to_call" className="flex items-center gap-3 hover:text-white">
                    <Phone aria-hidden className="size-4 text-teal" />
                    {s.phone}
                  </TrackedLink>
                </li>
              )}
              {s.email && (
                <li>
                  <TrackedLink href={`mailto:${s.email}`} event="click_email" className="flex items-center gap-3 hover:text-white">
                    <Mail aria-hidden className="size-4 text-teal" />
                    {s.email}
                  </TrackedLink>
                </li>
              )}
              {s.hours && (
                <li className="flex items-center gap-3">
                  <Clock aria-hidden className="size-4 text-teal" />
                  {s.hours}
                </li>
              )}
            </ul>
            {social.length > 0 && (
              <ul className="mt-6 flex gap-2" aria-label="Social media">
                {social.map((key) => (
                  <li key={key}>
                    <a
                      href={s[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Momentum Accounting on ${key[0].toUpperCase()}${key.slice(1)}`}
                      className="grid size-11 place-items-center rounded-full border border-white/15 transition-all hover:-translate-y-0.5 hover:border-teal hover:text-teal"
                    >
                      <SocialIcon name={key} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold tracking-wide text-white uppercase">{col.title}</h3>
                <ul className="mt-4 space-y-2.5 text-[15px]">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="transition-colors hover:text-teal">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {locations.length > 0 && (
          <div className="mt-12 border-t border-white/10 pt-8">
            <h3 className="text-sm font-semibold tracking-wide text-white uppercase">Areas we cover</h3>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
              {locations.map((l) => (
                <li key={l.slug}>
                  <Link href={`/accountants/${l.slug}`} className="hover:text-teal">
                    Accountants in {l.town}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p>
              © {new Date().getFullYear()} {s.legalName}. All rights reserved.
              {s.companyNumber && ` Registered in England & Wales, company no. ${s.companyNumber}.`}
            </p>
            {s.accreditation && <p className="text-white/50">{s.accreditation}.</p>}
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/privacy-policy" className="hover:text-white">Privacy policy</Link>
            </li>
            <li>
              <Link href="/cookie-policy" className="hover:text-white">Cookie policy</Link>
            </li>
            <li>
              <CookieSettingsButton className="hover:text-white" />
            </li>
            <li>
              <Link href="/accessibility" className="hover:text-white">Accessibility</Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}

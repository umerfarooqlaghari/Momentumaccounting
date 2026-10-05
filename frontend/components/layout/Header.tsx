"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { mainNav } from "@/lib/site";
import type { Service } from "@/lib/types";

export function Header({ services, announcement }: { services: Pick<Service, "slug" | "title" | "icon">[]; announcement?: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  // Close the mobile menu whenever the route changes.
  if (open && openedAt !== pathname) setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Campaign landing pages keep visitors focused: logo and one call to action only.
  const minimal = pathname.startsWith("/lp/");
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-charcoal/10 bg-white/85 py-3 shadow-[0_8px_30px_-12px_rgb(34_32_30/0.15)] backdrop-blur-xl"
          : "py-5"
      }`}
    >
      <a
        href="#main"
        className="sr-only rounded-full bg-charcoal px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      {announcement && !scrolled && (
        <p className="-mt-5 mb-4 bg-charcoal-900 px-5 py-2 text-center text-sm font-medium text-white">{announcement}</p>
      )}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Logo />

        <nav aria-label="Main" className={minimal ? "hidden" : "hidden lg:block"}>
          <ul className="flex items-center gap-1">
            {mainNav.map((item) =>
              item.href === "/services" ? (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors hover:text-teal-ink ${isActive(item.href) ? "text-teal-ink" : "text-charcoal"}`}
                  >
                    {item.label}
                    <ChevronDown aria-hidden className="size-3.5 transition-transform group-hover:rotate-180" />
                  </Link>
                  <div className="invisible absolute top-full left-1/2 w-[560px] -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="grid grid-cols-2 gap-1 rounded-3xl border border-charcoal/10 bg-white p-3 shadow-2xl shadow-charcoal/10">
                      <Link
                        href="/monthly-package"
                        className="col-span-2 mb-1 rounded-2xl bg-charcoal-900 p-4 text-white transition-colors hover:bg-charcoal"
                      >
                        <span className="text-xs font-semibold tracking-wide text-teal uppercase">Main offer</span>
                        <span className="mt-1 block font-bold">The full monthly package →</span>
                        <span className="text-sm text-white/65">Everything you need for one fixed monthly fee.</span>
                      </Link>
                      {services.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-teal-50"
                        >
                          <span className="mt-0.5 rounded-xl bg-teal-50 p-2 text-teal-ink">
                            <Icon name={s.icon} className="size-4" />
                          </span>
                          <span className="text-sm leading-snug font-semibold text-charcoal-900">{s.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors hover:text-teal-ink ${isActive(item.href) ? "text-teal-ink" : "text-charcoal"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Button href="/book-a-call" className="!min-h-11 !px-5">
              Book a call
            </Button>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpenedAt(pathname);
              setOpen((o) => !o);
            }}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`${minimal ? "hidden" : "grid"} size-11 place-items-center rounded-full border border-charcoal/15 bg-white lg:hidden`}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100dvh-68px)] overflow-y-auto border-t border-charcoal/10 bg-white px-5 pt-4 pb-28 lg:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="divide-y divide-charcoal/10">
            <li>
              <Link href="/monthly-package" className="block py-4 text-lg font-semibold">
                Monthly package
              </Link>
            </li>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block py-4 text-lg font-semibold ${isActive(item.href) ? "text-teal-ink" : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="block py-4 text-lg font-semibold">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <Button href="/book-a-call" className="mt-6 w-full">
          Book an introductory call
        </Button>
      </div>
    </header>
  );
}

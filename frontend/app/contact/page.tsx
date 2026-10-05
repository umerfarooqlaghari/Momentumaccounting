import type { Metadata } from "next";
import { CalendarDays, Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { getPageText, getSite } from "@/lib/data";
import { telHref } from "@/lib/site";

const DEFAULTS = {
  heroEyebrow: "Contact",
  heroTitle: "Let's talk about your business",
  heroText: "Tell us a little about your business and we'll be in touch, usually within one working day.",
  seoTitle: "Contact us",
  seoDescription: "Get in touch with Momentum Accounting in Ashford, Surrey. Send an enquiry or book an introductory call.",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getPageText("contact", DEFAULTS);
  return { title: t.seoTitle, description: t.seoDescription };
}

export default async function ContactPage() {
  const { settings: s } = await getSite();
  const t = await getPageText("contact", DEFAULTS);
  const address = [s.streetAddress, s.locality, s.region, s.postcode].filter(Boolean).join(", ");

  return (
    <>
      <PageHero eyebrow={t.heroEyebrow} title={t.heroTitle} text={t.heroText} crumbs={[{ label: "Contact" }]} />
      <section className="pb-24">
        <Container className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <EnquiryForm contactEmail={s.email} />
          <aside className="space-y-5">
            <div className="rounded-3xl bg-charcoal-900 p-8 text-white">
              <CalendarDays aria-hidden className="size-8 text-teal" />
              <p className="mt-5 text-xl font-bold">Prefer to talk?</p>
              <p className="mt-2 text-white/65">Book a free 20–30 minute introductory call at a time that suits you.</p>
              <Button href="/book-a-call" className="mt-6">
                Book a call
              </Button>
            </div>
            <ul className="space-y-5 rounded-3xl border border-charcoal/10 bg-white p-8">
              {s.phone && (
                <li className="flex gap-4">
                  <Phone aria-hidden className="mt-0.5 size-5 shrink-0 text-teal-ink" />
                  <div>
                    <p className="font-semibold text-charcoal-900">Phone</p>
                    <TrackedLink href={telHref(s.phone)} event="click_to_call" className="text-muted hover:text-teal-ink">
                      {s.phone}
                    </TrackedLink>
                  </div>
                </li>
              )}
              {s.email && (
                <li className="flex gap-4">
                  <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-teal-ink" />
                  <div>
                    <p className="font-semibold text-charcoal-900">Email</p>
                    <TrackedLink href={`mailto:${s.email}`} event="click_email" className="text-muted hover:text-teal-ink">
                      {s.email}
                    </TrackedLink>
                  </div>
                </li>
              )}
              <li className="flex gap-4">
                <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-teal-ink" />
                <div>
                  <p className="font-semibold text-charcoal-900">Office</p>
                  <p className="text-muted">{address}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-teal-ink" />
                <div>
                  <p className="font-semibold text-charcoal-900">Opening hours</p>
                  <p className="text-muted">{s.hours ?? "Mon–Fri"}</p>
                  <p className="text-sm text-muted">We usually reply within one working day.</p>
                </div>
              </li>
            </ul>
          </aside>
        </Container>
      </section>
    </>
  );
}

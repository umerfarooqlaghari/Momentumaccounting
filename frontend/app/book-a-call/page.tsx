import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { BookingEmbed } from "@/components/forms/BookingEmbed";
import { TestimonialCard } from "@/components/sections/Testimonials";
import { Container } from "@/components/ui/Container";
import { getPageText, getSite } from "@/lib/data";

const DEFAULTS = {
  heroEyebrow: "Book a call",
  heroTitle: "Book your free introductory call",
  heroText: "A friendly, no-obligation chat to see if we're the right fit for your business.",
  seoTitle: "Book an introductory call",
  seoDescription: "Book a free, no-obligation introductory call with Momentum Accounting.",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getPageText("book-a-call", DEFAULTS);
  return { title: t.seoTitle, description: t.seoDescription };
}

const expect = [
  "A relaxed 20–30 minute conversation",
  "We learn about your business and goals",
  "We explain how the monthly package works",
  "A clear, fixed monthly price afterwards",
  "No obligation and no hard sell",
];

export default async function BookACallPage() {
  const { settings, testimonials } = await getSite();
  const t = await getPageText("book-a-call", DEFAULTS);

  return (
    <>
      <PageHero eyebrow={t.heroEyebrow} title={t.heroTitle} text={t.heroText} crumbs={[{ label: "Book a call" }]} />
      <section className="pb-24">
        <Container className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* Live calendar when a booking URL is set in superadmin; otherwise a call-request form. */}
          {settings.bookingUrl ? <BookingEmbed url={settings.bookingUrl} /> : <EnquiryForm intent="call-request" contactEmail={settings.email} />}
          <aside className="space-y-5">
            <div className="rounded-3xl border border-charcoal/10 bg-white p-8">
              <p className="text-xl font-bold text-charcoal-900">What to expect</p>
              <ul className="mt-5 space-y-3">
                {expect.map((e) => (
                  <li key={e} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-teal text-charcoal-900">
                      <Check aria-hidden className="size-3.5" strokeWidth={3} />
                    </span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            {testimonials[1] && <TestimonialCard t={testimonials[1]} />}
          </aside>
        </Container>
      </section>
    </>
  );
}

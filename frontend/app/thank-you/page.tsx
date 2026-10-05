import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TrackOnLoad } from "@/components/forms/TrackOnLoad";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false },
};

const COPY: Record<string, { title: string; text: string }> = {
  enquiry: { title: "Thanks, we've got your enquiry", text: "A member of the team will get back to you, usually within one working day." },
  "call-request": { title: "Thanks, we'll be in touch to arrange your call", text: "A member of the team will contact you, usually within one working day, to find a time that suits." },
  booking: { title: "Your call is booked", text: "You'll receive a confirmation and calendar invitation by email. We look forward to speaking with you." },
};

// Separate thank-you URLs per conversion type make conversion tracking straightforward (MA-028).
// Booking tools should redirect here with ?type=booking after a successful booking.
export default async function ThankYouPage({ searchParams }: PageProps<"/thank-you">) {
  const { type } = await searchParams;
  const key = typeof type === "string" && COPY[type] ? type : "enquiry";
  const copy = COPY[key];

  return (
    <section className="relative isolate overflow-hidden pt-40 pb-28">
      {key === "booking" && <TrackOnLoad event="book_call" />}
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" aria-hidden />
      <Container className="max-w-2xl text-center">
        <span className="animate-pulse-ring mx-auto grid size-20 place-items-center rounded-full bg-teal text-charcoal-900">
          <CheckCircle2 aria-hidden className="size-10" />
        </span>
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-charcoal-900 sm:text-5xl">{copy.title}</h1>
        <p className="mt-5 text-lg text-muted">{copy.text}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          {key === "enquiry" && <Button href="/book-a-call">Book your introductory call now</Button>}
          <Button href="/quarterly-report" variant="ghost">
            Explore the quarterly report
          </Button>
        </div>
      </Container>
    </section>
  );
}

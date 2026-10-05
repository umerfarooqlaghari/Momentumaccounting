import Link from "next/link";
import { CalendarDays, MessageSquareText } from "lucide-react";

// Sticky mobile call-to-action so the next step is always one tap away (§5.1).
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/10 bg-white/90 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden">
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/contact"
          className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-charcoal/15 text-[15px] font-semibold"
        >
          <MessageSquareText aria-hidden className="size-4" /> Enquire
        </Link>
        <Link
          href="/book-a-call"
          className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal text-[15px] font-semibold text-charcoal-900"
        >
          <CalendarDays aria-hidden className="size-4" /> Book a call
        </Link>
      </div>
    </div>
  );
}

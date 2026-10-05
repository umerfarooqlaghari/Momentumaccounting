"use client";

import { useState } from "react";
import { Download, MailCheck } from "lucide-react";
import { ContactGate } from "@/components/forms/ContactGate";
import { track } from "@/lib/analytics";

export function DownloadGate({ slug, title }: { slug: string; title: string }) {
  const [done, setDone] = useState<{ downloadUrl?: string } | null>(null);

  if (done) {
    return (
      <div className="animate-[fade-in_0.5s_ease] rounded-[28px] bg-charcoal-900 p-8 text-white" role="status">
        <MailCheck aria-hidden className="size-10 text-teal" />
        <h2 className="mt-4 text-2xl font-extrabold">Thank you!</h2>
        {done.downloadUrl ? (
          <>
            <p className="mt-2 text-white/75">Your download is ready. We&apos;ve also emailed you the link.</p>
            <a href={done.downloadUrl} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-teal px-6 font-semibold text-charcoal-900">
              <Download aria-hidden className="size-4" /> Download {title}
            </a>
          </>
        ) : (
          <p className="mt-2 text-white/75">We&apos;ll email {title.toLowerCase()} to you shortly.</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-charcoal/10 bg-white p-6 shadow-[0_40px_80px_-40px_rgb(34_32_30/0.35)] sm:p-8">
      <h2 className="text-2xl font-extrabold text-charcoal-900">Get your free copy</h2>
      <p className="mt-1 text-muted">Tell us where to send it.</p>
      <div className="mt-6">
        <ContactGate
          type="download"
          submitLabel="Get the download"
          answers={{ magnet: slug }}
          onDone={(r) => {
            track("download", { item: slug });
            setDone(r);
          }}
        />
      </div>
    </div>
  );
}

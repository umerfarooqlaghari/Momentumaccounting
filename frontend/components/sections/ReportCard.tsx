import { TrendingUp, ShieldCheck } from "lucide-react";

const bars = [38, 46, 44, 58, 63, 72, 80, 92];

// Illustrative quarterly report card for the hero. Figures are sample data.
export function ReportCard() {
  return (
    <div className="relative">
      <div className="animate-float relative rounded-[28px] border border-charcoal/10 bg-white p-6 shadow-[0_40px_80px_-30px_rgb(34_32_30/0.35)] sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Quarterly report · Sample</p>
            <p className="mt-1 text-lg font-bold text-charcoal-900">Business summary, Q3</p>
          </div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-ink">On track</span>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Revenue", value: "£412k", delta: "+14%" },
            { label: "Gross margin", value: "41%", delta: "+3pt" },
            { label: "Cash", value: "£96k", delta: "+£22k" },
          ].map((k) => (
            <div key={k.label} className="rounded-2xl bg-stone-50 p-3">
              <p className="text-[11px] font-medium text-muted">{k.label}</p>
              <p className="mt-1 text-lg font-bold text-charcoal-900">{k.value}</p>
              <p className="text-[11px] font-semibold text-teal-ink">{k.delta}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-6 h-40 rounded-2xl bg-gradient-to-b from-teal-50 to-white p-4">
          <div className="flex h-full items-end gap-2">
            {bars.map((h, i) => (
              <div
                key={i}
                className="animate-grow-y flex-1 origin-bottom rounded-t-md bg-teal/70"
                style={{ height: `${h}%`, animationDelay: `${300 + i * 90}ms` }}
              />
            ))}
          </div>
          <svg className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)]" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <path
              d="M0 70 L14 58 L28 60 L42 44 L57 38 L71 27 L85 18 L100 4"
              fill="none"
              stroke="#423E3B"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="400"
              strokeDashoffset="400"
              className="animate-draw [animation-delay:600ms]"
            />
          </svg>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted">
          “Strong quarter. Margin improved on the new pricing, and cash is building ahead of the VAT payment.”
        </p>
      </div>

      <div className="animate-float absolute -bottom-12 -left-4 flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-white px-4 py-3 shadow-xl [animation-delay:-2s] sm:-left-10">
        <span className="grid size-10 place-items-center rounded-xl bg-charcoal-900 text-teal">
          <ShieldCheck aria-hidden className="size-5" />
        </span>
        <div>
          <p className="text-xs text-muted">Tax position</p>
          <p className="text-sm font-bold text-charcoal-900">No surprises</p>
        </div>
      </div>

      <div className="animate-float absolute -top-5 -right-3 flex items-center gap-2 rounded-2xl bg-charcoal-900 px-4 py-3 text-white shadow-xl [animation-delay:-4s] sm:-right-8">
        <TrendingUp aria-hidden className="size-5 text-teal" />
        <p className="text-sm font-semibold">Profit +18% vs Q2</p>
      </div>
    </div>
  );
}

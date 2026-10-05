import Link from "next/link";
import { Loader2 } from "lucide-react";

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-charcoal/10 bg-white ${className}`}>{children}</div>;
}

const variants = {
  primary: "bg-teal text-charcoal-900 hover:bg-[#2ab8b9]",
  dark: "bg-charcoal-900 text-white hover:bg-charcoal",
  ghost: "border border-charcoal/15 bg-white hover:border-charcoal/40",
  danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
};

export function Button({
  variant = "primary",
  loading,
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants; loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 aria-hidden className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

export function LinkButton({ href, variant = "primary", children, className = "" }: { href: string; variant?: keyof typeof variants; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-charcoal-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

const badgeTones: Record<string, string> = {
  ideal: "bg-teal-100 text-teal-ink",
  possible: "bg-amber-100 text-amber-800",
  not_a_fit: "bg-stone-200 text-muted",
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-violet-100 text-violet-800",
  call_booked: "bg-teal-100 text-teal-ink",
  proposal_sent: "bg-amber-100 text-amber-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-stone-200 text-muted",
  synced: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  failed: "bg-red-100 text-red-800",
  true: "bg-emerald-100 text-emerald-800",
  false: "bg-stone-200 text-muted",
};

export function Badge({ value, label }: { value: string; label?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${badgeTones[value] ?? "bg-stone-100 text-charcoal"}`}>
      {label ?? value.replace(/_/g, " ")}
    </span>
  );
}

export function Spinner() {
  return (
    <div className="grid place-items-center py-20 text-muted">
      <Loader2 aria-label="Loading" className="size-6 animate-spin" />
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      {message}
    </p>
  );
}

export const inputCls =
  "block w-full min-h-10 rounded-xl border border-charcoal/20 bg-white px-3 py-2 text-[15px] text-charcoal-900 outline-none transition focus:border-teal-ink focus:ring-4 focus:ring-teal/20";

export function formatDate(d?: string | Date, withTime = false) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}) });
}

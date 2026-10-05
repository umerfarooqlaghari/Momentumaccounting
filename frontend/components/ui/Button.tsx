import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "light";

const styles: Record<Variant, string> = {
  primary:
    "bg-teal text-charcoal-900 hover:bg-[#2ab8b9] shadow-[0_8px_24px_-8px_rgb(51_203_204/0.7)] hover:shadow-[0_12px_32px_-8px_rgb(51_203_204/0.8)]",
  secondary: "bg-charcoal text-white hover:bg-charcoal-900",
  ghost: "border border-charcoal/15 text-charcoal hover:border-charcoal/40 hover:bg-white",
  light: "border border-white/25 text-white hover:bg-white/10",
};

export function Button({
  href,
  children,
  variant = "primary",
  arrow = true,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition-all duration-300 hover:-translate-y-0.5 ${styles[variant]} ${className}`}
    >
      {children}
      {arrow && <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </Link>
  );
}

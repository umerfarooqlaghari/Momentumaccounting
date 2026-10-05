import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Superadmin", template: "%s · Momentum superadmin" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${jakarta.variable} antialiased`}>
      <body className="min-h-dvh font-sans text-[15px]">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Momentum Accounting API",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

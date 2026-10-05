import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { AttributionTracker } from "@/components/layout/AttributionTracker";
import { LiveContent } from "@/components/layout/LiveContent";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { ExitIntent } from "@/components/layout/ExitIntent";
import { Analytics } from "@/components/consent/Analytics";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSite } from "@/lib/data";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSite();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.businessName} | Accountants for growing limited companies in Ashford, Surrey`,
      template: `%s | ${settings.businessName}`,
    },
    description:
      "Modern accountants in Ashford, Surrey. Quarterly management accounts, your tax position every quarter and a full monthly service for growing limited companies.",
    openGraph: { type: "website", siteName: settings.businessName, locale: "en_GB" },
    alternates: { canonical: "./" },
  };
}

export const viewport: Viewport = {
  themeColor: "#33CBCC",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { settings: s, services } = await getSite();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": `${siteUrl}/#organization`,
    name: s.legalName,
    alternateName: s.businessName,
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    email: s.email,
    telephone: s.phone,
    slogan: s.tagline,
    priceRange: "££",
    address: {
      "@type": "PostalAddress",
      streetAddress: s.streetAddress || undefined,
      addressLocality: s.locality,
      addressRegion: s.region,
      postalCode: s.postcode || undefined,
      addressCountry: "GB",
    },
    openingHours: "Mo-Fr 09:00-17:00",
    areaServed: ["Ashford", "Surrey", "London", "United Kingdom"],
    sameAs: [s.instagram, s.tiktok, s.linkedin, s.facebook].filter(Boolean),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Accounting services",
      itemListElement: services.map((x) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: x.title, url: `${siteUrl}/services/${x.slug}` } })),
    },
  };

  return (
    <html lang="en-GB" className={`${jakarta.variable} antialiased`} data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col font-sans">
        <Header services={services.map(({ slug, title, icon }) => ({ slug, title, icon }))} announcement={s.announcement} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileCtaBar />
        <ConsentBanner />
        <ExitIntent />
        <AttributionTracker />
        <LiveContent />
        <Analytics
          ga4Id={s.ga4Id}
          googleAdsId={s.googleAdsId}
          googleAdsLeadLabel={s.googleAdsLeadLabel}
          metaPixelId={s.metaPixelId}
          linkedinPartnerId={s.linkedinPartnerId}
          tiktokPixelId={s.tiktokPixelId}
        />
        <JsonLd data={orgJsonLd} />
      </body>
    </html>
  );
}

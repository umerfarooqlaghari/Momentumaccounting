import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { CookieSettingsButton } from "@/components/consent/ConsentBanner";

export const metadata: Metadata = { title: "Cookie policy" };

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie policy"
      updated="October 2026"
      sections={[
        { heading: "What cookies are", text: "Cookies and similar technologies are small files stored on your device that help websites work and help us understand how they are used." },
        {
          heading: "Essential",
          text: "We store your cookie choice in your browser (ma_consent) and keep campaign information for your visit in session storage (ma_attribution) so your enquiry records how you found us. These are needed for the site to work and cannot be switched off.",
        },
        { heading: "Analytics (only with your consent)", text: "Google Analytics 4 (cookies beginning _ga) helps us understand which pages are useful. It is only loaded if you accept analytics cookies." },
        {
          heading: "Marketing (only with your consent)",
          text: "Google Ads, Meta Pixel, LinkedIn Insight Tag and TikTok Pixel help us measure our advertising. Embedded social media posts may also set cookies. These are only loaded if you accept marketing cookies.",
        },
        {
          heading: "Change your choice",
          text: (
            <>
              You can change your choice at any time:{" "}
              <CookieSettingsButton className="font-semibold text-teal-ink underline underline-offset-2" />. You can also control cookies through your browser settings.
            </>
          ),
        },
      ]}
    />
  );
}

import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { getSite } from "@/lib/data";

export const metadata: Metadata = { title: "Accessibility statement" };

export default async function AccessibilityPage() {
  const { settings } = await getSite();
  return (
    <LegalPage
      title="Accessibility statement"
      updated="October 2026"
      sections={[
        {
          heading: "Our commitment",
          text: "We want everyone to be able to use this website. It is designed to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.",
        },
        {
          heading: "What we've done",
          text: "The site can be navigated by keyboard, works with screen readers, uses sufficient colour contrast and respects your device's reduced-motion setting.",
        },
        {
          heading: "Feedback",
          text: `If you have difficulty using any part of this website, please email ${settings.email} and we'll help.`,
        },
      ]}
    />
  );
}

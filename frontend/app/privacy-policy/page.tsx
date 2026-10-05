import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { getSite } from "@/lib/data";

export const metadata: Metadata = { title: "Privacy policy" };

export default async function PrivacyPage() {
  const { settings: s } = await getSite();
  return (
    <LegalPage
      title="Privacy policy"
      updated="October 2026"
      sections={[
        {
          heading: "Who we are",
          text: `${s.legalName} is the data controller for personal information collected through this website.${s.companyNumber ? ` Company number ${s.companyNumber}.` : ""} Contact us at ${s.email ?? "our office"}.`,
        },
        {
          heading: "What we collect",
          text: "When you send an enquiry, book a call, take our quiz, use our calculator or download a resource, we collect the details you provide, such as your name, email, phone number and information about your business. We also record the page you came from and any campaign information (for example from an advert) to understand how people find us.",
        },
        {
          heading: "How we use it",
          text: "We use your information to respond to your enquiry and, if you become a client, to provide our services. Our lawful basis is your request and our legitimate interest in responding to it. We only send marketing emails if you have opted in, and every email includes an unsubscribe link.",
        },
        {
          heading: "Who we share it with",
          text: "Your details are stored in our own systems, including our internal practice management system (Momentum HQ). We use trusted processors to host the website, send emails and provide online booking. They act only on our instructions. We never sell your data.",
        },
        {
          heading: "Where it is stored",
          text: "Your information is stored securely in the UK or European Economic Area and is transmitted over encrypted connections.",
        },
        {
          heading: "How long we keep it",
          text: "If you do not become a client, we keep your enquiry details for up to 24 months and then delete them. Client records are kept in line with our legal and professional obligations.",
        },
        {
          heading: "Your rights",
          text: "You have the right to access, correct or delete your personal data, and to object to or restrict how we use it. To make a request, email us. You can also complain to the Information Commissioner's Office (ico.org.uk).",
        },
      ]}
    />
  );
}

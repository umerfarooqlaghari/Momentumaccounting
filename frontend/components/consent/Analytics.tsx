"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useConsent } from "@/lib/consent";
import type { Settings } from "@/lib/types";

type Ids = Pick<Settings, "ga4Id" | "googleAdsId" | "googleAdsLeadLabel" | "metaPixelId" | "linkedinPartnerId" | "tiktokPixelId">;
const safe = (id?: string) => (id && /^[A-Za-z0-9_-]+$/.test(id) ? id : undefined);

// Loads tracking tags only after consent (§9). Tag IDs are managed in superadmin → Site settings.
export function Analytics(props: Ids) {
  const consent = useConsent();

  useEffect(() => {
    window.__maTracking = { googleAdsId: safe(props.googleAdsId), googleAdsLeadLabel: props.googleAdsLeadLabel };
  }, [props.googleAdsId, props.googleAdsLeadLabel]);

  const ga4 = consent?.analytics ? safe(props.ga4Id) : undefined;
  const ads = consent?.marketing ? safe(props.googleAdsId) : undefined;
  const meta = consent?.marketing ? safe(props.metaPixelId) : undefined;
  const linkedin = consent?.marketing ? safe(props.linkedinPartnerId) : undefined;
  const tiktok = consent?.marketing ? safe(props.tiktokPixelId) : undefined;
  const gtagId = ga4 ?? ads;

  return (
    <>
      {gtagId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              analytics_storage: '${ga4 ? "granted" : "denied"}',
              ad_storage: '${ads ? "granted" : "denied"}',
              ad_user_data: '${ads ? "granted" : "denied"}',
              ad_personalization: '${ads ? "granted" : "denied"}'
            });
            gtag('js', new Date());
            ${ga4 ? `gtag('config', '${ga4}');` : ""}
            ${ads ? `gtag('config', '${ads}');` : ""}
          `}</Script>
        </>
      )}
      {meta && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${meta}'); fbq('track', 'PageView');
        `}</Script>
      )}
      {linkedin && (
        <Script id="linkedin-insight" strategy="afterInteractive">{`
          window._linkedin_partner_id = '${linkedin}';
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
          (function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}
          var s=document.getElementsByTagName('script')[0];var b=document.createElement('script');b.type='text/javascript';b.async=true;
          b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';s.parentNode.insertBefore(b,s);})(window.lintrk);
        `}</Script>
      )}
      {tiktok && (
        <Script id="tiktok-pixel" strategy="afterInteractive">{`
          !function (w, d, t) {w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],
          ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
          ttq.load=function(e){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{};
          var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
          ttq.load('${tiktok}');ttq.page();}(window, document, 'ttq');
        `}</Script>
      )}
    </>
  );
}

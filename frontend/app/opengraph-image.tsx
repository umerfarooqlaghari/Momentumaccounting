import { ImageResponse } from "next/og";

export const alt = "Momentum Accounting — Building financial momentum for your business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social share image for every page.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#22201e", color: "white", fontFamily: "sans-serif" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
          <path d="M-20 600 L240 470 L330 530 L560 360 L650 420 L880 230 L960 280 L1220 40" fill="none" stroke="#33CBCC" strokeOpacity="0.35" strokeWidth="6" />
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="96" height="78" viewBox="0 0 64 52">
            <path d="M2 38 L14 18 L19 29 L27 13 L31 22 L62 2 L42 30 L36 18 Z" fill="#33CBCC" />
            <path d="M16 50 L27 24 Q29 20 33 20 Q36 20 37 24 L40 34 L46 23 Q48 20 51 20 Q55 20 55 25 L56 50 L49 50 L48.5 33 L42 46 Q41 48 39 48 Q37 48 36 46 L31.5 33 L24 50 Z" fill="white" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 34, fontWeight: 800, fontStyle: "italic", lineHeight: 1 }}>
            <span>MOMENTUM</span>
            <span style={{ fontSize: 22, letterSpacing: 6, opacity: 0.8 }}>ACCOUNTING</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>Know your numbers.</div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, color: "#33CBCC" }}>Build momentum.</div>
          <div style={{ marginTop: 28, fontSize: 30, opacity: 0.75 }}>Accountants for growing limited companies · Ashford, Surrey</div>
        </div>
      </div>
    ),
    size,
  );
}

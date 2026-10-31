import { ImageResponse } from "next/og";

export const alt = "Prometheus — Websites and business systems for the Philippines";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#642b2d", color: "#fff4ea" }}>
      <div style={{ fontSize: 36, fontWeight: 700 }}>prometheus</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>Your very own IT team.</div>
        <div style={{ fontSize: 32, color: "#fff4ea" }}>Websites · CRM · Business Management Systems</div>
      </div>
      <div style={{ fontSize: 25 }}>Built for Philippine businesses, freelancers and professionals.</div>
    </div>, size,
  );
}

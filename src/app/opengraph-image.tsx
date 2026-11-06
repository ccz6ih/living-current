import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Living Current — Dr. Amina's method, in software";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#15302b", color: "#f2f3ee", padding: 72, fontFamily: "Georgia, serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <svg width="72" height="72" viewBox="0 0 64 64" fill="none">
              <path d="M12 22c5-4 10-4 15 0s10 4 15 0 10-4 10-4" stroke="#f2f3ee" strokeWidth="4" strokeLinecap="round" />
              <path d="M12 32h8l4-9 6 18 4-13 3 4h15" stroke="#b8862a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 44c5-4 10-4 15 0s10 4 15 0 10-4 10-4" stroke="#f2f3ee" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div style={{ fontSize: 40 }}>Living Current</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 1000 }}>Dr. Amina at every practitioner's shoulder.</div>
            <div style={{ fontSize: 30, color: "#c9d1cb", fontFamily: "sans-serif" }}>Read the pulse. Apply the current. Show the client what changed.</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

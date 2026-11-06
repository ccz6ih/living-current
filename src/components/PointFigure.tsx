"use client";

/**
 * A simple figure with the point marked. Regions are stylised silhouettes;
 * the marker pulses so the eye finds it from arm's length.
 * Point coordinates are placeholders until Amina's locations are confirmed.
 */
type Region = "lowerLeg" | "knee" | "hand" | "forearm" | "head" | "back" | "belly";

const POINT_MAP: Record<string, { region: Region; x: number; y: number }> = {
  "SP 6": { region: "lowerLeg", x: 70, y: 200 },
  "ST 36": { region: "lowerLeg", x: 118, y: 100 },
  "SP 9": { region: "lowerLeg", x: 74, y: 92 },
  "GB 34": { region: "lowerLeg", x: 126, y: 96 },
  "GB 39": { region: "lowerLeg", x: 122, y: 200 },
  "KI 3": { region: "lowerLeg", x: 70, y: 236 },
  "LV 3": { region: "lowerLeg", x: 98, y: 262 },
  "ST 41": { region: "lowerLeg", x: 100, y: 240 },
  "ST 35": { region: "knee", x: 128, y: 140 },
  Xiyan: { region: "knee", x: 72, y: 140 },
  "LI 4": { region: "hand", x: 60, y: 150 },
  "HT 7": { region: "forearm", x: 84, y: 220 },
  "PC 6": { region: "forearm", x: 100, y: 180 },
  "GB 20": { region: "head", x: 82, y: 190 },
  Taiyang: { region: "head", x: 56, y: 110 },
  Yintang: { region: "head", x: 100, y: 100 },
  "GV 20": { region: "head", x: 100, y: 28 },
  Anmian: { region: "head", x: 48, y: 160 },
  "BL 23": { region: "back", x: 84, y: 190 },
  "BL 40": { region: "back", x: 120, y: 272 },
  "GV 4": { region: "back", x: 100, y: 196 },
  "CV 12": { region: "belly", x: 100, y: 118 },
};

export function PointFigure({ code, color }: { code: string; color: string }) {
  const p = POINT_MAP[code] ?? { region: "lowerLeg" as Region, x: 100, y: 150 };
  return (
    <svg viewBox="0 0 200 290" className="w-full h-full" aria-label={`Location of ${code}`}>
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efd3bd" />
          <stop offset="1" stopColor="#dfb08f" />
        </linearGradient>
      </defs>
      <g fill="url(#skin)">
        {p.region === "lowerLeg" && (
          <>
            <path d="M62 10 C58 70 56 150 68 230 L72 262 C80 272 110 272 134 262 L130 230 C140 150 140 70 136 10 Z" />
            <path d="M68 262 C60 276 70 288 100 288 C130 288 150 282 150 272 L134 262 Z" />
            <path d="M92 20 L94 240" stroke="#c99a76" strokeWidth="1.5" strokeDasharray="4 5" fill="none" />
          </>
        )}
        {p.region === "knee" && (
          <>
            <path d="M62 10 L138 10 L140 110 C150 140 150 170 138 200 L140 280 L60 280 L62 200 C50 170 50 140 60 110 Z" />
            <ellipse cx="100" cy="140" rx="28" ry="26" fill="#e3b99a" />
          </>
        )}
        {p.region === "hand" && (
          <>
            <path d="M70 280 L70 170 C70 140 90 110 100 80 L110 20 C114 10 126 12 124 26 L120 90 L150 70 C160 64 170 76 160 86 L128 118 L130 200 L130 280 Z" />
          </>
        )}
        {p.region === "forearm" && (
          <>
            <path d="M60 280 C60 200 64 130 72 60 L76 20 C80 6 120 6 124 20 L128 60 C136 130 140 200 140 280 Z" />
            <path d="M92 30 L94 270 M108 30 L106 270" stroke="#c99a76" strokeWidth="1.5" fill="none" />
          </>
        )}
        {p.region === "head" && (
          <>
            <ellipse cx="100" cy="110" rx="58" ry="78" />
            <path d="M72 180 L70 280 L130 280 L128 180 Z" />
            <path d="M48 120 C40 140 56 160 60 150 M152 120 C160 140 144 160 140 150" stroke="#c99a76" strokeWidth="2" fill="none" />
          </>
        )}
        {p.region === "back" && (
          <>
            <path d="M50 10 L150 10 L156 140 C156 180 140 200 136 230 L134 280 L66 280 L64 230 C60 200 44 180 44 140 Z" />
            <path d="M100 14 L100 240" stroke="#c99a76" strokeWidth="2" strokeDasharray="5 5" fill="none" />
          </>
        )}
        {p.region === "belly" && (
          <>
            <path d="M46 10 L154 10 L160 150 C160 200 140 240 100 280 C60 240 40 200 40 150 Z" />
            <circle cx="100" cy="160" r="6" fill="#d1a382" />
            <path d="M100 14 L100 150" stroke="#c99a76" strokeWidth="1.5" strokeDasharray="4 5" fill="none" />
          </>
        )}
      </g>
      <g>
        <circle cx={p.x} cy={p.y} r="18" fill={color} opacity="0.25">
          <animate attributeName="r" values="14;26;14" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0;0.35" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={p.x} cy={p.y} r="10" fill={color} stroke="white" strokeWidth="3" />
      </g>
    </svg>
  );
}

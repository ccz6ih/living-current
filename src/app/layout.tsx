import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/lib/store";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://living-current.vercel.app"),
  title: { default: "Living Current — Dr. Amina's method, in software", template: "%s · Living Current" },
  description: "Read the pulse, apply the current, show the client what changed. Guided Equiscope and Acuscope protocols by Dr. Amina, point by point.",
  applicationName: "Living Current",
  openGraph: { type: "website", siteName: "Living Current", title: "Living Current", description: "Dr. Amina at every practitioner's shoulder." },
  twitter: { card: "summary_large_image" },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Living Current", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#15302b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

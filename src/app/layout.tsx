import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Living Current | Practitioner Studio",
  description: "A thoughtful workspace for integrative wellness practitioners.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body>{children}</body></html>;
}

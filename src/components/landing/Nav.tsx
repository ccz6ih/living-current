"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Waves } from "lucide-react";

const LINKS = [
  ["#session", "The session"],
  ["#method", "The method"],
  ["#results", "Results"],
  ["#devices", "Devices"],
  ["#learn", "Certification"],
  ["#pricing", "Pricing"],
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`sticky top-0 z-30 transition-colors ${scrolled ? "bg-bone/85 backdrop-blur border-b border-line" : ""}`}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="w-8 h-8 rounded-full bg-ink text-bone inline-flex items-center justify-center"><Waves className="w-4 h-4" /></span>
          Living Current
        </Link>
        <nav className="hidden md:flex gap-5 text-sm ml-4">
          {LINKS.map(([h, l]) => (
            <a key={h} href={h} className="hover:underline underline-offset-4">{l}</a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/app" className="text-sm hover:underline underline-offset-4">Practitioner login</Link>
          <a href="#pilot" className="btn btn-primary !min-h-10 text-sm">Join the pilot</a>
        </div>
      </div>
    </header>
  );
}

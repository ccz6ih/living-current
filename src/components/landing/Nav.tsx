"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

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
        <Link href="/" aria-label="Living Current home"><Logo size={30} /></Link>
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

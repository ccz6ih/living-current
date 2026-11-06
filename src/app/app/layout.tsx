import Link from "next/link";
import { PRACTITIONER } from "@/data/seed";
import { Waves } from "lucide-react";

export default function TabletLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="flex items-center gap-4 px-5 h-16 border-b border-line bg-paper/80 backdrop-blur sticky top-0 z-20">
        <Link href="/app" className="flex items-center gap-2 font-semibold">
          <span className="w-8 h-8 rounded-full bg-ink text-bone inline-flex items-center justify-center">
            <Waves className="w-4 h-4" />
          </span>
          Living Current
        </Link>
        <nav className="ml-6 hidden md:flex gap-5 text-sm">
          <Link href="/app" className="hover:underline">Today</Link>
          <Link href="/app/clients/sarah-m" className="hover:underline">Clients</Link>
          <Link href="/app/library" className="hover:underline">Protocol library</Link>
          <Link href="/app/device" className="hover:underline">Your device</Link>
        </nav>
        <div className="ml-auto text-right leading-tight">
          <div className="text-sm font-semibold">{PRACTITIONER.name}</div>
          <div className="text-xs text-ink-soft">{PRACTITIONER.device}</div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

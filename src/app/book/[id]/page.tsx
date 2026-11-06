import Link from "next/link";
import { PRACTITIONER } from "@/data/seed";

/** Landing from the report's booking QR. Booking integrates with the clinic's calendar in phase 5. */
export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slots = ["Tue 11 Nov · 10:00", "Tue 11 Nov · 2:30", "Thu 13 Nov · 9:00", "Fri 14 Nov · 1:00"];
  return (
    <div className="min-h-dvh flex items-center justify-center px-5 py-10">
      <div className="card p-6 w-full max-w-md">
        <div className="text-sm text-ink-soft">{PRACTITIONER.clinic}</div>
        <h1 className="text-3xl mt-1">Book your next visit</h1>
        <p className="text-sm text-ink-soft mt-1 mb-5">Within 7 days keeps the change holding. Pick a time that suits.</p>
        <ul className="flex flex-col gap-2">
          {slots.map((s) => (
            <li key={s}>
              <button className="tap w-full text-left card px-4 py-3 hover:bg-bone font-semibold">{s}</button>
            </li>
          ))}
        </ul>
        <p className="text-xs text-ink-soft mt-5">Client file {id}. <Link href="/" className="underline">Living Current</Link></p>
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ReportActions } from "@/components/report-actions";
import { clients, getClient } from "@/lib/demo-data";

export const instant = false;

export function generateStaticParams() {
  return clients.map(({ id }) => ({ id }));
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = getClient(id);
  if (!client) notFound();

  const score = client.sessions.at(-1)?.score ?? 68;
  return (
    <main className="report-wrap">
      <Link href="/" className="report-brand"><span className="brand-mark"><span>↝</span></span> living current</Link>
      <article className="report-card">
        <div className="report-topline"><span className="eyebrow">YOUR SESSION REFLECTION</span><span className="report-date">November 6, 2026</span></div>
        <h1>A little more grounded.</h1>
        <p>A thoughtful note from your time with Amina Shah.</p>
        <div className="report-hero">
          <div className="report-score">{score}<small>wellbeing index</small></div>
          <div><h2>Today’s intention</h2><p>More steady energy through the afternoon. Your session focused on supporting the center and finding an even rhythm.</p></div>
        </div>
        <section className="report-section"><h3>What we explored</h3><p>We noticed where your energy was asking for support and built a gentle sequence around that. You were guided through {client.sessions.length ? 3 : 3} points at a comfortable pace, with space to settle between each one.</p></section>
        <section className="report-section"><h3>A practice for the week</h3><p>Pause for three slow breaths before the afternoon rush. Let your shoulders soften and feel your feet on the ground.</p></section>
        <section className="report-section"><h3>Your next step</h3><p>Notice when your energy feels most steady. We can revisit what you discover at your next session.</p></section>
        <div className="report-footer"><div className="qr-box"><ReportActions clientId={client.id} /><span>Scan to return to this<br />reflection and booking details.</span></div><ReportActions clientId={client.id} printButton /></div>
      </article>
      <p className="public-note">Fictional demo reflection for {client.name}. Your care, your pace.</p>
    </main>
  );
}

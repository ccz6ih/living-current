import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { AppShell, ElementBadge, PageHeading } from "@/components/app-shell";
import { Tracker } from "@/components/tracker";
import { clients, getClient } from "@/lib/demo-data";

export const instant = false;

export function generateStaticParams() {
  return clients.map(({ id }) => ({ id }));
}

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = getClient(id);
  if (!client) notFound();

  return (
    <AppShell active="clients">
      <div className="content-wrap">
        <Link className="flow-back" href="/"><ArrowLeft size={15} /> Back to today</Link>
        <PageHeading
          eyebrow="CLIENT FILE"
          title={client.name}
          description="A living record of care, patterns, and progress."
          action={<Link className="button button-primary" href={`/session/${client.id}/intake`}><Plus size={16} /> Start a session</Link>}
        />
        <section className="panel-card">
          <div className="client-header">
            <div className={`avatar avatar-${client.color}`}>{client.initials}</div>
            <div><h2>{client.name}</h2><p>{client.age} years <span className="divider-dot">·</span> {client.pronouns}</p></div>
            <div style={{ marginLeft: "auto" }}><ElementBadge>{client.status}</ElementBadge></div>
          </div>
          <div className="client-facts">
            <div className="client-fact"><span>Focus areas</span><strong>{client.focus}</strong></div>
            <div className="client-fact"><span>Last visit</span><strong>{client.lastVisit}</strong></div>
            <div className="client-fact"><span>Next appointment</span><strong>{client.nextVisit}</strong></div>
          </div>
        </section>

        <div className="two-column">
          <section className="panel-card">
            <div className="panel-title"><div><h2>Living Current Index</h2><p>A view of change over time</p></div><Link href={`/r/${client.id}`} className="subtle-link">Latest report <ArrowRight size={14} /></Link></div>
            <Tracker sessions={client.sessions} />
          </section>
          <section className="panel-card">
            <div className="panel-title"><div><h2>Session history</h2><p>{client.sessions.length} sessions recorded</p></div></div>
            {client.sessions.length ? (
              <div className="session-history">
                {[...client.sessions].reverse().map((session) => (
                  <div className="history-item" key={session.date}>
                    <span className="history-date">{session.date}</span>
                    <span className="history-focus">{session.focus}<small>{session.duration} · Session report</small></span>
                    <span className="score-chip">{session.score}</span>
                  </div>
                ))}
              </div>
            ) : <div className="empty-note">This client’s first session is ready to begin. Their file will grow with each visit.</div>}
          </section>
        </div>
        <section className="index-card">
          <div className="index-ring"><span>{client.sessions.at(-1)?.score ?? "—"}</span></div>
          <div className="index-copy"><strong>Wellbeing is a conversation, not a score.</strong><p>The index brings together settle, point-settle, and balance signals across sessions.</p></div>
        </section>
      </div>
    </AppShell>
  );
}

import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Bell,
  CalendarDays,
  Clock3,
  Plus,
  Sparkles,
} from "lucide-react";
import { AppShell, PageHeading } from "@/components/app-shell";
import { clients } from "@/lib/demo-data";

export default function Home() {
  return (
    <AppShell>
      <div className="content-wrap dashboard">
        <PageHeading
          eyebrow="FRIDAY, NOVEMBER 6"
          title="Good morning, Amina"
          description="A steady day starts with a moment to arrive."
          action={<Link className="button button-primary" href="/session/sarah-m/intake"><Plus size={17} /> Start a session</Link>}
        />
        <section className="welcome-strip">
          <div className="welcome-icon"><Sparkles size={20} /></div>
          <div>
            <strong>Make space for what’s here.</strong>
            <p>Your studio is ready. You have 3 client visits on the calendar today.</p>
          </div>
          <Link href="/admin/rules" className="text-link">View your flow <ArrowRight size={15} /></Link>
        </section>

        <div className="section-heading">
          <div><h2>Today at a glance</h2><p>Your practice, in rhythm.</p></div>
          <Link className="subtle-link" href="/clients/sarah-m">View calendar <ArrowUpRight size={15} /></Link>
        </div>
        <div className="stat-grid">
          <article className="stat-card">
            <div className="stat-top"><span>Sessions today</span><CalendarDays size={17} /></div>
            <div className="stat-value">03 <span>scheduled</span></div>
            <div className="stat-note">Next visit in <strong>24 min</strong></div>
          </article>
          <article className="stat-card">
            <div className="stat-top"><span>Client wellbeing</span><Sparkles size={17} /></div>
            <div className="stat-value">72<span className="stat-unit">/100</span></div>
            <div className="stat-note"><span className="positive-dot" /> Sarah’s latest index <span className="trend">+6 this month</span></div>
          </article>
          <article className="stat-card">
            <div className="stat-top"><span>Check-ins to review</span><Bell size={17} /></div>
            <div className="stat-value">02 <span>waiting</span></div>
            <div className="stat-note">Both received this morning</div>
          </article>
        </div>

        <div className="dashboard-columns">
          <section className="panel appointments">
            <div className="panel-heading">
              <div><h2>Today’s clients</h2><p>Friday, November 6 <span className="divider-dot">·</span> 3 appointments</p></div>
              <button className="icon-button" aria-label="Calendar options"><CalendarDays size={18} /></button>
            </div>
            <div className="appointment-list">
              {clients.map((client, index) => (
                <article className="appointment-row" key={client.id}>
                  <div className="appointment-time"><strong>{["10:00", "11:30", "2:00"][index]}</strong><span>{index < 2 ? "AM" : "PM"}</span></div>
                  <div className={`avatar avatar-${client.color}`}>{client.initials}</div>
                  <div className="appointment-details">
                    <Link href={`/clients/${client.id}`} className="client-name">{client.name}</Link>
                    <span>{client.focus}</span>
                  </div>
                  <span className={`status-tag ${client.status === "New client" ? "status-new" : client.status === "Check-in due" ? "status-due" : ""}`}>{client.status}</span>
                  <Link href={`/session/${client.id}/intake`} className="row-action" aria-label={`Start session with ${client.name}`}><ArrowUpRight size={16} /></Link>
                </article>
              ))}
            </div>
            <Link href="/clients/sarah-m" className="panel-footer">See all clients <ArrowRight size={15} /></Link>
          </section>

          <section className="panel session-card">
            <div className="session-card-art">
              <div className="sun-orbit orbit-one" /><div className="sun-orbit orbit-two" />
              <div className="sun-disc" />
              <span className="art-label">A practice in presence</span>
            </div>
            <div className="session-card-content">
              <div className="eyebrow">YOUR NEXT SESSION</div>
              <h2>Sarah M.</h2>
              <p>Follow-up <span className="divider-dot">·</span> Energy &amp; digestion</p>
              <div className="session-meta"><span><Clock3 size={15} /> 10:00 AM</span><span className="status-tag">In 24 min</span></div>
              <Link className="button button-dark full-button" href="/session/sarah-m/intake">Prepare session <ArrowRight size={16} /></Link>
            </div>
          </section>
        </div>

        <section className="insight-card">
          <div className="insight-icon"><Sparkles size={18} /></div>
          <div><span className="eyebrow">A GENTLE REMINDER</span><p>“A good session doesn’t need to fix everything. It needs to meet what’s ready.”</p></div>
          <span className="insight-credit">Your practice note <span>·</span> Oct 28</span>
        </section>
      </div>
    </AppShell>
  );
}

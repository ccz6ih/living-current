"use client";

import { useState } from "react";
import { AppShell, PageHeading } from "@/components/app-shell";
import { protocolLibrary } from "@/lib/demo-data";
import { Check, Plus, SlidersHorizontal } from "lucide-react";

export default function ProtocolsPage() {
  const [enabled, setEnabled] = useState(() => Object.fromEntries(protocolLibrary.map(({ id, active }) => [id, active])));
  const [added, setAdded] = useState(false);

  return (
    <AppShell active="protocols">
      <div className="content-wrap">
        <PageHeading eyebrow="YOUR LIBRARY" title="Protocols" description="Shape a starting point that keeps your care personal." action={<button className="button button-primary" onClick={() => setAdded(true)}><Plus size={16} /> New protocol</button>} />
        {added && <div className="welcome-strip"><Check size={18} /><div><strong>New protocol draft created.</strong><p>Give it a name and build the sequence that feels right.</p></div></div>}
        <div className="admin-grid">
          {protocolLibrary.map((protocol) => (
            <article className="protocol-card" key={protocol.id}>
              <div className="protocol-card-top">
                <div><h2>{protocol.name}</h2><p>{protocol.goal}</p></div>
                <button className={`toggle ${enabled[protocol.id] ? "on" : ""}`} aria-label={`${enabled[protocol.id] ? "Disable" : "Enable"} ${protocol.name}`} aria-pressed={Boolean(enabled[protocol.id])} onClick={() => setEnabled((current) => ({ ...current, [protocol.id]: !current[protocol.id] }))}><span /></button>
              </div>
              <div className="protocol-tags">{protocol.tags.map((tag) => <span className="element-badge" key={tag}>{tag}</span>)}</div>
              <div className="point-list">{protocol.points.map((point, index) => <div className="point-row" key={point}><div className="point-code">{String(index + 1).padStart(2, "0")}</div><div><strong>{point}</strong><p>{index === 0 ? "First point · tonify" : "Gentle support"}</p></div><SlidersHorizontal size={15} color="#a2ada4" /></div>)}</div>
            </article>
          ))}
        </div>
        <p className="public-note">Changes in this demo are temporary and won’t be saved.</p>
      </div>
    </AppShell>
  );
}

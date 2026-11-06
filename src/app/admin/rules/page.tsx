import { ArrowRight, GitBranch, Info } from "lucide-react";
import Link from "next/link";
import { AppShell, PageHeading } from "@/components/app-shell";

export default function RulesPage() {
  return (
    <AppShell active="rules">
      <div className="content-wrap">
        <PageHeading eyebrow="DECISION TREE" title="Rules, with room to respond." description="Amina’s draft rules suggest a direction. Clinical judgement always leads." action={<Link className="button button-outline" href="/admin/protocols"><GitBranch size={16} /> Edit protocols</Link>} />
        <section className="panel-card">
          <div className="panel-title"><div><h2>Session suggestion</h2><p>Rule set · Living Current starter · Updated just now</p></div><span className="status-tag">Active in demo</span></div>
          <div className="rule-list">
            <div className="rule-row"><span>If Earth is low <small>pulse rating below 1.5</small></span><span className="rule-arrow"><ArrowRight size={16} /></span><span>Support Earth <small>build steady, grounded energy</small></span></div>
            <div className="rule-row"><span>And Wood is over-acting <small>pulse rating above 2.5</small></span><span className="rule-arrow"><ArrowRight size={16} /></span><span>Use gentle, tonifying tone <small>avoid over-stimulating the system</small></span></div>
            <div className="rule-row"><span>Otherwise <small>no strong element gap</small></span><span className="rule-arrow"><ArrowRight size={16} /></span><span>Settle and balance <small>short, even sequence</small></span></div>
          </div>
          <div className="empty-note" style={{ display: "flex", gap: 9, alignItems: "flex-start", marginTop: 16 }}><Info size={15} style={{ flex: "0 0 auto" }} /> These are illustrative demo rules, not medical guidance. Review every suggestion and adapt it to the person in front of you.</div>
        </section>
      </div>
    </AppShell>
  );
}

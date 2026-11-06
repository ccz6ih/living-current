import Link from "next/link";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Leaf,
  Settings2,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

const navigation = [
  { label: "Today", href: "/", icon: CalendarDays, id: "today" },
  { label: "Clients", href: "/clients/sarah-m", icon: UsersRound, id: "clients" },
  { label: "Protocols", href: "/admin/protocols", icon: ClipboardList, id: "protocols" },
  { label: "Decision rules", href: "/admin/rules", icon: Settings2, id: "rules" },
];

export function AppShell({
  children,
  active = "today",
}: {
  children: ReactNode;
  active?: string;
}) {
  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark"><Activity size={21} strokeWidth={1.8} /></span>
          <span>living current<small>practitioner studio</small></span>
        </Link>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map(({ label, href, icon: Icon, id }) => (
            <Link
              aria-current={active === id ? "page" : undefined}
              className={`side-link ${active === id ? "active" : ""}`}
              href={href}
              key={id}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {id === "clients" && <span className="nav-count">12</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <Link className="help-link" href="/client/checkin/demo">
          <CircleHelp size={17} /> Help &amp; resources
        </Link>
        <div className="practitioner-card">
          <div className="avatar avatar-sage">AS</div>
          <div className="practitioner-name">Amina Shah<small>Practitioner</small></div>
          <ChevronDown size={16} className="muted-icon" />
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand"><Activity size={20} /> living current</div>
          <div className="breadcrumb">Studio <span>/</span> <strong>{navigation.find((item) => item.id === active)?.label ?? "Studio"}</strong></div>
          <div className="topbar-right">
            <span className="demo-pill"><span /> Demo workspace</span>
            <div className="avatar avatar-sage small-avatar">AS</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ElementBadge({ children }: { children: ReactNode }) {
  return <span className="element-badge"><Leaf size={13} />{children}</span>;
}

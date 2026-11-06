/**
 * The Living Current mark: three lines of current, the middle one carrying a
 * pulse. Read the pulse, apply the current. Pine ink, with the pulse in earth
 * gold, the element at the centre of the method.
 */
export function Mark({ size = 32, ink = "var(--ink)", pulse = "var(--earth)", bg = "transparent" }: { size?: number; ink?: string; pulse?: string; bg?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="32" fill={bg} />
      <path d="M12 22c5-4 10-4 15 0s10 4 15 0 10-4 10-4" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      <path d="M12 32h8l4-9 6 18 4-13 3 4h15" stroke={pulse} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 44c5-4 10-4 15 0s10 4 15 0 10-4 10-4" stroke={ink} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ size = 28, className = "", light = false }: { size?: number; className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark size={size} ink={light ? "var(--bone)" : "var(--ink)"} />
      <span className="display font-medium tracking-tight" style={{ fontSize: size * 0.8, lineHeight: 1 }}>Living Current</span>
    </span>
  );
}

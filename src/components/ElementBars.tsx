import { ELEMENTS, ELEMENT_LABEL, type ElementBalance } from "@/engine/types";

/** Five horizontal bars centred on zero: left is deficient, right is excess. */
export function ElementBars({ balance, compact = false }: { balance: ElementBalance; compact?: boolean }) {
  return (
    <ul className={`flex flex-col ${compact ? "gap-1.5" : "gap-3"}`}>
      {ELEMENTS.map((e) => {
        const v = balance.scores[e];
        const pct = (Math.abs(v) / 2) * 50;
        const isW = e === balance.weakest, isS = e === balance.strongest;
        return (
          <li key={e} className="grid grid-cols-[64px_1fr_44px] items-center gap-3 text-sm">
            <span className={`font-semibold ${isW || isS ? "" : "text-ink-soft"}`}>{ELEMENT_LABEL[e]}</span>
            <div className={`relative ${compact ? "h-2.5" : "h-4"} rounded-full bg-bone-2`}>
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-line" />
              <div
                className="absolute top-0 bottom-0 rounded-full"
                style={{
                  background: `var(--${e})`,
                  left: v < 0 ? `${50 - pct}%` : "50%",
                  width: `${pct}%`,
                  opacity: isW || isS ? 1 : 0.55,
                }}
              />
            </div>
            <span className="tabular-nums text-right text-ink-soft">{v > 0 ? `+${v}` : v}</span>
          </li>
        );
      })}
    </ul>
  );
}

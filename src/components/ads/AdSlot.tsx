import { AdSlotData } from "../../data/ads";

export function AdSlot({ ad }: { ad: AdSlotData }) {
  return (
    <a
      href={ad.href}
      className="group flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-base-line bg-base-panel px-6 py-5 transition-colors hover:border-lime/40"
    >
      <div>
        <p className="text-[11px] uppercase tracking-wide text-ink-faint">In partnership with {ad.sponsor}</p>
        <p className="mt-1.5 font-display text-lg text-ink">{ad.headline}</p>
      </div>
      <span className="shrink-0 rounded-full border border-base-line px-4 py-2 text-xs font-medium text-ink transition-colors group-hover:border-lime group-hover:text-lime">
        {ad.cta}
      </span>
    </a>
  );
}

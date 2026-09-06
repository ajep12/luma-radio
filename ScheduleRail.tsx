import { Link } from "react-router-dom";
import { scheduleForDay } from "../../data/schedule";
import { presenters } from "../../data/presenters";
import { shows } from "../../data/shows";

function currentTimeLabel() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function isSlotLive(time: string, now: string) {
  const [start, end] = time.split("–").map((t) => t.trim());
  return now >= start && now < end;
}

export function ScheduleRail({ day }: { day: string }) {
  const slots = scheduleForDay(day);
  const now = currentTimeLabel();

  if (slots.length === 0) {
    return <p className="text-sm text-ink-faint">Nothing scheduled — check back on another day.</p>;
  }

  return (
    <div className="flex snap-x gap-3 overflow-x-auto pb-2">
      {slots.map((slot) => {
        const live = isSlotLive(slot.time, now);
        return (
          <Link
            key={`${slot.day}-${slot.time}-${slot.showId}`}
            to={`/shows/${slot.show.id}`}
            className={`group flex w-64 shrink-0 snap-start flex-col gap-3 rounded-2xl border p-4 transition-colors ${
              live
                ? "border-lime bg-lime/5"
                : "border-base-line bg-base-panel hover:border-base-line/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-display text-sm ${live ? "text-lime" : "text-ink-faint"}`}>
                {slot.time}
              </span>
              {live && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-lime">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse-dot" />
                  On air
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <img
                src={slot.show.artwork}
                alt=""
                className="h-12 w-12 rounded-lg object-cover ring-1 ring-base-line"
              />
              <div className="min-w-0">
                <p className="truncate font-display text-base text-ink">{slot.show.name}</p>
                <p className="truncate text-xs text-ink-faint">with {presenterName(slot.showId)}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function presenterName(showId: string) {
  const show = shows.find((s) => s.id === showId);
  const presenter = presenters.find((p) => p.id === show?.presenterId);
  return presenter?.name ?? "Luma Radio";
}

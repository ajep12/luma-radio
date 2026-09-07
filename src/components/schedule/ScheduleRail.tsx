import { Link } from "react-router-dom";

type ScheduleEntry = {
  id: string;
  date: string;
  start_time: string;
  end_time: string | null;
  show_id: string;
  show: {
    id: string;
    name: string;
    artwork: string;
  } | null;
};

function currentTimeLabel() {
  const d = new Date();

  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

function isSlotLive(
  startTime: string,
  endTime: string | null,
  date: string
) {
  if (!endTime) return false;

  const today = new Date().toISOString().split("T")[0];

  if (date !== today) return false;

  const now = currentTimeLabel();
  const start = startTime.slice(0, 5);
  const end = endTime.slice(0, 5);

  return now >= start && now < end;
}

export function ScheduleRail({
  schedule,
}: {
  schedule: ScheduleEntry[];
}) {
  if (schedule.length === 0) {
    return (
      <p className="text-sm text-ink-faint">
        Nothing scheduled — check back on another day.
      </p>
    );
  }

  return (
    <div className="flex snap-x gap-3 overflow-x-auto pb-2">
      {schedule.map((slot) => {
        if (!slot.show) return null;

        const live = isSlotLive(
          slot.start_time,
          slot.end_time,
          slot.date
        );

        return (
          <Link
            key={slot.id}
            to={`/shows/${slot.show.id}`}
            className={`group flex w-64 shrink-0 snap-start flex-col gap-3 rounded-2xl border p-4 transition-colors ${
              live
                ? "border-lime bg-lime/5"
                : "border-base-line bg-base-panel hover:border-base-line/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-display text-sm ${
                  live ? "text-lime" : "text-ink-faint"
                }`}
              >
                {slot.start_time.slice(0, 5)}
                {slot.end_time &&
                  `–${slot.end_time.slice(0, 5)}`}
              </span>

              {live && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-lime">
                  <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-lime" />
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
                <p className="truncate font-display text-base text-ink">
                  {slot.show.name}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

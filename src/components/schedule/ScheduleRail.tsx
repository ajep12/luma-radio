import { useState, useEffect } from "react";

type ScheduleEntry = {
  id: string;
  date: string;
  start_time: string;
  end_time: string | null;
  show_name: string;
};

function getLocalDate() {
  const d = new Date();

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

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

  const today = getLocalDate();

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
  const [, setCurrentTime] = useState(Date.now());

  // Refresh every minute so "On air" updates automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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
        const live = isSlotLive(
          slot.start_time,
          slot.end_time,
          slot.date
        );

        return (
          <div
            key={slot.id}
            className={`group flex w-64 shrink-0 snap-start flex-col gap-3 rounded-2xl border p-4 transition-colors ${
              live
                ? "border-lime bg-lime/5"
                : "border-base-line bg-base-panel hover:border-base-line/60"
            }`}
          >
            {/* Time + live indicator */}
            <div className="flex items-center justify-between">
              <span
                className={`font-display text-sm ${
                  live
                    ? "text-lime"
                    : "text-ink-faint"
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

            {/* Show */}
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-xs font-medium ${
                  live
                    ? "bg-lime text-coal"
                    : "bg-base-raised text-ink-faint"
                }`}
              >
                L
              </div>

              <div className="min-w-0">
                <p
                  className={`truncate font-display text-base ${
                    live
                      ? "text-lime"
                      : "text-ink"
                  }`}
                >
                  {slot.show_name}
                </p>

                <p className="truncate text-xs text-ink-faint">
                  Luma Radio
                </p>
              </div>
            </div>

            {/* Current show indicator */}
            {live && (
              <div className="rounded-lg bg-lime/10 px-3 py-2 text-xs text-lime">
                Currently playing
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

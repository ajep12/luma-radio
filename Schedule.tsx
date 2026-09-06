import { useState } from "react";
import { Link } from "react-router-dom";
import { weekDays, scheduleForDay } from "../data/schedule";
import { ScheduleRail } from "../components/schedule/ScheduleRail";

const fullDayNames: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

function todayShort() {
  const idx = new Date().getDay();
  return weekDays[(idx + 6) % 7];
}

export function Schedule() {
  const [day, setDay] = useState(todayShort());

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-medium text-lime">Weekly schedule</p>
      <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">What's on</h1>
      <p className="mt-3 max-w-lg text-ink-faint">
        Every show, every day. Tap a day to see the full lineup.
      </p>

      <div className="mt-9 flex gap-2 overflow-x-auto border-b border-base-line pb-4">
        {weekDays.map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              day === d ? "bg-lime text-coal" : "bg-base-panel text-ink-soft hover:text-ink"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-display text-xl text-ink">{fullDayNames[day]}</h2>
        <div className="grid gap-3 sm:hidden">
          <ScheduleRail day={day} />
        </div>
        <ScheduleTable day={day} />
      </div>
    </div>
  );
}

function ScheduleTable({ day }: { day: string }) {
  const slots = scheduleForDay(day);

  if (slots.length === 0) {
    return <p className="text-sm text-ink-faint">Nothing scheduled for this day yet.</p>;
  }

  return (
    <div className="hidden divide-y divide-base-line rounded-2xl border border-base-line sm:block">
      {slots.map((slot) => (
        <Link
          key={`${slot.time}-${slot.showId}`}
          to={`/shows/${slot.show.id}`}
          className="flex items-center gap-5 px-6 py-4 transition-colors hover:bg-base-panel"
        >
          <span className="w-28 shrink-0 font-display text-sm text-lime">{slot.time}</span>
          <img
            src={slot.show.artwork}
            alt=""
            className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-base-line"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-ink">{slot.show.name}</p>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">Details →</span>
        </Link>
      ))}
    </div>
  );
}

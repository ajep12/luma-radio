import { useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "../config/supabase";
import { ScheduleRail } from "../components/schedule/ScheduleRail";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const fullDayNames: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

type ScheduleEntry = {
  id: string;
  date: string;
  start_time: string;
  end_time: string | null;
  show_name: string;
};

function getMonday(date: Date) {
  const result = new Date(date);
  const day = result.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);

  return result;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

function getDateForDay(monday: Date, day: string) {
  const index = weekDays.indexOf(day);
  const date = new Date(monday);

  date.setDate(monday.getDate() + index);

  return date;
}

export function Schedule() {
  const [day, setDay] = useState(() => {
    const index = new Date().getDay();

    return weekDays[index === 0 ? 6 : index - 1];
  });

  const [monday, setMonday] = useState(() =>
    getMonday(new Date())
  );

  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const selectedDate = useMemo(
    () => getDateForDay(monday, day),
    [monday, day]
  );

  useEffect(() => {
    async function loadSchedule() {
      if (!isSupabaseConfigured) {
        setSchedule([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);

      const weekStart = formatDate(monday);

      const weekEnd = new Date(monday);
      weekEnd.setDate(monday.getDate() + 6);

      const { data, error: supabaseError } = await supabase
        .from("schedule")
        .select(
          "id, date, start_time, end_time, show_name"
        )
        .gte("date", weekStart)
        .lte("date", formatDate(weekEnd))
        .order("date")
        .order("start_time");

      if (supabaseError) {
        console.error(
          "[Supabase] Failed to load schedule:",
          supabaseError
        );

        setSchedule([]);
        setError(true);
        setLoading(false);
        return;
      }

      setSchedule(
        (data ?? []) as ScheduleEntry[]
      );

      setLoading(false);
    }

    loadSchedule();
  }, [monday]);

  const selectedDaySchedule = schedule.filter(
    (entry) =>
      entry.date === formatDate(selectedDate)
  );

  function previousWeek() {
    const date = new Date(monday);
    date.setDate(date.getDate() - 7);
    setMonday(date);
  }

  function nextWeek() {
    const date = new Date(monday);
    date.setDate(date.getDate() + 7);
    setMonday(date);
  }

  function goToThisWeek() {
    const today = new Date();

    setMonday(getMonday(today));

    const index = today.getDay();

    setDay(
      weekDays[index === 0 ? 6 : index - 1]
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-medium text-lime">
        Weekly schedule
      </p>

      <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
        What's on
      </h1>

      <p className="mt-3 max-w-lg text-ink-faint">
        Every show, every day. Tap a day to see the full lineup.
      </p>

      {/* Week controls */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          onClick={previousWeek}
          className="rounded-full border border-base-line bg-base-panel px-4 py-2 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          ← Previous
        </button>

        <div className="text-center">
          <p className="font-display text-sm text-ink">
            {monday.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}
            {" – "}
            {getDateForDay(monday, 6).toLocaleDateString(
              "en-GB",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            )}
          </p>

          <button
            onClick={goToThisWeek}
            className="mt-1 text-xs text-lime hover:underline"
          >
            This week
          </button>
        </div>

        <button
          onClick={nextWeek}
          className="rounded-full border border-base-line bg-base-panel px-4 py-2 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          Next →
        </button>
      </div>

      {/* Days */}
      <div className="mt-9 flex gap-2 overflow-x-auto border-b border-base-line pb-4">
        {weekDays.map((d) => {
          const date = getDateForDay(monday, d);

          return (
            <button
              key={d}
              onClick={() => setDay(d)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                day === d
                  ? "bg-lime text-coal"
                  : "bg-base-panel text-ink-soft hover:text-ink"
              }`}
            >
              <span>{d}</span>

              <span className="ml-1 opacity-60">
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected day */}
      <div className="mt-8">
        <h2 className="mb-4 font-display text-xl text-ink">
          {fullDayNames[day]}

          <span className="ml-2 text-sm font-normal text-ink-faint">
            {selectedDate.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
            })}
          </span>
        </h2>

        {loading ? (
          <p className="text-sm text-ink-faint">
            Loading schedule...
          </p>
        ) : error ? (
          <p className="text-sm text-red-400">
            Failed to load the schedule.
          </p>
        ) : selectedDaySchedule.length === 0 ? (
          <p className="text-sm text-ink-faint">
            Nothing scheduled for this day yet.
          </p>
        ) : (
          <>
            {/* Mobile */}
            <div className="sm:hidden">
              <ScheduleRail
                schedule={selectedDaySchedule}
              />
            </div>

            {/* Desktop */}
            <div className="hidden divide-y divide-base-line rounded-2xl border border-base-line sm:block">
              {selectedDaySchedule.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center gap-5 px-6 py-4 transition-colors hover:bg-base-panel"
                >
                  <div className="w-28 shrink-0">
                    <p className="font-display text-sm text-lime">
                      {formatTime(slot.start_time)}
                    </p>

                    {slot.end_time && (
                      <p className="text-xs text-ink-faint">
                        until {formatTime(slot.end_time)}
                      </p>
                    )}
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-base-raised font-display text-sm text-ink-faint">
                    L
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-ink">
                      {slot.show_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

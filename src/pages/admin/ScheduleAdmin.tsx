import { useEffect, useState } from "react";
import {
  supabase,
  isSupabaseConfigured,
} from "../../config/supabase";
import { AdminHeading } from "./AdminHeading";

type ScheduleEntry = {
  id: string;
  date: string;
  start_time: string;
  end_time: string | null;
  show_name: string;
};

type Show = {
  id: string;
  name: string;
  time: string;
  days: string[];
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function getMonday(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);

  return result;
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function getDateForDay(monday: Date, index: number) {
  const date = new Date(monday);
  date.setDate(monday.getDate() + index);
  return date;
}

function parseShowTime(time: string) {
  const cleaned = time.trim();

  const parts = cleaned
    .split(/\s*(?:-|–|—|to)\s*/i)
    .map((part) => part.trim());

  const start = parts[0] ?? "";
  const end = parts[1] ?? "";

  const normaliseTime = (value: string) => {
    const match = value.match(
      /^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i
    );

    if (!match) {
      return "";
    }

    let hour = Number(match[1]);
    const minute = match[2];
    const period = match[3]?.toUpperCase();

    if (period === "PM" && hour < 12) {
      hour += 12;
    }

    if (period === "AM" && hour === 12) {
      hour = 0;
    }

    if (hour > 23 || Number(minute) > 59) {
      return "";
    }

    return `${String(hour).padStart(2, "0")}:${minute}`;
  };

  return {
    start_time: normaliseTime(start),
    end_time: end ? normaliseTime(end) || null : null,
  };
}

function showRunsOnDay(show: Show, day: string) {
  return show.days.some(
    (showDay) =>
      showDay.trim().toLowerCase() === day.toLowerCase()
  );
}

export function ScheduleAdmin() {
  const [monday, setMonday] = useState(() =>
    getMonday(new Date())
  );

  const [schedule, setSchedule] = useState<ScheduleEntry[]>(
    []
  );

  const [shows, setShows] = useState<Show[]>([]);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<string | null>(
    null
  );

  const [addingDate, setAddingDate] = useState<string | null>(
    null
  );

  const [form, setForm] = useState({
    show_name: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    loadData();
  }, [monday]);

  async function loadData() {
    if (!isSupabaseConfigured) {
      setSchedule([]);
      setShows([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const weekEnd = new Date(monday);
    weekEnd.setDate(monday.getDate() + 6);

    const [scheduleResult, showsResult] =
      await Promise.all([
        supabase
          .from("schedule")
          .select(
            "id, date, start_time, end_time, show_name"
          )
          .gte("date", formatDate(monday))
          .lte("date", formatDate(weekEnd))
          .order("date")
          .order("start_time"),

        supabase
          .from("shows")
          .select("id, name, time, days")
          .order("name"),
      ]);

    if (scheduleResult.error) {
      console.error(
        "[Schedule] Failed to load schedule:",
        scheduleResult.error
      );

      setSchedule([]);
    } else {
      setSchedule(
        Array.isArray(scheduleResult.data)
          ? (scheduleResult.data as ScheduleEntry[])
          : []
      );
    }

    if (showsResult.error) {
      console.error(
        "[Schedule] Failed to load shows:",
        showsResult.error
      );

      setShows([]);
    } else {
      setShows(
        Array.isArray(showsResult.data)
          ? (showsResult.data as Show[])
          : []
      );
    }

    setLoading(false);
  }

  async function generateWeek() {
    if (generating) return;

    if (shows.length === 0) {
      alert("No shows are available to schedule.");
      return;
    }

    setGenerating(true);

    try {
      const entries: {
        date: string;
        start_time: string;
        end_time: string | null;
        show_name: string;
      }[] = [];

      for (let index = 0; index < days.length; index++) {
        const dayName = days[index];
        const date = getDateForDay(monday, index);
        const dateString = formatDate(date);

        for (const show of shows) {
          if (!show.name || !show.time) {
            continue;
          }

          if (!showRunsOnDay(show, dayName)) {
            continue;
          }

          const parsedTime = parseShowTime(show.time);

          if (!parsedTime.start_time) {
            console.error(
              `[Schedule] Could not parse time for "${show.name}":`,
              show.time
            );
            continue;
          }

          entries.push({
            date: dateString,
            start_time: parsedTime.start_time,
            end_time: parsedTime.end_time,
            show_name: show.name,
          });
        }
      }

      if (entries.length === 0) {
        alert(
          "No scheduled shows were found for this week. Check the days and times in your shows."
        );
        setGenerating(false);
        return;
      }

      const existing = new Set(
        schedule.map(
          (slot) =>
            `${slot.date}|${slot.start_time.slice(
              0,
              5
            )}|${slot.show_name}`
        )
      );

      const newEntries = entries.filter(
        (entry) =>
          !existing.has(
            `${entry.date}|${entry.start_time}|${entry.show_name}`
          )
      );

      if (newEntries.length === 0) {
        alert(
          "This week's schedule has already been generated."
        );
        setGenerating(false);
        return;
      }

      const { error } = await supabase
        .from("schedule")
        .insert(newEntries);

      if (error) {
        console.error(
          "[Schedule] Failed to generate week:",
          error
        );

        alert(error.message);
        setGenerating(false);
        return;
      }

      await loadData();

      alert(
        `${newEntries.length} schedule ${
          newEntries.length === 1 ? "slot" : "slots"
        } added.`
      );
    } finally {
      setGenerating(false);
    }
  }

  function startAdding(date: string) {
    setEditing(null);
    setAddingDate(date);

    setForm({
      show_name: "",
      start_time: "",
      end_time: "",
    });
  }

  function startEditing(slot: ScheduleEntry) {
    setAddingDate(null);
    setEditing(slot.id);

    setForm({
      show_name: slot.show_name,
      start_time: slot.start_time.slice(0, 5),
      end_time: slot.end_time
        ? slot.end_time.slice(0, 5)
        : "",
    });
  }

  function cancelForm() {
    setAddingDate(null);
    setEditing(null);

    setForm({
      show_name: "",
      start_time: "",
      end_time: "",
    });
  }

  async function saveSlot(date: string) {
    const showName = form.show_name.trim();

    if (!showName || !form.start_time) {
      alert(
        "Please enter a show name and start time."
      );
      return;
    }

    setSaving(true);

    const payload = {
      date,
      start_time: form.start_time,
      end_time: form.end_time || null,
      show_name: showName,
    };

    if (editing) {
      const { error } = await supabase
        .from("schedule")
        .update(payload)
        .eq("id", editing);

      if (error) {
        console.error(
          "[Schedule] Failed to update:",
          error
        );

        alert(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("schedule")
        .insert(payload);

      if (error) {
        console.error(
          "[Schedule] Failed to add:",
          error
        );

        alert(error.message);
        setSaving(false);
        return;
      }
    }

    await loadData();

    cancelForm();
    setSaving(false);
  }

  async function deleteSlot(id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this schedule slot?"
      )
    ) {
      return;
    }

    const { error } = await supabase
      .from("schedule")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "[Schedule] Failed to delete:",
        error
      );

      alert(error.message);
      return;
    }

    await loadData();
  }

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

  function thisWeek() {
    setMonday(getMonday(new Date()));
  }

  return (
    <div>
      <AdminHeading
        title="Schedule"
        subtitle="Build the weekly on-air lineup."
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={generateWeek}
          disabled={generating || loading}
          className="rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-coal disabled:cursor-not-allowed disabled:opacity-50"
        >
          {generating
            ? "Generating..."
            : "Generate week"}
        </button>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <button
            type="button"
            onClick={previousWeek}
            className="rounded-full border border-base-line bg-base-panel px-4 py-2 text-sm text-ink-soft hover:text-ink"
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
              {getDateForDay(
                monday,
                6
              ).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>

            <button
              type="button"
              onClick={thisWeek}
              className="mt-1 text-xs text-lime hover:underline"
            >
              This week
            </button>
          </div>

          <button
            type="button"
            onClick={nextWeek}
            className="rounded-full border border-base-line bg-base-panel px-4 py-2 text-sm text-ink-soft hover:text-ink"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-base-line bg-base-panel px-5 py-4">
        <p className="text-sm font-medium text-ink">
          Automatic scheduling
        </p>

        <p className="mt-1 text-xs leading-5 text-ink-faint">
          Generate this week's schedule from the days and times
          set on your shows. Existing schedule slots won't be
          duplicated.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-2xl bg-base-raised"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {days.map((day, index) => {
            const date = getDateForDay(monday, index);
            const dateString = formatDate(date);

            const slots = schedule.filter(
              (slot) => slot.date === dateString
            );

            const isAdding =
              addingDate === dateString;

            return (
              <div key={dateString}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-soft">
                      {day}
                    </p>

                    <p className="text-xs text-ink-faint">
                      {date.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      startAdding(dateString)
                    }
                    className="rounded-full bg-lime px-3 py-1.5 text-xs font-semibold text-coal"
                  >
                    + Add slot
                  </button>
                </div>

                <div className="divide-y divide-base-line overflow-hidden rounded-2xl border border-base-line">
                  {slots.length === 0 &&
                  !isAdding ? (
                    <p className="px-5 py-4 text-sm text-ink-faint">
                      Nothing scheduled.
                    </p>
                  ) : (
                    slots.map((slot) =>
                      editing === slot.id ? (
                        <ScheduleForm
                          key={slot.id}
                          form={form}
                          setForm={setForm}
                          saving={saving}
                          onSave={() =>
                            saveSlot(dateString)
                          }
                          onCancel={cancelForm}
                        />
                      ) : (
                        <div
                          key={slot.id}
                          className="flex items-center gap-4 px-5 py-3"
                        >
                          <span className="w-32 shrink-0 text-sm text-lime">
                            {slot.start_time.slice(
                              0,
                              5
                            )}

                            {slot.end_time &&
                              `–${slot.end_time.slice(
                                0,
                                5
                              )}`}
                          </span>

                          <span className="flex-1 text-sm text-ink">
                            {slot.show_name}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              startEditing(slot)
                            }
                            className="text-xs font-medium text-ink-faint hover:text-lime"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteSlot(slot.id)
                            }
                            className="text-xs font-medium text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      )
                    )
                  )}

                  {isAdding && (
                    <ScheduleForm
                      form={form}
                      setForm={setForm}
                      saving={saving}
                      onSave={() =>
                        saveSlot(dateString)
                      }
                      onCancel={cancelForm}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ScheduleForm({
  form,
  setForm,
  saving,
  onSave,
  onCancel,
}: {
  form: {
    show_name: string;
    start_time: string;
    end_time: string;
  };

  setForm: React.Dispatch<
    React.SetStateAction<{
      show_name: string;
      start_time: string;
      end_time: string;
    }>
  >;

  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="grid gap-3 p-5 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end">
      <label className="text-xs text-ink-faint">
        Show name

        <input
          type="text"
          value={form.show_name}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              show_name: event.target.value,
            }))
          }
          placeholder="e.g. Luma Drive"
          className="mt-1 w-full rounded-xl border border-base-line bg-base-panel px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
        />
      </label>

      <label className="text-xs text-ink-faint">
        Start

        <input
          type="time"
          value={form.start_time}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              start_time: event.target.value,
            }))
          }
          className="mt-1 rounded-xl border border-base-line bg-base-panel px-3 py-2 text-sm text-ink"
        />
      </label>

      <label className="text-xs text-ink-faint">
        End

        <input
          type="time"
          value={form.end_time}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              end_time: event.target.value,
            }))
          }
          className="mt-1 rounded-xl border border-base-line bg-base-panel px-3 py-2 text-sm text-ink"
        />
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-full bg-lime px-4 py-2 text-xs font-semibold text-coal disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-full border border-base-line px-4 py-2 text-xs text-ink-soft hover:text-ink disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

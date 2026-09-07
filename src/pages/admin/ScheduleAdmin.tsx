import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../../config/supabase";
import { AdminHeading } from "./AdminHeading";

type Show = {
  id: string;
  name: string;
};

type ScheduleEntry = {
  id: string;
  date: string;
  start_time: string;
  end_time: string | null;
  show_id: string;
  show: Show | null;
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
  return date.toISOString().split("T")[0];
}

function getDateForDay(monday: Date, index: number) {
  const date = new Date(monday);
  date.setDate(monday.getDate() + index);
  return date;
}

export function ScheduleAdmin() {
  const [monday, setMonday] = useState(() =>
    getMonday(new Date())
  );

  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [shows, setShows] = useState<Show[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<string | null>(null);
  const [addingDate, setAddingDate] = useState<string | null>(null);

  const [form, setForm] = useState({
    show_id: "",
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

    const weekStart = formatDate(monday);

    const weekEnd = new Date(monday);
    weekEnd.setDate(monday.getDate() + 6);

    const [scheduleResult, showsResult] = await Promise.all([
      supabase
        .from("schedule")
        .select(`
          id,
          date,
          start_time,
          end_time,
          show_id,
          show:shows (
            id,
            name
          )
        `)
        .gte("date", weekStart)
        .lte("date", formatDate(weekEnd))
        .order("date")
        .order("start_time"),

      supabase
        .from("shows")
        .select("id, name")
        .order("name"),
    ]);

    if (scheduleResult.error) {
      console.error(
        "[Schedule] Failed to load schedule:",
        scheduleResult.error
      );
    }

    if (showsResult.error) {
      console.error(
        "[Schedule] Failed to load shows:",
        showsResult.error
      );
    }

    setSchedule(
      (scheduleResult.data ?? []) as ScheduleEntry[]
    );

    setShows((showsResult.data ?? []) as Show[]);

    setLoading(false);
  }

  function startAdding(date: string) {
    setEditing(null);
    setAddingDate(date);

    setForm({
      show_id: shows[0]?.id ?? "",
      start_time: "",
      end_time: "",
    });
  }

  function startEditing(slot: ScheduleEntry) {
    setAddingDate(null);
    setEditing(slot.id);

    setForm({
      show_id: slot.show_id,
      start_time: slot.start_time.slice(0, 5),
      end_time: slot.end_time
        ? slot.end_time.slice(0, 5)
        : "",
    });
  }

  function cancelForm() {
    setAddingDate(null);
    setEditing(null);
  }

  async function saveSlot(date: string) {
    if (!form.show_id || !form.start_time) {
      alert("Please select a show and start time.");
      return;
    }

    setSaving(true);

    const payload = {
      date,
      start_time: form.start_time,
      end_time: form.end_time || null,
      show_id: form.show_id,
    };

    if (editing) {
      const { error } = await supabase
        .from("schedule")
        .update(payload)
        .eq("id", editing);

      if (error) {
        console.error(error);
        alert(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("schedule")
        .insert(payload);

      if (error) {
        console.error(error);
        alert(error.message);
        setSaving(false);
        return;
      }
    }

    await loadData();

    setAddingDate(null);
    setEditing(null);
    setSaving(false);
  }

  async function deleteSlot(id: string) {
    if (!confirm("Delete this schedule slot?")) {
      return;
    }

    const { error } = await supabase
      .from("schedule")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
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

      {/* Week controls */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
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
            onClick={thisWeek}
            className="mt-1 text-xs text-lime hover:underline"
          >
            This week
          </button>
        </div>

        <button
          onClick={nextWeek}
          className="rounded-full border border-base-line bg-base-panel px-4 py-2 text-sm text-ink-soft hover:text-ink"
        >
          Next →
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-ink-faint">
          Loading schedule...
        </p>
      ) : (
        <div className="space-y-6">
          {days.map((day, index) => {
            const date = getDateForDay(monday, index);
            const dateString = formatDate(date);

            const slots = schedule.filter(
              (slot) => slot.date === dateString
            );

            const isAdding = addingDate === dateString;

            return (
              <div key={day}>
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
                    onClick={() => startAdding(dateString)}
                    className="rounded-full bg-lime px-3 py-1.5 text-xs font-semibold text-coal"
                  >
                    + Add slot
                  </button>
                </div>

                <div className="divide-y divide-base-line rounded-2xl border border-base-line">
                  {slots.length === 0 && !isAdding ? (
                    <p className="px-5 py-4 text-sm text-ink-faint">
                      Nothing scheduled.
                    </p>
                  ) : (
                    slots.map((slot) => (
                      <div key={slot.id}>
                        {editing === slot.id ? (
                          <ScheduleForm
                            form={form}
                            setForm={setForm}
                            shows={shows}
                            saving={saving}
                            onSave={() =>
                              saveSlot(dateString)
                            }
                            onCancel={cancelForm}
                          />
                        ) : (
                          <div className="flex items-center gap-4 px-5 py-3">
                            <span className="w-28 shrink-0 text-sm text-lime">
                              {slot.start_time.slice(0, 5)}
                              {slot.end_time &&
                                `–${slot.end_time.slice(0, 5)}`}
                            </span>

                            <span className="flex-1 text-sm text-ink">
                              {slot.show?.name ??
                                "Unknown show"}
                            </span>

                            <button
                              onClick={() =>
                                startEditing(slot)
                              }
                              className="text-xs font-medium text-ink-faint hover:text-lime"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                deleteSlot(slot.id)
                              }
                              className="text-xs font-medium text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}

                  {isAdding && (
                    <ScheduleForm
                      form={form}
                      setForm={setForm}
                      shows={shows}
                      saving={saving}
                      onSave={() => saveSlot(dateString)}
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
  shows,
  saving,
  onSave,
  onCancel,
}: {
  form: {
    show_id: string;
    start_time: string;
    end_time: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      show_id: string;
      start_time: string;
      end_time: string;
    }>
  >;
  shows: Show[];
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="grid gap-3 p-5 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end">
      <label className="text-xs text-ink-faint">
        Show
        <select
          value={form.show_id}
          onChange={(e) =>
            setForm((current) => ({
              ...current,
              show_id: e.target.value,
            }))
          }
          className="mt-1 w-full rounded-xl border border-base-line bg-base-panel px-3 py-2 text-sm text-ink"
        >
          <option value="">Select a show</option>

          {shows.map((show) => (
            <option key={show.id} value={show.id}>
              {show.name}
            </option>
          ))}
        </select>
      </label>

      <label className="text-xs text-ink-faint">
        Start
        <input
          type="time"
          value={form.start_time}
          onChange={(e) =>
            setForm((current) => ({
              ...current,
              start_time: e.target.value,
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
          onChange={(e) =>
            setForm((current) => ({
              ...current,
              end_time: e.target.value,
            }))
          }
          className="mt-1 rounded-xl border border-base-line bg-base-panel px-3 py-2 text-sm text-ink"
        />
      </label>

      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="rounded-full bg-lime px-4 py-2 text-xs font-semibold text-coal disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          onClick={onCancel}
          className="rounded-full border border-base-line px-4 py-2 text-xs text-ink-soft hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

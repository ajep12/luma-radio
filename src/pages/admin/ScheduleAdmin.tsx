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

/*
 * IMPORTANT:
 * Don't use toISOString() here.
 * It converts the date to UTC and can move UK dates
 * backwards/forwards by one day.
 */
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

export function ScheduleAdmin() {
  const [monday, setMonday] = useState(() =>
    getMonday(new Date())
  );

  const [schedule, setSchedule] = useState<ScheduleEntry[]>(
    []
  );

  const [loading, setLoading] = useState(true);
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
    loadSchedule();
  }, [monday]);

  async function loadSchedule() {
    if (!isSupabaseConfigured) {
      setSchedule([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const weekEnd = new Date(monday);
    weekEnd.setDate(monday.getDate() + 6);

    const { data, error } = await supabase
      .from("schedule")
      .select(
        "id, date, start_time, end_time, show_name"
      )
      .gte("date", formatDate(monday))
      .lte("date", formatDate(weekEnd))
      .order("date")
      .order("start_time");

    if (error) {
      console.error(
        "[Schedule] Failed to load:",
        error
      );

      setSchedule([]);
    } else {
      setSchedule(
        Array.isArray(data)
          ? (data as ScheduleEntry[])
          : []
      );
    }

    setLoading(false);
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

    await loadSchedule();

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

    await loadSchedule();
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
                {/* Day heading */}
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

                {/* Slots */}
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

                  {/* Add form */}
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
      {/* Show name */}
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

      {/* Start */}
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

      {/* End */}
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

      {/* Buttons */}
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

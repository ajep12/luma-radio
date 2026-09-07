import { useState } from "react";
import { useShows } from "../../hooks/useShows";
import { presenters } from "../../data/presenters";
import { supabase } from "../../config/supabase";
import { AdminHeading } from "./AdminHeading";

type Show = {
  id: string;
  name: string;
  artwork: string;
  description: string;
  time: string;
  days: string[];
  presenterId: string;
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function ShowsAdmin() {
  const { shows, loading } = useShows();

  const [editingShow, setEditingShow] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedShow = shows.find(
    (show) => show.id === editingShow
  );

  function refreshShows() {
    setEditingShow(null);
    setRefreshKey((value) => value + 1);
  }

  return (
    <div key={refreshKey}>
      <AdminHeading
        title="Shows"
        subtitle="Manage Luma Radio's show lineup."
        action={
          <button
            type="button"
            className="rounded-full bg-lime px-4 py-2 text-sm font-semibold text-coal"
          >
            Add show
          </button>
        }
      />

      {selectedShow && (
        <div className="mb-6 rounded-2xl border border-base-line bg-base-panel p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="font-display text-xl text-ink">
                Edit show
              </h2>

              <p className="mt-1 text-sm text-ink-faint">
                Update the details for {selectedShow.name}.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEditingShow(null)}
              className="text-sm text-ink-faint hover:text-ink"
            >
              Cancel
            </button>
          </div>

          <EditShowForm
            show={selectedShow}
            onSaved={refreshShows}
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-base-line">
        {loading ? (
          <div className="px-5 py-8 text-sm text-ink-faint">
            Loading shows...
          </div>
        ) : shows.length === 0 ? (
          <div className="px-5 py-8 text-sm text-ink-faint">
            No shows found.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-base-panel text-ink-faint">
              <tr>
                <th className="px-5 py-3 font-medium">
                  Show
                </th>

                <th className="px-5 py-3 font-medium">
                  Presenter
                </th>

                <th className="px-5 py-3 font-medium">
                  Time
                </th>

                <th className="px-5 py-3 font-medium">
                  Days
                </th>

                <th className="px-5 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y divide-base-line">
              {shows.map((show) => {
                const presenter = presenters.find(
                  (p) => p.id === show.presenterId
                );

                return (
                  <tr key={show.id}>
                    <td className="flex items-center gap-3 px-5 py-3">
                      {show.artwork ? (
                        <img
                          src={show.artwork}
                          alt=""
                          className="h-9 w-9 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-lg bg-base-raised" />
                      )}

                      <span className="text-ink">
                        {show.name}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-ink-soft">
                      {presenter?.name ?? "No presenter"}
                    </td>

                    <td className="px-5 py-3 text-ink-soft">
                      {show.time}
                    </td>

                    <td className="px-5 py-3 text-ink-soft">
                      {show.days?.join(", ") || "No days"}
                    </td>

                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingShow(show.id)
                          }
                          className="text-xs font-medium text-lime hover:underline"
                        >
                          Edit
                        </button>

                        <DeleteShowButton
                          show={show}
                          onDeleted={refreshShows}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function EditShowForm({
  show,
  onSaved,
}: {
  show: Show;
  onSaved: () => void;
}) {
  const [name, setName] = useState(show.name);
  const [artwork, setArtwork] = useState(show.artwork);
  const [description, setDescription] = useState(
    show.description
  );
  const [time, setTime] = useState(show.time);
  const [days, setDays] = useState<string[]>(
    Array.isArray(show.days) ? show.days : []
  );
  const [presenterId, setPresenterId] = useState(
    show.presenterId || ""
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toggleDay(day: string) {
    setDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day]
    );
  }

  async function save() {
    if (!name.trim()) {
      setError("Show name is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const updateData = {
        name: name.trim(),
        artwork: artwork.trim(),
        description: description.trim(),
        time: time.trim(),
        days,
        presenter_id: presenterId || null,
      };

      console.log("[Supabase] Updating show:", show.id);
      console.log("[Supabase] Data:", updateData);

      const { data, error: updateError } = await supabase
        .from("shows")
        .update(updateData)
        .eq("id", show.id)
        .select()
        .single();

      if (updateError) {
        console.error(
          "[Supabase] Update failed:",
          updateError
        );

        throw new Error(
          updateError.message ||
            "Supabase refused to update this show."
        );
      }

      console.log(
        "[Supabase] Show updated successfully:",
        data
      );

      onSaved();
    } catch (err) {
      console.error(
        "[Supabase] Failed to update show:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save the show."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5">
      <label className="grid gap-2">
        <span className="text-sm font-medium text-ink">
          Show name
        </span>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border border-base-line bg-base-raised px-4 py-3 text-ink outline-none focus:border-lime"
          placeholder="Show name"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-ink">
          Artwork URL
        </span>

        <input
          value={artwork}
          onChange={(e) => setArtwork(e.target.value)}
          className="rounded-xl border border-base-line bg-base-raised px-4 py-3 text-ink outline-none focus:border-lime"
          placeholder="https://..."
        />

        {artwork && (
          <img
            src={artwork}
            alt=""
            className="mt-2 h-24 w-24 rounded-xl object-cover"
          />
        )}
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-ink">
          Description
        </span>

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          rows={4}
          className="resize-none rounded-xl border border-base-line bg-base-raised px-4 py-3 text-ink outline-none focus:border-lime"
          placeholder="Describe the show..."
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-ink">
          Time
        </span>

        <input
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-xl border border-base-line bg-base-raised px-4 py-3 text-ink outline-none focus:border-lime"
          placeholder="18:00 - 20:00"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-ink">
          Presenter
        </span>

        <select
          value={presenterId}
          onChange={(e) =>
            setPresenterId(e.target.value)
          }
          className="rounded-xl border border-base-line bg-base-raised px-4 py-3 text-ink outline-none focus:border-lime"
        >
          <option value="">No presenter</option>

          {presenters.map((presenter) => (
            <option
              key={presenter.id}
              value={presenter.id}
            >
              {presenter.name}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-2">
        <span className="text-sm font-medium text-ink">
          Days
        </span>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DAYS.map((day) => {
            const selected = days.includes(day);

            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`rounded-xl border px-4 py-3 text-sm transition ${
                  selected
                    ? "border-lime bg-lime text-coal"
                    : "border-base-line bg-base-raised text-ink-faint hover:text-ink"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || !name.trim()}
          className="rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-coal disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>

        <button
          type="button"
          onClick={onSaved}
          disabled={saving}
          className="rounded-full border border-base-line px-5 py-2.5 text-sm font-medium text-ink-faint hover:text-ink disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function DeleteShowButton({
  show,
  onDeleted,
}: {
  show: Show;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function deleteShow() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${show.name}"?\n\nThis cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      console.log(
        "[Supabase] Deleting show:",
        show.id
      );

      const { error: deleteError } = await supabase
        .from("shows")
        .delete()
        .eq("id", show.id);

      if (deleteError) {
        console.error(
          "[Supabase] Delete failed:",
          deleteError
        );

        throw new Error(
          deleteError.message ||
            "Supabase refused to delete this show."
        );
      }

      console.log(
        "[Supabase] Show deleted successfully"
      );

      onDeleted();
    } catch (err) {
      console.error(
        "[Supabase] Failed to delete show:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete the show."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={deleteShow}
        disabled={deleting}
        className="text-xs font-medium text-red-400 hover:underline disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>

      {error && (
        <span className="text-xs text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}

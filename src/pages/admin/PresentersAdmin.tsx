import { useEffect, useState } from "react";
import { AdminHeading } from "./AdminHeading";
import { supabase } from "../../config/supabase";

type Presenter = {
  id: string;
  name: string;
  photo: string;
  bio: string;
};

export function PresentersAdmin() {
  const [items, setItems] = useState<Presenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPresenter, setEditingPresenter] =
    useState<Presenter | null>(null);
  const [adding, setAdding] = useState(false);

  async function loadPresenters() {
    setLoading(true);

    const { data, error } = await supabase
      .from("presenters")
      .select("id, name, photo, bio")
      .order("name");

    if (error) {
      console.error(
        "[Supabase] Failed to load presenters:",
        error
      );

      setItems([]);
      setLoading(false);
      return;
    }

    setItems((data ?? []) as Presenter[]);
    setLoading(false);
  }

  useEffect(() => {
    loadPresenters();
  }, []);

  async function deletePresenter(presenter: Presenter) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${presenter.name}"?\n\nThis cannot be undone.`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("presenters")
      .delete()
      .eq("id", presenter.id);

    if (error) {
      console.error(
        "[Supabase] Failed to delete presenter:",
        error
      );

      alert(`Failed to delete presenter:\n\n${error.message}`);
      return;
    }

    await loadPresenters();
  }

  return (
    <div>
      <AdminHeading
        title="Presenters"
        subtitle="Manage the people behind the mic."
        action={
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="rounded-full bg-lime px-4 py-2 text-sm font-semibold text-coal"
          >
            Add presenter
          </button>
        }
      />

      {(adding || editingPresenter) && (
        <div className="mb-6 rounded-2xl border border-base-line bg-base-panel p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="font-display text-xl text-ink">
                {adding ? "Add presenter" : "Edit presenter"}
              </h2>

              <p className="mt-1 text-sm text-ink-faint">
                {adding
                  ? "Add someone to the Luma Radio team."
                  : `Update ${editingPresenter?.name}.`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setEditingPresenter(null);
              }}
              className="text-sm text-ink-faint hover:text-ink"
            >
              Cancel
            </button>
          </div>

          <PresenterForm
            presenter={editingPresenter}
            onSaved={async () => {
              setAdding(false);
              setEditingPresenter(null);
              await loadPresenters();
            }}
          />
        </div>
      )}

      <div className="grid gap-3">
        {loading ? (
          <div className="rounded-2xl border border-base-line bg-base-panel p-6 text-sm text-ink-faint">
            Loading presenters...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-base-line bg-base-panel p-6 text-sm text-ink-faint">
            No presenters found.
          </div>
        ) : (
          items.map((presenter) => (
            <div
              key={presenter.id}
              className="flex items-center gap-4 rounded-2xl border border-base-line bg-base-panel p-4"
            >
              {presenter.photo ? (
                <img
                  src={presenter.photo}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-base-raised" />
              )}

              <div className="min-w-0 flex-1">
                <p className="text-ink">
                  {presenter.name}
                </p>

                <p className="truncate text-xs text-ink-faint">
                  {presenter.bio}
                </p>
              </div>

              <div className="flex shrink-0 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setEditingPresenter(presenter)
                  }
                  className="text-xs font-medium text-lime hover:underline"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deletePresenter(presenter)
                  }
                  className="text-xs font-medium text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PresenterForm({
  presenter,
  onSaved,
}: {
  presenter: Presenter | null;
  onSaved: () => void | Promise<void>;
}) {
  const [name, setName] = useState(
    presenter?.name ?? ""
  );
  const [photo, setPhoto] = useState(
    presenter?.photo ?? ""
  );
  const [bio, setBio] = useState(
    presenter?.bio ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    if (!name.trim()) {
      setError("Presenter name is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (presenter) {
        const { error } = await supabase
          .from("presenters")
          .update({
            name: name.trim(),
            photo: photo.trim(),
            bio: bio.trim(),
          })
          .eq("id", presenter.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("presenters")
          .insert({
            name: name.trim(),
            photo: photo.trim(),
            bio: bio.trim(),
          });

        if (error) throw error;
      }

      await onSaved();
    } catch (err) {
      console.error(
        "[Supabase] Failed to save presenter:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save presenter."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5">
      <label className="grid gap-2">
        <span className="text-sm font-medium text-ink">
          Name
        </span>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Presenter name"
          className="rounded-xl border border-base-line bg-base-raised px-4 py-3 text-ink outline-none focus:border-lime"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-ink">
          Photo URL
        </span>

        <input
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          placeholder="https://..."
          className="rounded-xl border border-base-line bg-base-raised px-4 py-3 text-ink outline-none focus:border-lime"
        />

        {photo && (
          <img
            src={photo}
            alt=""
            className="mt-2 h-24 w-24 rounded-full object-cover"
          />
        )}
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-ink">
          Bio
        </span>

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Presenter biography..."
          className="resize-none rounded-xl border border-base-line bg-base-raised px-4 py-3 text-ink outline-none focus:border-lime"
        />
      </label>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={save}
        disabled={saving || !name.trim()}
        className="w-fit rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-coal disabled:opacity-50"
      >
        {saving
          ? "Saving..."
          : presenter
            ? "Save changes"
            : "Add presenter"}
      </button>
    </div>
  );
}

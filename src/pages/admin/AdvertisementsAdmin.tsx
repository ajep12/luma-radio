import { useEffect, useState } from "react";
import { AdminHeading } from "./AdminHeading";
import { supabase, isSupabaseConfigured } from "../../config/supabase";

interface Advertisement {
  id: string;
  sponsor: string;
  headline: string;
  href: string;
  cta: string;
  kind: string;
  active: boolean;
}

interface AdvertisementForm {
  sponsor: string;
  headline: string;
  href: string;
  cta: string;
  kind: string;
  active: boolean;
}

const kindLabels: Record<string, string> = {
  "homepage-banner": "Homepage banner",
  "sponsored-content": "Sponsored content",
  "show-sponsorship": "Show sponsorship",
};

const emptyForm: AdvertisementForm = {
  sponsor: "",
  headline: "",
  href: "",
  cta: "Learn more",
  kind: "homepage-banner",
  active: true,
};

export function AdvertisementsAdmin() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdvertisementForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadAds() {
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("advertisements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load advertisements:", error);
      setError(error.message);
      setAds([]);
    } else {
      setAds(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAds();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError(null);
  }

  function openEditForm(ad: Advertisement) {
    setEditingId(ad.id);

    setForm({
      sponsor: ad.sponsor,
      headline: ad.headline,
      href: ad.href,
      cta: ad.cta,
      kind: ad.kind,
      active: ad.active,
    });

    setShowForm(true);
    setError(null);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function updateForm(
    field: keyof AdvertisementForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveAdvertisement() {
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured.");
      return;
    }

    if (!form.sponsor.trim()) {
      setError("Please enter a sponsor name.");
      return;
    }

    if (!form.headline.trim()) {
      setError("Please enter a headline.");
      return;
    }

    if (!form.href.trim()) {
      setError("Please enter a destination URL.");
      return;
    }

    setSaving(true);
    setError(null);

    if (editingId) {
      const { data, error } = await supabase
        .from("advertisements")
        .update({
          sponsor: form.sponsor.trim(),
          headline: form.headline.trim(),
          href: form.href.trim(),
          cta: form.cta.trim() || "Learn more",
          kind: form.kind,
          active: form.active,
        })
        .eq("id", editingId)
        .select()
        .single();

      if (error) {
        console.error("Failed to update advertisement:", error);
        setError(error.message);
        setSaving(false);
        return;
      }

      setAds((current) =>
        current.map((ad) =>
          ad.id === editingId ? data : ad
        )
      );
    } else {
      const { data, error } = await supabase
        .from("advertisements")
        .insert({
          sponsor: form.sponsor.trim(),
          headline: form.headline.trim(),
          href: form.href.trim(),
          cta: form.cta.trim() || "Learn more",
          kind: form.kind,
          active: form.active,
        })
        .select()
        .single();

      if (error) {
        console.error("Failed to create advertisement:", error);
        setError(error.message);
        setSaving(false);
        return;
      }

      setAds((current) => [data, ...current]);
    }

    setSaving(false);
    closeForm();
  }

  async function toggleAdvertisement(
    id: string,
    currentActive: boolean
  ) {
    const { error } = await supabase
      .from("advertisements")
      .update({
        active: !currentActive,
      })
      .eq("id", id);

    if (error) {
      console.error("Failed to update advertisement:", error);
      setError(error.message);
      return;
    }

    setAds((current) =>
      current.map((ad) =>
        ad.id === id
          ? {
              ...ad,
              active: !currentActive,
            }
          : ad
      )
    );
  }

  async function deleteAdvertisement(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this advertisement?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("advertisements")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete advertisement:", error);
      setError(error.message);
      return;
    }

    setAds((current) =>
      current.filter((ad) => ad.id !== id)
    );
  }

  return (
    <div>
      <AdminHeading
        title="Advertisements"
        subtitle="Homepage banners, sponsored content and show sponsorships."
        action={
          <button
            type="button"
            onClick={openAddForm}
            className="rounded-full bg-lime px-4 py-2 text-sm font-semibold text-coal"
          >
            Add advertisement
          </button>
        }
      />

      {error && (
        <div className="mb-4 rounded-xl border border-base-line bg-base-panel px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 rounded-2xl border border-base-line bg-base-panel p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg text-ink">
                {editingId
                  ? "Edit advertisement"
                  : "Add advertisement"}
              </h2>

              <p className="mt-1 text-xs text-ink-faint">
                Create a new advertisement for Luma Radio.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="text-sm text-ink-faint hover:text-ink"
            >
              Cancel
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-faint">
                Sponsor
              </label>

              <input
                type="text"
                value={form.sponsor}
                onChange={(e) =>
                  updateForm("sponsor", e.target.value)
                }
                placeholder="Northside Coffee Co."
                className="w-full rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-lime"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-faint">
                Advertisement type
              </label>

              <select
                value={form.kind}
                onChange={(e) =>
                  updateForm("kind", e.target.value)
                }
                className="w-full rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink outline-none focus:border-lime"
              >
                <option value="homepage-banner">
                  Homepage banner
                </option>

                <option value="sponsored-content">
                  Sponsored content
                </option>

                <option value="show-sponsorship">
                  Show sponsorship
                </option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-ink-faint">
                Headline
              </label>

              <input
                type="text"
                value={form.headline}
                onChange={(e) =>
                  updateForm("headline", e.target.value)
                }
                placeholder="Fuelling Luma Drive every weekday morning."
                className="w-full rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-lime"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-faint">
                Destination URL
              </label>

              <input
                type="url"
                value={form.href}
                onChange={(e) =>
                  updateForm("href", e.target.value)
                }
                placeholder="https://example.com"
                className="w-full rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-lime"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-faint">
                Button text
              </label>

              <input
                type="text"
                value={form.cta}
                onChange={(e) =>
                  updateForm("cta", e.target.value)
                }
                placeholder="Visit website"
                className="w-full rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-lime"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  updateForm("active", e.target.checked)
                }
                className="h-4 w-4 accent-lime"
              />

              Advertisement active
            </label>

            <button
              type="button"
              disabled={saving}
              onClick={saveAdvertisement}
              className="rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-coal transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Create advertisement"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-base-line px-5 py-8 text-center text-sm text-ink-faint">
          Loading advertisements...
        </div>
      ) : ads.length === 0 ? (
        <div className="rounded-2xl border border-base-line px-5 py-8 text-center">
          <p className="text-sm text-ink-faint">
            No advertisements found.
          </p>

          <button
            type="button"
            onClick={openAddForm}
            className="mt-3 text-sm font-medium text-lime hover:underline"
          >
            Add your first advertisement
          </button>
        </div>
      ) : (
        <div className="divide-y divide-base-line rounded-2xl border border-base-line">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-lime">
                    {kindLabels[ad.kind] ?? ad.kind}
                  </p>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      ad.active
                        ? "bg-lime/10 text-lime"
                        : "bg-base-panel text-ink-faint"
                    }`}
                  >
                    {ad.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-0.5 truncate text-ink">
                  {ad.headline}
                </p>

                <p className="text-xs text-ink-faint">
                  Sponsor: {ad.sponsor}
                </p>

                {ad.href && (
                  <p className="mt-1 truncate text-xs text-ink-faint">
                    {ad.href}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    toggleAdvertisement(ad.id, ad.active)
                  }
                  className="text-xs font-medium text-ink-faint hover:text-lime"
                >
                  {ad.active ? "Disable" : "Enable"}
                </button>

                <button
                  type="button"
                  onClick={() => openEditForm(ad)}
                  className="text-xs font-medium text-ink-faint hover:text-lime"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => deleteAdvertisement(ad.id)}
                  className="text-xs font-medium text-ink-faint hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

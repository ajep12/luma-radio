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

const kindLabels: Record<string, string> = {
  "homepage-banner": "Homepage banner",
  "sponsored-content": "Sponsored content",
  "show-sponsorship": "Show sponsorship",
};

export function AdvertisementsAdmin() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      alert("Failed to update advertisement.");
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
      alert("Failed to delete advertisement.");
      return;
    }

    setAds((current) => current.filter((ad) => ad.id !== id));
  }

  return (
    <div>
      <AdminHeading
        title="Advertisements"
        subtitle="Homepage banners, sponsored content and show sponsorships."
        action={
          <button
            type="button"
            onClick={() => {
              // Add advertisement functionality can be added here
            }}
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

      {loading ? (
        <div className="rounded-2xl border border-base-line px-5 py-8 text-center text-sm text-ink-faint">
          Loading advertisements...
        </div>
      ) : ads.length === 0 ? (
        <div className="rounded-2xl border border-base-line px-5 py-8 text-center">
          <p className="text-sm text-ink-faint">
            No advertisements found.
          </p>
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
                  onClick={() => {
                    // Edit functionality can be added here
                  }}
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

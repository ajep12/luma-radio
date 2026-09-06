import { ads } from "../../data/ads";
import { AdminHeading } from "./AdminHeading";

const kindLabels: Record<string, string> = {
  "homepage-banner": "Homepage banner",
  "sponsored-content": "Sponsored content",
  "show-sponsorship": "Show sponsorship",
};

export function AdvertisementsAdmin() {
  return (
    <div>
      <AdminHeading
        title="Advertisements"
        subtitle="Homepage banners, sponsored content and show sponsorships."
        action={
          <button className="rounded-full bg-lime px-4 py-2 text-sm font-semibold text-coal">
            Add advertisement
          </button>
        }
      />
      <div className="divide-y divide-base-line rounded-2xl border border-base-line">
        {ads.map((ad) => (
          <div key={ad.id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
              <p className="text-xs text-lime">{kindLabels[ad.kind]}</p>
              <p className="mt-0.5 truncate text-ink">{ad.headline}</p>
              <p className="text-xs text-ink-faint">Sponsor: {ad.sponsor}</p>
            </div>
            <button className="shrink-0 text-xs font-medium text-ink-faint hover:text-lime">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

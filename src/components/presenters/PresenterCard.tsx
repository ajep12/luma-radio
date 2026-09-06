import { Presenter } from "../../data/presenters";
import { shows } from "../../data/shows";
import { SocialIcon } from "../layout/SocialIcon";

function guessIcon(href: string): "instagram" | "x" | "tiktok" | "youtube" {
  if (href.includes("instagram")) return "instagram";
  if (href.includes("tiktok")) return "tiktok";
  if (href.includes("youtube")) return "youtube";
  return "x";
}

export function PresenterCard({ presenter }: { presenter: Presenter }) {
  const presentedShows = shows.filter((s) => presenter.showIds.includes(s.id));

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-base-line bg-base-panel">
      <div className="aspect-[4/3] overflow-hidden">
        <img src={presenter.photo} alt={presenter.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg text-ink">{presenter.name}</h3>
        <p className="text-sm leading-relaxed text-ink-faint">{presenter.bio}</p>
        {presentedShows.length > 0 && (
          <p className="text-xs text-ink-soft">
            Presents{" "}
            {presentedShows.map((s) => s.name).join(", ")}
          </p>
        )}
        <div className="mt-auto flex gap-2 pt-2">
          {presenter.socials.map((s) => (
            <a
              key={s.href + s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-base-line text-ink-soft transition-colors hover:border-lime hover:text-lime"
            >
              <SocialIcon icon={guessIcon(s.href)} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

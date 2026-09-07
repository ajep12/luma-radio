import { SocialIcon } from "../layout/SocialIcon";

type Presenter = {
  id: string;
  name: string;
  photo: string;
  bio: string;
  socials?: {
    href: string;
    label: string;
  }[];
};

function guessIcon(
  href: string
): "instagram" | "x" | "tiktok" | "youtube" {
  if (href.includes("instagram")) return "instagram";
  if (href.includes("tiktok")) return "tiktok";
  if (href.includes("youtube")) return "youtube";
  return "x";
}

export function PresenterCard({
  presenter,
}: {
  presenter: Presenter;
}) {
  const socials = Array.isArray(presenter.socials)
    ? presenter.socials
    : [];

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-base-line bg-base-panel">
      <div className="aspect-[4/3] overflow-hidden">
        {presenter.photo ? (
          <img
            src={presenter.photo}
            alt={presenter.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-base-raised" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg text-ink">
          {presenter.name}
        </h3>

        <p className="text-sm leading-relaxed text-ink-faint">
          {presenter.bio}
        </p>

        {socials.length > 0 && (
          <div className="mt-auto flex gap-2 pt-2">
            {socials.map((social) => (
              <a
                key={social.href + social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-base-line text-ink-soft transition-colors hover:border-lime hover:text-lime"
              >
                <SocialIcon
                  icon={guessIcon(social.href)}
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

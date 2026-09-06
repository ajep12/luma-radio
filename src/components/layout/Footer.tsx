import { Link } from "react-router-dom";
import { footerNav, site, socialLinks } from "../../config/site";
import { Logo } from "./Logo";
import { SocialIcon } from "./SocialIcon";

export function Footer() {
  return (
    <footer className="border-t border-base-line bg-base-raised">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-ink-faint">{site.tagline}</p>
          </div>

          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 sm:flex sm:flex-wrap sm:gap-x-6">
            {footerNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm text-ink-soft transition-colors hover:text-lime"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-6 border-t border-base-line pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-base-line text-ink-soft transition-colors hover:border-lime hover:text-lime"
              >
                <SocialIcon icon={s.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

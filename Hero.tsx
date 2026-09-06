import { Link } from "react-router-dom";
import { site } from "../../config/site";
import { LivePlayer } from "../player/LivePlayer";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-lume-radial">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pb-24 lg:pt-24">
        <div className="animate-rise">
          <p className="text-sm font-medium text-lime">Internet radio, UK-wide</p>
          <h1 className="mt-4 font-display text-[13vw] leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-[4.6rem]">
            {site.name}
          </h1>
          <p className="mt-4 font-display text-xl text-ink-soft sm:text-2xl">{site.tagline}</p>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-faint">
            {site.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/listen"
              className="rounded-full bg-lime px-6 py-3.5 text-sm font-semibold text-coal transition-transform hover:scale-[1.03]"
            >
              Listen Live
            </Link>
            <Link
              to="/schedule"
              className="rounded-full border border-base-line px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-lime hover:text-lime"
            >
              View Schedule
            </Link>
          </div>
        </div>

        <div className="animate-rise [animation-delay:150ms]">
          <LivePlayer />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-lume-fade" />
    </section>
  );
}

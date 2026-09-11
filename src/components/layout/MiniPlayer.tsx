import { usePlayer } from "../../context/PlayerContext";
import { useNowPlaying } from "../../hooks/useNowPlaying";
import { site } from "../../config/site";
import { Waveform } from "../player/Waveform";
import { PlayButton } from "../player/PlayButton";

export function MiniPlayer() {
  const { isPlaying } = usePlayer();
  const { data } = useNowPlaying();

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9998] border-t border-base-line bg-base-raised/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-base-panel ring-1 ring-base-line">
          {data?.artwork ? (
            <img
              src={data.artwork}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lime/60">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="2.6"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">
            {data?.song ?? site.name}
          </p>

          <p className="truncate text-xs text-ink-faint">
            {data?.artist ?? "Luma Radio"}
          </p>

          {data?.presenter && (
            <p className="truncate text-xs text-lime">
              {data.presenter}
            </p>
          )}
        </div>

        <div className="hidden sm:block">
          <Waveform active={isPlaying} size="sm" />
        </div>

        <PlayButton size={40} />
      </div>
    </div>
  );
}

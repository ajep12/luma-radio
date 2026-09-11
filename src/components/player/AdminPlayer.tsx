import { usePlayer } from "../../context/PlayerContext";
import { useNowPlaying } from "../../hooks/useNowPlaying";
import { site } from "../../config/site";
import { Waveform } from "./Waveform";
import { PlayButton } from "./PlayButton";
import { VolumeControl } from "./VolumeControl";

export function AdminPlayer() {
  const { isPlaying } = usePlayer();
  const { data, loading } = useNowPlaying();

  const presenter = data?.presenter || "Auto DJ";

  return (
    <div className="fixed bottom-5 right-5 z-[9998] w-[360px] overflow-hidden rounded-2xl border border-base-line bg-base-raised/95 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-3 p-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-base-panel ring-1 ring-base-line">
          {data?.artwork ? (
            <img
              src={data.artwork}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lime/60">
              <svg
                width="22"
                height="22"
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
          <p className="text-[10px] font-semibold uppercase tracking-wider text-lime">
            {data?.presenter ? "Live" : "Auto DJ"}
          </p>

          <p className="mt-0.5 truncate text-sm font-semibold text-ink">
            {loading ? "Loading..." : data?.song ?? site.name}
          </p>

          <p className="truncate text-xs text-ink-faint">
            {data?.artist ?? "Luma Radio"}
          </p>

          <p className="mt-0.5 truncate text-xs text-lime">
            {presenter}
          </p>
        </div>

        <PlayButton size={42} />
      </div>

      <div className="flex items-center gap-3 border-t border-base-line px-4 py-2.5">
        <div className="flex-1">
          <Waveform active={isPlaying} size="sm" />
        </div>

        <VolumeControl />
      </div>
    </div>
  );
}

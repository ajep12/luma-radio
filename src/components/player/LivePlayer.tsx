import { useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { useNowPlaying } from "../../hooks/useNowPlaying";
import { radioCastConfig } from "../../config/radiocast";
import { site } from "../../config/site";
import { Waveform } from "./Waveform";
import { LiveIndicator } from "./LiveIndicator";
import { PlayButton } from "./PlayButton";
import { VolumeControl } from "./VolumeControl";
import { TalkbackModal } from "../talkback/TalkbackModal";

export function LivePlayer() {
  const { isPlaying, hasError, isConfigured } = usePlayer();
  const { data } = useNowPlaying();
  const [talkbackOpen, setTalkbackOpen] = useState(false);

  if (radioCastConfig.playerEmbedUrl) {
    return (
      <>
        <div className="overflow-hidden rounded-2xl border border-base-line bg-base-panel">
          <iframe
            title="Luma Radio — RadioCast player"
            src={radioCastConfig.playerEmbedUrl}
            className="h-64 w-full"
            allow="autoplay"
          />
        </div>

        <TalkbackModal
          open={talkbackOpen}
          onClose={() => setTalkbackOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-base-line bg-base-panel p-6 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-lime/10 blur-3xl" />

        <div className="relative flex items-center justify-between gap-3">
          <LiveIndicator live={isConfigured} />

          {typeof data?.listeners === "number" && (
            <span className="text-xs text-ink-faint">
              {data.listeners.toLocaleString()} listening
            </span>
          )}
        </div>

        <div className="relative mt-6 flex items-center gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-base ring-1 ring-base-line">
            {data?.artwork ? (
              <img
                src={data.artwork}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lime/60">
                <svg
                  width="28"
                  height="28"
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
            <p className="truncate font-display text-lg text-ink">
              {data?.song ?? site.name}
            </p>

            <p className="truncate text-sm text-ink-faint">
              {data?.artist ?? site.tagline}
            </p>

            <p className="mt-1 truncate text-xs text-lime">
              {data?.presenter || "Auto DJ"}
            </p>

            {data?.showName && (
              <p className="mt-0.5 truncate text-xs text-lime">
                {data.showName}
              </p>
            )}
          </div>

          <Waveform active={isPlaying} size="md" />
        </div>

        <div className="relative mt-7 flex items-center justify-between gap-4">
          <PlayButton size={60} />
          <VolumeControl />
        </div>

        <button
          type="button"
          onClick={() => setTalkbackOpen(true)}
          className="relative mt-5 w-full rounded-xl border border-base-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-lime hover:text-lime"
        >
          Talkback
        </button>

        {!isConfigured && (
          <p className="relative mt-5 rounded-lg border border-base-line bg-base px-3 py-2 text-xs text-ink-faint">
            RadioCast stream not configured yet. Add{" "}
            <code className="text-lime/80">
              VITE_RADIOCAST_STREAM_URL
            </code>{" "}
            to your{" "}
            <code className="text-lime/80">.env</code> file to go live.
          </p>
        )}

        {isConfigured && hasError && (
          <p className="relative mt-5 rounded-lg border border-base-line bg-base px-3 py-2 text-xs text-ink-faint">
            We couldn't reach the live stream. Check your RadioCast
            stream URL, or try again shortly.
          </p>
        )}
      </div>

      <TalkbackModal
        open={talkbackOpen}
        onClose={() => setTalkbackOpen(false)}
      />
    </>
  );
}

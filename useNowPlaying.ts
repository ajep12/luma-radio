import { useEffect, useState } from "react";
import { isNowPlayingConfigured, radioCastConfig } from "../config/radiocast";

export interface NowPlayingData {
  song?: string;
  artist?: string;
  artwork?: string;
  presenter?: string;
  showName?: string;
  listeners?: number;
}

interface NowPlayingState {
  data: NowPlayingData | null;
  /** True once we've configured a Now Playing endpoint but haven't heard back yet. */
  loading: boolean;
  /** True if a fetch to the configured endpoint failed. */
  error: boolean;
}

/**
 * Polls RadioCast's Now Playing endpoint, if one has been configured in
 * `.env` (VITE_RADIOCAST_NOW_PLAYING_URL). This hook deliberately does NOT
 * assume a response shape, because that shape is defined by RadioCast, not
 * by this project.
 *
 * TO CONNECT YOUR REAL RADIOCAST NOW PLAYING API:
 * 1. Set VITE_RADIOCAST_NOW_PLAYING_URL in your `.env`.
 * 2. Map the JSON RadioCast actually returns onto `NowPlayingData` inside
 *    the `mapResponse` function below — this is the one place that needs
 *    your endpoint's real field names.
 *
 * Until step 2 is done for your endpoint, or if no endpoint is configured,
 * this hook returns `data: null` and the UI shows the station identity
 * instead of any invented "now playing" details.
 */
export function useNowPlaying(): NowPlayingState {
  const [state, setState] = useState<NowPlayingState>({
    data: null,
    loading: isNowPlayingConfigured,
    error: false,
  });

  useEffect(() => {
    if (!isNowPlayingConfigured) return;

    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(radioCastConfig.nowPlayingUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`RadioCast Now Playing request failed (${res.status})`);
        const json = await res.json();
        if (!cancelled) {
          setState({ data: mapResponse(json), loading: false, error: false });
        }
      } catch (err) {
        if (!cancelled) {
          setState((prev) => ({ ...prev, loading: false, error: true }));
        }
        // eslint-disable-next-line no-console
        console.warn("[RadioCast] Now Playing fetch failed:", err);
      }
    }

    poll();
    const interval = setInterval(poll, radioCastConfig.nowPlayingPollIntervalMs);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return state;
}

/**
 * ---------------------------------------------------------------------------
 * MAP YOUR REAL RADIOCAST RESPONSE HERE.
 * ---------------------------------------------------------------------------
 * This function currently returns an empty object because we don't know the
 * shape of your RadioCast Now Playing response. Replace the body with real
 * field mappings once you have your RadioCast API documentation, e.g.:
 *
 *   return {
 *     song: json.now_playing?.song?.title,
 *     artist: json.now_playing?.song?.artist,
 *     artwork: json.now_playing?.song?.art,
 *     presenter: json.live?.streamer_name,
 *     showName: json.live?.show_name,
 *     listeners: json.listeners?.current,
 *   };
 */
function mapResponse(_json: unknown): NowPlayingData {
  return {};
}

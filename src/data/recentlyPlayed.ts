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

export interface PlayedTrack {
  id: string;
  artist: string;
  song: string;
  artwork: string;
  playedAt: string;
}

interface NowPlayingState {
  data: NowPlayingData | null;
  recentlyPlayed: PlayedTrack[];
  loading: boolean;
  error: boolean;
}

interface RadioCastSongHistoryEntry {
  sh_id: number;
  played_at: number;
  song?: {
    id?: string;
    title?: string;
    artist?: string;
    art?: string;
  };
}

interface RadioCastNowPlayingResponse {
  now_playing?: {
    song?: {
      title?: string;
      artist?: string;
      art?: string;
    };
  };
  live?: {
    is_live?: boolean;
    streamer_name?: string;
  };
  listeners?: {
    current?: number;
  };
  song_history?: RadioCastSongHistoryEntry[];
}

export function useNowPlaying(): NowPlayingState {
  const [state, setState] = useState<NowPlayingState>({
    data: null,
    recentlyPlayed: [],
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
          setState({
            data: mapResponse(json),
            recentlyPlayed: mapHistory(json),
            loading: false,
            error: false,
          });
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

function mapResponse(json: unknown): NowPlayingData {
  const data = json as RadioCastNowPlayingResponse;
  const song = data.now_playing?.song;
  const isLive = data.live?.is_live === true;

  return {
    song: song?.title,
    artist: song?.artist,
    artwork: song?.art,
    presenter: isLive ? data.live?.streamer_name || undefined : undefined,
    listeners: data.listeners?.current,
  };
}

function mapHistory(json: unknown): PlayedTrack[] {
  const data = json as RadioCastNowPlayingResponse;
  const history = data.song_history ?? [];

  return history
    .filter((entry) => entry.song?.title)
    .map((entry) => ({
      id: String(entry.sh_id),
      artist: entry.song?.artist ?? "Unknown artist",
      song: entry.song?.title ?? "Unknown song",
      artwork: entry.song?.art ?? "",
      playedAt: new Date(entry.played_at * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
}

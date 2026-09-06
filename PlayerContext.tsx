import { createContext, useCallback, useContext, useMemo, useRef, useState, ReactNode } from "react";
import { isRadioCastConfigured, radioCastConfig } from "../config/radiocast";

interface PlayerContextValue {
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  hasError: boolean;
  isConfigured: boolean;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  setVolume: (v: number) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolumeState] = useState(0.85);

  if (!audioRef.current && typeof window !== "undefined") {
    const el = new Audio();
    el.preload = "none";
    el.volume = volume;
    // Prefer the RadioCast stream URL; fall back only if explicitly configured.
    el.src = radioCastConfig.streamUrl || radioCastConfig.fallbackStreamUrl;
    audioRef.current = el;
  }

  const play = useCallback(() => {
    const el = audioRef.current;
    if (!el || !isRadioCastConfigured) {
      setHasError(true);
      return;
    }
    setIsLoading(true);
    setHasError(false);
    el.play()
      .then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setHasError(true);
      });
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const value = useMemo(
    () => ({
      isPlaying,
      isLoading,
      volume,
      hasError,
      isConfigured: isRadioCastConfigured,
      toggle,
      play,
      pause,
      setVolume,
    }),
    [isPlaying, isLoading, volume, hasError, toggle, play, pause, setVolume]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within a PlayerProvider");
  return ctx;
}

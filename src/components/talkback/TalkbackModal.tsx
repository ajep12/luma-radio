
import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  supabase,
  isSupabaseConfigured,
} from "../../config/supabase";

interface TalkbackModalProps {
  open: boolean;
  onClose: () => void;
  autoDj: boolean;
}

interface SongResult {
  trackName: string;
  artistName: string;
  collectionName?: string;
  artworkUrl100?: string;
}

declare global {
  interface Window {
    __lumaSongSearch?: (data: {
      resultCount: number;
      results: SongResult[];
    }) => void;
  }
}

export function TalkbackModal({
  open,
  onClose,
  autoDj,
}: TalkbackModalProps) {
  const [name, setName] = useState("");
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [talkbacksEnabled, setTalkbacksEnabled] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(false);

  const [songSearch, setSongSearch] = useState("");
  const [songResults, setSongResults] = useState<SongResult[]>([]);
  const [searchingSongs, setSearchingSongs] = useState(false);
  const [showSongResults, setShowSongResults] = useState(false);

  const searchTimeout = useRef<number | null>(null);
  const searchRequest = useRef(0);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !isSupabaseConfigured) return;

    async function loadSettings() {
      setLoadingSettings(true);

      const { data, error } = await supabase
        .from("station_settings")
        .select("talkbacks_enabled")
        .eq("id", true)
        .single();

      if (!error && data) {
        setTalkbacksEnabled(data.talkbacks_enabled);
      }

      setLoadingSettings(false);
    }

    loadSettings();
  }, [open]);

  useEffect(() => {
    if (autoDj) {
      setError("");
      setSuccess(false);
    }
  }, [autoDj]);

  useEffect(() => {
    if (!open) {
      setSongResults([]);
      setShowSongResults(false);
      setSearchingSongs(false);
      return;
    }

    const query = songSearch.trim();

    if (query.length < 2) {
      setSongResults([]);
      setShowSongResults(false);
      setSearchingSongs(false);
      return;
    }

    if (searchTimeout.current) {
      window.clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = window.setTimeout(() => {
      searchSongs(query);
    }, 450);

    return () => {
      if (searchTimeout.current) {
        window.clearTimeout(searchTimeout.current);
      }
    };
  }, [songSearch, open]);

  async function searchSongs(query: string) {
    const requestId = ++searchRequest.current;

    setSearchingSongs(true);
    setShowSongResults(true);

    try {
      const callbackName = `__lumaSongSearch_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}`;

      const result = await new Promise<{
        resultCount: number;
        results: SongResult[];
      }>((resolve, reject) => {
        const timeout = window.setTimeout(() => {
          delete (window as any)[callbackName];
          script.remove();
          reject(new Error("Song search timed out."));
        }, 8000);

        const script = document.createElement("script");

        (window as any)[callbackName] = (
          data: {
            resultCount: number;
            results: SongResult[];
          }
        ) => {
          window.clearTimeout(timeout);
          delete (window as any)[callbackName];
          script.remove();
          resolve(data);
        };

        script.onerror = () => {
          window.clearTimeout(timeout);
          delete (window as any)[callbackName];
          script.remove();
          reject(new Error("Song search failed."));
        };

        script.src =
          `https://itunes.apple.com/search?term=${encodeURIComponent(
            query
          )}` +
          `&country=GB` +
          `&media=music` +
          `&entity=song` +
          `&limit=8` +
          `&lang=en_gb` +
          `&callback=${callbackName}`;

        document.body.appendChild(script);
      });

      if (requestId !== searchRequest.current) {
        return;
      }

      setSongResults(result.results || []);
    } catch {
      if (requestId === searchRequest.current) {
        setSongResults([]);
      }
    } finally {
      if (requestId === searchRequest.current) {
        setSearchingSongs(false);
      }
    }
  }

  function selectSong(result: SongResult) {
    setSong(result.trackName);
    setArtist(result.artistName);
    setSongSearch(result.trackName);
    setSongResults([]);
    setShowSongResults(false);
  }

  function clearSongSelection() {
    setSong("");
    setArtist("");
    setSongSearch("");
    setSongResults([]);
    setShowSongResults(false);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (autoDj) {
      setError(
        "Talkback is unavailable while Auto DJ is running."
      );
      return;
    }

    if (!talkbacksEnabled) {
      setError(
        "Talkbacks are currently closed. Please check back later."
      );
      return;
    }

    if (
      !name.trim() &&
      !song.trim() &&
      !artist.trim() &&
      !message.trim()
    ) {
      setError("Please enter a message or request.");
      return;
    }

    if (!isSupabaseConfigured) {
      setError("Talkbacks are currently unavailable.");
      return;
    }

    setSubmitting(true);

    try {
      const { data: result, error: functionError } =
        await supabase.functions.invoke("submit-talkback", {
          body: {
            name: name.trim() || null,
            song: song.trim() || null,
            artist: artist.trim() || null,
            message: message.trim() || null,
          },
        });

      if (functionError) {
        const response = (functionError as any).context;

        if (response) {
          try {
            const errorData = await response.json();

            if (errorData?.banned) {
              setError(
                "Talkbacks are unavailable from this connection."
              );
              return;
            }

            if (errorData?.disabled) {
              setTalkbacksEnabled(false);
              setError(
                "Talkbacks are currently closed. Please check back later."
              );
              return;
            }

            if (errorData?.error) {
              setError(errorData.error);
              return;
            }
          } catch {}
        }

        console.error(
          "[Talkback] Submission failed:",
          functionError
        );

        setError("Something went wrong. Please try again.");
        return;
      }

      if (result?.banned) {
        setError(
          "Talkbacks are unavailable from this connection."
        );
        return;
      }

      if (result?.disabled) {
        setTalkbacksEnabled(false);
        setError(
          "Talkbacks are currently closed. Please check back later."
        );
        return;
      }

      if (result?.error) {
        setError(result.error);
        return;
      }

      setName("");
      setSong("");
      setArtist("");
      setMessage("");
      setSongSearch("");
      setSongResults([]);
      setShowSongResults(false);
      setSuccess(true);
    } catch (error) {
      console.error("[Talkback] Submission failed:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleBackdropClick(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  if (!open) {
    return null;
  }

  const showClosed =
    !loadingSettings && !talkbacksEnabled && !autoDj;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex min-h-screen w-screen items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="talkback-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-base-line bg-base-panel shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-base-line bg-base-panel px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-lime">
              Luma Radio
            </p>

            <h2
              id="talkback-title"
              className="mt-1 font-display text-2xl text-ink"
            >
              Talkback
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Talkback"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-base-line text-ink-faint transition-colors hover:border-lime hover:text-lime"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {loadingSettings ? (
          <div className="p-8 text-center">
            <p className="text-sm text-ink-faint">
              Checking Talkback availability...
            </p>
          </div>
        ) : showClosed ? (
          <div className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-base">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="text-lime"
                />
                <path
                  d="M8 10V7.5C8 5.57 9.57 4 11.5 4h1C14.43 4 16 5.57 16 7.5V10"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="text-lime"
                />
              </svg>
            </div>

            <h3 className="mt-5 font-display text-2xl text-ink">
              Talkbacks are closed
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-faint">
              Talkbacks are currently unavailable. Please check
              back later.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-xl border border-base-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-lime hover:text-lime"
            >
              Close
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-6"
          >
            <p className="text-sm leading-6 text-ink-faint">
              Send us a message or request a song. Everything is
              optional — just send whatever you want us to hear.
            </p>

            {autoDj && (
              <div className="rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink-faint">
                Talkbacks are currently unavailable while Auto DJ
                is running.
              </div>
            )}

            <div className="relative">
              <label
                htmlFor="talkback-song-search"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Song
                <span className="ml-1 text-xs text-ink-faint">
                  (optional)
                </span>
              </label>

              <div className="relative">
                <input
                  id="talkback-song-search"
                  type="text"
                  value={songSearch}
                  onChange={(event) => {
                    setSongSearch(event.target.value);
                    setShowSongResults(true);
                  }}
                  onFocus={() => {
                    if (songResults.length > 0) {
                      setShowSongResults(true);
                    }
                  }}
                  placeholder="Search for a song..."
                  maxLength={200}
                  autoComplete="off"
                  className="w-full rounded-xl border border-base-line bg-base px-4 py-3 pr-10 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-lime"
                />

                {songSearch && (
                  <button
                    type="button"
                    onClick={clearSongSelection}
                    aria-label="Clear song"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-faint transition-colors hover:text-lime"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M6 6L18 18M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {showSongResults && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-base-line bg-base-panel shadow-xl">
                  {searchingSongs ? (
                    <div className="px-4 py-4 text-sm text-ink-faint">
                      Searching...
                    </div>
                  ) : songResults.length > 0 ? (
                    <div className="max-h-72 overflow-y-auto">
                      {songResults.map((result, index) => (
                        <button
                          key={`${result.trackName}-${result.artistName}-${index}`}
                          type="button"
                          onClick={() => selectSong(result)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-base"
                        >
                          {result.artworkUrl100 ? (
                            <img
                              src={result.artworkUrl100}
                              alt=""
                              className="h-10 w-10 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 shrink-0 rounded-lg bg-base" />
                          )}

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink">
                              {result.trackName}
                            </p>

                            <p className="truncate text-xs text-ink-faint">
                              {result.artistName}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : songSearch.trim().length >= 2 ? (
                    <div className="px-4 py-4 text-sm text-ink-faint">
                      No songs found. You can enter the song manually.
                    </div>
                  ) : null}
                </div>
              )}

              <p className="mt-2 text-xs text-ink-faint">
                Search for a song or enter it manually.
              </p>
            </div>

            <div>
              <label
                htmlFor="talkback-song"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Song title
                <span className="ml-1 text-xs text-ink-faint">
                  (optional)
                </span>
              </label>

              <input
                id="talkback-song"
                type="text"
                value={song}
                onChange={(event) => setSong(event.target.value)}
                placeholder="Song title"
                maxLength={200}
                className="w-full rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-lime"
              />
            </div>

            <div>
              <label
                htmlFor="talkback-artist"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Artist
                <span className="ml-1 text-xs text-ink-faint">
                  (optional)
                </span>
              </label>

              <input
                id="talkback-artist"
                type="text"
                value={artist}
                onChange={(event) => setArtist(event.target.value)}
                placeholder="Artist name"
                maxLength={200}
                className="w-full rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-lime"
              />
            </div>

            <div>
              <label
                htmlFor="talkback-name"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Your name
                <span className="ml-1 text-xs text-ink-faint">
                  (optional)
                </span>
              </label>

              <input
                id="talkback-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                maxLength={100}
                className="w-full rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-lime"
              />
            </div>

            <div>
              <label
                htmlFor="talkback-message"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Message
                <span className="ml-1 text-xs text-ink-faint">
                  (optional)
                </span>
              </label>

              <textarea
                id="talkback-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write a message to Luma..."
                rows={4}
                maxLength={1000}
                className="w-full resize-none rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-lime"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink-faint">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-lime/30 bg-lime/5 px-4 py-3 text-sm text-lime">
                Your Talkback has been sent to the Luma team!
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-base-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-lime hover:text-lime"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || autoDj}
                className="flex-1 rounded-xl bg-lime px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {autoDj
                  ? "Unavailable"
                  : submitting
                    ? "Sending..."
                    : "Send Talkback"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}

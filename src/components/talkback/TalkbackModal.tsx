
import { FormEvent, useEffect, useState } from "react";
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
    if (autoDj) {
      setError("");
      setSuccess(false);
    }
  }, [autoDj]);

  if (!open) {
    return null;
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

      if (result?.error) {
        setError(result.error);
        return;
      }

      setName("");
      setSong("");
      setArtist("");
      setMessage("");
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
              htmlFor="talkback-song"
              className="mb-2 block text-sm font-medium text-ink"
            >
              Song
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
      </div>
    </div>,
    document.body
  );
}

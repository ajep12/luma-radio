
import { FormEvent, useState } from "react";
import {
  supabase,
  isSupabaseConfigured,
} from "../config/supabase";

export function Requests() {
  const [name, setName] = useState("");
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    // Make sure the user has entered something
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

    const { error: insertError } = await supabase
      .from("requests")
      .insert({
        name: name.trim() || null,
        song: song.trim() || null,
        artist: artist.trim() || null,
        message: message.trim() || null,
        status: "pending",
      });

    setSubmitting(false);

    if (insertError) {
      console.error(
        "[Supabase] Talkback submission failed:",
        insertError
      );

      setError("Something went wrong. Please try again.");
      return;
    }

    // Clear the form
    setName("");
    setSong("");
    setArtist("");
    setMessage("");

    setSuccess(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      {/* Page heading */}
      <p className="text-sm font-medium text-lime">
        Talkback
      </p>

      <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
        Have your say
      </h1>

      <p className="mt-3 max-w-xl text-ink-faint">
        Send a message to Luma or request a song. Your Talkback
        will be sent straight to the Luma team.
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-6 rounded-2xl border border-base-line bg-base-panel p-6 sm:p-8"
      >
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Your name
            <span className="ml-1 text-xs text-ink-faint">
              (optional)
            </span>
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            maxLength={100}
            className="w-full rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-lime"
          />
        </div>

        {/* Song */}
        <div>
          <label
            htmlFor="song"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Song
            <span className="ml-1 text-xs text-ink-faint">
              (optional)
            </span>
          </label>

          <input
            id="song"
            type="text"
            value={song}
            onChange={(event) => setSong(event.target.value)}
            placeholder="Song title"
            maxLength={200}
            className="w-full rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-lime"
          />
        </div>

        {/* Artist */}
        <div>
          <label
            htmlFor="artist"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Artist
            <span className="ml-1 text-xs text-ink-faint">
              (optional)
            </span>
          </label>

          <input
            id="artist"
            type="text"
            value={artist}
            onChange={(event) => setArtist(event.target.value)}
            placeholder="Artist name"
            maxLength={200}
            className="w-full rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-lime"
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Message
            <span className="ml-1 text-xs text-ink-faint">
              (optional)
            </span>
          </label>

          <textarea
            id="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write a message to the Luma team..."
            rows={5}
            maxLength={1000}
            className="w-full resize-none rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-lime"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-base-line bg-base px-4 py-3 text-sm text-ink-faint">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="rounded-xl border border-lime/30 bg-lime/5 px-4 py-3 text-sm text-lime">
            Your Talkback has been sent to the Luma team!
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-lime px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send Talkback"}
        </button>
      </form>
    </div>
  );
}

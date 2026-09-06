import { FormEvent, useState } from "react";

/**
 * Song requests interface. This does not yet persist anywhere — there is no
 * request backend wired up. When you're ready to store requests, connect
 * this form's `onSubmit` to your database of choice (see README.md, "Future
 * Supabase integration") instead of the local `setSubmitted` call below.
 */
export function Requests() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: send to your requests backend/database once connected.
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <p className="text-sm font-medium text-lime">Requests</p>
      <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">Request a song</h1>
      <p className="mt-3 text-ink-faint">
        Tell us what you want to hear and we'll try to get it on air.
      </p>

      {submitted ? (
        <div className="mt-10 rounded-2xl border border-lime/40 bg-lime/5 p-6">
          <p className="font-display text-lg text-ink">Request sent</p>
          <p className="mt-1 text-sm text-ink-faint">
            Thanks — your request has been queued for the studio.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 text-sm font-medium text-lime hover:underline"
          >
            Send another request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <Field label="Song" name="song" placeholder="e.g. Halfway Home" required />
          <Field label="Artist" name="artist" placeholder="e.g. Nova Bloom" required />
          <Field label="Your name" name="name" placeholder="What should we call you?" required />
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft" htmlFor="message">
              Message (optional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              placeholder="Dedications, shout-outs, anything else..."
              className="w-full rounded-xl border border-base-line bg-base-panel px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-lime"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-lime py-3.5 text-sm font-semibold text-coal transition-transform hover:scale-[1.01]"
          >
            Send request
          </button>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-ink-soft" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-base-line bg-base-panel px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-lime"
      />
    </div>
  );
}

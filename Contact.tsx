export function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <p className="text-sm font-medium text-lime">Contact</p>
      <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">Get in touch</h1>
      <p className="mt-4 max-w-lg leading-relaxed text-ink-faint">
        Got a question, a show idea, or want to advertise with Luma Radio? We'd love to hear
        from you.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-base-line bg-base-panel p-5">
          <p className="text-sm text-ink-soft">General enquiries</p>
          <p className="mt-1 font-display text-lg text-ink">hello@lumaradio.example</p>
        </div>
        <div className="rounded-2xl border border-base-line bg-base-panel p-5">
          <p className="text-sm text-ink-soft">Advertising</p>
          <p className="mt-1 font-display text-lg text-ink">partners@lumaradio.example</p>
        </div>
      </div>
    </div>
  );
}

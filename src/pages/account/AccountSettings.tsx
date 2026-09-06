import { AccountField } from "./AccountCard";

export function AccountSettings() {
  return (
    <div className="mx-auto max-w-lg px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl text-ink">Account settings</h1>
      <p className="mt-3 text-ink-faint">
        Manage your details. This form isn't connected to a backend yet — see README.md for
        how to wire it up to Supabase.
      </p>
      <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <AccountField label="Name" name="name" />
        <AccountField label="Email" name="email" type="email" />
        <AccountField label="New password" name="password" type="password" />
        <button
          type="submit"
          className="rounded-full bg-lime px-6 py-3 text-sm font-semibold text-coal transition-transform hover:scale-[1.01]"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}

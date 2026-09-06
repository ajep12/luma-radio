import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccountField } from "./AccountCard";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../config/supabase";

export function AccountSettings() {
  const { user, isConfigured } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName((user.user_metadata as { name?: string } | null)?.name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-lg px-4 py-14 sm:px-6">
        <h1 className="font-display text-4xl text-ink">Account settings</h1>
        <p className="mt-3 text-ink-faint">Accounts aren't set up yet.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-14 sm:px-6">
        <h1 className="font-display text-4xl text-ink">Account settings</h1>
        <p className="mt-3 text-ink-faint">Log in to manage your account.</p>
        <Link
          to="/account/login"
          className="mt-6 inline-block rounded-full bg-lime px-6 py-3 text-sm font-semibold text-coal"
        >
          Log in
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setSubmitting(true);

    const updates: { email?: string; password?: string; data?: { name: string } } = {
      data: { name },
    };
    if (email !== user!.email) updates.email = email;
    if (password) updates.password = password;

    const { error } = await supabase.auth.updateUser(updates);
    setSubmitting(false);

    if (error) {
      setError(error.message);
    } else {
      setStatus(
        updates.email
          ? "Saved — check your new email address for a confirmation link."
          : "Changes saved."
      );
      setPassword("");
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-14 sm:px-6">
      <h1 className="font-display text-4xl text-ink">Account settings</h1>
      <p className="mt-3 text-ink-faint">Manage your Luma Radio account details.</p>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <AccountField label="Name" name="name" value={name} onChange={setName} />
        <AccountField label="Email" name="email" type="email" value={email} onChange={setEmail} />
        <AccountField
          label="New password"
          name="password"
          type="password"
          value={password}
          onChange={setPassword}
        />
        {status && <p className="text-sm text-lime">{status}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-lime px-6 py-3 text-sm font-semibold text-coal transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

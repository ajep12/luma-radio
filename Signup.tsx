import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AccountCard, AccountField } from "./AccountCard";
import { useAuth } from "../../context/AuthContext";

export function Signup() {
  const { signUp, isConfigured } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signUp(email, password, name);
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    // If Supabase has email confirmation on (the default), there's no
    // session yet — show a "check your email" message instead of
    // navigating straight to the profile page.
    setConfirmSent(true);
  }

  if (confirmSent) {
    return (
      <AccountCard title="Almost there" subtitle="Confirm your email to finish creating your account.">
        <p className="text-sm text-ink-faint">
          We've sent a confirmation link to <span className="text-ink">{email}</span>. Once you
          confirm it, you can{" "}
          <Link to="/account/login" className="text-lime hover:underline">
            log in
          </Link>
          .
        </p>
      </AccountCard>
    );
  }

  return (
    <AccountCard title="Create your account" subtitle="Join Luma Radio.">
      {!isConfigured && (
        <p className="mb-4 rounded-lg border border-base-line bg-base px-3 py-2 text-xs text-ink-faint">
          Accounts aren't set up yet — add your Supabase details to get signup working.
        </p>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <AccountField label="Name" name="name" value={name} onChange={setName} required />
        <AccountField label="Email" name="email" type="email" value={email} onChange={setEmail} required />
        <AccountField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-lime py-3 text-sm font-semibold text-coal transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-ink-faint">
        Already have an account?{" "}
        <Link to="/account/login" className="text-lime hover:underline">
          Log in
        </Link>
      </p>
    </AccountCard>
  );
}

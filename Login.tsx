import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AccountCard, AccountField } from "./AccountCard";
import { useAuth } from "../../context/AuthContext";

export function Login() {
  const { signIn, isConfigured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      setError(error);
    } else {
      navigate("/account/profile");
    }
  }

  return (
    <AccountCard title="Log in" subtitle="Welcome back to Luma Radio.">
      {!isConfigured && (
        <p className="mb-4 rounded-lg border border-base-line bg-base px-3 py-2 text-xs text-ink-faint">
          Accounts aren't set up yet — add your Supabase details to get login working.
        </p>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
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
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-ink-faint">
        New to Luma?{" "}
        <Link to="/account/signup" className="text-lime hover:underline">
          Create an account
        </Link>
      </p>
    </AccountCard>
  );
}

import { Link } from "react-router-dom";
import { AccountCard, AccountField } from "./AccountCard";

/**
 * Login form UI only. No authentication is wired up yet — submitting does
 * nothing. Connect this to Supabase Auth (or your provider of choice) when
 * ready; see README.md "Future Supabase integration".
 */
export function Login() {
  return (
    <AccountCard title="Log in" subtitle="Welcome back to Luma Radio.">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <AccountField label="Email" name="email" type="email" />
        <AccountField label="Password" name="password" type="password" />
        <button
          type="submit"
          className="w-full rounded-full bg-lime py-3 text-sm font-semibold text-coal transition-transform hover:scale-[1.01]"
        >
          Log in
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

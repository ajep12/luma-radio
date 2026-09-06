import { Link } from "react-router-dom";
import { AccountCard, AccountField } from "./AccountCard";

export function Signup() {
  return (
    <AccountCard title="Create your account" subtitle="Join Luma Radio.">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <AccountField label="Name" name="name" />
        <AccountField label="Email" name="email" type="email" />
        <AccountField label="Password" name="password" type="password" />
        <button
          type="submit"
          className="w-full rounded-full bg-lime py-3 text-sm font-semibold text-coal transition-transform hover:scale-[1.01]"
        >
          Create account
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

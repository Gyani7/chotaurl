import { ArrowRight, Chrome, LoaderCircle, Mail } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { FormEvent, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export function AuthForm() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "signin",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function authenticate(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setMessage("Supabase is not configured yet. Add the environment variables to continue.");
      setLoading(false);
      return;
    }

    const result =
      mode === "signup"
        ? await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
          })
        : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setMessage(result.error.message);
    } else if (mode === "signup") {
      setMessage("Check your inbox to confirm your email.");
    } else {
      window.location.assign("/dashboard");
    }
    setLoading(false);
  }

  async function continueWithGoogle() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setMessage("Supabase is not configured yet.");
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="w-full max-w-[420px]">
      <p className="eyebrow">{mode === "signup" ? "Start free" : "Welcome back"}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
        {mode === "signup" ? "Create your workspace." : "Sign in to ChotaURL."}
      </h1>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        {mode === "signup"
          ? "Unlimited smart links and every premium feature, included."
          : "Manage links, teams, domains, and analytics."}
      </p>

      <button
        type="button"
        onClick={continueWithGoogle}
        className="button-secondary mt-8 h-12 w-full"
      >
        <Chrome size={17} /> Continue with Google
      </button>
      <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[.14em] text-[var(--subtle)]">
        <span className="h-px flex-1 bg-[var(--line)]" />
        or continue with email
        <span className="h-px flex-1 bg-[var(--line)]" />
      </div>
      <form onSubmit={authenticate} className="grid gap-4">
        <label className="grid gap-2 text-xs font-medium">
          Email address
          <span className="relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--subtle)]"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input !pl-10"
              placeholder="you@company.com"
            />
          </span>
        </label>
        <label className="grid gap-2 text-xs font-medium">
          Password
          <input
            required
            minLength={8}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input"
            placeholder="At least 8 characters"
          />
        </label>
        {message && (
          <p className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 text-xs leading-5 text-[var(--muted)]">
            {message}
          </p>
        )}
        <button type="submit" className="button-primary mt-1 h-12 w-full">
          {loading ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <>
              {mode === "signup" ? "Create account" : "Sign in"}{" "}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
      <p className="mt-7 text-center text-xs text-[var(--muted)]">
        {mode === "signup" ? "Already have an account?" : "New to ChotaURL?"}{" "}
        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="font-semibold text-[var(--text)] hover:text-[var(--brand)]"
        >
          {mode === "signup" ? "Sign in" : "Create one free"}
        </button>
      </p>
    </div>
  );
}

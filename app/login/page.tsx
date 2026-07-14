import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex min-h-screen flex-col px-6 py-6 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-16">
          <Suspense>
            <AuthForm />
          </Suspense>
        </div>
        <p className="text-center text-[11px] text-[var(--subtle)]">
          By continuing, you agree to the Terms and Privacy Policy.
        </p>
      </section>
      <section className="relative hidden overflow-hidden border-l border-[var(--line)] bg-[var(--bg-elevated)] lg:block">
        <div className="grid-lines absolute inset-0 opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_35%,rgba(146,235,40,.16),transparent_38%)]" />
        <div className="relative flex h-full flex-col justify-between p-14">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <span className="size-2 rounded-full bg-[var(--brand)] shadow-[0_0_12px_var(--brand)]" />
            Global edge network operational
          </div>
          <div>
            <p className="max-w-xl text-[42px] font-medium leading-[1.08] tracking-[-0.045em]">
              “We moved every campaign to ChotaURL and finally got one clear picture of
              what our links were doing.”
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-[var(--brand)] text-xs font-bold text-[var(--brand-ink)]">
                AK
              </span>
              <div>
                <p className="text-sm font-semibold">Aarav Kapoor</p>
                <p className="text-xs text-[var(--muted)]">Growth lead, Northstar</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["99.99%", "redirect uptime"],
              ["84 ms", "global latency"],
              ["0", "feature paywalls"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-[var(--line)] p-4">
                <strong className="text-lg">{value}</strong>
                <p className="mt-1 text-[10px] text-[var(--muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

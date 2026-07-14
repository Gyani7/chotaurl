import { LockKeyhole } from "lucide-react";
import { Logo } from "@/components/logo";

export default async function UnlockPage({
  params,
  searchParams,
}: {
  params: Promise<{ shortcode: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { shortcode } = await params;
  const { error } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center p-5">
      <div className="w-full max-w-[420px]">
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow)]">
          <span className="grid size-11 place-items-center rounded-xl bg-[rgba(146,235,40,.1)] text-[var(--brand)]">
            <LockKeyhole size={20} />
          </span>
          <h1 className="mt-6 text-2xl font-semibold tracking-[-.04em]">
            This link is protected
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Enter the password shared by the link owner to continue.
          </p>
          <form action={`/api/unlock/${shortcode}`} method="post" className="mt-6 grid gap-3">
            <input
              required
              autoFocus
              type="password"
              name="password"
              className="input"
              placeholder="Link password"
            />
            {error && (
              <p className="text-xs text-[var(--danger)]">That password is not correct.</p>
            )}
            <button className="button-primary h-12">Unlock link</button>
          </form>
        </div>
        <p className="mt-5 text-center text-[10px] text-[var(--subtle)]">
          Protected by ChotaURL secure redirects
        </p>
      </div>
    </main>
  );
}
